from app import db

class Plant(db.Model):
    __tablename__ = "planten"

    plant_id = db.Column(db.Integer, primary_key=True)
    plant_naam = db.Column(db.String(100), nullable=False)
    plantensoort = db.Column(db.String(100), nullable=False)
    plant_geteelt = db.Column(db.Boolean, default=False)
    kas_locatie = db.Column(db.String(100))
    

    def to_dict(self):
        return {
            "plant_id": self.plant_id,
            "plant_naam": self.plant_naam,
            "plantensoort": self.plantensoort,
            "plant_geteelt": int(self.plant_geteelt),
            "kas_locatie": self.kas_locatie
        }
    

    @classmethod
    def get_planten_data(cls):
        try:
            planten = cls.query.all()
            return [plant.to_dict() for plant in planten]
        except Exception as e:
            print("Failed to fetch planten data:", e)
            return {"error": "Kon plantendata niet ophalen"}
        
        
    @classmethod
    def get_planten_lijst(cls):
        try:
            planten = cls.query.all()
            return [plant.to_dict() for plant in planten]
        except Exception as e:
            print("Faal om planten lijst te fetchen")
            return {"error": "Kon planten lijst data niet ophalen"}
        

    @classmethod
    def insert_plant(cls, naam, soort, geteelt, locatie):
        try:
            new_plant = cls(
                plant_naam=naam,
                plantensoort=soort,
                plant_geteelt=geteelt,
                kas_locatie=locatie
            )
            db.session.add(new_plant)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            print(f"Insert plant failed: {e}")
            return False

    @classmethod
    def update_geteelt(cls, plant_id, new_status):
        try:
            plant = cls.query.get(plant_id)
            if plant:
                plant.plant_geteelt = new_status
                db.session.commit()
                return True
            return False
        except Exception as e:
            db.session.rollback()
            print(f"Error updating plant_geteelt: {e}")
            return False

    @classmethod
    def get_details(cls, plant_id):
        return cls.query.get(plant_id)