from app import create_app, db
from app.models.user import User
from app.models.plant import Plant
from app.models.oogst import Oogst

from werkzeug.security import generate_password_hash
from datetime import date


def seed_admin():
    admin_exists = User.query.filter_by(email="admin@admin.nl").first()

    if admin_exists:
        print("Admin-user bestaat al, wordt niet opnieuw aangemaakt!")
        return

    admin = User(
        username="admin",
        password=generate_password_hash("admin"),
        role="admin",
        email="admin@admin.nl",
    )
    db.session.add(admin)
    db.session.commit()
    print("Admin-user aangemaakt!")


def seed_plant():
    planten = [
        {
            "plant_naam": "Tomaat",
            "plantensoort": "groente",
            "plant_geteelt": True,
            "kas_locatie": "LEFT",
        },
        {
            "plant_naam": "Koriander",
            "plantensoort": "kruiden",
            "plant_geteelt": True,
            "kas_locatie": "LEFT",
        },
        {
            "plant_naam": "Aardbei",
            "plantensoort": "fruit",
            "plant_geteelt": True,
            "kas_locatie": "RIGHT",
        },
        {
            "plant_naam": "Champignon",
            "plantensoort": "schimmel",
            "plant_geteelt": True,
            "kas_locatie": "RIGHT",
        },
        {
            "plant_naam": "Cactus",
            "plantensoort": "overig",
            "plant_geteelt": True,
            "kas_locatie": "LEFT",
        },
        {
            "plant_naam": "Peer",
            "plantensoort": "fruit",
            "plant_geteelt": False,
            "kas_locatie": "LEFT",
        },
    ]

    added_count = 0
    skipped_count = 0

    for plant_data in planten:
        existing_plant = Plant.query.filter_by(plant_naam=plant_data["plant_naam"]).first()

        if existing_plant:
            print(f"Plant '{plant_data['plant_naam']}' bestaat al, wordt overgeslagen.")
            skipped_count += 1
            continue

        new_plant = Plant(**plant_data)
        db.session.add(new_plant)
        added_count += 1

    if added_count > 0:
        db.session.commit()

    print(
        f"Planten seeding voltooid! "
        f"\033[92mToegevoegd: {added_count}\033[0m, "
        f"\033[93mOvergeslagen: {skipped_count}\033[0m"
    )



def get_plant_id_by_name(naam):
    plant = Plant.query.filter_by(plant_naam=naam).first()
    return plant.plant_id if plant else None


def seed_oogsten():
    tomaat_id = get_plant_id_by_name("Tomaat")
    koriander_id = get_plant_id_by_name("Koriander")
    aardbei_id = get_plant_id_by_name("Aardbei")

    oogst_data = [
        {"plant_id": tomaat_id, "datum": date(2023, 6, 20), "succesvol": True},
        {"plant_id": tomaat_id, "datum": date(2023, 6, 20), "succesvol": True},
        {"plant_id": tomaat_id, "datum": date(2023, 6, 20), "succesvol": False},
        {"plant_id": koriander_id, "datum": date(2023, 6, 21), "succesvol": False},
        {"plant_id": koriander_id, "datum": date(2023, 6, 22), "succesvol": True},
        {"plant_id": koriander_id, "datum": date(2023, 6, 23), "succesvol": True},
        {"plant_id": aardbei_id, "datum": date(2023, 6, 25), "succesvol": True},
        {"plant_id": aardbei_id, "datum": date(2023, 6, 27), "succesvol": False},
        {"plant_id": aardbei_id, "datum": date(2023, 6, 29), "succesvol": False},
    ]

    added = 0
    for record in oogst_data:
        if record["plant_id"] is None:
            print("❌ Ongeldige plant_id — record overgeslagen:", record)
            continue

        exists = Oogst.query.filter_by(
            plant_id=record["plant_id"], datum=record["datum"], succesvol=record["succesvol"]
        ).first()

        if not exists:
            db.session.add(Oogst(**record))
            added += 1

    if added:
        db.session.commit()
        print(f"\033[92mOogst seeding voltooid! Toegevoegd: {added}\033[0m")
    else:
        print("Alle oogst records bestonden al.")


if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        seed_admin()
        seed_plant()
        seed_oogsten()
