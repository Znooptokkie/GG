import json, requests, os

from app import db

from googletrans import Translator


class GenericPlantData(db.Model):
    __tablename__ = "generic_plant_data"

    id = db.Column(db.Integer, primary_key=True)
    plant_id = db.Column(db.Integer, unique=True)
    common_name = db.Column(db.String(255))
    scientific_name = db.Column(db.Text)
    other_name = db.Column(db.Text)
    cycle = db.Column(db.String(255))
    watering = db.Column(db.String(255))
    sunlight = db.Column(db.Text)

    @classmethod
    def json_or_none(cls, value):
        if value is None:
            return None
        return json.dumps(value)
    
    @classmethod
    def none_if_empty(cls, value):
        if value in (None, "", [], {}):
            return None
        return value

    @classmethod
    def translate_text(cls, text, translator):
        if isinstance(text, list):
            translated_texts = translator.translate(text, src="en", dest="nl")
            return [translated.text for translated in translated_texts]
        else:
            result = translator.translate(text, src="en", dest="nl")
            return result.text

    @classmethod
    def translate_specific_columns(cls, plant_data, columns_to_translate, translator):
        translated_data = {}
        for key, value in plant_data.items():
            if key in columns_to_translate:
                translated_data[key] = cls.translate_text(value, translator)
            else:
                translated_data[key] = value
        return translated_data

    @classmethod
    def insert_generic_plant_data(cls, plant_data):
        translator = Translator()

        columns_to_translate = ["common_name", "cycle", "watering"]
        translated_data = cls.translate_specific_columns(plant_data, columns_to_translate, translator)

        new_plant = GenericPlantData(
            plant_id=translated_data.get("id"),
            common_name=cls.none_if_empty(translated_data.get("common_name")),
            scientific_name=cls.json_or_none(translated_data.get("scientific_name")),
            other_name=cls.json_or_none(translated_data.get("other_name")),
            cycle=cls.none_if_empty(translated_data.get("cycle")),
            watering=cls.none_if_empty(translated_data.get("watering")),
            sunlight=cls.json_or_none(translated_data.get("sunlight"))
        )

        try:
            db.session.add(new_plant)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e

    @classmethod
    def fetch_generic_data(cls, plant_name):
        api_url = f"https://perenual.com/api/species-list?key={os.getenv('PLANTEN_KEY')}&q={plant_name}"
        response = requests.get(api_url)
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Error fetching data from API: {response.status_code}")


    @classmethod
    def handle_selection(cls, plant_data):
        common_name = plant_data.get("common_name")
        scientific_name = plant_data.get("scientific_name", [])
    
        if not common_name or not scientific_name:
            return {"success": False, "error": "Missing data"}, 400

        try:
            cls.insert_generic_plant_data(plant_data)
            return {"success": True}
        except Exception as e:
            print(f"Error: '{e}'")
            return {"success": False, "error": str(e)}, 500
