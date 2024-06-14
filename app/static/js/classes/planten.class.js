/**
 * Klasse die een plant vertegenwoordigt.
 */
class Plant 
{
    /**
     * Constructor voor de Plant klasse.
     * @param {Object} dataObject - Het data object met plantinformatie.
     */
    constructor(dataObject) 
    {
        this.plant_id = dataObject.plant_id;
        this.plantNaam = dataObject.plant_naam;
        this.plantensoort = dataObject.plantensoort;
        this.plantGeteelt = dataObject.plant_geteelt;
    }

    /**
     * Haalt de afbeeldingsbron op basis van de plantensoort.
     * @returns {string} De URL van de afbeelding.
     */
    getImageSrc() 
    {
        switch (this.plantensoort) 
        {
            case "Groente":
                return "../static/images/icons-category/carrot.png";
            case "Kruiden":
                return "../static/images/icons-category/salt.png";
            case "Fruit":
                return "../static/images/icons-category/strawberry.png";
            case "Schimmel":
                return "../static/images/icons-category/mushroom.png";
            case "overig":
                return "../static/images/icons-category/leaf.png";
            default:
                return "../static/images/icons-category/leaf.png";
        }
    }
}

/**
 * Klasse die een raster van planten vertegenwoordigt.
 */
class PlantGrid 
{
    /**
     * Constructor voor de PlantGrid klasse.
     */
    constructor() 
    {
        this.leftGrid = this.createGrid(1, 8); // 1 kolom, 8 rijen
        this.rightGrid = this.createGrid(1, 8); // 1 kolom, 8 rijen
        this.loadData();
    }
    
    /**
     * Maakt een leeg raster met het opgegeven aantal kolommen en rijen.
     * @param {number} cols - Het aantal kolommen.
     * @param {number} rows - Het aantal rijen.
     * @returns {Array} Het gemaakte raster.
     */
    createGrid(cols, rows) 
    {
        let grid = [];
        for (let i = 0; i < rows; i++) 
        {
            grid[i] = new Array(cols).fill(null);
        }
        return grid;
    }

    /**
     * Laadt de plantgegevens van de server.
     */
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

    /**
     * Vult het raster met plantgegevens.
     * @param {Array} grid - Het raster om te vullen.
     * @param {Array} plants - De lijst met plantgegevens.
     */
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

    /**
     * Toont het raster in de HTML-tabel.
     */
    displayGrid() 
    {
        this.updateTable(document.getElementById("leftPlants").querySelector("tbody"), this.leftGrid, "left");
        this.updateTable(document.getElementById("rightPlants").querySelector("tbody"), this.rightGrid, "right");
    }

    /**
     * Werkt de HTML-tabel bij met de gegevens van het raster.
     * @param {HTMLElement} tableBody - Het tabellichaam element.
     * @param {Array} grid - Het raster met plantgegevens.
     * @param {string} side - De zijde van het raster ("left" of "right").
     */
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
                link.href = `plant-detail?id=${plant.plant_id}`;
                const article = document.createElement("article");
                article.classList.add("plant-container");
                const img = document.createElement("img");
                img.src = plant.getImageSrc();
                img.classList.add("plant-icon");
                const h2 = document.createElement("h2");
                h2.textContent = plant.plantNaam;

                h2.style.overflow = 'hidden';
                h2.style.textOverflow = 'ellipsis';
                h2.style.maxWidth = '150px';
                h2.style.whiteSpace = 'nowrap';
                
                document.body.appendChild(h2);
                const h2Width = h2.offsetWidth;
                document.body.removeChild(h2);

                switch(true) {
                case h2Width >= 125 && h2Width < 150:
                    h2.style.fontSize = '1rem';
                    break;
                case h2Width == 150:
                    h2.style.fontSize = '0.7rem';
                    break;
                default:
                    h2.style.fontSize = '1.5rem';
                }

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

    /**
     * Maakt de knop om een plant toe te voegen.
     * @param {string} side - De zijde van het raster ("left" of "right").
     * @returns {HTMLElement} De tabelcel met de knop om een plant toe te voegen.
     */
    createAddButton(side) 
    {
        const td = document.createElement("td");
        const article = document.createElement("article");
        article.classList.add("plant-container", "add-button");
        const img = document.createElement("img");
        img.src = "../static/images/icons-category/plus.png";
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
