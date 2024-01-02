document.addEventListener('DOMContentLoaded', function () {
    // Evento de inicio de sesión
    document.getElementById('login-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const contraseña = document.getElementById("contraseña").value;

        fetch(`${host}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email: email, contraseña: contraseña })
        }).then(function (response) {
            return response.json();
        }).then(function (json) {
            console.log(json);

            alert(json.message);

            if (json.message === "Usuario logueado") {
                // Almacena el nombre de usuario en localStorage
                localStorage.setItem('nombreUsuario', email);
                // Redirige a la página de inicio con el nombre de usuario como parámetro
                window.location.href = `/index.html?nombre=${email}`;
            }
        }).catch(function (error) {
            console.log(error);
        });
    });

    // Evento de clic en "Espacio Cliente"
    let loginLink = document.getElementById('loginLink');
    console.log(loginLink); 
    loginLink.addEventListener('click', function () {
        console.log("Clic en Espacio Cliente"); // Añade este log para verificar
        // Redirecciona a la página de login
        window.location.href = '/html/login.html';
    });

    /**
     * REGISTRO---------------------------------------------------------------------------------------------------------------------------------
     */
    document.getElementById('register-form').addEventListener('submit', function (event) {
        event.preventDefault();

        // Resto del código de registro...

    });

    /*Mostrar saludo o enlace a la página de inicio de sesión*/
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const saludoUsuarioElement = document.getElementById('saludoUsuario');

    if (nombreUsuario) {
        saludoUsuarioElement.innerHTML = `¡Hola, ${nombreUsuario}! <span> Espacio Cliente</span>`;
    } else {
        saludoUsuarioElement.innerHTML = '<span> Espacio Cliente</span>';
    }
});
