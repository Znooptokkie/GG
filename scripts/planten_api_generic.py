import requests
import mysql.connector
from mysql.connector import Error
import json

# Functie om data op te halen uit een API
def fetch_generic_data(api_url):
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error fetching data from API: {response.status_code}")

# Functie om een verbinding met de MySQL database te maken
def create_connection(host_name, user_name, user_password, db_name):
    connection = None
    try:
        connection = mysql.connector.connect(
            host=host_name,
            user=user_name,
            passwd=user_password,
            database=db_name
        )
        print("Connection to MySQL DB successful")
    except Error as e:
        print(f"The error '{e}' occurred")
    return connection

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

# Functie om data in de database in te voegen
def insert_generic_plant_data(connection, plant_data):
    cursor = connection.cursor()

    insert_query = """
    INSERT INTO `generic-plant-data` (
        `common_name`, `scientific_name`, `other_name`, `cycle`, `watering`, `sunlight`
    ) VALUES (
        %s, %s, %s, %s, %s, %s
    )
    """

    values = (
        plant_data.get("common_name"),
        json_or_none(plant_data.get("scientific_name")),
        json_or_none(plant_data.get("other_name")),
        plant_data.get("cycle"),
        plant_data.get("watering"),
        json_or_none(plant_data.get("sunlight"))
    )

    cursor.execute(insert_query, values)
    connection.commit()

# Hoofdfunctie om het proces te beheren
def main():
    api_url = "https://perenual.com/api/species-list?key=sk-fUc26654cb42acef65471&q=tomato"
    
    db_connection = create_connection("localhost", "root", "", "goodgarden")

    # Haal data op van de API
    api_response = fetch_generic_data(api_url)
    
    # Print de API-respons om de structuur te inspecteren
    print(json.dumps(api_response, indent=2))

    # Verwerk de data van de API-respons
    plant_data_list = api_response.get("data", [])
    for plant in plant_data_list:
        insert_generic_plant_data(db_connection, plant)

    db_connection.close()

if __name__ == "__main__":
    main()
