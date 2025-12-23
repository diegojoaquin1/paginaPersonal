import { auth } from "./firebase-config.js";
import { sincronizarCarrito, cargarCarritoDeNube } from "./cart-logic.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let carritoLocal = [];

onAuthStateChanged(auth, async (user) => {
    if (user) {
        carritoLocal = await cargarCarritoDeNube();
        console.log("Carrito recuperado para el usuario activo");
    }
});

window.ajustarCantidad = function(boton, cambio) {
    const input = boton.parentElement.querySelector('input');
    let valor = parseInt(input.value) + cambio;
    if (valor < 1) valor = 1;
    input.value = valor;
}

window.agregarAlCarrito = async function(productoId, boton) {
    const tarjeta = boton.closest('.tarjeta-producto');
    const cantidad = parseInt(tarjeta.querySelector('input').value);
    const nombre = tarjeta.querySelector('h3').innerText;

    const nuevoItem = { id: productoId, nombre, cantidad };

    carritoLocal.push(nuevoItem);
    await sincronizarCarrito(carritoLocal);

    alert(`Añadido: ${cantidad}x ${nombre}`);
}