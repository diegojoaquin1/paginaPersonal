import { auth } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- ELEMENTOS DEL DOM ---
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authStatus = document.getElementById("auth-status");

// --- FUNCIONALIDAD: INICIAR SESIÓN ---
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault(); // Evita que la página se refresque y se borren los datos
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const btn = loginForm.querySelector("button");

        try {
            btn.innerText = "Ingresando...";
            btn.disabled = true;

            await signInWithEmailAndPassword(auth, email, password);
            alert("¡Bienvenido a Goal Temple!");
            window.location.href = "index.html"; // Redirige al inicio
        } catch (error) {
            btn.innerText = "Ingresar";
            btn.disabled = false;
            console.error("Error de login:", error.code);
            alert("Error: Usuario o contraseña incorrectos.");
        }
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const btn = document.getElementById("btn-registrar");

        try {
            btn.innerText = "Creando cuenta...";
            btn.disabled = true;

            await createUserWithEmailAndPassword(auth, email, password);
            alert("¡Cuenta creada con éxito!");
            window.location.href = "index.html";
        } catch (error) {
            btn.innerText = "Registrarse";
            btn.disabled = false;
            if (error.code === 'auth/email-already-in-use') {
                alert("Este correo ya está registrado.");
            } else {
                alert("Error: " + error.message);
            }
        }
    });
}

// --- PERSISTENCIA: DETECTAR USUARIO LOGUEADO ---
onAuthStateChanged(auth, (user) => {
    if (user && authStatus) {
        // Si el usuario está dentro, cambiamos el botón de "Login" por su nombre y "Salir"
        authStatus.innerHTML = `
            <span style="color: white; margin-right: 10px;">Hola, ${user.email.split('@')[0]}</span>
            <a href="#" id="logout-btn" style="color: #ff4d4d;">Cerrar Sesión</a>
        `;

        document.getElementById("logout-btn").addEventListener("click", (e) => {
            e.preventDefault();
            signOut(auth).then(() => {
                alert("Sesión cerrada.");
                window.location.reload();
            });
        });
    }
});