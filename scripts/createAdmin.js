// scripts/createAdmin.js
// Ejecutar: node scripts/createAdmin.js admin@example.com 123456 "Admin Name"

const db = require('../db');      // <- se resuelve desde scripts/, apunta a root/db.js
const bcrypt = require('bcryptjs');

async function run() {
  const email = process.argv[2];
  const pass = process.argv[3] || '123456';
  const nombre = process.argv[4] || 'Administrador';

  if (!email) {
    console.error('Uso: node scripts/createAdmin.js admin@example.com 123456 "Admin Name"');
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(pass, 10);
    const [rows] = await db.query('SELECT id FROM usuarios WHERE correo = ?', [email]);

    if (rows && rows.length > 0) {
      // actualizar a admin y setear password
      await db.query('UPDATE usuarios SET nombre = ?, password = ?, rol = ? WHERE correo = ?', [nombre, hash, 'admin', email]);
      console.log('✅ Usuario existente actualizado como admin:', email);
    } else {
      await db.query('INSERT INTO usuarios (nombre, correo, password, rol) VALUES (?, ?, ?, ?)', [nombre, email, hash, 'admin']);
      console.log('✅ Usuario admin creado:', email);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error scripts/createAdmin:', err);
    process.exit(2);
  }
}

run();
