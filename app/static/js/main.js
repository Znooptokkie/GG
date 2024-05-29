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
      setTimeout(hideLoadingScreen, 1000); // Verberg laadscherm na 1 seconde
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
      const gevondenPlant = plantenData.find(plant => plant.plant_id === plantId);
  
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
  