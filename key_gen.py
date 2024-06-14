import secrets

def generate_secret_key():
    """
    Genereert een geheime sleutel van 32 bytes in hexadecimaal formaat.

    Retourneert:
        str: Een hexadecimale string van de geheime sleutel.
    """
    secret_key = secrets.token_hex(32)
    return secret_key

def main():
    """
    Genereert en print een geheime sleutel.
    """
    secret_key = generate_secret_key()
    print(secret_key)

if __name__ == "__main__":
    main()

## PLAK DEZE SLEUTEL IN DE ".env"