import os
import json
import mysql.connector
from db_connect import database_connect

def fetch_plant_and_write_to_json():
    connection = database_connect()
    
    try:
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT plant_id, plant_naam, plantensoort, plant_geteelt, kas_locatie FROM planten")
        plants = cursor.fetchall()
        
        current_directory = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        json_file_path = os.path.join(current_directory, 'json/plants.json')
        
        # Controleer of de 'json' map bestaat en maak deze indien nodig aan
        json_dir = os.path.join(current_directory, 'json')
        if not os.path.exists(json_dir):
            os.makedirs(json_dir)
        
        with open(json_file_path, 'w') as json_file:
            json.dump(plants, json_file, indent=4)
        print("Data written to JSON file successfully.")
            
    except mysql.connector.Error as error:
        print(f"Error fetching data from MySQL table: {error}")
        
    except Exception as e:
        print(f"Error writing data to JSON file: {e}")

    finally:
        if 'cursor' in locals():
            cursor.close()
        if connection and connection.is_connected():
            connection.close()

if __name__ == "__main__":
    fetch_plant_and_write_to_json()