from flask import Blueprint, jsonify, request

sensor_routes = Blueprint("sensor_routes", __name__)

# SENSOREN MQTT
sensor_data = {}

@sensor_routes.route("/api/sensor/<sensor_id>", methods=["POST"])
def receive_sensor_data(sensor_id):
    """
    Receive sensor data via POST request and store it.

    @param {string} sensor_id - The ID of the sensor sending data.
    @return {Response} JSON response with status and received data.
    """
    data = request.json
    if sensor_id not in sensor_data:
        sensor_data[sensor_id] = []
    sensor_data[sensor_id].append(data)
    return jsonify({"status": "success", "data_received": data}), 201

@sensor_routes.route("/api/sensor", methods=["GET"])
def get_sensor_data():
    """
    Get all received sensor data.

    @return {Response} JSON response with all sensor data.
    """
    return jsonify(sensor_data)
