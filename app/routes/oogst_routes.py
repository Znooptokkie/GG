from app.models.oogst import Oogst

from flask import Blueprint, jsonify

oogst_bp = Blueprint("oogst", __name__)


@oogst_bp.route("/oogsten", methods=["GET"])
def get_oogst():
    return jsonify(Oogst.fetch_stats())
