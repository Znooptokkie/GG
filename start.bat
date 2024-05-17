@echo off

echo Activating virtual environment...
call venv\Scripts\activate

echo Installing dependencies...
pip install -r requirements.txt

echo Running the application...
start http://127.0.0.1:5000
python run.py