from app import login_manager
from app.models.user import User

from flask import Blueprint, request, redirect, url_for
from flask_login import login_required, logout_user

auth_bp = Blueprint("auth", __name__)


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


@auth_bp.route("/login", methods=["POST"])
def login():
    return User.login(request.form)


@auth_bp.route("/register", methods=["POST"])
def register():
    return User.register(request.form)


@auth_bp.route("/logout", methods=["POST"])
@login_required
def logout():
    logout_user()
    return redirect(url_for('main.home'))


