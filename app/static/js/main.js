  //---LAADSCHERM---
  document.addEventListener('DOMContentLoaded', function() {
        showLoadingScreen(); 
        startTimer();
  });
  
  function showLoadingScreen() {
      document.getElementById('loading-screen').style.display = 'block';
  }
  
  function hideLoadingScreen() {
      document.getElementById('loading-screen').style.display = 'none';
  }
  
  function startTimer() {
      setTimeout(hideLoadingScreen, 100); // Verberg laadscherm na 2 seconden
  }
  
  function fetchPlantenData()
  {
      axios.get('http://127.0.0.1:5000/planten-data')
      .then(response => 
      {
          const plantenData = response.data;
          updatePlantenData(plantenData);
      })
      .catch(error => 
      {
          console.error('Error fetching planten data:', error);
      });
  }
  
  function getPlantIdFromUrl()
  {
      const currentUrl = new URL(window.location.href);
      const searchParams = currentUrl.searchParams;
      return searchParams.get('id');
  }
  
  function updatePlantenData(plantenData) 
  {
      const plantId = parseInt(getPlantIdFromUrl(), 10);
      const gevondenPlant = plantenData.find(plant => plant.planten_id === plantId);
  
      if (gevondenPlant) 
      {
          document.title = gevondenPlant.plant_naam;
          document.querySelector(".plant-titel").textContent = gevondenPlant.plant_naam;
      }
      else 
      {
          console.log(`Geen plant gevonden met ID ${plantId}`);
      }
  }
      
  fetchPlantenData();
  
  document.addEventListener('DOMContentLoaded', function() {
      showLoadingScreen();
      startTimer();
  });
   

  ////////////////////////////////////
  document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('loginModal');
    const settingsBtn = document.getElementById('settings-button');
    const loginForm = document.getElementById('loginForm');
    const nextInput = document.getElementById('next');

    if (settingsBtn) {
        settingsBtn.onclick = function(event) {
            event.preventDefault();
            fetch('/status')
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'logged_in') {
                        window.location.href = settingsBtn.dataset.url;
                    } else {
                        closeAllModals();
                        loginModal.style.display = 'flex';
                        nextInput.value = settingsBtn.dataset.url;
                        focusFirstInput(loginModal);
                    }
                });
        }
    }

    // Function to close all modals
    function closeAllModals() {
        if (loginModal) {
            loginModal.style.display = 'none';
        }
        if (registerModal) {
            registerModal.style.display = 'none';
        }
        if (logoutModal) {
            logoutModal.style.display = 'none';
        }
    }

    // Get the button that opens the modal
    const loginBtn = document.getElementById('login-button');
    const registerBtn = document.getElementById('register-button');
    const logoutBtn = document.getElementById('logout-button');

    // Get the <span> elements that close the modals
    const loginClose = document.getElementById('loginClose');
    const registerClose = document.getElementById('registerClose');
    const logoutClose = document.getElementById('logoutClose');

    // Get the cancel buttons
    const loginCancel = document.getElementById('loginCancel');
    const registerCancel = document.getElementById('registerCancel');
    const logoutCancel = document.getElementById('logoutCancel');

    function focusFirstInput(modal) {
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }

    // When the user clicks the button, open the modal and close others
    if (loginBtn) {
        loginBtn.onclick = function() {
            closeAllModals();
            loginModal.style.display = 'flex';
            focusFirstInput(loginModal);
        }
    }

    if (registerBtn) {
        registerBtn.onclick = function() {
            closeAllModals();
            registerModal.style.display = 'flex';
            focusFirstInput(registerModal);
        }
    }

    if (logoutBtn) {
        logoutBtn.onclick = function() {
            closeAllModals();
            logoutModal.style.display = 'flex';
        }
    }

    // When the user clicks on <span> (x), close the modal
    if (loginClose) {
        loginClose.onclick = function() {
            loginModal.style.display = 'none';
        }
    }

    if (registerClose) {
        registerClose.onclick = function() {
            registerModal.style.display = 'none';
        }
    }

    if (logoutClose) {
        logoutClose.onclick = function() {
            logoutModal.style.display = 'none';
        }
    }

    // When the user clicks on cancel button, close the modal
    if (loginCancel) {
        loginCancel.onclick = function() {
            loginModal.style.display = 'none';
        }
    }

    if (registerCancel) {
        registerCancel.onclick = function() {
            registerModal.style.display = 'none';
        }
    }

    if (logoutCancel) {
        logoutCancel.onclick = function() {
            logoutModal.style.display = 'none';
        }
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
        if (event.target == registerModal) {
            registerModal.style.display = 'none';
        }
        if (event.target == logoutModal) {
            logoutModal.style.display = 'none';
        }
    }
});