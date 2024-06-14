/**
 * PIE DIAGRAM - HOMEPAGE
 * 
 * Toont 3 diagrams met het aantal succesvolle en mislukte oogsten.
 */
class OogstDataFetcher 
{
    /**
     * Constructor voor de OogstDataFetcher klasse.
     * @param {string} elementId - Het ID van het canvas element.
     * @param {string} chartType - Het type diagram (bijv. "pie").
     * @param {Array<string>} chartLabels - De labels voor het diagram.
     * @param {Array<string>} backgroundColors - De achtergrondkleuren voor de datasets.
     * @param {string} category - De categorie van de oogstdata.
     * @param {string} titleClass - De CSS-klasse van het titel element.
     */
    constructor(elementId, chartType, chartLabels, backgroundColors, category, titleClass) 
    {
        this.elementId = elementId;
        this.chartType = chartType;
        this.chartLabels = chartLabels;
        this.backgroundColors = backgroundColors;
        this.category = category;
        this.titleClass = titleClass;
        this.chart = null;
    }

    /**
     * Haalt de data op en toont het diagram.
     */
    fetchAndDisplayData() 
    {
        axios.get("http://127.0.0.1:5000/oogsten")
            .then(response => 
            {
                const categoryData = response.data.find(item => item[0] === this.category);
                if (categoryData)
                {
                    this.updateTitle();
                    this.createChart(categoryData.slice(1));
                }
                else
                {
                    console.error("Category data not found.");
                }
            })
            .catch(error => 
            {
                console.error("Error fetching data:", error);
            });
    }

    /**
     * Update de titel van het diagram.
     */
    updateTitle() 
    {
        const titleElement = document.querySelector(`.${this.titleClass}`);
        if (titleElement) 
        {
            titleElement.textContent = this.category;
        }
        else 
        {
            console.error("Title element not found.");
        }
    }

    /**
     * Creëert en toont het diagram.
     * @param {Array<number>} data - De data voor het diagram.
     */
    createChart(data) 
    {
        const ctx = document.getElementById(this.elementId).getContext("2d");
        if (!ctx) 
        {
            console.error("Canvas context is null. Check if element exists and is visible.");
            return;
        }

        this.chart = new Chart(ctx, 
        {
            type: this.chartType,
            data: 
            {
                labels: this.chartLabels,
                datasets: [{
                    label: `${this.category} Oogst resultaat`,
                    data: data,
                    backgroundColor: this.backgroundColors,
                    borderWidth: 0
                }]
            },
            options: 
            {
                responsive: true,
                plugins: 
                {
                    legend: 
                    {
                        display: false,
                    },
                    tooltip: 
                    {
                        mode: "index",
                        intersect: false,
                    },
                    datalabels: 
                    {
                        color: 'white',
                        font: 
                        {
                            size: 22,
                            family: "Akaya Kanadaka"
                        },
                        formatter: (value) => 
                        {
                            return value;
                        }
                    }
                },
                radius: '65%', // Pas dit percentage aan om het diagram kleiner te maken
            },
            plugins: [ChartDataLabels]
        });
    }
}

const fruitChart = new OogstDataFetcher("pie-1", "pie", ["Gelukt", "Mislukt"], ["rgba(46, 86, 81)", "rgba(191, 215, 182)"], "Fruit", "pie-1-titel");
const vegetableChart = new OogstDataFetcher("pie-2", "pie", ["Gelukt", "Mislukt"], ["rgba(46, 86, 81)", "rgba(191, 215, 182)"], "Groente", "pie-2-titel");
const herbChart = new OogstDataFetcher("pie-3", "pie", ["Gelukt", "Mislukt"], ["rgba(46, 86, 81)", "rgba(191, 215, 182)"], "Kruiden", "pie-3-titel");

fruitChart.fetchAndDisplayData();
vegetableChart.fetchAndDisplayData();
herbChart.fetchAndDisplayData();

///////////////////////////////////////////

/**
 * WEERCHART - HOMEPAGE
 * 
 * Toont de weersverwachting voor aankomende dagen.
 * 
 * @param {string} canvasId - Het ID van het canvas element.
 * @param {string} apiUrl - De URL van de weer API.
 */
function fetchWeatherDataAndDrawChart(canvasId, apiUrl) 
{
    fetch(apiUrl)
        .then(response => response.ok ? response.json() : Promise.reject("Network response was not ok."))
        .then(data => 
        {
            const dates = data.weather_forecast.map(item => 
            {
                const [day, month, year] = item.dag.split("-").map(Number);
                const date = new Date(year, month - 1, day);
                const weekdays = ["zo", "ma", "di", "wo", "do", "vr", "za"];
                const weekday = weekdays[date.getDay()];

                return `${weekday}`;
            });

            const temperatures = data.weather_forecast.map(item => item.max_temp);
            const minTemp = Math.min(...temperatures);
            const maxTemp = Math.max(...temperatures);

            const canvas = document.getElementById(canvasId);
            if (!canvas) 
            {
                console.error("Canvas element not found.");
                return;
            }

            const ctx = canvas.getContext("2d");
            new Chart(ctx, 
            {
                type: "line", 
                data: 
                {
                    labels: dates,
                    datasets: 
                    [{
                        label: "Max Temperature",
                        data: temperatures,
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        borderColor: "rgb(171, 211, 174)",
                        pointBackgroundColor: "rgb(46, 86, 81)",
                        pointBorderColor: "rgb(46, 86, 81)",
                        borderWidth: 2,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        fill: false
                    }]
                },
                options: 
                {
                    maintainAspectRatio: false,
                    responsive: true,
                    scales: 
                    {
                        y: 
                        {
                            beginAtZero: false,
                            min: minTemp - 1,
                            max: maxTemp + 1,
                            grid: 
                            {
                                display: false
                            },
                            ticks: 
                            {
                                display: false
                            },
                            border: 
                            {
                                display: false
                            }
                        },
                        x: 
                        {
                            grid: 
                            {
                                display: false
                            },
                            ticks: 
                            {
                                font: 
                                {
                                    size: 18,
                                    family: "'Comic Sans MS', cursive, sans-serif",
                                    weight: "bold",
                                },
                                color: "rgba(53, 102, 128, 1)" 
                            },
                            border: 
                            {
                                display: false
                            }
                        }
                    },
                    plugins: 
                    {
                        legend: 
                        {
                            display: false 
                        },
                        tooltip: 
                        {
                            backgroundColor: "white",
                            border: true,
                            borderWidth: 2,
                            borderColor: "rgb(143, 188, 143)",
                            titleColor: "black",
                            bodyColor: "black",
                            footerColor: "black",
                            callbacks: 
                            {
                                label: function(context) 
                                {
                                    return context.raw + "°C"; 
                                }
                            }
                        },
                        datalabels: 
                        {
                            display: true,
                            align: "top",
                            formatter: function(value) 
                            {
                                return value + "°C";
                            },
                            font: 
                            {
                                size: 14,
                                weight: "bold",
                            },
                            color: "rgb(199, 199, 199)"
                        }
                    }
                },
                plugins: [ChartDataLabels]
            });
        })
        .catch(error => console.error("There was a problem with the fetch operation:", error));
}

document.addEventListener("DOMContentLoaded", function() 
{
    fetchWeatherDataAndDrawChart("weerCanvas", "http://127.0.0.1:5000/weather");
});
