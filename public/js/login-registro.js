document.addEventListener('DOMContentLoaded', function () {

   
    
    console.log("Script de login-registro.js cargado correctamente.");
    
    const host = "http://localhost:8000";


    // Función para actualizar el saludo del usuario
    function actualizarSaludoUsuario() {
        console.log("Función actualizarSaludoUsuario llamada");
        const saludoUsuarioElement = document.getElementById('saludoUsuario');

        if (saludoUsuarioElement) {
            console.log("Elemento con ID 'saludoUsuario' encontrado");
            const nombreUsuario = localStorage.getItem('nombreUsuario');

            console.log("Nombre de usuario recuperado desde localStorage:", nombreUsuario);

            if (nombreUsuario !== null && nombreUsuario.trim() !== '') {
                console.log(`Nombre de usuario recuperado desde localStorage: ${nombreUsuario}`);
                saludoUsuarioElement.innerHTML = `¡Hola, ${nombreUsuario}! `;
                console.log(`Saludo actualizado a ¡Hola, ${nombreUsuario}!`);
            } else {
                console.log("Nombre de usuario no encontrado o vacío en localStorage");
                saludoUsuarioElement.innerHTML = '<span> Espacio Cliente</span>';
            }

        }
    }


 


    console.log("Script cargado"); // Agregado para verificar si el script se carga correctamente


    /**
     * LOGIN-----------------------------------------------------------------------------------------------------------------------------------
     */

    const loginForm = document.getElementById('login-form');
    if (loginForm) {

        loginForm.addEventListener('submit', function (event) {
            console.log("Evento de inicio de sesión ejecutado");
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

                console.log("Respuesta del servidor:", response); // Este si funciona
                // Comprobamos si la respuesta es exitosa (status 200)
                if (!response.ok) {
                    throw new Error(`Error de red: ${response.statusText}`);
                }

                // Parseamos el cuerpo de la respuesta como JSON
                return response.json();

            }).then(function (json) {
                console.log("Respuesta JSON del servidor:", json);
                alert(json.message);

                // Verificamos si el usuario está logueado correctamente
                if (json.message === "Usuario logueado") {
                    // Almacena el nombre de usuario en localStorage
                    if (json.nombreUsuario !== null) {
                        localStorage.setItem('nombreUsuario', json.nombreUsuario);
                        console.log("Nombre de usuario almacenado en localStorage:", json.nombreUsuario);
                    }
                    

                    // Ahora, después de almacenar, puedes llamar a actualizarSaludoUsuario
                    actualizarSaludoUsuario();

               
                    // Redirige a la página de inicio con el nombre de usuario como parámetro
                    window.location.href = `/index.html?${json.nombreUsuario}`;
                }
            }).catch(function (error) {
                console.log(error);
            });
        });

    } else {
        console.error(`Elemento con id="login-form" no encontrado`);
    }

    /**
     * REGISTRO---------------------------------------------------------------------------------------------------------------------------------
     */

    const registerForm = document.getElementById('register-form');
    if (registerForm) {

        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();


        const nombre = document.getElementById("nombre").value;
        const apellidos = document.getElementById("apellidos").value;
        const email = document.getElementById("emailr").value;
        const contraseña = document.getElementById("contraseñar").value;
        const repetirContraseña = document.getElementById("contraseñarr").value;


        // Verifica si las contraseñas coinciden
        if (contraseña !== repetirContraseña) {
            alert("Las contraseñas no coinciden. Por favor, inténtalo de nuevo.");
            return;
        }

        // Realiza el registro del usuario
            fetch(`${host}/registro`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nombre, apellidos, email, contraseña })
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (json) {
                    console.log(json);

                    alert(json.message);

                    if (json.message === "Usuario registrado correctamente") {
                        // Almacena el nombre de usuario en localStorage
                        if (json.nombreUsuario !== null) {
                            localStorage.setItem('nombreUsuario', json.nombreUsuario);
                        }

                        // Ahora, después de almacenar, puedes llamar a actualizarSaludoUsuario
                        actualizarSaludoUsuario();
                        
                        // Redirige a la página de inicio con el nombre de usuario como parámetro
                        window.location.href = `/index.html?${json.nombreUsuario}`;
                    }
                })
                .catch(function (error) {
                    console.error("Error en la solicitud de registro:", error);

                    
                    alert("Hubo un error durante el registro. Por favor, inténtalo de nuevo.");
                });

    });

    } else {
        console.error(`Elemento con id = "register-form" no encontrado`);
    }
       
    
    // Clic en "Espacio Cliente"
    const loginLink = document.getElementById('loginLink');

    if (loginLink) {
        loginLink.addEventListener('click', function () {
            window.location.href = '/html/login.html';
        });
    }


    // Verificar y actualizar el saludo del usuario después de la redirección
    actualizarSaludoUsuario();
});




