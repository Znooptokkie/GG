/**
 * Event listener voor het DOMContentLoaded evenement.
 * Toont het laadscherm en start de timer.
 */
document.addEventListener('DOMContentLoaded', function() {
    showLoadingScreen(); 
    startTimer();
});

/**
 * Functie om het laadscherm te tonen.
 */
function showLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'block';
}

/**
 * Functie om het laadscherm te verbergen.
 */
function hideLoadingScreen() {
    document.getElementById('loading-screen').style.display = 'none';
}

/**
 * Functie om de timer te starten om het laadscherm te verbergen.
 * Verbergt het laadscherm na 1 seconde.
 */
function startTimer() {
    setTimeout(hideLoadingScreen, 1000); // Verberg laadscherm na 1 seconde
}

/**
 * Functie om plantgegevens op te halen van de server.
 * Maakt gebruik van axios om een GET-verzoek te sturen naar de server.
 */
function fetchPlantenData() {
    axios.get('http://127.0.0.1:5000/planten-data')
        .then(response => {
            const plantenData = response.data;
            updatePlantenData(plantenData);
        })
        .catch(error => {
            console.error('Error fetching planten data:', error);
        });
}

/**
 * Controleert of de huidige pagina de homepage is.
 * Zo ja, haalt de plantgegevens op.
 */
if (window.location.pathname === "/") {
    fetchPlantenData();
}

/**
 * Functie om het plant ID uit de URL te halen.
 * @returns {string|null} Het plant ID uit de URL of null als het niet bestaat.
 */
function getPlantIdFromUrl() {
    const currentUrl = new URL(window.location.href);
    const searchParams = currentUrl.searchParams;
    return searchParams.get('id');
}

/**
 * Functie om de plantgegevens bij te werken op basis van de opgehaalde data.
 * @param {Array<Object>} plantenData - De lijst met plantgegevens.
 */
function updatePlantenData(plantenData) {
    const plantId = parseInt(getPlantIdFromUrl(), 10);
    const gevondenPlant = plantenData.find(plant => plant.plant_id === plantId);

    if (gevondenPlant) {
        document.title = gevondenPlant.plant_naam;
        document.querySelector(".plant-titel").textContent = gevondenPlant.plant_naam;
    }
}

/**
 * Functie om de pagina opnieuw te laden naar de homepage.
 */
function reloadPage() {
    setTimeout(function() {
        window.location.href = "/";
    }, 100);
}

// Voor het updaten van de status voor geteelt
function submitToggle(checkbox, plantId)
{
    const form = document.getElementById("togglePlantForm-" + plantId);
    const formData = new FormData(form);
    if (!checkbox.checked)
    {
        formData.set("plant_geteelt", 0);
    }

    fetch("/toggle_plant", 
    {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => 
    {
        if (data.success)
        {
            location.href = "/";
        }
        else
        {
            alert("Update mislukt");
        }
    });
}
