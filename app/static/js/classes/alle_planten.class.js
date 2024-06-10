class Plant {
    constructor(dataObject) {
        this.planten_id = dataObject.planten_id;
        this.plantNaam = dataObject.plant_naam;
        this.plantensoort = dataObject.plantensoort;
        this.plantGeteelt = dataObject.plant_geteelt;
    }

    getImageSrc() {
    switch (this.plantensoort) {
        case "Groente": 
            if (this.plantGeteelt) {
                return "../static/images/icons-category/carrot.png";
            } else {
                return "../static/images/icons-category/carrot_grey.png";
            }
        case "Kruiden":
            if (this.plantGeteelt) {
                return "../static/images/icons-category/salt.png";
            } else {
                return "../static/images/icons-category/salt_grey.png";
            }
        case "Fruit":
            if (this.plantGeteelt) {
                return "../static/images/icons-category/strawberry.png";
            } else {
                return "../static/images/icons-category/strawberry_grey.png";
            }
        case "Schimmel":
            if (this.plantGeteelt) {
                return "../static/images/icons-category/mushroom.png";
            } else {
                return "../static/images/icons-category/mushroom_grey.png";
            }
        case "overig":
            if (this.plantGeteelt) {
                return "../static/images/icons-category/leaf.png";
            } else {
                return "../static/images/icons-category/leaf_grey.png";
            }
        default:
            return "../static/images/icons-category/leaf.png";
    }
}


   
}

class PlantGrid {
    constructor() {
        this.grid = this.createGrid(4, 8); // 4 kolommen, 5 rijen
        this.loadData();
    }

    createGrid(cols, rows) {
        let grid = [];
        for (let i = 0; i < rows; i++) {
            grid[i] = new Array(cols).fill(null);
        }
        return grid;
    }

    loadData() {
        fetch('/json/plants.json')
            .then(response => response.json())
            .then(data => {
                this.populateGrid(this.grid, data.slice(0, 10)); // Beperkt tot 20 planten
                this.displayGrid();
            })
            .catch(error => console.error('Error:', error));
    }

    populateGrid(grid, plants) {
        plants.forEach((plantObject, index) => {
            const plant = new Plant(plantObject);
            const row = Math.floor(index / 4); // Bereken de rij (4 items per rij)
            const col = index % 4; // Bereken de kolom
            grid[row][col] = plant;
        });
    }

    displayGrid() {
        this.updateTable(document.getElementById("plantTable").querySelector("tbody"), this.grid);
    }

    updateTable(tableBody, grid) {
        tableBody.innerHTML = "";
        
        grid.forEach((row) => {
            const tr = document.createElement("tr");

            row.forEach((cell) => {
                const td = document.createElement("td");

                if (cell) {
                    const plant = cell;
                    const link = document.createElement("a");
                    link.href = `plant?name=${plant.plantNaam}&id=${plant.planten_id}`;
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

    addPlant(plantData) {
        const plant = new Plant(plantData);
        const row = Math.floor(this.grid.flat().filter(p => p !== null).length / 4);
        const col = this.grid.flat().filter(p => p !== null).length % 4;
        if (row < 5) {
            this.grid[row][col] = plant;
            this.displayGrid();
        } else {
            console.error('Grid is vol, kan geen nieuwe plant toevoegen.');
        }
    }
}
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

function reloadPage() {
    setTimeout(function() {
        window.location.href = "/planten";
    }, 50);
}

document.getElementById("plantForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Voorkom standaardgedrag van formulierindiening
    submitForm(); // Roep de submitForm-functie aan om het formulier te verwerken
});


document.addEventListener("DOMContentLoaded", () => {
    const plantGrid = new PlantGrid();

    document.getElementById("plantForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const plantNaam = document.getElementById("plantNaam").value;
        const plantensoort = document.getElementById("plantensoort").value;
        const plantGeteelt = document.querySelector('input[name="plant_geteelt"]:checked').value === 'true';
        const newPlant = {
            planten_id: Date.now(), // Gebruikt timestamp als tijdelijk ID
            plant_naam: plantNaam,
            plantensoort: plantensoort,
            plant_geteelt: plantGeteelt
        };
        plantGrid.addPlant(newPlant);
        closeModal();
    });
});

function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('myModal').style.display = 'none';
}

document.querySelector('.close').addEventListener('click', closeModal);

////////////////////

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
        reloadPage();
    });

    cancelButton.addEventListener('click', () => {
        reloadPage(); // Hier wordt de reloadPage() functie aangeroepen wanneer op de "Annuleren" knop wordt geklikt.
    });
});

function openFilterModal() {
    document.getElementById('filterModal').style.display = 'block';
}

function closeFilterModal() {
    document.getElementById('filterModal').style.display = 'none';
}

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

    // Clear the table
    rows.forEach(row => row.innerHTML = '');

    // Re-add filtered plants to the table
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

    // Add placeholders to the remaining cells
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

function resetFilter() {
    const filterNaamInput = document.getElementById('filterNaam');
    filterNaamInput.value = '';
    applyFilter();
}

function reloadPage() {
    location.reload();
}

///

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

    // Clear the table
    rows.forEach(row => row.innerHTML = '');

    // Re-add filtered plants to the table
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

    // Add placeholders to the remaining cells
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

function cancelFilter() {
    window.location.reload(); // Ververs de pagina
}
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

function openFilterModals() {
    document.getElementById('filterModals').style.display = 'block';
}

function closeFilterModals() {
    document.getElementById('filterModals').style.display = 'none';
}
