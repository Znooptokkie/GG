from app import db

from flask import request, redirect, url_for, flash
from flask_login import UserMixin, login_user
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model, UserMixin):
    __tablename__ = "users"

    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(255))
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def get_id(self):
        return str(self.user_id)
    

    @classmethod
    def login(cls, form_data):
        username = form_data["username"]
        password = form_data["password"]

        user = cls.query.filter_by(username=username).first()

        if user and check_password_hash(user.password, password):
            login_user(user)
            next_page = request.args.get("next")
            return redirect(next_page or url_for("main.home"))

        flash("Onjuist wachtwoord of gebruikersnaam", "error")
        return redirect(url_for("main.home"))

    @classmethod
    def register(cls, form_data):
        username = form_data["username"]
        password = form_data["password"]
        hashed_password = generate_password_hash(password, method="pbkdf2:sha256")

        try:
            new_user = cls(username=username, password=hashed_password, role="admin")
            db.session.add(new_user)
            db.session.commit()
            flash("Registratie succesvol!", "success")
        except Exception as e:
            db.session.rollback()
            if "Duplicate entry" in str(e):
                flash("Gebruikersnaam bestaat al,<br>probeer een andere!", "error")
            else:
                flash("Er is een fout opgetreden,<br>probeer het opnieuw!", "error")

        return redirect(url_for("main.home"))