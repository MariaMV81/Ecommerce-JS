


function agregarAFavoritos(producto) {
    const favoritos = obtenerFavoritosDesdeLocalStorage() || [];

    // Verifica si el producto ya está en favoritos
    const productoExistente = favoritos.find((p) => p.id === producto.id);

    if (!productoExistente) {
        favoritos.push(producto);
        guardarFavoritosEnLocalStorage(favoritos);
        actualizarCantidadFavoritos();
    }
}

function obtenerFavoritosDesdeLocalStorage() {
    const favoritosEnLocalStorage = JSON.parse(localStorage.getItem("favoritos"));
    return favoritosEnLocalStorage || [];
}

function guardarFavoritosEnLocalStorage(favoritos) {
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function actualizarCantidadFavoritos() {
    const cantidadFavoritoElement = document.getElementById("cantidad-favorito");
    if (cantidadFavoritoElement) {
        const favoritos = obtenerFavoritosDesdeLocalStorage();
        cantidadFavoritoElement.textContent = favoritos.length;
    }
}
