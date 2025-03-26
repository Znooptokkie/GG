from app import db
from sqlalchemy import func, case
from app.models.plant import Plant

class Oogst(db.Model):
    __tablename__ = "oogsten"

    oogst_id = db.Column(db.Integer, primary_key=True)
    plant_id = db.Column(db.Integer, db.ForeignKey("planten.plant_id"), nullable=False)
    datum = db.Column(db.Date)
    succesvol = db.Column(db.Boolean, nullable=False)

    @classmethod
    def fetch_stats(cls):
        try:
            result = (
                db.session.query(
                    Plant.plantensoort.label("PlantType"),
                    func.count(case((cls.succesvol == True, 1))).label("SuccesvolleOogsten"),
                    func.count(case((cls.succesvol == False, 1))).label("MislukteOogsten")
                )
                .join(cls, Plant.plant_id == cls.plant_id)
                .group_by(Plant.plantensoort)
                .all()
            )

            return [
                {
                    "PlantType": row.PlantType,
                    "SuccesvolleOogsten": row.SuccesvolleOogsten,
                    "MislukteOogsten": row.MislukteOogsten
                }
                for row in result
            ]

        except Exception as e:
            print("Failed to fetch oogst data:", e)
            return {"error": "Kon oogst data niet ophalen"}