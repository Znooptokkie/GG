/**
 * Klasse die een plant vertegenwoordigt.
 */
class Plant {
    /**
     * Constructor voor de Plant klasse.
     * @param {Object} dataObject - Het data object met plantinformatie.
     */
    constructor(dataObject) {
        this.plant_id = dataObject.plant_id;
        this.plantNaam = dataObject.plant_naam;
        this.plantensoort = dataObject.plantensoort;
        this.plantGeteelt = dataObject.plant_geteelt;
    }

    /**
     * Haalt de afbeeldingsbron op basis van de plantensoort en teeltstatus.
     * @returns {string} De URL van de afbeelding.
     */
    getImageSrc() {
        switch (this.plantensoort) {
            case "Groente": 
                return this.plantGeteelt ? "../static/images/icons-category/carrot.png" : "../static/images/icons-category/carrot_grey.png";
            case "Kruiden":
                return this.plantGeteelt ? "../static/images/icons-category/salt.png" : "../static/images/icons-category/salt_grey.png";
            case "Fruit":
                return this.plantGeteelt ? "../static/images/icons-category/strawberry.png" : "../static/images/icons-category/strawberry_grey.png";
            case "Schimmel":
                return this.plantGeteelt ? "../static/images/icons-category/mushroom.png" : "../static/images/icons-category/mushroom_grey.png";
            case "overig":
                return this.plantGeteelt ? "../static/images/icons-category/leaf.png" : "../static/images/icons-category/leaf_grey.png";
            default:
                return "../static/images/icons-category/leaf.png";
        }
    }
}

/**
 * Klasse die een raster van planten vertegenwoordigt.
 */
class PlantGrid {
    /**
     * Constructor voor de PlantGrid klasse.
     */
    constructor() {
        this.grid = this.createGrid(4, 8); // 4 kolommen, 8 rijen
        this.loadData();
    }

    /**
     * Maakt een leeg raster met de opgegeven aantal kolommen en rijen.
     * @param {number} cols - Het aantal kolommen.
     * @param {number} rows - Het aantal rijen.
     * @returns {Array} Het gemaakte raster.
     */
    createGrid(cols, rows) {
        let grid = [];
        for (let i = 0; i < rows; i++) {
            grid[i] = new Array(cols).fill(null);
        }
        return grid;
    }

    /**
     * Laadt de plantgegevens van de server.
     */
    loadData() {
        fetch('/planten-lijst')
            .then(response => response.json())
            .then(data => {
                this.populateGrid(this.grid, data.slice(0, 10)); // Beperkt tot 10 planten
                this.displayGrid();
            })
            .catch(error => console.error('Error:', error));
    }

    /**
     * Vult het raster met plantgegevens.
     * @param {Array} grid - Het raster om te vullen.
     * @param {Array} plants - De lijst met plantgegevens.
     */
    populateGrid(grid, plants) {
        plants.forEach((plantObject, index) => {
            const plant = new Plant(plantObject);
            const row = Math.floor(index / 4); // Bereken de rij (4 items per rij)
            const col = index % 4; // Bereken de kolom
            grid[row][col] = plant;
        });
    }

    /**
     * Toont het raster in de HTML tabel.
     */
    displayGrid() {
        this.updateTable(document.getElementById("plantTable").querySelector("tbody"), this.grid);
    }

    /**
     * Werkt de HTML tabel bij met de gegevens van het raster.
     * @param {HTMLElement} tableBody - Het tabellichaam element.
     * @param {Array} grid - Het raster met plantgegevens.
     */
    updateTable(tableBody, grid) {
        tableBody.innerHTML = "";
        
        grid.forEach((row) => {
            const tr = document.createElement("tr");

            row.forEach((cell) => {
                const td = document.createElement("td");

                if (cell) {
                    const plant = cell;
                    const link = document.createElement("a");
                    link.href = `plant-detail?id=${plant.plant_id}`
                    const article = document.createElement("article");
                    article.classList.add("plant-container");
                    const img = document.createElement("img");
                    img.src = plant.getImageSrc();
                    img.classList.add("plant-icon");
                    const h2 = document.createElement("h2");
                    h2.textContent = plant.plantNaam;

                    const p = document.createElement("p");
                    if (!plant.plantGeteelt) {
                        p.classList.add("afwezig");
                    }

                    article.appendChild(img);
                    article.appendChild(h2);
                    article.appendChild(p);
                    link.appendChild(article);
                    td.appendChild(link);
                } else {
                    const placeholder = document.createElement("div");
                    placeholder.className = "placeholder";
                    td.appendChild(placeholder);
                }

                tr.appendChild(td);
            });

            tableBody.appendChild(tr);
        });
    }

    /**
     * Voegt een nieuwe plant toe aan het raster.
     * @param {Object} plantData - De gegevens van de plant die moet worden toegevoegd.
     */
    addPlant(plantData) {
        const plant = new Plant(plantData);
        const row = Math.floor(this.grid.flat().filter(p => p !== null).length / 4);
        const col = this.grid.flat().filter(p => p !== null).length % 4;
        if (row < 8) {
            this.grid[row][col] = plant;
            this.displayGrid();
        } else {
            console.error('Grid is vol, kan geen nieuwe plant toevoegen.');
        }
    }
}

/**
 * Verstuurt het plantformulier naar de server.
 */
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
            reloadPage();
        } else {
            alert("Geen data ingevuld!");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Er is een fout opgetreden bij het verzenden van het formulier.");
    });
}

/**
 * Laadt de pagina opnieuw.
 */

document.getElementById("plantForm").addEventListener("submit", function(event) {
    event.preventDefault();
    submitForm(); 
});

document.addEventListener("DOMContentLoaded", () => {
    const plantGrid = new PlantGrid();

    document.getElementById("plantForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const plantNaam = document.getElementById("plantNaam").value;
        const plantensoort = document.getElementById("plantensoort").value;
        const plantGeteelt = document.querySelector('input[name="plant_geteelt"]:checked').value === 'true';
        const newPlant = {
            planten_id: Date.now(), 
            plant_naam: plantNaam,
            plantensoort: plantensoort,
            plant_geteelt: plantGeteelt
        };
        plantGrid.addPlant(newPlant);
        closeModal();
    });
});

/**
 * Opent de modal.
 */
function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

/**
 * Sluit de modal.
 */
function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

document.querySelector('.close').addEventListener('click', closeModal);

document.addEventListener("DOMContentLoaded", () => {
    const settingsIcon = document.querySelector('.navbar-icons a img[alt="Settings"]');
    const filterModal = document.getElementById('filterModal');
    const closeModalButton = filterModal.querySelector('.close');
    const filterNaamInput = document.getElementById('filterNaam');
    const applyFilterButton = document.getElementById('applyFilterButton');
    const resetFilterButton = document.getElementById('resetFilterButton');
    const cancelButton = document.getElementById('cancelButton');

    settingsIcon.addEventListener('click', (event) => {
        event.preventDefault();
        openFilterModal();
    });

    closeModalButton.addEventListener('click', () => {
        closeFilterModal();
    });

    window.addEventListener('click', (event) => {
        if (event.target == filterModal) {
            closeFilterModal();
        }
    });

    filterNaamInput.addEventListener('input', applyFilter);

    applyFilterButton.addEventListener('click', () => {
        closeFilterModal();
    });

    resetFilterButton.addEventListener('click', () => {
        resetFilter();
        // reloadPage();
    });

    cancelButton.addEventListener('click', () => {
        reloadPage(); // Hier wordt de reloadPage() functie aangeroepen wanneer op de "Annuleren" knop wordt geklikt.
    });
});

/**
 * Opent de filtermodal.
 */
function openFilterModal() {
    document.getElementById('filterModal').style.display = 'block';
}

/**
 * Sluit de filtermodal.
 */
function closeFilterModal() {
    document.getElementById('filterModal').style.display = 'none';
}

/**
 * Past de filter toe op de plantenlijst.
 */
function applyFilter() {
    const filterNaam = document.getElementById('filterNaam').value.toLowerCase();
    const tableBody = document.getElementById("plantTable").querySelector("tbody");
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    let filteredPlants = [];
    rows.forEach(row => {
        const plantContainers = Array.from(row.querySelectorAll('.plant-container'));
        plantContainers.forEach(container => {
            const plantNameElement = container.querySelector('h2');
            if (plantNameElement) {
                const plantName = plantNameElement.textContent.toLowerCase();
                if (plantName.includes(filterNaam)) {
                    filteredPlants.push(container);
                }
            }
        });
    });

    // Maak de tabel leeg
    rows.forEach(row => row.innerHTML = '');

    // Voeg gefilterde planten opnieuw toe aan de tabel
    let currentRow = 0;
    filteredPlants.forEach((plant, index) => {
        if (index % 4 === 0 && index !== 0) {
            currentRow++;
        }
        if (!rows[currentRow]) {
            const newRow = document.createElement('tr');
            tableBody.appendChild(newRow);
            rows[currentRow] = newRow;
        }
        const newCell = document.createElement('td');
        newCell.appendChild(plant);
        rows[currentRow].appendChild(newCell);
    });

    // Voeg placeholders toe aan de resterende cellen
    rows.forEach(row => {
        while (row.children.length < 4) {
            const placeholderCell = document.createElement('td');
            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder';
            placeholderCell.appendChild(placeholder);
            row.appendChild(placeholderCell);
        }
    });
}

/**
 * Reset de filter.
 */
function resetFilter() {
    const filterNaamInput = document.getElementById('filterNaam');
    filterNaamInput.value = '';
    applyFilter();
}

/**
 * Laadt de pagina opnieuw.
 */
function reloadPage() {
    location.reload();
}

/**
 * Past filters toe op de plantenlijst.
 */
function applyFilters() {
    const filterCategorie = document.getElementById('filterCategorie').value;
    const tableBody = document.getElementById("plantTable").querySelector("tbody");
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    let filteredPlants = [];
    rows.forEach(row => {
        const plantContainers = Array.from(row.querySelectorAll('.plant-container'));
        plantContainers.forEach(container => {
            const plantCategoryElement = container.querySelector('img');

            if (plantCategoryElement) {
                const plantCategory = getCategoryFromImgSrc(plantCategoryElement.src);

                const categoryMatches = filterCategorie === "" || plantCategory === filterCategorie;

                if (categoryMatches) {
                    filteredPlants.push(container);
                }
            }
        });
    });

    // Maak de tabel leeg
    rows.forEach(row => row.innerHTML = '');

    // Voeg gefilterde planten opnieuw toe aan de tabel
    let currentRow = 0;
    filteredPlants.forEach((plant, index) => {
        if (index % 4 === 0 && index !== 0) {
            currentRow++;
        }
        if (!rows[currentRow]) {
            const newRow = document.createElement('tr');
            tableBody.appendChild(newRow);
            rows[currentRow] = newRow;
        }
        const newCell = document.createElement('td');
        newCell.appendChild(plant);
        rows[currentRow].appendChild(newCell);
    });

    // Voeg placeholders toe aan de resterende cellen
    rows.forEach(row => {
        while (row.children.length < 4) {
            const placeholderCell = document.createElement('td');
            const placeholder = document.createElement('div');
            placeholder.className = 'placeholder';
            placeholderCell.appendChild(placeholder);
            row.appendChild(placeholderCell);
        }
    });
}

/**
 * Annuleert de filter.
 */
function cancelFilter() {
    window.location.reload(); // Ververs de pagina
}

/**
 * Haalt de categorie op basis van de afbeeldingsbron.
 * @param {string} src - De bron van de afbeelding.
 * @returns {string} De categorie van de plant.
 */
function getCategoryFromImgSrc(src) {
    if (src.includes("carrot")) {
        return "Groente";
    } else if (src.includes("salt")) {
        return "Kruiden";
    } else if (src.includes("strawberry")) {
        return "Fruit";
    } else if (src.includes("mushroom")) {
        return "Schimmel";
    } else {
        return "Overig";
    }
}

/**
 * Opent de filtermodal.
 */
function openFilterModals() {
    document.getElementById('filterModals').style.display = 'block';
}

/**
 * Sluit de filtermodal.
 */
function closeFilterModals() {
    document.getElementById('filterModals').style.display = 'none';
}
