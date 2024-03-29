// const host = "http://ec2-15-237-159-66.eu-west-3.compute.amazonaws.com:8000";



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


// localStorage.clear();


document.addEventListener("DOMContentLoaded", function () {


  cargarProductos();
  actualizarCantidadCarrito();
  renderizarProductosEnCarrito();
  agregarAFavoritos();

  carritoBtn.addEventListener("click", function () {
    window.location.href = "/html/carrito.html";
  });

  // const iconoFavorito = document.getElementById("favoritos-icono");

  // if (iconoFavorito) {
  //   iconoFavorito.addEventListener("click", function () {
  //     const producto = obtenerProductoDesdeElemento();
  //     agregarAFavoritos(producto);
  //   });
  // }

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
  // Busca si el producto ya está en el carrito
  const productoExistente = carrito.find((p) => p.id === producto.id);

  if (productoExistente) {
    // Si el producto ya está en el carrito, incrementar la cantidad
    productoExistente.cantidad++;
  } else {
    // Si el producto no está en el carrito, agregarlo con cantidad 1
    carrito.push({ ...producto, cantidad: 1 });
  }

  // Actualizar el carrito en el almacenamiento local
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Actualizar la visualización del carrito
  renderizarProductosEnCarrito();

  // Actualizar la cantidad en el icono del carrito
  actualizarCantidadCarrito();

  // Sincronizar el carrito con el servidor
  sincronizarCarritoConServidor();
}



function renderizarProductosEnCarrito() {
  const listaCarrito = document.getElementById("productos-carrito-lista");
  const cantidadCarrito = document.querySelector(".quantity");

  // Verificar si el elemento existe antes de intentar modificarlo
  if (listaCarrito) {
    // Limpiar la lista antes de agregar los nuevos productos
    listaCarrito.innerHTML = "";

    // Inicializar la cantidad de artículos en el carrito
    let cantidadTotal = 0;

    // Iterar sobre los productos en el carrito y agregarlos a la lista
    for (let i = 0; i < carrito.length; i++) {
      const producto = carrito[i];
      cantidadTotal += producto.cantidad;
      const itemCarrito = crearElementoCarrito(producto);
      listaCarrito.appendChild(itemCarrito);
    }


    // Actualizar la cantidad total en el carrito
    cantidadCarrito.textContent = `${cantidadTotal} Artículo(s)`;

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
    
      <img src="${producto.foto}" alt="${producto.nombre}" />
      <div class="contenido">
      <div class="favorito" ><i class="bi bi-heart" h4 data-product-id="${producto.id}"></i></div>
        <div class="top">
          <h4>${producto.nombre}</h4>
          <div class="precio">${producto.precio}<i class="bi bi-currency-euro m-color"></i></div>
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
          <button class="carrito" data-product-id="${producto.id}"> Añadir al carrito </button>
          <button href="#" class="btn"> Ver </button>
        </div>
      </div>
    
  `;


  if (typeof agregarAFavoritos === 'function') {
    const iconoFavorito = tarjeta.querySelector(".favorito i");
    iconoFavorito.addEventListener("click", function () {
      agregarAFavoritos(producto);
    });
  } else {
    console.error('La función agregarAFavoritos no está definida.');
  }


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



