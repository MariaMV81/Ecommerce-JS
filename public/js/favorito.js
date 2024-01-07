
document.addEventListener("DOMContentLoaded", function () {
    // Al cargar la página, actualiza el contador de favoritos y obtén la lista de favoritos desde localStorage
    // actualizarCantidadFavoritos();

    

    const listaProductos = document.getElementById("productos-base-datos");

    if (listaProductos) {
        listaProductos.addEventListener("click", function (event) {
            const iconoFavorito = event.target.closest(".favorito i");

            if (iconoFavorito) {
                const producto = obtenerProductoDesdeElemento(iconoFavorito);
                agregarAFavoritos(producto);
            }
        });
    }



// Función para obtener el identificador único del usuario
function obtenerIdUsuario() {
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual"));
    return usuarioActual ? usuarioActual.id : null;
}


// Función para obtener y actualizar productos favoritos asociados al usuario
function obtenerFavoritosUsuario() {
    const usuarioId = obtenerIdUsuario();
    const favoritosEnLocalStorage = JSON.parse(localStorage.getItem(`favoritos_${usuarioId}`));
    return favoritosEnLocalStorage || [];
}

function guardarFavoritosUsuario(favoritos) {
    const usuarioId = obtenerIdUsuario();
    localStorage.setItem(`favoritos_${usuarioId}`, JSON.stringify(favoritos));
    // Después de guardar, actualiza el contador de favoritos
    actualizarCantidadFavoritos();
}

    function actualizarCantidadFavoritos() {
        const cantidadFavoritoElement = document.getElementById("cantidad-favorito");
        if (cantidadFavoritoElement) {
            const favoritos = obtenerFavoritosUsuario();
            cantidadFavoritoElement.textContent = favoritos.length;
        }
    }

    function obtenerProductoDesdeElemento(elemento) {
        return { id: elemento.dataset.productId };
    }



// Función para agregar productos a favoritos
function agregarAFavoritos(producto) {
    const favoritos = obtenerFavoritosUsuario() || [];

    // Verifica si el producto ya está en favoritos
    const productoExistente = favoritos.find((p) => p.id === producto.id);

    if (!productoExistente) {
        favoritos.push(producto);
        guardarFavoritosUsuario(favoritos);
        actualizarCantidadFavoritos();  // Agrega esta línea para actualizar el contador
    }
}
});