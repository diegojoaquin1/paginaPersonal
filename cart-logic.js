import { db, auth } from "./firebase-config.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


export async function sincronizarCarrito(carritoLocal) {
    const user = auth.currentUser;
    
    if (!user) {
        console.warn("Intento de sincronización sin usuario autenticado.");
        return;
    }

    try {
        const carritoRef = doc(db, "carritos", user.uid);
        
        await setDoc(carritoRef, {
            productos: carritoLocal,
            ultimaActualizacion: serverTimestamp(),
            emailUsuario: user.email
        }, { merge: true }); 

        console.log("✅ Carrito guardado en la nube para:", user.email);
    } catch (error) {
        console.error("❌ Error al sincronizar con Firebase:", error);
    }
}

export async function cargarCarritoDeNube() {
    const user = auth.currentUser;
    if (!user) return [];

    try {
        const docRef = doc(db, "carritos", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            console.log("📦 Carrito recuperado con éxito");
            return docSnap.data().productos || [];
        }
    } catch (error) {
        console.error("❌ Error al obtener el carrito:", error);
    }
    return [];
}