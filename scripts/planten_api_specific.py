import requests
import mysql.connector
from mysql.connector import Error
import json
from scripts.db_connect import database_connect

def fetch_data_from_api(api_url):
    """
    Haalt data op van een gegeven API URL.

    Parameters:
        api_url (str): De URL van de API waarvan data opgehaald moet worden.

    Retourneert:
        dict: De opgehaalde data in JSON-formaat als de statuscode 200 is.

    Werpt:
        Exception: Als er een fout optreedt bij het ophalen van de data, 
                   met de statuscode van de API respons.
    """
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error fetching data from API: {response.status_code}")

def create_connection(host_name, user_name, user_password, db_name):
    """
    Maakt verbinding met een MySQL database.

    Parameters:
        host_name (str): De hostname van de MySQL server.
        user_name (str): De gebruikersnaam om in te loggen op de MySQL server.
        user_password (str): Het wachtwoord om in te loggen op de MySQL server.
        db_name (str): De naam van de database waarmee verbonden moet worden.

    Retourneert:
        connection (mysql.connector.connection_cext.CMySQLConnection): 
            Een MySQL verbindingsobject als de verbinding succesvol is.
        None: 
            Als de verbinding niet succesvol is.

    Werpt:
        Error: Als er een fout optreedt bij het verbinden met de database.
    """
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

def json_or_none(value):
    """
    Converteert een waarde naar een JSON-string als de waarde niet None is.

    Parameters:
        value: De waarde die geconverteerd moet worden.

    Retourneert:
        str: De waarde als JSON-string.
        None: Als de waarde None is.
    """
    if value is None:
        return None
    return json.dumps(value)

def none_if_empty(value):
    """
    Retourneert None als de waarde leeg is, anders retourneert de waarde zelf.

    Parameters:
        value: De waarde die gecontroleerd moet worden.

    Retourneert:
        None: Als de waarde None, een lege string, een lege lijst of een lege dictionary is.
        value: De oorspronkelijke waarde als deze niet leeg is.
    """
    if value in (None, '', [], {}):
        return None
    return value

def insert_specific_plant_data(connection, plant_data):
    """
    Voegt specifieke plantgegevens in een database in.

    Parameters:
        connection (mysql.connector.connection_cext.CMySQLConnection): 
            De databaseverbinding.
        plant_data (dict): De data van de plant die ingevoerd moet worden.

    Retourneert:
        None
    """
    cursor = connection.cursor()

    insert_query = """
    INSERT INTO `specific-plant-data` (
        `plant_id`, `family`, `origin`, `type`, `dimension`, `dimensions`, 
        `cycle`, `attracts`, `propagation`, `hardiness`, `watering`, 
        `depth_water_requirement`, `volume_water_requirement`, `watering_general_benchmark`, 
        `plant_anatomy`, `sunlight`, `pruning_month`, `pruning_count`, 
        `seeds`, `maintenance`, `care-guides`, `soil`, `growth_rate`, 
        `drought_tolerant`, `salt_tolerant`, `thorny`, `invasive`, 
        `tropical`, `indoor`, `care_level`, `pest_susceptibility`, 
        `pest_susceptibility_api`, `flowers`, `flowering_season`, `flower_color`, 
        `cones`, `fruits`, `edible_fruit`, `edible_fruit_taste_profile`, 
        `fruit_nutritional_value`, `fruit_color`, `harvest_season`, 
        `leaf`, `leaf_color`, `edible_leaf`, `cuisine`, `medicinal`, 
        `poisonous_to_humans`, `poisonous_to_pets`, `description`, `default_image`
    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    values = (
        plant_data.get('id'),
        plant_data.get('family'),
        json_or_none(plant_data.get('origin')),
        plant_data.get('type'),
        plant_data.get('dimension'),
        json_or_none(plant_data.get('dimensions')),
        plant_data.get('cycle'),
        json_or_none(plant_data.get('attracts')),
        json_or_none(plant_data.get('propagation')),
        json_or_none(plant_data.get('hardiness')),
        plant_data.get('watering'),
        json_or_none(plant_data.get('depth_water_requirement')),
        json_or_none(plant_data.get('volume_water_requirement')),
        json_or_none(plant_data.get('watering_general_benchmark')),
        json_or_none(plant_data.get('plant_anatomy')),
        json_or_none(plant_data.get('sunlight')),
        json_or_none(plant_data.get('pruning_month')),
        json_or_none(plant_data.get('pruning_count')),
        plant_data.get('seeds'),
        plant_data.get('maintenance'),
        plant_data.get('care-guides'),
        json_or_none(plant_data.get('soil')),
        plant_data.get('growth_rate'),
        none_if_empty(plant_data.get('drought_tolerant')),
        none_if_empty(plant_data.get('salt_tolerant')),
        none_if_empty(plant_data.get('thorny')),
        none_if_empty(plant_data.get('invasive')),
        none_if_empty(plant_data.get('tropical')),
        none_if_empty(plant_data.get('indoor')),
        plant_data.get('care_level'),
        json_or_none(plant_data.get('pest_susceptibility')),
        plant_data.get('pest_susceptibility_api'),
        none_if_empty(plant_data.get('flowers')),
        plant_data.get('flowering_season'),
        plant_data.get('flower_color'),
        none_if_empty(plant_data.get('cones')),
        none_if_empty(plant_data.get('fruits')),
        none_if_empty(plant_data.get('edible_fruit')),
        plant_data.get('edible_fruit_taste_profile'),
        plant_data.get('fruit_nutritional_value'),
        json_or_none(plant_data.get('fruit_color')),
        plant_data.get('harvest_season'),
        none_if_empty(plant_data.get('leaf')),
        json_or_none(plant_data.get('leaf_color')),
        none_if_empty(plant_data.get('edible_leaf')),
        none_if_empty(plant_data.get('cuisine')),
        none_if_empty(plant_data.get('medicinal')),
        none_if_empty(plant_data.get('poisonous_to_humans')),
        none_if_empty(plant_data.get('poisonous_to_pets')),
        plant_data.get('description'),
        json_or_none(plant_data.get('default_image'))
    )

    print("Number of placeholders in query:", insert_query.count("%s"))
    print("Number of values to insert:", len(values))

    print("Values to insert:", values)

    cursor.execute(insert_query, values)
    connection.commit()

# Moet nog verder uitgewerkt worden. Zie "planten_api_generic.py".
def main():
    # api_url = "https://perenual.com/api/species/details/20?key=" 

    mydb = database_connect()

    # plant_data = fetch_data_from_api(api_url)

    # insert_specific_plant_data(mydb, plant_data)

    mydb.close()

if __name__ == "__main__":
    main()
