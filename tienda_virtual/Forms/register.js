document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await res.json();
    document.getElementById("mensaje").textContent = res.ok 
      ? "✅ Usuario registrado con éxito"
      : `❌ Error: ${data.message}`;
  } catch {
    document.getElementById("mensaje").textContent = "⚠️ Error de conexión";
    
  }
});
