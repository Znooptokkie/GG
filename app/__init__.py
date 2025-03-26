from flask import Flask
from flask_login import LoginManager, current_user
from dotenv import load_dotenv
from app.config.config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

load_dotenv()

db = SQLAlchemy()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    Migrate(app, db)

    login_manager.init_app(app)
    login_manager.login_view = "auth.login"

    from app.routes.main_routes import main_bp
    from app.routes.auth_routes import auth_bp
    from app.routes.planten_routes import plant_bp
    from app.routes.oogst_routes import oogst_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(plant_bp)
    app.register_blueprint(oogst_bp)
    app.register_blueprint(auth_bp)

    @app.context_processor
    def inject_user():
        return dict(user=current_user)

    return app
