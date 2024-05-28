import requests
import mysql.connector
from mysql.connector import Error
import json
from googletrans import Translator

# Functie om data op te halen uit een API
def fetch_generic_data(api_url):
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error fetching data from API: {response.status_code}")

# Functie om een verbinding met de MySQL database te maken
# def create_connection():
#     connection = None
#     try:
#         connection = mysql.connector.connect(
#             host="localhost",
#             user="root",
#             passwd="",
#             database="goodgarden"
#         )
#         print("Connection to MySQL DB successful")
#     except Error as e:
#         print(f"The error '{e}' occurred")
#     return connection

# Helperfunctie om waarden om te zetten naar JSON of NULL
def json_or_none(value):
    if value is None:
        return None
    return json.dumps(value)

# Helperfunctie om een waarde om te zetten naar None als deze leeg is
def none_if_empty(value):
    if value in (None, "", [], {}):
        return None
    return value

# Functie om specifieke kolommen te vertalen naar het Nederlands
def translate_specific_columns(plant_data, columns_to_translate, translator):
    translated_data = {}
    for key, value in plant_data.items():
        if key in columns_to_translate:
            translated_data[key] = translate_text(value, translator)
        else:
            translated_data[key] = value
    return translated_data

# Functie om teksten te vertalen naar het Nederlands
def translate_text(text, translator):
    if isinstance(text, list):
        translated_texts = translator.translate(text, src='en', dest='nl')
        return [translated.text for translated in translated_texts]
    else:
        result = translator.translate(text, src='en', dest='nl')
        return result.text

# Functie om data in de database in te voegen
def insert_generic_plant_data(connection, plant_data):
    cursor = connection.cursor()

    insert_query = """
    INSERT INTO `generic-plant-data` (
        `plant_id`, `common_name`, `scientific_name`, `other_name`, `cycle`, `watering`, `sunlight`
    ) VALUES (
        %s, %s, %s, %s, %s, %s, %s
    )
    """

    columns_to_translate = ["common_name", "cycle", "watering"]
    translator = Translator()
    translated_data = translate_specific_columns(plant_data, columns_to_translate, translator)

    values = (
        translated_data.get("id"),
        translated_data.get("common_name"),
        json_or_none(translated_data.get("scientific_name")),
        json_or_none(translated_data.get("other_name")),
        translated_data.get("cycle"),
        translated_data.get("watering"),
        json_or_none(translated_data.get("sunlight"))
    )

    cursor.execute(insert_query, values)
    connection.commit()
