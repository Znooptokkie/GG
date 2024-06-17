from app import create_app

# # Maak de applicatie aan
app = create_app()

if __name__ == "__main__":
    # Start de applicatie in debug mode
    app.run(debug=True)