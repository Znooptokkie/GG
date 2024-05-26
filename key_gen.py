import secrets

def generate_secret_key():
    secret_key = secrets.token_hex(32)
    return secret_key

def main():
    secret_key = generate_secret_key()
    print(secret_key)

if __name__ == "__main__":
    main()
