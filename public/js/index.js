const host = "http://localhost:8000";
const listaCarrito = document.getElementById("productos-lista");
const carritoBtn = document.getElementById("carrito-btn");

if (carritoBtn) {
  carritoBtn.addEventListener("click", function () {
    window.location.href = "/html/carrito.html";
  });
};

const cantidadCarritoElement = document.getElementById("cantidad-carrito");

let carrito = obtenerCarritoDesdeLocalStorage() || [];
console.log("Carrito recuperado:", carrito);

renderizarProductosEnCarrito(carrito);


localStorage.clear();

document.addEventListener("DOMContentLoaded", function () {

  
  cargarProductos();
  actualizarCantidadCarrito();
  renderizarProductosEnCarrito();

  carritoBtn.addEventListener("click", function () {
    window.location.href = "/html/carrito.html";
  });

  console.log(JSON.parse(localStorage.getItem("carrito")));
  console.log(cantidadCarritoElement.textContent);
});

function obtenerCarritoDesdeLocalStorage() {
  const carritoEnLocalStorage = JSON.parse(localStorage.getItem("carrito"));
  return carritoEnLocalStorage || [];
}

function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function sincronizarCarritoConServidor() {
  if (!carrito || carrito.length === 0) {
    console.log("El carrito está vacío. No se sincronizará con el servidor.");
    return;
  }

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
      renderizarProductosEnCarrito(); 
      actualizarCantidadCarrito();
    })
    .catch((error) => {
      console.error("Error al sincronizar con el servidor:", error);
    });
}

function agregarAlCarrito(producto) {
  producto.cantidad = producto.cantidad || 1;
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderizarProductosEnCarrito();
  actualizarCantidadCarrito();
  sincronizarCarritoConServidor();
}


function renderizarProductosEnCarrito() {
  const listaCarrito = document.getElementById("productos-carrito-lista");

  // Verificar si el elemento existe antes de intentar modificarlo
  if (listaCarrito) {
    // Limpiar la lista antes de agregar los nuevos productos
    listaCarrito.innerHTML = "";

    // Iterar sobre los productos en el carrito y agregarlos a la lista
    for (let i = 0; i < carrito.length; i++) {
      const producto = carrito[i];
      const itemCarrito = crearElementoCarrito(producto);
      listaCarrito.appendChild(itemCarrito);
    }
  }
}


function mostrarProductos(productos) {
  const contenedorProductos = document.getElementById("productos-base-datos");

  for (let i = 0; i < productos.length; i++) {
    const tarjeta = crearTarjeta(productos[i]);
    contenedorProductos.appendChild(tarjeta);
  }
}

function crearTarjeta(producto) {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("item");

  tarjeta.innerHTML = `
    <div class="card">
      <img src="${producto.foto}" alt="${producto.nombre}" />
      <div class="contenido">
        <div class="top">
          <h4>${producto.nombre}</h4>
          <div class="h4">${producto.precio}<i class="bi bi-currency-euro m-color"></i></div>
        </div>
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

        <div class="actions">
          <button class="carrito" data-product-id="${producto.id}"> Comprar </button>
          <button href="#" class="btn"> Ver </button>
        </div>
      </div>
    </div>
  `;
  

  const botonComprar = tarjeta.querySelector(".carrito");
  botonComprar.addEventListener("click", function () {
    agregarAlCarrito(producto);
  });

  return tarjeta;
}

function cargarProductos() {
  fetch(`${host}/productos?total=6`)
    .then((response) => response.json())
    .then((productos) => {
      console.log("Respuesta de la solicitud:", productos);
      mostrarProductos(productos);
      actualizarCantidadCarrito();
    })
    .catch((error) => {
      console.log(error);
    });

  
}

function actualizarCantidadCarrito() {
  const cantidadCarritoElement = document.getElementById("cantidad-carrito");
  if (cantidadCarritoElement) {
    cantidadCarritoElement.textContent = carrito.length;
  }
}