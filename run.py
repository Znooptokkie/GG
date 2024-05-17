import sys
import os
import mysql.connector
from app import create_app

sys.path.append(os.path.join(os.path.dirname(__file__), 'scripts'))

from scripts.planten import fetch_plant_and_write_to_json

def execute_sql_file(database, sql_file):
    conn = mysql.connector.connect(
        host="localhost", #** Vervang dit door jouw host
        user="root",  #** Vervang dit door jouw gebruikersnaam
        password=""  #** Vervang dit door jouw wachtwoord
    )
    cursor = conn.cursor()
    
    with open(sql_file, 'r') as f:
        sql_script = f.read()

    statements = sql_script.split(';')

    for statement in statements:
        if statement.strip():
            cursor.execute(statement)

    conn.commit()
    cursor.close()
    conn.close()

app = create_app()

with app.app_context():
    fetch_plant_and_write_to_json()
    execute_sql_file('goodgarden', 'scripts/goodgarden.sql')

if __name__ == "__main__":
    app.run(debug=True)
