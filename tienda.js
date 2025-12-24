import { auth } from "./firebase-config.js";
import { sincronizarCarrito, cargarCarritoDeNube } from "./cart-logic.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let carritoLocal = [];

const modal = document.getElementById('cart-modal');
const btnAbrirCarrito = document.getElementById('cart-toggle');
const contenedorItems = document.getElementById('cart-items-container');
const contadorVisual = document.getElementById('cart-count');

onAuthStateChanged(auth, async (user) => {
    if (user) {
        carritoLocal = await cargarCarritoDeNube();
        actualizarInterfaz();
        console.log("Carrito sincronizado para:", user.email);
    }
});

if (btnAbrirCarrito) {
    btnAbrirCarrito.onclick = () => {
        renderizarListaCarrito();
        modal.style.display = "block";
    };
}

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
};

// 3. Funciones Globales para el HTML
window.ajustarCantidad = function(boton, cambio) {
    const input = boton.parentElement.querySelector('input');
    let valor = parseInt(input.value) + cambio;
    if (valor < 1) valor = 1;
    input.value = valor;
};

window.agregarAlCarrito = async function(productoId, boton) {
    const tarjeta = boton.closest('.tarjeta-producto'); 
    const cantidad = parseInt(tarjeta.querySelector('input').value);
    const nombre = tarjeta.querySelector('h3').innerText;
    const precio = tarjeta.querySelector('.precio').innerText;

    const nuevoItem = { id: productoId, nombre, cantidad, precio };

    carritoLocal.push(nuevoItem);
    
    await sincronizarCarrito(carritoLocal);
    actualizarInterfaz();
    alert(`Añadido: ${cantidad}x ${nombre}`);
};

window.eliminarDelCarrito = async function(index) {
    carritoLocal.splice(index, 1);
    await sincronizarCarrito(carritoLocal); 
    actualizarInterfaz();
    renderizarListaCarrito();
};

// 5. Funciones de Interfaz
function actualizarInterfaz() {
    if (contadorVisual) {
        contadorVisual.innerText = carritoLocal.length;
    }
}

function renderizarListaCarrito() {
    if (!contenedorItems) return;
    contenedorItems.innerHTML = '';

    if (carritoLocal.length === 0) {
        contenedorItems.innerHTML = '<p style="text-align:center;">Tu carrito está vacío.</p>';
        return;
    }

    carritoLocal.forEach((prod, index) => {
        const item = document.createElement('div');
        item.className = 'item-carrito-lista';
        item.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #444; padding-bottom:5px;">
                <span>${prod.cantidad}x ${prod.nombre}</span>
                <span>${prod.precio}</span>
                <button onclick="eliminarDelCarrito(${index})" style="background:red; color:white; border:none; cursor:pointer; padding:2px 8px;">X</button>
            </div>
        `;
        contenedorItems.appendChild(item);
    });
}