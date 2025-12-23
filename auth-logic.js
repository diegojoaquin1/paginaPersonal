const loginForm = document.getElementById("login-form");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            console.log("Intentando entrar...");
            await signInWithEmailAndPassword(auth, email, password);
            alert("¡Bienvenido!");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Error completo:", error);
            alert("Credenciales incorrectas o error de conexión.");
        }
    });
}