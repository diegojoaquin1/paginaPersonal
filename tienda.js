function ajustarCantidad(boton, cambio) {
    const contenedor = boton.parentElement;
    const input = contenedor.querySelector('input');
    let valorActual = parseInt(input.value);
    
    valorActual += cambio;
    
    if (valorActual < 1) valorActual = 1;
    input.value = valorActual;
}

function agregarAlCarrito(productoId, boton) {
    const tarjeta = boton.closest('.tarjeta-producto');
    const cantidad = tarjeta.querySelector('input').value;
    
    alert(`Has añadido ${cantidad} unidad(es) de ${productoId} al carrito.`);
    
}