from flask import Flask

def create_app():
    app = Flask(__name__)
    
    from .routes import main
    from .additional_routes import additional_routes
    
    app.register_blueprint(main)
    app.register_blueprint(additional_routes)
    
    return app
