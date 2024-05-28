/**
 * Functie om een modaal venster te openen.
 * Deze functie stelt event listeners in voor het openen en sluiten van de modaal.
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

    // modal.style.display = "block";
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

function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

/**
 * Functie om het eerste invoerveld in de modaal te focussen.
 */
function focusFirstInput(modal) 
{
    const firstInput = modal.querySelector('input');
    if (firstInput) 
    {
        firstInput.focus();
    }
}

// Update de displaySearchResults functie
function displaySearchResults(data) {
    const resultsModal = document.getElementById("resultsModal");
    const resultsContainer = document.getElementById("resultsContainer");

    // Maak de container leeg
    resultsContainer.innerHTML = "";

    // Controleer of er data is
    if (data.data && data.data.length > 0) {
        data.data.forEach((plant, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("plant-item");
            listItem.innerHTML = `
                <img src="${plant.default_image.medium_url}" alt="${plant.common_name}">
                <span>${plant.translated_common_name}</span>
            `;
            listItem.onclick = () => {
                selectPlant(plant);
            };
            resultsContainer.appendChild(listItem);
        });
    } else {
        resultsContainer.innerHTML = "<p>Geen resultaten gevonden</p>";
    }

    resultsModal.style.display = "block";
}

// Stuur de geselecteerde plant naar de backend
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
    .then(data => {
        if (data.success) {
            alert("Plant succesvol toegevoegd aan de database!");
            closeModal('resultsModal');
        } else {
            alert("Er is een fout opgetreden bij het toevoegen van de plant aan de database.");
        }
    });
}

function searchPlant() {
    const plantNaam = document.getElementById("plantNaam").value;
    fetch('/translate-and-search-plant', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plantNaam: plantNaam })
    })
    .then(response => response.json())
    .then(data => {
        displaySearchResults(data);
        closeModal('confirmModal');
    });
}

// Formulier indienen
function submitForm() {
    const form = document.getElementById("plantForm");
    const formData = new FormData(form);
    fetch('/add-plant', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const modal = document.getElementById("myModal");
        if (data.success) {
            modal.style.display = "none";
            document.getElementById("confirmModal").style.display = "flex";
        } else {
            if (data.error === "missing_data") {
                alert("Geen data ingevuld!");
            } else if (data.error === "duplicate_entry") {
                alert("Deze plant bestaat al in de database!");
            } else {
                alert("Er is een fout opgetreden!");
            }
        }
    });
}