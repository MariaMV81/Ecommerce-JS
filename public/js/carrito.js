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
    
      
    <img src="${producto.foto}" alt="${producto.nombre}" width="100" >
    <div class="info-producto">
      <h5 class="item-title">${producto.nombre}</h5>
      <div class="price-grp">
        <span class="precio-total">${producto.precio * producto.cantidad}</span>
        <span class="currenci">€</span>
      </div>
    </div>
    <div class="producto-cantidad">
      <button type="button" class="aumentar">+</button>
      <input type="input" value="${Number(producto.cantidad)}" class="cantidad-input">
      <button type="button" class="disminuir">-</button>
    </div>
    <button type="button" class="eliminar"><i class="bi bi-trash"></i></button>
  
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
  producto.cantidad++;
  guardarCarritoEnLocalStorage();
  renderizarProductosEnCarrito(carrito);
  actualizarPrecioTotal(producto);
  actualizarPrecioFinal();
}

function disminuirCantidad(producto) {
  if (producto.cantidad > 1) {
    producto.cantidad--;
    guardarCarritoEnLocalStorage();
    renderizarProductosEnCarrito(carrito);
    actualizarPrecioTotal(producto);
    actualizarPrecioFinal();
  }
}

function actualizarPrecioTotal(producto) {
  const productoElement = document.querySelector(`#producto-${producto.id}`);

  if (productoElement) {
    const precioTotalElement = productoElement.querySelector(".precio-total");
    const cantidadElement = productoElement.querySelector(".producto-cantidad input");

    // Actualizar el valor del input de cantidad
    if (cantidadElement) {
      cantidadElement.value = producto.cantidad;
    }

    // Actualizar el precio total del producto
    if (precioTotalElement) {
      precioTotalElement.textContent = producto.precio * producto.cantidad;
    }
  }
}


function eliminarProducto(producto) {
  const index = carrito.findIndex((p) => p.id === producto.id);
  if (index !== -1) {
    carrito.splice(index, 1);
    guardarCarritoEnLocalStorage();
    renderizarProductosEnCarrito(carrito);
    actualizarPrecioTotal(producto);
    actualizarPrecioFinal();
    actualizarCantidadCarrito();
  }
}


console.log("Pagina cargada!!!!")

function calcularTotal(carrito) {
  let total = 0;

  // Suma los precios de todos los productos en el carrito
  for (let i = 0; i < carrito.length; i++) {
    total += carrito[i].precio * carrito[i].cantidad;
  }

  return total;
}


function actualizarPrecioFinal() {
  const total = calcularTotal(carrito);
  const spanTotalPrecio = document.getElementById("totalPrecio");
  if (spanTotalPrecio) {
    spanTotalPrecio.textContent = total;
  }
}


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
  actualizarPrecioFinal();


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
  // btnFinalizarCompra.addEventListener("click", finalizarCompra);

  /**
   * llaman a funciones que inicializan y renderizan los productos en el carrito cuando se carga la página.
   */
  // Inicialización
  cargarProductos();
  actualizarCantidadCarrito();
  renderizarProductosEnCarrito();
});



function calcularTotal(carrito) {
  let total = 0;

  // Suma los precios de todos los productos en el carrito
  for (let i = 0; i < carrito.length; i++) {
    total += carrito[i].precio * carrito[i].cantidad;
  }

  return total;
}


function actualizarPrecioFinal() {
  const total = calcularTotal(carrito);
  const spanTotalPrecio = document.getElementById("totalPrecio");
  if (spanTotalPrecio) {
    spanTotalPrecio.textContent = total;
  }
}




