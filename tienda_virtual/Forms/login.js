document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    document.getElementById("mensaje").textContent = res.ok 
      ? "✅ Bienvenido!"
      : `❌ Error: ${data.message}`;
  } catch {
    document.getElementById("mensaje").textContent = "⚠️ Error de conexión";
  }
});
