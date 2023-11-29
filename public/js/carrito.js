const host = "http://localhost:8000";

document.addEventListener("DOMContentLoaded", function () {
  // Obtener los productos del carrito almacenados en localStorage
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Renderizar los productos en el carrito
  renderizarProductos(carrito);
});

function renderizarProductos(productos) {
  const listaCarrito = document.getElementById("productos-carrito");

  // Limpiar la lista antes de agregar nuevos productos
  listaCarrito.innerHTML = "";

  productos.forEach((producto) => {
    const itemCarrito = document.createElement("li");
    itemCarrito.textContent = producto.nombre;
    listaCarrito.appendChild(itemCarrito);
  });

  // Otras acciones que puedas necesitar
}
