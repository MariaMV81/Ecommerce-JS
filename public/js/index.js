const host = "http://localhost:8000";

window.addEventListener("load", function (event) {
  fetch(`${host}/productos?total=6`) //solicitud HTTP
    .then(function (response) { //promesa
      return response.json();
    })
    .then(function (productos) {
      cargarCard(productos);
    })
    .catch(function (error) {
      console.log(error);
    });
});

function cargarCard(productos) {
  const listaProductos = document.getElementById("productos-lista");

  productos.forEach((producto) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <figure>
        <img src="${producto.foto}" alt="${producto.nombre}" />
      </figure>
      <div class="info-product">
        <h3>${producto.descripcion_corta}</h3>
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
          <button class="add-to-cart" data-product-id="${producto.id}">Comprar</button>
      </div>

    `;

    listaProductos.appendChild(li);
  });
}

let botonesComprar;
let productos = []; // Asumiendo que tienes un array de productos

document.addEventListener("DOMContentLoaded", function () {
    botonesComprar = document.querySelectorAll(".add-to-cart");

    botonesComprar.forEach((boton) => {
        boton.addEventListener("click", function () {
            const productoID = parseInt(boton.dataset.productId);
            const producto = productos.find((p) => p.id === productoID);

            if (producto) {
                añadirAlCarrito(producto);
            } else {
                console.error("Producto no encontrado");
            }
        });
    });
});

function añadirAlCarrito(producto) {
    // Lógica para agregar productos al carrito
    console.log("Producto añadido al carrito:", producto);

    // Actualizar la vista del carrito
    actualizarVistaCarrito();
}

function actualizarVistaCarrito() {
    // Lógica para actualizar la vista del carrito
    console.log("Actualizando vista del carrito");
}


