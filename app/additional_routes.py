from flask import Blueprint, jsonify, request, render_template
import requests
import os
from scripts.db_connect import database_connect
from scripts.planten_api_generic import fetch_generic_data, insert_generic_plant_data
from googletrans import Translator
# import mysql.connector
from mysql.connector import Error


additional_routes = Blueprint("additional_routes", __name__)


def get_weather_data():
    # api_key = "05ddd06644"
    location = "Leiden"
    url = f"https://weerlive.nl/api/weerlive_api_v2.php?key={os.getenv('WEER_API_KEY')}&locatie={location}"
    response = requests.get(url).json()
    return response

@additional_routes.route('/weather', methods=['GET'])
def get_weather():
    weather_response = get_weather_data()

    if 'error' in weather_response:
        return jsonify({"error": "Kon weerdata niet ophalen"})

    live_weather = weather_response.get('liveweer', [])
    weather_forecast = weather_response.get('wk_verw', [])
    day_forecast = weather_response.get('wk_verw', [])

    weather_data = {
        "live_weather": live_weather[0] if live_weather else {},
        "weather_forecast": weather_forecast,
        "day_forecast": day_forecast
    }

    return jsonify(weather_data)

def get_planten_data():
    mydb = database_connect()
    if mydb and mydb.is_connected():
        try:
            cursor = mydb.cursor(dictionary=True)
            query = "SELECT plant_id, plant_naam, plantensoort, plant_geteelt, kas_locatie FROM planten"
            cursor.execute(query)
            planten_data = cursor.fetchall()
            mydb.close()
            return planten_data
        except Exception as e:
            print("Failed to fetch planten data:", e)
            return {"error": "Kon plantendata niet ophalen"}
    else:
        return {"error": "Database connection failed"}

@additional_routes.route("/planten-data", methods=["GET"])
def get_planten():
    planten_response = get_planten_data()

    if "error" in planten_response:
        return jsonify(planten_response)

    return jsonify(planten_response)


# @additional_routes.route('/update_plant_geteelt/<int:plant_id>', methods=['POST'])
# def api_update_plant_geteelt(plant_id):
#     data = request.json
#     if 'plant_geteelt' not in data:
#         return jsonify({"error": "plant_geteelt is missing in the request"}), 400

#     plant_geteelt = data['plant_geteelt']
#     if update_plant_geteelt(plant_id, plant_geteelt):
#         return jsonify({"message": "Plant_geteelt successfully updated"}), 200
#     else:
#         return jsonify({"error": "Failed to update plant_geteelt"}), 500


#---PIE DIAGRAM---#
def oogst_aantal():
    conn = database_connect()
    if conn and conn.is_connected():
        try:
            cursor = conn.cursor()
            query = """SELECT planten.plantensoort AS PlantType,
                        COUNT(CASE WHEN oogsten.succesvol = 1 THEN 1 END) AS SuccesvolleOogsten,
                        COUNT(CASE WHEN oogsten.succesvol = 0 THEN 1 END) AS MislukteOogsten
                        FROM planten
                        JOIN oogsten ON planten.plant_id = oogsten.plant_id
                        GROUP BY planten.plantensoort"""
            cursor.execute(query)
            oogst_data = cursor.fetchall()
            return oogst_data
        except Exception as e:
            print("Failed to fetch planten data:", e)
            return {"error": "Kon oogst data niet ophalen"}
        finally:
            conn.close()
    else:
        return {"error": "Database connection failed"}

@additional_routes.route("/oogsten", methods=["GET"])
def get_oogst():
    oogst_response = oogst_aantal()

    if "error" in oogst_response:
        return jsonify(oogst_response)

    return jsonify(oogst_response)

    
@additional_routes.route('/search-plant')
def search_plant():
    plant_name = request.args.get('name')
    api_url = f"https://perenual.com/api/species-list?key={os.getenv('PLANTEN_KEY')}&q={plant_name}"
    plant_data = fetch_generic_data(api_url)
    return jsonify(plant_data)

@additional_routes.route("/select-plant", methods=["POST"])
def select_plant():
    plant_data = request.json
    common_name = plant_data.get("common_name")
    scientific_name = plant_data.get("scientific_name", [])
    
    if not common_name or not scientific_name:
        return jsonify({"success": False, "error": "Missing data"}), 400

    try:
        connection = database_connect()
        insert_generic_plant_data(connection, plant_data)
        return jsonify({"success": True})
    except Error as e:
        print(f"Error: '{e}'")
        return jsonify({"success": False, "error": str(e)}), 500

@additional_routes.route('/translate-and-search-plant', methods=['POST'])
def translate_and_search_plant():
    data = request.json
    plant_name = data.get("plantNaam")

    if not plant_name:
        return jsonify({"error": "Missing plant name"}), 400

    translator = Translator()
    translated_plant_name = translator.translate(plant_name, src='nl', dest='en').text

    api_url = f"https://perenual.com/api/species-list?key={os.getenv('PLANTEN_KEY')}&q={translated_plant_name}"
    plant_data = fetch_generic_data(api_url)
    
    # Voeg vertaalde namen toe aan de plant_data en filter op aanwezigheid van een geldige afbeelding
    filtered_data = []
    for plant in plant_data.get('data', []):
        default_image = plant.get('default_image')
        if default_image and 'medium_url' in default_image:
            image_url = default_image['medium_url']
            if "upgrade_access.jpg" not in image_url:
                translated_common_name = translator.translate(plant['common_name'], src='en', dest='nl').text
                translated_common_name = translated_common_name.capitalize()
                plant['translated_common_name'] = translated_common_name
                filtered_data.append(plant)
    
    # Update de plant_data met de gefilterde resultaten
    plant_data['data'] = filtered_data
    
    return jsonify(plant_data)
