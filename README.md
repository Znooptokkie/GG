# GoodGarden

## Vereisten

* Python
* MySQL-server

## Setup

1. Dupliceer de `.env.example` en hernoem het naar `.env`. Vul de juiste gegevens in:

2. Genereer voor de 2 API's een API-key:

    - [WEER_API_KEY](weerlive.nl)

    - [PLANTEN_KEY](perenual.com)

3. Maak een virtual environment (venv) aan:

    ```bash
    python -m venv venv
    ```

4. Activeer de virtual enviroment:

    * Linux/Mac
    ```bash
    source venv/bin/activate
    ```

    * Windows
    ```bash
    venv\Scripts\activate
    ```

5. Installeer de dependencies:

    ```bash
    pip install -r requirements.txt
    ```

6. Maak een database aan met de naam goodgarden:

    ```bash
    CREATE DATABASE goodgarden;
    ```

7. Maak een migration aan:

    ```bash
    flask db migrate -m "initial migration"
    flask db upgrade
    ```

8. Vul de database in met een seeder in de root van het project:

    ```bash
    python seed.py
    ```

9a. Start de applicatie in DEBUG mode:

    ```bash
    python run.py
    ```

9b. Start de applicatie zonder DEBUG (LET OP: je kan debug mode on hebben!):
 
    ```bash
    flask run
    ```

## Troubleshooting

Op Windows kan het voorkomen dat het runnen van Python scripts "restricted" is, als dit het geval is voer dan het volgende commando uit in de terminal:  

    ```bash
    Set-ExecutionPolicy -Scope CurrentUser Unrestricted
    ```

Om met de migration 1 stap terug te gaan, kan je het volgende commando uitvoeren:

    ```bash
    flask db downgrade
    ```