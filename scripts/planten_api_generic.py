import requests
import json
from googletrans import Translator

def fetch_generic_data(api_url):
    """
    Haalt generieke data op van een API.

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
    if value in (None, "", [], {}):
        return None
    return value

def translate_specific_columns(plant_data, columns_to_translate, translator):
    """
    Vertaalt specifieke kolommen in plant_data met behulp van een Translator object.

    Parameters:
        plant_data (dict): De data van de plant.
        columns_to_translate (list): De lijst van kolommen die vertaald moeten worden.
        translator (Translator): Een Translator object om de vertaling uit te voeren.

    Retourneert:
        dict: De plant_data met de specifieke kolommen vertaald.
    """
    translated_data = {}
    for key, value in plant_data.items():
        if key in columns_to_translate:
            translated_data[key] = translate_text(value, translator)
        else:
            translated_data[key] = value
    return translated_data

def translate_text(text, translator):
    """
    Vertaalt tekst of een lijst van teksten van Engels naar Nederlands.

    Parameters:
        text (str of list): De tekst of lijst van teksten die vertaald moeten worden.
        translator (Translator): Een Translator object om de vertaling uit te voeren.

    Retourneert:
        str of list: De vertaalde tekst of lijst van vertaalde teksten.
    """
    if isinstance(text, list):
        translated_texts = translator.translate(text, src='en', dest='nl')
        return [translated.text for translated in translated_texts]
    else:
        result = translator.translate(text, src='en', dest='nl')
        return result.text

def insert_generic_plant_data(connection, plant_data):
    """
    Voegt generieke plantgegevens in een database in.

    Parameters:
        connection (mysql.connector.connection_cext.CMySQLConnection): 
            De databaseverbinding.
        plant_data (dict): De data van de plant die ingevoerd moet worden.

    Retourneert:
        None
    """
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
