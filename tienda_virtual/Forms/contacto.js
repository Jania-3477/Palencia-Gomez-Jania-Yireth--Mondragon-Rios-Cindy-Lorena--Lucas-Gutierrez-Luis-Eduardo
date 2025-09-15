document.getElementById("contactoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const mensaje = document.getElementById("mensajeTexto").value;

  try {
    const res = await fetch("http://localhost:3000/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, mensaje }),
    });

    const data = await res.json();
    document.getElementById("mensaje").textContent = res.ok 
      ? "✅ Mensaje enviado correctamente"
      : `❌ Error: ${data.message}`;
  } catch {
    document.getElementById("mensaje").textContent = "⚠️ Error de conexión";
  }
});
