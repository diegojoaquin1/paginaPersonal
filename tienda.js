import { auth } from "./firebase-config.js";
import { sincronizarCarrito, cargarCarritoDeNube } from "./cart-logic.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let carritoLocal = [];

const modal = document.getElementById('cart-modal');
const btnAbrirCarrito = document.getElementById('cart-toggle');
const contenedorItems = document.getElementById('cart-items-container');
const contadorVisual = document.getElementById('cart-count');
const totalElemento = document.getElementById('cart-total'); 

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

function actualizarInterfaz() {
    if (contadorVisual) {
        contadorVisual.innerText = carritoLocal.length;
    }
}

function renderizarListaCarrito() {
    if (!contenedorItems) return;
    contenedorItems.innerHTML = '';
    let sumaTotal = 0;

    if (carritoLocal.length === 0) {
        contenedorItems.innerHTML = '<p style="text-align:center; padding:20px;">Tu carrito está vacío.</p>';
        if (totalElemento) totalElemento.innerText = "0.00";
        return;
    }

    carritoLocal.forEach((prod, index) => {
        const precioLimpio = parseFloat(prod.precio.replace(/[^0-9.-]+/g, ""));
        const subtotal = precioLimpio * prod.cantidad;
        sumaTotal += subtotal;

        const item = document.createElement('div');
        item.className = 'item-carrito-lista';
        item.innerHTML = `
            <div style="display:grid; grid-template-columns: 2fr 1fr 40px; align-items:center; margin-bottom:15px; border-bottom:1px solid #333; padding-bottom:10px;">
                <span style="color: #ffcc00; font-weight: bold;">${prod.cantidad}x ${prod.nombre}</span>
                <span style="text-align: right; color: #fff;">${subtotal.toFixed(2)} PEN</span>
                <button onclick="eliminarDelCarrito(${index})" 
                        style="background:#ff4d4d; color:white; border:none; border-radius:4px; cursor:pointer; margin-left:10px; padding:5px;">
                    X
                </button>
            </div>
        `;
        contenedorItems.appendChild(item);
    });

    if (totalElemento) {
        totalElemento.innerText = sumaTotal.toFixed(2);
    }
}
