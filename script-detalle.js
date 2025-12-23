document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productoId = urlParams.get('id');

    const datosProductos = {
        "chimpunes-adidas": {
            "nombre": "Chimpunes Adidas Predator",
            "precio": "100.00 PEN",
            "descripcion": "Domina el juego con los nuevos Adidas Predator. Diseñados para ofrecer un control superior del balón y una tracción inigualable en el campo.",
            "imagen": "imagenes/calzado_1.png"
        },
        "balon-elite": {
            "nombre": "Balón Elite N5",
            "precio": "80.00 PEN",
            "descripcion": "Balón profesional de alta resistencia, ideal para competencias oficiales y entrenamientos intensos.",
            "imagen": "imagenes/balon_1.png"
        },
        "camiseta-barcelona": {
            "nombre": "Camiseta FC Barcelona 2023",
            "precio": "129.00 PEN",
            "descripcion": "Camiseta oficial del FC Barcelona para la temporada 2023, confeccionada con materiales de alta calidad para mayor comodidad.",
            "imagen": "imagenes/camiseta_1.webp" 
        }
    };

    const info = datosProductos[productoId];

    if (info) {
        document.getElementById('titulo-producto').textContent = info.nombre;
        document.getElementById('precio-producto').textContent = info.precio;
        document.getElementById('desc-producto').textContent = info.descripcion;
        document.getElementById('foto-producto').src = info.imagen;
        document.getElementById('foto-producto').alt = info.nombre;
        document.title = info.nombre + " | Goal Temple";
    } else {
        const contenedor = document.querySelector('.detalle-contenedor');
        if (contenedor) {
            contenedor.innerHTML = `
                <div style="text-align:center; padding: 50px;">
                    <h2 style="color:var(--accent-color); font-size: 2rem;">PRODUCTO NO ENCONTRADO</h2>
                    <p style="margin: 20px 0;">Verifica que el enlace sea correcto.</p>
                    <a href="Inicio.html" style="color:var(--accent-color); text-decoration: underline;">Volver al inicio</a>
                </div>
            `;
        }
    }
});