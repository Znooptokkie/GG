from flask import Flask
from flask_login import LoginManager
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    
    # Get the SECRET_KEY from environment variables
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

    login_manager.init_app(app)
    login_manager.login_view = "main.login"
    
    from .routes import main
    from .additional_routes import additional_routes
    
    app.register_blueprint(main)
    app.register_blueprint(additional_routes)

    from .sensor_routes import sensor_routes
    app.register_blueprint(sensor_routes)
    
    return app
