import os

from app.models.generic_plant_data import GenericPlantData
from googletrans import Translator


class PlantAPI:
    @classmethod
    def translate_and_search(cls, plant_name: str) -> dict:
        if not plant_name:
            return {"error": "Missing plant name"}

        translator = Translator()

        try:
            translated_plant_name = translator.translate(plant_name, src="nl", dest="en").text
        except Exception as e:
            print("Fout bij vertalen van opgegeven plantnaam:", e)
            translated_plant_name = plant_name  # fallback: gebruik originele naam

        api_url = f"https://perenual.com/api/species-list?key={os.getenv('PLANTEN_KEY')}&q={translated_plant_name}"
        plant_data = GenericPlantData.fetch_generic_data(api_url)

        filtered_data = []

        for plant in plant_data.get("data", []):
            default_image = plant.get("default_image")

            if default_image and "medium_url" in default_image and plant.get("common_name"):
                image_url = default_image["medium_url"]

                if "upgrade_access.jpg" not in image_url:
                    try:
                        vertaling = translator.translate(plant["common_name"], src="en", dest="nl")
                        translated_common_name = vertaling.text
                    except Exception as e:
                        print(f"Fout bij vertalen van common_name '{plant['common_name']}':", e)
                        translated_common_name = plant["common_name"]

                    plant["translated_common_name"] = translated_common_name.capitalize()
                    filtered_data.append(plant)

        plant_data["data"] = filtered_data
        return plant_data
