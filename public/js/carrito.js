document.addEventListener("DOMContentLoaded", function () {
  
  const listaCarrito = document.getElementById("productos-lista");
  const totalElement = document.getElementById("total-compra");
  const btnFinalizarCompra = document.getElementById("btn-finalizar-compra");

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  function renderizarProductosEnCarrito() {
    listaCarrito.innerHTML = "";

    const totalCompra = carrito.reduce((total, producto) => {
      const itemCarrito = document.createElement("li");
      itemCarrito.textContent = `${producto.nombre} - Cantidad: ${
        producto.cantidad
      } - Precio: ${producto.precio * producto.cantidad}`;

      const btnIncrementar = crearBoton("+", () => aumentarCantidad(producto));
      const btnDecrementar = crearBoton("-", () => disminuirCantidad(producto));

      itemCarrito.appendChild(btnIncrementar);
      itemCarrito.appendChild(btnDecrementar);
      listaCarrito.appendChild(itemCarrito);

      return total + producto.precio * producto.cantidad;
    }, 0);

    totalElement.textContent = `Total: ${totalCompra} euros`;
  }

  function aumentarCantidad(producto) {
    producto.cantidad++;
    guardarCarritoEnLocalStorage();
    renderizarProductosEnCarrito();
  }

  function disminuirCantidad(producto) {
    if (producto.cantidad > 1) {
      producto.cantidad--;
      guardarCarritoEnLocalStorage();
      renderizarProductosEnCarrito();
    }
  }

  function finalizarCompra() {
    sincronizarCarritoConServidor()
      .then(function () {
        limpiarCarrito();
        window.location.href = "/html/confirmacion-exito-pedido.html";
      })
      .catch(function (error) {
        console.error("Error al finalizar compra:", error);
        // Manejar el error de alguna manera, por ejemplo, mostrar un mensaje al usuario
      });
  }

  function limpiarCarrito() {
    carrito = [];
    guardarCarritoEnLocalStorage();
    renderizarProductosEnCarrito();
  }

  // Botón para finalizar la compra
  btnFinalizarCompra.addEventListener("click", finalizarCompra);


  // Inicialización
  cargarProductos();
  actualizarCantidadCarrito();
  renderizarProductosEnCarrito();
});


