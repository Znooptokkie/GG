from flask import Blueprint, request, jsonify, render_template, send_from_directory, redirect, url_for, flash
from flask_login import UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app import login_manager
from scripts.db_connect import database_connect
from mysql.connector.errors import IntegrityError
import sys
import os
import subprocess

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts')))
from scripts.planten_form import insert_plant_name

main = Blueprint("main", __name__)

#* --- LOGIN ---

class User(UserMixin):
    def __init__(self, id, username, password, role):
        """
        Initialiseer het User-object.

        Args:
            id (int): Gebruikers-ID.
            username (str): Gebruikersnaam.
            password (str): Gehashed wachtwoord.
            role (str): Gebruikersrol.
        """
        self.id = id
        self.username = username
        self.password = password
        self.role = role

@login_manager.user_loader
def load_user(user_id):
    """
    Laad de gebruiker uit de database op basis van gebruikers-ID.

    Args:
        user_id (int): Gebruikers-ID.

    Returns:
        User: User-object als gevonden, anders None.
    """
    connection = database_connect()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()
    if user:
        return User(user["user_id"], user["username"], user["password"], user["role"])
    return None

#* --- PAGINA'S ---

@main.route("/")
def home():
    """
    Render de startpagina.

    Returns:
        HTML: Gerenderde startpagina template.
    """
    return render_template("index.html", user=current_user)

@main.route("/planten")
def planten():
    """
    Render de plantenpagina.

    Returns:
        HTML: Gerenderde plantenpagina template.
    """
    return render_template("planten.html", user=current_user)

@main.route("/instellingen")
@login_required
def settings():
    """
    Render de instellingenpagina. Vereist login.

    Returns:
        HTML: Gerenderde instellingenpagina template met gebruikersinformatie.
    """
    connection = database_connect()
    cursor = connection.cursor(dictionary=True)

    cursor.execute("SELECT user_id, username, role, email, date_created FROM goodgarden.users")
    user = cursor.fetchone()

    cursor.close()
    connection.close()

    if user is None:
        user = {}

    user_id = user.get("user_id", "")
    username = user.get("username", "")
    role = user.get("role", "")
    email = user.get("email", "")
    aangemaakt = user.get("date_created", "")

    return render_template(
        "instellingen.html", 
        user_id=user_id, 
        username=username, 
        role=role, 
        email=email, 
        aangemaakt=aangemaakt,
        user=current_user
    )

@main.route("/plant-detail", methods=['GET'])
def plant_detail():
    """
    Render de plantdetailpagina voor een specifieke plant-ID.

    Returns:
        HTML: Gerenderde plantdetailpagina template.
    """
    plant_id = request.args.get('id')
    if not plant_id:
        return "Geen plant-ID opgegeven", 400
    
    plant = get_plant_details(plant_id)
    if not plant:
        return "Plant niet gevonden", 404

    plant_geteelt_value = 1 if plant['plant_geteelt'] else 0

    return render_template('plant.html', plant=plant, plant_geteelt_value=plant_geteelt_value, user=current_user)

@main.route("/pomp")
def pump():
    """
    Render de pomppagina.

    Returns:
        HTML: Gerenderde pomppagina template.
    """
    return render_template("pomp.html", user=current_user)

@main.route("/sensor")
def sensor():
    """
    Render de sensorpagina.

    Returns:
        HTML: Gerenderde sensorpagina template.
    """
    return render_template("sensor.html", user=current_user)

#* --- LOGIN/LOGOUT/REGISTER ---
@main.route("/login", methods=["POST"])
def login():
    """
    Behandel gebruikerslogin.

    Returns:
        Redirect: Redirects naar de startpagina of de volgende pagina als login succesvol is.
    """
    username = request.form["username"]
    password = request.form["password"]

    connection = database_connect()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()
    connection.close()

    if user:
        if check_password_hash(user["password"], password):
            user_obj = User(user["user_id"], user["username"], user["password"], user["role"])
            login_user(user_obj)
            next_page = request.args.get('next')
            return redirect(next_page or url_for("main.home"))
        else:
            flash("Onjuist wachtwoord, probeer het opnieuw!", "error")
    else:
        flash("Gebruikersnaam niet gevonden!", "error")
    
    return redirect(url_for("main.home"))

@main.route("/register", methods=["POST"])
def register():
    """
    Behandel gebruikersregistratie.

    Returns:
        Redirect: Redirects naar de startpagina na registratie.
    """
    username = request.form["username"]
    password = request.form["password"]
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    connection = database_connect()
    cursor = connection.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password, role) VALUES (%s, %s, %s)", (username, hashed_password, "admin"))
        connection.commit()
        flash("Registratie succesvol!", "success")
    except IntegrityError as e:
        if e.errno == 1062:
            flash("Gebruikersnaam bestaat al,<br>probeer een andere!", "error")
        else:
            flash("Er is een fout opgetreden,<br>probeer het opnieuw!", "error")
    finally:
        cursor.close()
        connection.close()

    return redirect(url_for("main.home"))

@main.route("/logout", methods=["POST"])
@login_required
def logout():
    """
    Behandel gebruikerslogout. Vereist login.

    Returns:
        Redirect: Redirects naar de startpagina na logout.
    """
    logout_user()
    return redirect(url_for('main.home'))

#* --- FORM om een plant toe te voegen ---
@main.route("/add-plant", methods=["POST"])
def add_plant():
    """
    Behandel het toevoegen van een nieuwe plant.

    Returns:
        JSON-respons: Succes- of foutmelding.
    """
    plant_naam = request.form.get("plant_naam")
    plantensoort = request.form.get("plantensoort")
    plant_geteelt = request.form.get("plant_geteelt") == "true"
    kas_locatie = request.form.get("kas_locatie")
    
    if not plant_naam or not plantensoort or not kas_locatie:
        return jsonify({"success": False, "error": "Missing data"}), 400

    success = insert_plant_name(plant_naam, plantensoort, plant_geteelt, kas_locatie)
    if success:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Failed to insert plant data"}), 500

@main.route("/status")
def status():
    """
    Controleer de huidige gebruikersstatus.

    Returns:
        JSON-respons: Ingelogde status en gebruikersnaam als geauthenticeerd, anders niet ingelogde status.
    """
    if current_user.is_authenticated:
        return jsonify({"status": "logged_in", "user": current_user.username}), 200
    else:
        return jsonify({"status": "not_logged_in"}), 401

# @main.route("/json/<path:filename>")
# def json_files(filename):
#     """
#     Serve JSON-bestanden vanuit de json-directory.

#     Args:
#         filename (str): Naam van het JSON-bestand.

#     Returns:
#         File: JSON-bestand.
#     """
#     json_dir = os.path.join(os.getcwd(), "json")
#     return send_from_directory(json_dir, filename)

@main.route("/update_plant_geteelt", methods=["POST"])
def update_plant_geteelt():
    """
    Update de 'plant_geteelt' status voor een specifieke plant.

    Returns:
        JSON-respons: Succes- of foutmelding.
    """
    data = request.json
    plant_id = data.get("plant_id")
    new_status = data.get("plant_geteelt")

    if plant_id is None or new_status is None:
        return jsonify({"success": False, "error": "Missing data"}), 400

    success = update_plant_geteelt_in_database(plant_id, new_status)
    if success:
        return jsonify({"success": True}), 200
    else:
        return jsonify({"success": False, "error": "Failed to update plant status"}), 500

#* --- DATABASE functies ---
def update_plant_geteelt_in_database(plant_id, new_status):
    """
    Update de 'plant_geteelt' status in de database.

    Args:
        plant_id (int): ID van de plant.
        new_status (bool): Nieuwe status van 'plant_geteelt'.

    Returns:
        bool: True als de update succesvol is, anders False.
    """
    try:
        connection = database_connect()
        cursor = connection.cursor()

        query = "UPDATE planten SET plant_geteelt = %s WHERE plant_id = %s"
        cursor.execute(query, (new_status, plant_id))
        connection.commit()
        # subprocess.run(["python", "scripts/planten.py"], check=True)

        cursor.close()
        connection.close()

        return True

    except Exception as e:
        print(f"Error updating plant_geteelt: {e}")
        return False

def get_plant_details(plant_id):
    """
    Haal plantdetails op uit de database.

    Args:
        plant_id (int): ID van de plant.

    Returns:
        dict of None: Plantdetails als gevonden, anders None.
    """
    try:
        connection = database_connect()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM planten WHERE plant_id = %s", (plant_id,))
        plant = cursor.fetchone()

        cursor.close()
        connection.close()

        return plant

    except Exception as e:
        print(f"Error occurred while fetching plant details: {e}")
        return None
