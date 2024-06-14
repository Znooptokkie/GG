from mysql.connector import Error
from scripts.db_connect import database_connect

def insert_plant_name(plant_naam, plantensoort, plant_geteelt, kas_locatie):
    """
    Voegt een nieuwe plant toe aan de goodgarden.planten tabel in de database.

    Parameters:
        plant_naam (str): De naam van de plant.
        plantensoort (str): De soort van de plant.
        plant_geteelt (bool): Of de plant geteelt is (True of False).
        kas_locatie (str): De locatie van de kas waar de plant zich bevindt.

    Retourneert:
        bool: True als de plant succesvol is toegevoegd, anders False.

    Werpt:
        Error: Als er een fout optreedt bij het invoegen van de plantgegevens in de database.
    """
    # Converteer de bool waarde van plant_geteelt naar een integer waarde (1 of 0)
    plant_geteelt_value = 1 if plant_geteelt else 0

    try:
        # Maak verbinding met de database
        connection = database_connect()
        cursor = connection.cursor()
        
        # Definieer de query voor het invoegen van plantgegevens
        query = "INSERT INTO goodgarden.planten (plant_naam, plantensoort, plant_geteelt, kas_locatie) VALUES (%s, %s, %s, %s)"
        
        # Voer de query uit met de verstrekte parameters
        cursor.execute(query, (plant_naam, plantensoort, plant_geteelt_value, kas_locatie))
        
        # Bevestig de wijzigingen in de database
        connection.commit()
        
        # Print de naam van de toegevoegde plant
        print(plant_naam)
        
        return True
    except Error as e:
        # Print het foutbericht als er een fout optreedt bij het invoegen van plantgegevens
        print("Error inserting plant data:", e)
        
        return False
    finally:
        # Sluit de cursor en de verbinding als deze geopend zijn
        if connection and connection.is_connected():    
            cursor.close()
            connection.close()
