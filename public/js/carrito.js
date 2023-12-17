  /**
   * Esta función se encarga de actualizar la visualización del carrito en la página, mostrando la lista de productos, 
   * la cantidad y el precio total. También utiliza dos funciones (aumentarCantidad y disminuirCantidad) 
   * para permitir la modificación de las cantidades de los productos en el carrito.
   */
  function renderizarProductosEnCarrito(carrito) {
    const listaCarrito = document.getElementById("productos-carrito-lista");

    // Limpiar la lista antes de agregar los nuevos productos
    listaCarrito.innerHTML = "";

    // Iterar sobre los productos en el carrito y agregarlos a la lista
    for (let i = 0; i < carrito.length; i++) {
      const producto = carrito[i];
      const itemCarrito = crearElementoCarrito(producto);
      listaCarrito.appendChild(itemCarrito);
    }
  }

  function crearElementoCarrito(producto) {

    const articleCarro = document.createElement("div");
    articleCarro.classList.add("item");

    articleCarro.innerHTML = `
    <img src="${producto.foto}" alt="${producto.nombre}" width="150" height="150">
    <div>
      <h4 class="card-title">${producto.nombre}</h4>
      <div class="price-grp">
        <span>${producto.precio}</span>
        <span class="currenci">€</span>
      </div>
    </div>
    <div class= "producto-cantidad">
    <button type="button" class="aumentar">+</button>
    <input type="input" value="${Number(producto.cantidad)}" >
    <button type="button" class="disminuir">-</button>
    </div>
    
    <button type="button" class="eliminar"><i class="bi bi-paper-card"></i></button>
  `;


    // Eventos para aumentar, disminuir y eliminar productos
    // const inputCantidad = tarjeta.querySelector("input");
    const btnAumentar = articleCarro.querySelector(".aumentar");
    const btnDisminuir = articleCarro.querySelector(".disminuir");
    const btnEliminar = articleCarro.querySelector(".eliminar");


    btnAumentar.addEventListener("click", function () {
      aumentarCantidad(producto);
    });

    btnDisminuir.addEventListener("click", function () {
      disminuirCantidad(producto);
    });

    btnEliminar.addEventListener("click", function () {
      eliminarProducto(producto);
    });
    return articleCarro;
  }


function aumentarCantidad(producto) {
  console.log("Aumentando cantidad para el producto:", producto);
  producto.cantidad++;
  console.log("Nueva cantidad:", producto.cantidad);
  guardarCarritoEnLocalStorage();
  renderizarProductosEnCarrito(carrito);
}

function disminuirCantidad(producto) {
  console.log("Disminuyendo cantidad para el producto:", producto);
  if (producto.cantidad > 1) {
    producto.cantidad--;
    console.log("Nueva cantidad:", producto.cantidad);
    guardarCarritoEnLocalStorage();
    renderizarProductosEnCarrito(carrito);
  }
}

function eliminarProducto(producto) {
  console.log("Eliminando producto:", producto);
  const index = carrito.findIndex((p) => p.id === producto.id);
  if (index !== -1) {
    carrito.splice(index, 1);
    console.log("Producto eliminado. Nuevo carrito:", carrito);
    guardarCarritoEnLocalStorage();
    renderizarProductosEnCarrito(carrito);
    actualizarCantidadCarrito();
  }
}

  
  console.log("Pagina cargada!!!!")


document.addEventListener("DOMContentLoaded", function () {
  actualizarCantidadCarrito();

  const listaCarrito = document.getElementById("productos-carrito-lista");
  const btnFinalizarCompra = document.getElementById("btn-finalizar-compra");

  const carrito = obtenerCarritoDesdeLocalStorage() || [];          //Lee el contenido del carrito desde el almacenamiento 
                                                                    //local del navegador. Si no hay ningún carrito almacenado, 
                                                                    //se inicializa como un array vacío


  console.log("Carrito inicializado:", carrito);

  // Renderizar los productos en el carrito
  renderizarProductosEnCarrito(carrito);


  /**
   * Esta función se llama cuando el usuario hace clic en el botón para finalizar la compra. Realiza acciones como sincronizar el carrito con el servidor 
   * (posiblemente enviando los datos al servidor), limpiar el carrito después de una compra exitosa y redirigir al usuario a una página de confirmación de pedido.
   */
  function finalizarCompra() {
    sincronizarCarritoConServidor()
      .then(function () {
        limpiarCarrito();
        window.location.href = "/html/confirmacion-exito-pedido.html";
      })
      .catch(function (error) {
        console.error("Error al finalizar compra:", error);
      });
  }


  /**
   * Esta función limpia completamente el carrito, estableciéndolo como un array vacío, guardando esta información en el almacenamiento local 
   * y actualizando la visualización del carrito en la página.
   */
  function limpiarCarrito() {
    carrito = [];
    guardarCarritoEnLocalStorage();
    renderizarProductosEnCarrito();
  }

  // Botón para finalizar la compra
  btnFinalizarCompra.addEventListener("click", finalizarCompra);

/**
 * llaman a funciones que inicializan y renderizan los productos en el carrito cuando se carga la página.
 */
  // Inicialización
  cargarProductos();
  actualizarCantidadCarrito();
  renderizarProductosEnCarrito();
});


