// /**
//  * Functie om een modaal venster te openen.
//  * Deze functie stelt event listeners in voor het openen en sluiten van de modaal.
//  */
function openModal(side) 
{
    const modal = document.getElementById("myModal");
    const leftRadio = document.getElementById("kas_locatie_left");
    const rightRadio = document.getElementById("kas_locatie_right");
    const closeButton = document.querySelector(".annulatie-knop");
    const close = document.querySelector(".close");
    const submit = document.querySelector(".submit-plant");

    if (side === "left") {
        leftRadio.checked = true;
    } else if (side === "right") {
        rightRadio.checked = true;
    }

    modal.style.display = "block";

    closeButton.onclick = close.onclick = function () 
    {
        modal.style.display = "none";
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
}

function submitForm() {
    const form = document.getElementById("plantForm");
    const formData = new FormData(form);

    fetch('/add-plant', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => {
          console.log(data);
          const modal = document.getElementById("myModal");
          if (data.success) {
              modal.style.display = "none";
              // Show success message or perform any other action
          } else {
              alert("Error: " + data.error);
          }
      });
}