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

    modal.style.display = "block";
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
            reloadPage();
        } 
        else 
        {
            alert("Geen data ingevuld!");
        }
    });
}

function reloadPage() 
{
    setTimeout(function() 
    {
        window.location.href = "/";
    }, 50);
}
