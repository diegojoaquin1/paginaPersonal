import { auth } from "./firebase-config.js";
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const authStatus = document.getElementById("auth-status");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const btn = document.getElementById("btn-registrar");

        try {
            btn.innerText = "Cargando...";
            btn.disabled = true;
            await createUserWithEmailAndPassword(auth, email, password);
            alert("¡Cuenta creada con éxito!");
            window.location.href = "index.html";
        } catch (error) {
            btn.innerText = "Registrarse";
            btn.disabled = false;
            console.error("Error de Firebase:", error.code);
            alert("Error: " + error.message);
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "index.html";
        } catch (error) {
            alert("Usuario o contraseña incorrectos");
        }
    });
}

onAuthStateChanged(auth, (user) => {
    if (user && authStatus) {
        const name = user.email.split('@')[0];
        authStatus.innerHTML = `
            <div id="auth-container">
                <span class="user-welcome">⚽ Hola, ${name}</span>
                <a href="#" id="logout-btn" class="btn-logout">Salir</a>
            </div>
        `;

        document.getElementById("logout-btn").addEventListener("click", (e) => {
            e.preventDefault();
            signOut(auth).then(() => window.location.reload());
        });
    }
});