const host = "http://localhost:8000";

window.addEventListener("load", function (event) {
  fetch(`${host}/productos?total=6`)
    .then(function (response) {
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


document.addEventListener("DOMContentLoaded", function () {

  let carrito = [];

  function añadirAlCarrito(productoID) {
     const producto = productos.find((p) => p.id === productoID);
     //añadir el producto al carrito
    carrito.push(producto);
    actualizarVistaCarrito();
  }

  function actualizarVistaCarrito() {
    const listaCarrito = document.getElementById("carrito-lista");
    const totalCarrito = document.getElementById("total-carrito");

    // Limpiar la vista del carrito
    listaCarrito.innerHTML = "";

    // Actualizar la vista del carrito con los productos actuales
    carrito.forEach((producto) => {
      const li = document.createElement("li");
      li.textContent = `${producto.nombre} - ${producto.precio} €`;
      listaCarrito.appendChild(li);
    });

    // Actualizar la cantidad total de elementos en el carrito
    totalCarrito.textContent = calcularTotalCarrito() + " €";
  }

  function calcularTotalCarrito() {
    return carrito.reduce((total, producto) => total + producto.precio, 0);
  }

  // Agrega el evento de clic para los botones "Comprar"
  const botonesComprar = document.querySelectorAll(".add-to-cart");
  botonesComprar.forEach((boton) => {
    boton.addEventListener("click", function () {
      // Obtén el ID del producto desde el atributo data-product-id
      const productoID = parseInt(boton.dataset.productId);
      añadirAlCarrito(productoID);
    });
  });
});