import os
import json
import mysql.connector
from db_connect import database_connect

def fetch_plant_and_write_to_json():
    """
    Haalt plantgegevens op uit de database en schrijft deze naar een JSON-bestand.

    Retourneert:
        None

    Werpt:
        mysql.connector.Error: Als er een fout optreedt bij het ophalen van gegevens uit de MySQL-tabel.
        Exception: Als er een fout optreedt bij het schrijven van gegevens naar het JSON-bestand.
    """
    # Maak verbinding met de database
    connection = database_connect()
    
    try:
        # Maak een cursor om gegevens op te halen in dictionary-formaat
        cursor = connection.cursor(dictionary=True)
        
        # Voer de query uit om plantgegevens op te halen
        cursor.execute("SELECT plant_id, plant_naam, plantensoort, plant_geteelt, kas_locatie FROM planten")
        plants = cursor.fetchall()
        
        # Bepaal het pad van het huidige directory en het JSON-bestand
        current_directory = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_file_path = os.path.join(current_directory, 'json/plants.json')
        
        # Controleer of de 'json' map bestaat en maak deze indien nodig aan
        json_dir = os.path.join(current_directory, 'json')
        if not os.path.exists(json_dir):
            os.makedirs(json_dir)
        
        # Schrijf de opgehaalde gegevens naar het JSON-bestand
        with open(json_file_path, 'w') as json_file:
            json.dump(plants, json_file, indent=4)
        print("Data written to JSON file successfully.")
            
    except mysql.connector.Error as error:
        # Print een foutbericht als er een fout optreedt bij het ophalen van gegevens uit de MySQL-tabel
        print(f"Error fetching data from MySQL table: {error}")
        
    except Exception as e:
        # Print een foutbericht als er een fout optreedt bij het schrijven van gegevens naar het JSON-bestand
        print(f"Error writing data to JSON file: {e}")

    finally:
        # Sluit de cursor en de verbinding als deze geopend zijn
        if 'cursor' in locals():
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

if __name__ == "__main__":
    fetch_plant_and_write_to_json()
