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


    getPresenceStatus() {
        return this.plantGeteelt ? "Aanwezig" : "Afwezig";
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
                this.populateGrid(this.grid, data.slice(0, 20)); // Beperkt tot 20 planten
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
                    p.textContent = plant.getPresenceStatus();
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
        window.location.href = "/";
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
