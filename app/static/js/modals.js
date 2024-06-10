document.addEventListener('DOMContentLoaded', function() 
{
    const loginModal = document.getElementById('loginModal');
    const settingsBtn = document.getElementById('settings-button');
    const nextInput = document.getElementById('next');
    const flashModal = document.getElementById("flashModal");
    const flashLogin = document.getElementById("flash-Login");
    const flashClose = document.getElementById("flashClose");
    const flashSubmit = document.getElementById("flash-submit");
    const flashRegister = document.getElementById("flash-Register");
    const registerModal = document.getElementById('registerModal');
    const logoutModal = document.getElementById('logoutModal'); 
    
    const confirmModal = document.getElementById("confirmModal");
    const resultModal = document.getElementById("resultsModal");

    function reloadPage() 
{
    setTimeout(function() 
    {
        window.location.href = "/";
    }, 50);
}

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

    function focusFirstInput(modal) 
    {
        const firstInput = modal.querySelector('input');
        if (firstInput) 
        {
            firstInput.focus();
        }
    }

    function openModal(modal) 
    {
        closeAllModals();
        modal.style.display = 'flex';
        focusFirstInput(modal);
    }

    if (document.getElementById('login-button')) 
    {
        document.getElementById('login-button').onclick = function() 
        {
            openModal(loginModal);
        }
    }

    if (document.getElementById('register-button')) 
    {
        document.getElementById('register-button').onclick = function() 
        {
            openModal(registerModal);
        }
    }

    if (document.getElementById('logout-button')) 
    {
        document.getElementById('logout-button').onclick = function() 
        {
            openModal(logoutModal);
        }
    }

    if (document.getElementById('loginClose')) 
    {
        document.getElementById('loginClose').onclick = function() 
        {
            loginModal.style.display = 'none';
        }
    }

    if (document.getElementById('registerClose')) 
    {
        document.getElementById('registerClose').onclick = function() 
        {
            registerModal.style.display = 'none';
        }
    }

    if (document.getElementById('logoutClose')) 
    {
        document.getElementById('logoutClose').onclick = function() 
        {
            logoutModal.style.display = 'none';
        }
    }

    if (document.getElementById("confirmClose"))
    {
        document.getElementById("confirmClose").onclick = function()
        {
            confirmModal.style.display = "none";
            reloadPage();
        }
    }

    if (document.getElementById("confirmCancel"))
    {
        document.getElementById("confirmCancel").onclick = function()
        {
            confirmModal.style.display = "none";
            reloadPage();
        }
    }

    if (document.getElementById("resultClose"))
    {
        document.getElementById("resultClose").onclick = function()
        {
            resultModal.style.display = "none";
            reloadPage();
        }
    }

    if (document.getElementById('loginCancel')) 
    {
        document.getElementById('loginCancel').onclick = function() 
        {
            loginModal.style.display = 'none';
        }
    }

    if (document.getElementById('registerCancel')) 
    {
        document.getElementById('registerCancel').onclick = function() 
        {
            registerModal.style.display = 'none';
        }
    }

    if (document.getElementById('logoutCancel')) 
    {
        document.getElementById('logoutCancel').onclick = function() 
        {
            logoutModal.style.display = 'none';
        }
    }


    // window.addEventListener("click", function(event)
    // {
    //     if (event.target === loginModal) 
    //     {
    //         loginModal.style.display = 'none';
    //     }
    //     if (event.target === registerModal) 
    //     {
    //         registerModal.style.display = 'none';
    //     }
    //     if (event.target === logoutModal) 
    //     {
    //         logoutModal.style.display = 'none';
    //     }
    //     if (event.target === flashModal) 
    //     {
    //         flashModal.style.display = 'none';
    //     }
    // });

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

    if (flashClose) 
    {
        flashClose.onclick = function() 
        {
            flashModal.style.display = "none";
        }
    }

    if (flashSubmit) 
    {
        flashSubmit.onclick = function() 
        {
            flashModal.style.display = "none";
        }
    }

    if (flashRegister) 
    {
        flashRegister.onclick = function() 
        {
            flashModal.style.display = "none";
            if (registerModal) 
            {
                registerModal.style.display = "flex";
            }
        }
    }

    if (flashLogin) 
    {
        flashLogin.onclick = function() 
        {
            flashModal.style.display = "none";
            if (loginModal) 
            {
                loginModal.style.display = "flex";
            }
        }
    }
});
