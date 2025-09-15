document.getElementById("productoForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const precio = document.getElementById("precio").value;
  const descripcion = document.getElementById("descripcion").value;

  try {
    const res = await fetch("http://localhost:3000/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, precio, descripcion }),
    });

    const data = await res.json();
    document.getElementById("mensaje").textContent = res.ok 
      ? "✅ Producto agregado correctamente"
      : `❌ Error: ${data.message}`;
  } catch {
    document.getElementById("mensaje").textContent = "⚠️ Error de conexión";
    
  }
});
