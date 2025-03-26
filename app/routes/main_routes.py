from app.models.user import User
from app.services.weer_api_service import WeatherAPI

from flask import Blueprint, jsonify, render_template
from flask_login import login_required, current_user

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def home():
    return render_template("index.html")


@main_bp.route("/weather", methods=["GET"])
def get_weather():
    return WeatherAPI.get_weather()


@main_bp.route("/instellingen")
@login_required
def settings():
    user = User.query.get(current_user.user_id)

    return render_template(
        "instellingen.html",
        user_id=user.user_id,
        username=user.username,
        role=user.role,
        email=user.email,
        aangemaakt=user.date_created,
    )


@main_bp.route("/pomp")
def pump():
    return render_template("pomp.html")


@main_bp.route("/sensor")
def sensor():
    return render_template("sensor.html")


@main_bp.route("/status")
def status():
    if current_user.is_authenticated:
        return jsonify({"status": "logged_in", "user": current_user.username}), 200
    else:
        return jsonify({"status": "not_logged_in"}), 401
    
