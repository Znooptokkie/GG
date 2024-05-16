import mysql.connector

from mysql.connector import Error

# Definieer een functie genaamd `database_connect` om verbinding te maken met de database.
def database_connect():
    try:
        # Maak een verbinding met de MySQL database.
        # Specificeer de database credentials en de database naam.
        connection = mysql.connector.connect(
            host="localhost",  # De hostnaam waar de database draait, in dit geval lokaal.
            user="root",       # De gebruikersnaam voor de database.
            password="",       # Het wachtwoord voor de gebruiker, leeg in dit geval.
            database="goodgarden"  # De naam van de database waarmee je wilt verbinden.
        )
        # Controleer of de verbinding succesvol is opgezet.
        if connection.is_connected():
            # Als de verbinding succesvol is, retourneer het verbinding object.
            # De print statement is uitgecommentarieerd, maar kan worden gebruikt voor debuggen.
            # print("Connection gelukt!")
            return connection
    except Error as e:
        # Als er een fout optreedt bij het maken van de verbinding, vang deze dan op en print een foutbericht.
        print(f"Connection NIET gelukt! ${e}")
    # Als de verbinding niet succesvol was, retourneer None.
    return None