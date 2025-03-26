import requests, os

from flask import jsonify


class WeatherAPI:

    location = "Leiden"
    url = f"https://weerlive.nl/api/weerlive_api_v2.php?key={os.getenv('WEER_API_KEY')}&locatie={location}"


    @classmethod
    def get_weather_data(cls):
        try:
            response = requests.get(cls.url)
            return response.json()
        except Exception as e:
            print(f"Fout bij ophalen weerdata: {e}")
            return {"error": "Request failed"}


    @classmethod
    def get_weather(cls):
        weather_response = cls.get_weather_data()

        if "error" in weather_response:
            return jsonify({"error": "Kon weerdata niet ophalen"})

        live_weather = weather_response.get("liveweer", [])
        forecast = weather_response.get("wk_verw", [])

        return jsonify({
            "live_weather": live_weather[0] if live_weather else {},
            "weather_forecast": forecast,
            "day_forecast": forecast
        })
