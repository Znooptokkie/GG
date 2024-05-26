# GoodGarden

## Vereisten

* Python
* XAMPP (of een andere webserver naar keuze)
* MQTT geïnstalleerd en toegevoegd aan je PATH-variabele

## Setup

1. Dupliceer de `.env.example` en hernoem het naar `.env`. Vul de juiste gegevens in.

    **Opmerking:** Zorg dat je in de root van het project zit en run het Python-script `generate_secret_key.py` om een unieke sleutel te genereren. Plak deze sleutel in de `.env`-file bij `SECRET_KEY`.

    ```bash
    python generate_secret_key.py
    ```

2. Maak een virtual environment (venv) aan:

    ```bash
    python -m venv venv
    ```

3. Start de applicatie door het script uit te voeren:

    - **Windows**:
      Dubbelklik op `start.bat` in de map of run het in de terminal:

      ```bash
      start start.bat
      ```

    - **Linux/macOS**:
      Run het shell script in de terminal:

      ```bash
      ./start.sh
      ```

## Versiebeheer

Dit project maakt gebruik van [GitHub](https://github.com) voor versiebeheer. Voor de beschikbare versies, zie [GG](https://github.com/Znooptokkie/GG).

## Auteurs

* **Atilla Oomen** - *Projectleider | Full Stack Developer* - [Znooptokkie](https://github.com/Znooptokkie)
* **Mohammed Çifçi** - *Full Stack Developer* - [6028570](https://github.com/6028570)
* **Burak Diker** - *Full Stack Programmeur* - [6028083](https://github.com/6028083)
* **Justin Doekhi** - *Full Stack Programmeur* - [6027529](https://github.com/6027529)
* **Renzo van Putten** - *Full Stack Programmeur* - [6025850](https://github.com/6025850)
* **Martijn Heins** - *Embedded Systems Developer | Back End Developer* - [6026961mborijnland](https://github.com/6026961mborijnland)
