import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv
import os

# Laad de omgevingsvariabelen uit een .env bestand
load_dotenv()

def database_connect():
    """
    Maakt verbinding met een MySQL database met behulp van inloggegevens
    uit omgevingsvariabelen.

    Retourneert:
        connection (mysql.connector.connection_cext.CMySQLConnection): 
            Een MySQL verbindingsobject als de verbinding succesvol is.
        None: 
            Als de verbinding niet succesvol is.

    Werpt:
        mysql.connector.Error: 
            Als er een fout optreedt bij het verbinden met de database.
    """
    try:
        # Maak een verbinding met de MySQL database
        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),        # Database host
            user=os.getenv("DB_USER"),        # Database gebruiker
            password=os.getenv("DB_PASSWORD"),# Database wachtwoord
            database=os.getenv("DB_NAME")     # Database naam
        )
        
        # Controleer of de verbinding is gemaakt
        if connection.is_connected():
            return connection
        
    except Error as e:
        # Print het foutbericht als de verbinding mislukt
        print(f"Verbinding NIET gelukt! ${e}")
    
    return None
