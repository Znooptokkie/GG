from flask import Blueprint, request, jsonify, render_template, send_from_directory, redirect, url_for, flash, current_app
from flask_login import UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from app import login_manager
from scripts.db_connect import database_connect
from mysql.connector.errors import IntegrityError
import mysql.connector
import sys
import os
import subprocess

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts')))
from scripts.planten_form import insert_plant_name

main = Blueprint("main", __name__)

class User(UserMixin):
    def __init__(self, id, username, password, role):
        self.id = id
        self.username = username
        self.password = password
        self.role = role

@login_manager.user_loader
def load_user(user_id):
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
    return render_template("index.html", user=current_user)

@main.route("/planten")
def about():
    return render_template("planten.html")

@main.route("/instellingen")
@login_required
def settings():
    connection = database_connect()
    cursor = connection.cursor(dictionary=True)

    api_key_function = api_keys_db
    # print(f"{api_key_function}")

    cursor.execute("SELECT user_id, username, role, email, date_created FROM goodgarden.users")
    user = cursor.fetchone()

    # cursor.execute("SELECT api_naam, value FROM api_keys")
    # api_key = cursor.fetchone()

    cursor.close()
    connection.close()

    if user is None:
        # Handle case where user is not found
        user = {}

    # if api_key is None:
    #     # Handle case where api_key is not found
    #     api_key = {"api_naam": "Not found"}

    user_id = user.get("user_id", "")
    username = user.get("username", "")
    role = user.get("role", "")
    email = user.get("email", "")
    aangemaakt = user.get("date_created", "")
    # api_naam = api_key_function.get("api_naam", "")

    return render_template(
        "instellingen.html", 
        user_id=user_id, 
        username=username, 
        role=role, 
        email=email, 
        aangemaakt=aangemaakt, 
        # api_naam=api_naam
    )

def api_keys_db():
    connection = database_connect()
    cursor = connection.cursor(dictionary=True)
    cursor.execute("SELECT * FROM goodgarden.api_keys")
    keys = cursor.fetchone()
    cursor.close()
    connection.close()
    
    if keys is None:
        return "Not found"
    
    return keys["api_naam"]

@main.route("/pomp")
def pump():
    return render_template("pomp.html")

@main.route("/sensor")
def sensor():
    return render_template("sensor.html")

#* --- LOGIN/LOGOUT/REGISTER ---

@main.route("/login", methods=["POST"])
def login():
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
        if e.errno == 1062:  # Duplicate entry error code
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
    logout_user()
    return redirect(url_for('main.home'))
#* --- FORM ---

@main.route("/add-plant", methods=["POST"])
def add_plant():
    plant_naam = request.form.get("plant_naam")
    plantensoort = request.form.get("plantensoort")
    plant_geteelt = request.form.get("plant_geteelt") == "true"
    kas_locatie = request.form.get("kas_locatie")
    
    if not plant_naam or not plantensoort or not kas_locatie:
        return jsonify({"success": False, "error": "Missing data"}), 400

    success = insert_plant_name(plant_naam, plantensoort, plant_geteelt, kas_locatie)
    if success:
        try:
            subprocess.run(["python", "scripts/planten.py"], check=True)
        except subprocess.CalledProcessError as e:
            return jsonify({"success": False, "error": "Error executing script"}), 500

        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Failed to insert plant data"}), 500

@main.route("/json/<path:filename>")
def json_files(filename):
    json_dir = os.path.join(os.getcwd(), "json")
    return send_from_directory(json_dir, filename)

@main.route("/status")
def status():
    if current_user.is_authenticated:
        return jsonify({"status": "logged_in", "user": current_user.username}), 200
    else:
        return jsonify({"status": "not_logged_in"}), 401
    

@main.route("/update_plant_geteelt", methods=["POST"])
def update_plant_geteelt():
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

def update_plant_geteelt_in_database(plant_id, new_status):
    try:
        connection = database_connect()
        cursor = connection.cursor()

        # Update the plant_geteelt status in the database
        query = "UPDATE planten SET plant_geteelt = %s WHERE plant_id = %s"
        cursor.execute(query, (new_status, plant_id))
        connection.commit()
        subprocess.run(["python", "scripts/planten.py"], check=True)

        cursor.close()
        connection.close()

        return True

    except Exception as e:
        # Log any errors that occur during the database update process
        print(f"Error updating plant_geteelt: {e}")
        return False


#* --- PAGINA'S ---
@main.route("/plant-detail", methods=['GET'])
def plant_detail():
    plant_id = request.args.get('id')
    if not plant_id:
        return "Geen plant-ID opgegeven", 400
    
    plant = get_plant_details(plant_id)
    if not plant:
        return "Plant niet gevonden", 404

    # Controleren of plant_geteelt is True of False en dienovereenkomstig de waarde voor de slider instellen
    plant_geteelt_value = 1 if plant['plant_geteelt'] else 0

    return render_template('plant.html', plant=plant, plant_geteelt_value=plant_geteelt_value , user=current_user)

# Functies voor database-interactie

def get_plant_details(plant_id):
    try:
        connection = database_connect()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM planten WHERE plant_id = %s", (plant_id,))
        plant = cursor.fetchone()

        cursor.close()
        connection.close()

        return plant

    except Exception as e:
        # Handle the exception appropriately, such as logging or displaying an error message
        print(f"Error occurred while fetching plant details: {e}")
        return None
