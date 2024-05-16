#     insert_plant_name(plant_naam, plantensoort, plant_geteelt, kas_locatie)
from mysql.connector import Error
from scripts.db_connect import database_connect

def insert_plant_name(plant_naam, plantensoort, plant_geteelt, kas_locatie):
    plant_geteelt_value = 1 if plant_geteelt else 0

    try:
        connection = database_connect()
        cursor = connection.cursor()
        query = "INSERT INTO goodgarden.planten (plant_naam, plantensoort, plant_geteelt, kas_locatie) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (plant_naam, plantensoort, plant_geteelt_value, kas_locatie))
        connection.commit()
        return True
    except Error as e:
        print("Error inserting plant data:", e)
        return False
    finally:
        if connection and connection.is_connected():    
            cursor.close()
            connection.close()
