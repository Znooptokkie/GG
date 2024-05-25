document.addEventListener('DOMContentLoaded', function() 
{
    const loginModal = document.getElementById('loginModal');
    const settingsBtn = document.getElementById('settings-button');
    const loginForm = document.getElementById('loginForm');
    const nextInput = document.getElementById('next');
    const flashModal = document.getElementById("flashModal");
    const flashLogin = document.getElementById("flash-Login");
    const flashClose = document.getElementById("flashClose");
    const flashSubmit = document.getElementById("flash-submit");
    const flashRegister = document.getElementById("flash-Register");
    const registerModal = document.getElementById('registerModal');

    if (settingsBtn) 
    {
        settingsBtn.onclick = function(event) 
        {
            event.preventDefault();
            fetch('/status')
                .then(response => response.json())
                .then(data => 
                {
                    if (data.status === 'logged_in') 
                    {
                        window.location.href = settingsBtn.dataset.url;
                    } 
                    else 
                    {
                        closeAllModals();
                        loginModal.style.display = 'flex';
                        nextInput.value = settingsBtn.dataset.url;
                        focusFirstInput(loginModal);
                    }
                });
        }
    }

    function closeAllModals() 
    {
        if (loginModal) 
        {
            loginModal.style.display = 'none';
        }
        if (registerModal) 
        {
            registerModal.style.display = 'none';
        }
        if (logoutModal) 
        {
            logoutModal.style.display = 'none';
        }
        if (flashModal) 
        {
            flashModal.style.display = 'none';
        }
    }

    const loginBtn = document.getElementById('login-button');
    const registerBtn = document.getElementById('register-button');
    const logoutBtn = document.getElementById('logout-button');

    const loginClose = document.getElementById('loginClose');
    const registerClose = document.getElementById('registerClose');
    const logoutClose = document.getElementById('logoutClose');

    const loginCancel = document.getElementById('loginCancel');
    const registerCancel = document.getElementById('registerCancel');
    const logoutCancel = document.getElementById('logoutCancel');

    function focusFirstInput(modal) 
    {
        const firstInput = modal.querySelector('input');
        if (firstInput) 
        {
            firstInput.focus();
        }
    }

    if (loginBtn) 
    {
        loginBtn.onclick = function() 
        {
            closeAllModals();
            loginModal.style.display = 'flex';
            focusFirstInput(loginModal);
        }
    }

    if (registerBtn) 
    {
        registerBtn.onclick = function() 
        {
            closeAllModals();
            registerModal.style.display = 'flex';
            focusFirstInput(registerModal);
        }
    }

    if (logoutBtn) 
    {
        logoutBtn.onclick = function() 
        {
            closeAllModals();
            logoutModal.style.display = 'flex';
        }
    }

    if (loginClose) 
    {
        loginClose.onclick = function() 
        {
            loginModal.style.display = 'none';
        }
    }

    if (registerClose) 
    {
        registerClose.onclick = function() 
        {
            registerModal.style.display = 'none';
        }
    }

    if (logoutClose) 
    {
        logoutClose.onclick = function() 
        {
            logoutModal.style.display = 'none';
        }
    }

    if (loginCancel) 
    {
        loginCancel.onclick = function() 
        {
            loginModal.style.display = 'none';
        }
    }

    if (registerCancel) 
    {
        registerCancel.onclick = function() 
        {
            registerModal.style.display = 'none';
        }
    }

    if (logoutCancel) 
    {
        logoutCancel.onclick = function() 
        {
            logoutModal.style.display = 'none';
        }
    }

  //   window.onclick = function(event) 
  //   {
  //       if (event.target == loginModal) 
  //       {
  //           loginModal.style.display = 'none';
  //       }
  //       if (event.target == registerModal) 
  //       {
  //           registerModal.style.display = 'none';
  //       }
  //       if (event.target == logoutModal) 
  //       {
  //           logoutModal.style.display = 'none';
  //       }
  //       if (event.target == flashModal) 
  //       {
  //           flashModal.style.display = 'none';
  //       }
  //   }

  const flashMessage = document.querySelector('.flashes h3');

    if (flashMessage) 
    {
        flashModal.style.display = "flex";

        if (flashMessage.textContent.includes('Gebruikersnaam niet gevonden!')) 
          {
              flashRegister.style.display = "block";
          } 
          else if (flashMessage.textContent.includes('Onjuist wachtwoord')) 
          {
              flashLogin.style.display = "block";
          }
    }

    flashClose.onclick = function() 
    {
        flashModal.style.display = "none";
    }

    flashSubmit.onclick = function() 
    {
        flashModal.style.display = "none";
    }

    flashRegister.onclick = function() 
    {
        flashModal.style.display = "none";
        if (registerModal) 
        {
            registerModal.style.display = "flex";
        }
    }

    flashLogin.onclick = function() 
    {
        flashModal.style.display = "none";
        if (loginModal) 
        {
            loginModal.style.display = "flex";
        }
    }
});
