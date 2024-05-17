from flask import Blueprint, request, jsonify, render_template, send_from_directory
import sys
import os
import subprocess

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'scripts')))

from scripts.planten_form import insert_plant_name

main = Blueprint("main", __name__)

@main.route("/")
def home():
    return render_template("index.html")

@main.route("/planten")
def about():
    return render_template("planten.html")

@main.route("/add-plant", methods=["POST"])
def add_plant():
    plant_naam = request.form.get("plant_naam")
    plantensoort = request.form.get("plantensoort")
    plant_geteelt = request.form.get("plant_geteelt") == 'true'
    kas_locatie = request.form.get("kas_locatie")
    
    if not plant_naam or not plantensoort or not kas_locatie:
        return jsonify({"success": False, "error": "Missing data"}), 400

    success = insert_plant_name(plant_naam, plantensoort, plant_geteelt, kas_locatie)
    if success:
        try:
            subprocess.run(["python", "scripts/planten.py"], check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error executing planten.py: {e}")
            return jsonify({"success": False, "error": "Error executing script"}), 500

        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Failed to insert plant data"}), 500

@main.route("/json/<path:filename>")
def json_files(filename):
    json_dir = os.path.join(os.getcwd(), 'json')
    return send_from_directory(json_dir, filename)