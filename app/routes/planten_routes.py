import os

from app import db
from app.models.plant import Plant
from app.models.generic_plant_data import GenericPlantData
from app.services.plant_api_service import PlantAPI

from flask import Blueprint, request, jsonify, render_template

plant_bp = Blueprint("plant", __name__)


@plant_bp.route("/planten-lijst", methods=["GET"])
def planten_lijst_homepage():
    return jsonify(Plant.get_planten_lijst())


@plant_bp.route("/planten")
def planten_template():
    return render_template("planten.html")

@plant_bp.route("/planten-data", methods=["GET"])
def get_planten():
    return jsonify(Plant.get_planten_data())


@plant_bp.route("/search-plant")
def search_plant():
    plant_name = request.args.get("name")
    return jsonify(GenericPlantData.fetch_generic_data(plant_name))


@plant_bp.route("/select-plant", methods=["POST"])
def select_plant():
    return jsonify(GenericPlantData.handle_selection(request.json))


@plant_bp.route("/translate-and-search-plant", methods=["POST"])
def translate_and_search_plant():
    data = request.json
    plant_name = data.get("plantNaam")

    result = PlantAPI.translate_and_search(plant_name)

    if "error" in result:
    
        return jsonify(result), 400
    

    return jsonify(result)


@plant_bp.route("/add-plant", methods=["POST"])
def add_plant():
    plant_naam = request.form.get("plant_naam")
    plantensoort = request.form.get("plantensoort")
    plant_geteelt = request.form.get("plant_geteelt") == "true"
    kas_locatie = request.form.get("kas_locatie")

    if not plant_naam or not plantensoort or not kas_locatie:
        return jsonify({"success": False, "error": "Missing data"}), 400

    if Plant.insert_plant(plant_naam, plantensoort, plant_geteelt, kas_locatie):
        return jsonify({"success": True})

    return jsonify({"success": False, "error": "Failed to insert plant data"}), 500


@plant_bp.route("/update_plant_geteelt", methods=["POST"])
def update_plant_geteelt():
    data = request.json
    plant_id = data.get("plant_id")
    new_status = data.get("plant_geteelt")

    if plant_id is None or new_status is None:
        return jsonify({"success": False, "error": "Missing data"}), 400

    if Plant.update_geteelt(plant_id, new_status):
        return jsonify({"success": True}), 200

    return jsonify({"success": False, "error": "Update mislukt"}), 500


@plant_bp.route("/plant-detail", methods=["GET"])
def plant_detail():
    plant_id = request.args.get("id")
    if not plant_id:
        return "Geen plant-ID opgegeven", 400

    plant = Plant.get_details(plant_id)
    if not plant:
        return "Plant niet gevonden", 404

    plant_geteelt_value = 1 if plant.plant_geteelt else 0
    return render_template("plant.html", plant=plant, plant_geteelt_value=plant_geteelt_value)
