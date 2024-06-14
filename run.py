import sys
import os
from app import create_app

# Voeg het 'scripts' pad toe aan sys.path om modules vanuit die directory te kunnen importeren
sys.path.append(os.path.join(os.path.dirname(__file__), 'scripts'))

from scripts.planten import fetch_plant_and_write_to_json
from scripts.db_connect import database_connect

def execute_sql_file(database, sql_file):
    """
    Voert SQL-instructies uit vanuit een bestand op een opgegeven database.

    Parameters:
        database (str): De naam van de database waarop de SQL-instructies uitgevoerd moeten worden.
        sql_file (str): Het pad naar het SQL-bestand met de uit te voeren instructies.

    Retourneert:
        None

    Werpt:
        mysql.connector.Error: Als er een fout optreedt bij het uitvoeren van de SQL-instructies.
    """
    # Maak verbinding met de database
    conn = database_connect()
    cursor = conn.cursor()
    
    # Lees het SQL-scriptbestand
    with open(sql_file, 'r') as f:
        sql_script = f.read()

    # Splits het script in afzonderlijke SQL-instructies
    statements = sql_script.split(';')

    # Voer elke SQL-instructie uit
    for statement in statements:
        if statement.strip():
            cursor.execute(statement)

    # Bevestig de wijzigingen in de database
    conn.commit()
    cursor.close()
    conn.close()

# Maak de applicatie aan
app = create_app()

# Voer taken uit binnen de applicatiecontext
with app.app_context():
    fetch_plant_and_write_to_json()
    execute_sql_file('goodgarden', 'scripts/goodgarden.sql')

if __name__ == "__main__":
    # Start de applicatie in debug mode
    app.run(debug=True)
