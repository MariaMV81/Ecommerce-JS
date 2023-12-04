const host = "http://localhost:8000/html/carrito.html";

document.addEventListener("DOMContentLoaded", function () {
  // Obtener elementos del DOM
  const carritoContador = document.getElementById("cantidad-carrito");
  const carritoBtn = document.getElementById("carrito-btn");

  // Obtener los productos del carrito almacenados en localStorage
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Actualizar el contador en el botón del carrito
  if (carritoContador) {
    carritoContador.textContent = carrito.length;
  }

  // Añadir evento de clic al botón del carrito en index.html
  if (carritoBtn) {
    carritoBtn.addEventListener("click", function () {
      // Almacenar el carrito en localStorage 
      localStorage.setItem("carrito", JSON.stringify(carrito));
    });
  }

  // Renderizar los productos en el carrito 
  renderizarProductos(carrito);
});

function renderizarProductos(productos) {
  const listaCarrito = document.getElementById("productos-carrito");

  // Limpiar la lista antes de agregar nuevos productos
  if (listaCarrito) {
    listaCarrito.innerHTML = "";

    productos.forEach((producto) => {
      const itemCarrito = document.createElement("li");
      itemCarrito.textContent = producto.nombre;
      listaCarrito.appendChild(itemCarrito);
    });
  }
}
