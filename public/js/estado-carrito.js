// Importar la función desde app.js
const { obtenerNuevoEstadoDelCarrito } = require('./app');

// Luego puedes usar la función
const idUsuario = 123; // Coloca el valor adecuado
const carrito = []; // Coloca el carrito adecuado
const nuevoEstadoCarrito = obtenerNuevoEstadoDelCarrito(carrito, idUsuario);
console.log("Nuevo estado del carrito:", nuevoEstadoCarrito);
