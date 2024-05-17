/**
 * PIE DIAGRAM - HOMEPAGE
 * 
 * Toont 3 diagrams met het aantal succevolle en mislukte oogsten.
*/
class OogstDataFetcher 
{
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

    fetchAndDisplayData() 
    {
        axios.get("http://127.0.0.1:5000/oogsten")
            .then(response => 
            {
                // console.log("Data fetched successfully:", response.data);
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
                labels: this.chartLabels, // ["Successfully Harvested", "Not Successfully Harvested"]
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
                        position: "top",
                    },
                    tooltip: 
                    {
                        mode: "index",
                        intersect: false,
                    },
                }
            }
        });
    }
}

const fruitChart = new OogstDataFetcher("pie-1", "pie", ["Gelukt", "Mislukt"], ["rgba(191, 215, 182)", "rgba(46, 86, 81)"], "Fruit", "pie-1-titel");
const vegetableChart = new OogstDataFetcher("pie-2", "pie", ["Gelukt", "Mislukt"], ["rgba(191, 215, 182)", "rgba(46, 86, 81)"], "Groente", "pie-2-titel");
const herbChart = new OogstDataFetcher("pie-3", "pie", ["Gelukt", "Mislukt"], ["rgba(191, 215, 182)", "rgba(46, 86, 81)"], "Kruiden", "pie-3-titel");

fruitChart.fetchAndDisplayData();
vegetableChart.fetchAndDisplayData();
herbChart.fetchAndDisplayData();

///////////////////////////////////////////

/**
 * WEERCHART - HOMEPAGE
 * 
 * Toont de weersverwachting voor aankomende dagen.
 * 
 * @param {string}
 * @param {string}
 */
function fetchWeatherDataAndDrawChart(canvasId, apiUrl) {
    fetch(apiUrl)
        .then(response => response.ok ? response.json() : Promise.reject('Network response was not ok.'))
        .then(data => {
            const dates = data.weather_forecast.map(item => {
                const [day, month, year] = item.dag.split('-').map(Number);
                const date = new Date(year, month - 1, day);
                const weekdays = ['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za'];
                const weekday = weekdays[date.getDay()];

                return `${weekday}`;
            });

            const temperatures = data.weather_forecast.map(item => item.max_temp);

            const canvas = document.getElementById(canvasId);
            if (!canvas) {
                console.error('Canvas element not found.');
                return;
            }


            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'bar', // Changed to bar chart type
                data: {
                    labels: dates,
                    datasets: [{
                        data: temperatures,
                        backgroundColor: 'rgba(143, 188, 143, 0.6)', // Changed background color for bars
                        borderColor: 'rgba(143, 188, 143, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    indexAxis: 'x', // Display bars vertically
                    maintainAspectRatio: false, // Disable aspect ratio
                    responsive: false, // Disable responsiveness
                    scales: {
                        y: {
                            beginAtZero: true // Ensure the y-axis starts from zero
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        })
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

document.addEventListener('DOMContentLoaded', function() {
    // fetchWeatherDataAndDrawChart("sensorCanvas", "http://127.0.0.1:5000/weather");
});