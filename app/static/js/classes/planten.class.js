class Plant
{
    constructor(dataObject) 
    {
        this.planten_id = dataObject.planten_id;
        this.plantNaam = dataObject.plant_naam;
        this.plantensoort = dataObject.plantensoort;
        this.plantGeteelt = dataObject.plant_geteelt;
    }

    getImageSrc() 
    {
        switch (this.plantensoort) 
        {
            case "Groente":
                return "../static/images/icons/broccoli.png";
            case "Kruiden":
                return "../static/images/icons/mortar.png";
            case "Fruit":
                return "../static/images/icons/strawberry.png";
            case "Schimmel":
                return "../static/images/icons/mushroom.png";
            case "overig":
                return "../static/images/icons/overig.png"
            default:
                return "../static/images/icons/overig.png";
        }
    }
}

class PlantGrid 
{
    constructor() 
    {
        this.leftGrid = this.createGrid(1, 8); // 1 col, 8 rows
        this.rightGrid = this.createGrid(1, 8); // 1 col, 8 rows
        this.loadData();
    }
    
    createGrid(cols, rows) 
    {
        let grid = [];
        for (let i = 0; i < rows; i++) 
        {
            grid[i] = new Array(cols).fill(null);
        }
        return grid;
    }

    loadData() 
    {
        fetch('/json/plants.json')
        .then(response => response.json())
        .then(data => 
        {
            const filteredData = data.filter(plant => plant.plant_geteelt === 1);
            this.populateGrid(this.leftGrid, filteredData.filter(plant => plant.kas_locatie === "LEFT").slice(0, 8));
            this.populateGrid(this.rightGrid, filteredData.filter(plant => plant.kas_locatie === "RIGHT").slice(0, 8));
            this.displayGrid();
        })
        .catch(error => console.error('Error:', error));
    }

    populateGrid(grid, plants) 
    {
        plants.forEach((plantObject, index) => 
        {
            const plant = new Plant(plantObject);
            const col = 0; 
            const row = index; 
            grid[row][col] = plant;
        });
    }

    displayGrid() 
    {
        this.updateTable(document.getElementById("leftPlants").querySelector("tbody"), this.leftGrid, "left");
        this.updateTable(document.getElementById("rightPlants").querySelector("tbody"), this.rightGrid, "right");
    }

    updateTable(tableBody, grid, side) 
    {
        tableBody.innerHTML = "";
        let addButtonPlaced = false;
        const plantsCount = grid.filter(row => row[0] !== null).length;

        grid.forEach((row, rowIndex) => {
            const tr = document.createElement("tr");

            if (row[0])
            {
                const td = document.createElement("td");
                const plant = row[0];
                const link = document.createElement("a");
                // link.href = `plant?id=${plant.planten_id}`;
                link.href = `plant?name=${plant.plantNaam}?id=${plant.planten_id}`;
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
                tr.appendChild(td);
            } 
            else if (!addButtonPlaced && plantsCount < 8 && window.userRole === 'admin')
            {
                const td = this.createAddButton(side);
                tr.appendChild(td);
                addButtonPlaced = true;
            }
            else
            {
                const td = document.createElement("td");
                const placeholder = document.createElement("div");
                placeholder.className = "placeholder";
                td.appendChild(placeholder);
                tr.appendChild(td);
            }

            tableBody.appendChild(tr);
        });
    }

    createAddButton(side) 
    {
        const td = document.createElement("td");
        const article = document.createElement("article");
        article.classList.add("plant-container", "add-button");
        const img = document.createElement("img");
        img.src = "../static/images/plus.png";
        img.classList.add("add-icon");
        img.id = `addButton-${side}`;
        img.alt = "Add";
        article.appendChild(img);
        article.onclick = () => openModal(side);
        td.appendChild(article);
        return td;
    }
}

document.addEventListener("DOMContentLoaded", () => 
{
    const plantGrid = new PlantGrid();
});
