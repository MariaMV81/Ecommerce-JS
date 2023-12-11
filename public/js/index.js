const host = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", function () {
  const listaCarrito = document.getElementById("productos-lista");
  const carritoBtn = document.getElementById("carrito-btn");
  const cantidadCarritoElement = document.getElementById("cantidad-carrito");

   let carrito = obtenerCarritoDesdeLocalStorage() || [];

    function obtenerCarritoDesdeLocalStorage() {
      const carritoGuardado = localStorage.getItem("carrito");
      return carritoGuardado ? JSON.parse(carritoGuardado) : null;
    }

    function guardarCarritoEnLocalStorage() {
      localStorage.setItem("carrito", JSON.stringify(carrito));
    }

   function sincronizarCarritoConServidor() {
     // Verificar que carrito esté definido y no esté vacío
     if (!carrito || carrito.length === 0) {
       console.warn(
         "El carrito está vacío. No se sincronizará con el servidor."
       );
       return;
     }

     // Enviar el carrito actual al servidor
     fetch(`${host}/carrito`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ carrito }),
     })
       .then((response) => {
         if (!response.ok) {
           throw new Error(`Error en la solicitud: ${response.statusText}`);
         }
         return response.json();
       })
       .then((data) => {
         carrito = data.carrito;
         guardarCarritoEnLocalStorage();
       })
       .catch((error) => {
         console.error("Error al sincronizar con el servidor:", error);
       });
   }

    function obtenerNuevoEstadoDelCarrito(carrito, idUsuario) {

      const nuevoEstadoCarrito = actualizarCarritoEnBaseDeDatos(
        idUsuario,
        carrito
      );

      return nuevoEstadoCarrito;
    }

    

  function actualizarCantidadCarrito() {
    cantidadCarritoElement.textContent = carrito.length;
  }

 function agregarAlCarrito(producto) {
   carrito.push(producto);
   localStorage.setItem("carrito", JSON.stringify(carrito));
   sincronizarCarritoConServidor(); 
   actualizarCantidadCarrito();
   renderizarProductosEnCarrito();
 }

  function renderizarProductosEnCarrito() {
    listaCarrito.innerHTML = "";

    carrito.forEach((producto) => {
      const itemCarrito = document.createElement("li");
      itemCarrito.textContent = producto.nombre;
      listaCarrito.appendChild(itemCarrito);
    });
  }

  function cargarProductos() {
    fetch(`${host}/productos?total=6`)
      .then((response) => response.json())
      .then((productos) => {
        console.log("Respuesta de la solicitud:", productos);
        mostrarProductos(productos);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function mostrarProductos(productos) {
    const contenedorProductos = document.getElementById("productos-base-datos");

    productos.forEach((producto) => {
      const tarjeta = crearTarjeta(producto);
      contenedorProductos.appendChild(tarjeta);
    });
  }

  function crearTarjeta(producto) {
    const tarjeta = document.createElement("div");
    tarjeta.classList.add("item");

    tarjeta.innerHTML = `
      <figure>
        <img src="${producto.foto}" alt="${producto.nombre}" />
      </figure>
      <div class="info-product">
        <h2>${producto.nombre}</h2>
        <div class="h4">${producto.precio}<i class="bi bi-currency-euro m-color"></i></div>
        <div class="valoracion">${producto.valoracion}
          <span class="m-color">
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
            <i class="bi bi-star-fill"></i>
          </span>
          <i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i>
        </div>
        <p>${producto.descripcion_larga}</p>
        <button class="btn-comprar" data-product-id="${producto.id}">Comprar</button>
        <button >Ver</button>
      </div>
    `;

    const botonComprar = tarjeta.querySelector(".btn-comprar");
    botonComprar.addEventListener("click", function () {
      agregarAlCarrito(producto);
    });

    return tarjeta;
  }

  console.log("Elemento carrito-btn:", carritoBtn);

  carritoBtn.addEventListener("click", function () {
   
    window.location.href = "/html/carrito.html";
  });

  cargarProductos();
  actualizarCantidadCarrito();
  renderizarProductosEnCarrito();
});
