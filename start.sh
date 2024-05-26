#!/bin/bash

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running the application..."
python run.py &
xdg-open http://127.0.0.1:5000 || open http://127.0.0.1:5000
