import requests

FLASK_API_URL = "http://localhost:5000/api/sensor"

def send_test_data(sensor_id, value, is_active, error_code):
    data = {"value": value, "actief": is_active, "error": error_code}
    response = requests.post(f"{FLASK_API_URL}/{sensor_id}", json=data)
    print(response.json())

if __name__ == "__main__":
    send_test_data("sensor1", 512, True, 0)
    send_test_data("sensor2", 300, False, 1)
