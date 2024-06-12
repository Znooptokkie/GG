python3 -m venv venv
if [ ! -d "venv" ]; then
    echo "Virtual environment does not exist. Please create it first."
    exit 1
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r /home/smartgarden/GG/requirements.txt

echo "Running the application..."
python /home/smartgarden/GG/run.py &

xdg-open http://127.0.0.1:5000 |
