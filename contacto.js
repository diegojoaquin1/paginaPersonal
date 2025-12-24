import { db, auth } from "./firebase-config.js";
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const form = document.getElementById('formulario-contacto');
const contenedorMensajes = document.getElementById('contenedor-mensajes-nube');

onAuthStateChanged(auth, (user) => {
    if (user) {
        cargarMisMensajes(user.uid);
    } else {
        if(contenedorMensajes) contenedorMensajes.innerHTML = '<p>Inicia sesión para ver tu historial.</p>';
    }
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
        alert("Debes iniciar sesión para enviar un mensaje.");
        return;
    }

    const datos = {
        uid: user.uid, 
        nombre: document.getElementById('nombre-contacto').value,
        email: document.getElementById('email-contacto').value,
        mensaje: document.getElementById('mensaje-contacto').value,
        fecha: serverTimestamp()
    };

    try {
        await addDoc(collection(db, "mensajes"), datos);
        form.reset();
    } catch (error) {
        console.error("Error:", error);
    }
});

function cargarMisMensajes(uid) {
    const q = query(
        collection(db, "mensajes"), 
        where("uid", "==", uid), 
        orderBy("fecha", "desc")
    );

    onSnapshot(q, (snapshot) => {
        contenedorMensajes.innerHTML = '';
        
        if (snapshot.empty) {
            contenedorMensajes.innerHTML = '<p style="text-align:center; color:#666;">No hay mensajes en tu historial.</p>';
            return;
        }

        snapshot.forEach((snapshotDoc) => {
            const data = snapshotDoc.data();
            const idMensaje = snapshotDoc.id; 
            const fecha = data.fecha ? data.fecha.toDate().toLocaleString() : "Enviando...";

            const div = document.createElement('div');
            div.className = 'cuadro-info'; 
            div.style.marginBottom = "15px";
            div.style.position = "relative"; 
            
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="color:#00ff41; font-size:0.8rem;">Enviado el: ${fecha}</span>
                    <button class="btn-borrar" data-id="${idMensaje}" 
                            style="background:none; border:none; color:#ff4d4d; cursor:pointer; font-size:1.2rem; font-weight:bold;">
                        &times;
                    </button>
                </div>
                <p style="margin-top:10px; color:#fff;">${data.mensaje}</p>
            `;
            contenedorMensajes.appendChild(div);
        });

        const botonesBorrar = document.querySelectorAll('.btn-borrar');
        botonesBorrar.forEach(boton => {
            boton.onclick = async (e) => {
                const id = e.target.getAttribute('data-id');
                if (confirm("¿Deseas eliminar este mensaje de tu historial?")) {
                    try {
                        await deleteDoc(doc(db, "mensajes", id));
                    } catch (error) {
                        console.error("Error al borrar:", error);
                    }
                }
            };
        });
    });
}