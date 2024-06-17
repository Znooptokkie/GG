/**
 * Functie om een modaal venster te openen.
 * Deze functie stelt event listeners in voor het openen en sluiten van de modaal.
 * @param {string} side - De zijde van de kas locatie ("left" of "right").
 */
function openModal(side) 
{
    const modal = document.getElementById("myModal");
    const leftRadio = document.getElementById("kas_locatie_left");
    const rightRadio = document.getElementById("kas_locatie_right");
    const closeButton = document.querySelector(".annulatie-knop");
    const close = document.querySelector(".close");
    const submit = document.querySelector(".submit-plant");

    if (side === "left") 
    {
        leftRadio.checked = true;
    } 
    else if (side === "right") 
    {
        rightRadio.checked = true;
    }

    modal.style.display = "flex";
    focusFirstInput(modal);

    closeButton.onclick = close.onclick = function () 
    {
        modal.style.display = "none";
    };

    window.onclick = function (event) 
    {
        if (event.target === modal) 
        {
            modal.style.display = "none";
        }
    };
}

/**
 * Functie om een modaal venster te sluiten.
 * @param {string} modalId - Het ID van de modaal die gesloten moet worden.
 */
function closeModal(modalId) 
{
    document.getElementById(modalId).style.display = "none";
}

/**
 * Functie om het eerste invoerveld in de modaal te focussen.
 * @param {HTMLElement} modal - Het modaal element.
 */
function focusFirstInput(modal) 
{
    const firstInput = modal.querySelector('input');
    if (firstInput) 
    {
        firstInput.focus();
    }
}

/**
 * Functie om de zoekresultaten weer te geven in een modaal.
 * @param {Object} data - De data met zoekresultaten.
 */
function displaySearchResults(data) 
{
    const resultsModal = document.getElementById("resultsModal");
    const resultsContainer = document.getElementById("resultsContainer");

    // Maak de container leeg
    resultsContainer.innerHTML = "";

    // Controleer of er data is
    if (data.data && data.data.length > 0) 
    {
        data.data.forEach((plant, index) => 
        {
            const listItem = document.createElement("li");
            listItem.classList.add("plant-item");
            listItem.innerHTML = `
                <img src="${plant.default_image.medium_url}" alt="${plant.common_name}">
                <span>${plant.translated_common_name}</span>
            `;
            listItem.onclick = () => 
            {
                selectPlant(plant);
            };
            resultsContainer.appendChild(listItem);
        });
    } 
    else 
    {
        resultsContainer.innerHTML = "<p>Helaas, geen resultaten gevonden!</p>";
    }

    resultsModal.style.display = "block";
}

/**
 * Functie om een geselecteerde plant naar de backend te sturen.
 * @param {Object} plant - Het geselecteerde plant object.
 */
function selectPlant(plant) 
{
    fetch('/select-plant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(plant)
    })
    .then(response => response.json())
    .then(data => 
    {
        if (data.success) 
        {
            alert("Plant succesvol toegevoegd aan de database!");
            closeModal('resultsModal');
            reloadPage();
        } 
       
        else 
        {
            alert("Er is een fout opgetreden bij het toevoegen van de plant aan de database.");
            reloadPage();
        }
    });
}

/**
 * Functie om een plant te zoeken op basis van de ingevoerde plantnaam.
 */
function searchPlant() 
{
    var button = document.getElementById("submitButton");
    var originalText = button.innerHTML;
    var plantNaam = document.getElementById("plantNaam").value;

    // Voeg laad icoon en loading klasse toe
    button.innerHTML = '<div class="loading-icon"></div>';
    button.classList.add("loading");

    fetch('/translate-and-search-plant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plantNaam: plantNaam })
    })
    .then(response => response.json())
    .then(data => 
    {
        displaySearchResults(data);
        closeModal('confirmModal');

        // Zet de originele tekst en klasse terug na de API-aanvraag
        button.innerHTML = originalText;
        button.classList.remove("loading");
    })
    .catch(error => 
    {
        console.error("Er is een fout opgetreden:", error);

        // Zet de originele tekst en klasse terug als er een fout optreedt
        button.innerHTML = originalText;
        button.classList.remove("loading");
    });
}

/**
 * Functie om het plantformulier in te dienen.
 */
function submitForm() 
{
    const form = document.getElementById("plantForm");
    const formData = new FormData(form);
    fetch('/add-plant', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => 
    {
        console.log(data);
        const modal = document.getElementById("myModal");
        if (data.success) 
        {
            modal.style.display = "none";
            document.getElementById("confirmModal").style.display = "flex";
        } 
        else 
        {
            if (data.error === "missing_data") 
            {
                alert("Geen data ingevuld!");
                reloadPage();
            } 
            else if (data.error === "duplicate_entry") 
            {
                alert("Deze plant bestaat al in de database!");
                reloadPage();
            } 
            else 
            {
                alert("Er is een fout opgetreden!");
                reloadPage();
            }
        }
    });
}
