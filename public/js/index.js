const host = "http://localhost:8000";

window.addEventListener("load", function (event) {
  fetch(`${host}/productos?total=6`)
    .then(function (response) {
      return response.json();
    })
    .then(function (productos) {
      mostrarProductos(productos);
    })
    .catch(function (error) {
      console.log(error);
    });
});

function mostrarProductos(productos) {
  const contenedorProductos = document.getElementById("productos-lista");

  productos.forEach((producto) => {
    const tarjeta = crearTarjeta(producto);
    contenedorProductos.appendChild(tarjeta);
  });
}

function crearTarjeta(producto) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("item"); // Añade la clase "item" para estilos

  tarjeta.innerHTML = `
    <figure>
      <img src="${producto.foto}" alt="${producto.nombre}" />
    </figure>
    <div class="info-product">
      <h2>${producto.nombre}</h2>
      <div class="h4">${producto.precio}<i class="bi bi-currency-euro m-color"></i></div>
      <div class="valoracion">
        <span class="m-color">
          <i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i>
          <i class="bi bi-star-fill"></i>
        </span>
        <i class="bi bi-star-fill"></i>
        <i class="bi bi-star-fill"></i>
      </div>
      <p>${producto.descripcion_larga}</p>
      <button class="add-to-cart" data-product-id="${producto.id}">Añadir al carrito</button>
    </div>
  `;

  // Asigna un manejador de eventos al botón de "Añadir al carrito"
  const botonCarrito = tarjeta.querySelector(".add-to-cart");
  botonCarrito.addEventListener("click", function () {
    añadirAlCarrito(producto);
  });

  return tarjeta;
}



function añadirAlCarrito(producto) {
  fetch(`${host}/productos/${producto.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al agregar al carrito");
      }
      return response.json();
    })
    .then((data) => {
      const cantidadCarritoElement =
        document.getElementById("cantidad-carrito");
      const cantidadEnCarrito =
        parseInt(cantidadCarritoElement.textContent) + 1;
      cantidadCarritoElement.textContent = cantidadEnCarrito;
      // Actualizar la vista del carrito
      actualizarVistaCarrito();
    })
    .catch((error) => {
      console.error(error.message);
    });
}

function actualizarVistaCarrito() {
  console.log("Actualizando vista del carrito", carrito);
}
