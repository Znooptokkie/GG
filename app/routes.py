from flask import Blueprint, request, jsonify, render_template, send_from_directory, redirect, url_for, flash
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
    return render_template("instellingen.html")

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
        return jsonify({"success": False, "error": "missing_data"}), 400

    success = insert_plant_name(plant_naam, plantensoort, plant_geteelt, kas_locatie)
    if success:
        try:
            subprocess.run(["python", "scripts/planten.py"], check=True)
        except subprocess.CalledProcessError as e:
            return jsonify({"success": False, "error": "script_error"}), 500

        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "duplicate_entry"}), 500


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

@main.route('/plant-detail', methods=['GET'])
def plant_detail():
    plant_id = request.args.get('id')
    if not plant_id:
        return "No plant ID provided", 400
    
    connection = None
    cursor = None
    try:
        connection = database_connect()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("SELECT * FROM goodgarden.planten WHERE plant_id = %s", (plant_id,))
        plant = cursor.fetchone()

        if not plant:
            return "Plant not found", 404

        return render_template('plant.html', plant=plant)

    except mysql.connector.Error as err:
        print(f"Database error: {err}")
        return "Internal server error", 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return "Internal server error", 500

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
