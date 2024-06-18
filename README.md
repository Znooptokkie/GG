# GoodGarden

## Vereisten

* Python
* XAMPP (of een andere webserver naar keuze)
* MQTT geïnstalleerd en toegevoegd aan je PATH-variabele

## Setup

1. Dupliceer de `.env.example` en hernoem het naar `.env`. Vul de juiste gegevens in:

    **Opmerking:** Zorg dat je in de root van het project zit en run het Python-script `key_gen.py` om een unieke sleutel te genereren. Plak deze sleutel in de `.env`-file bij `SECRET_KEY`.

    ```bash
    python key_gen.py
    ```

2. Genereer ook voor de 2 API's een API-key:

    - [WEER_API_KEY](weerlive.nl)

    - [PLANTEN_KEY](perenual.com)

3. Maak een virtual environment (venv) aan:

    ```bash
    python -m venv venv
    ```

4. Start de applicatie door het script uit te voeren:

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

## Troubleshooting

Op Windows kan het voorkomen dat het runnen van Python scripts "restricted" is, als dit het geval is voer dan het volgende commando uit in de terminal:  

    ```
    Set-ExecutionPolicy -Scope CurrentUser Unrestricted
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
