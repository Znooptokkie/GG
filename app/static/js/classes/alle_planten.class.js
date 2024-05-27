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
                return "../static/images/icons/broccoli.png";
            case "Kruiden":
                return "../static/images/icons/mortar.png";
            case "Fruit":
                return "../static/images/icons/strawberry.png";
            case "Schimmel":
                return "../static/images/icons/mushroom.png";
            case "overig":
                return "../static/images/icons/overig.png";
            default:
                return "../static/images/icons/overig.png";
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
                const filteredData = data.filter(plant => plant.plant_geteelt === 1);
                this.populateGrid(this.grid, filteredData.slice(0, 0)); // Beperkt tot 20 planten
                this.displayGrid();
            })
            .catch(error => console.error('Error:', error));
    }

    populateGrid(grid, plants) {
        plants.forEach((plantObject, index) => {
            const plant = new Plant(plantObject);
            const row = Math.floor(index / 5); // Bereken de rij (4 items per rij)
            const col = index % 5; // Bereken de kolom
            grid[row][col] = plant;
        });
    }

    displayGrid() {
        this.updateTable(document.getElementById("plantTable").querySelector("tbody"), this.grid);
    }

    updateTable(tableBody, grid) {
        tableBody.innerHTML = "";
        let addButtonPlaced = false;
        const plantsCount = grid.flat().filter(item => item !== null).length;

        grid.forEach((row, rowIndex) => {
            const tr = document.createElement("tr");

            row.forEach((cell, colIndex) => {
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

                    article.appendChild(img);
                    article.appendChild(h2);
                    link.appendChild(article);
                    td.appendChild(link);
                } else if (!addButtonPlaced && plantsCount < 20) {
                    const article = this.createAddButton();
                    td.appendChild(article);
                    addButtonPlaced = true;
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

    createAddButton() {
        const article = document.createElement("article");
        article.classList.add("plant-container", "add-button");
        const img = document.createElement("img");
        img.src = "../static/images/plus.png";
        img.classList.add("add-icon");
        img.alt = "Add";
        article.appendChild(img);
        article.onclick = () => openModal();
        return article;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const plantGrid = new PlantGrid();
});

function openModal() {
    document.getElementById('myModal').style.display = 'block';
}

