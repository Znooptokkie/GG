python3 -m venv venv
if [ ! -d "venv" ]; then
    echo "Virtual environment does not exist. Please create it first."
    exit 1
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo "Running the application..."
python run.py &

xdg-open http://127.0.0.1:5000 |
