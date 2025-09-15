# Proyecto Tienda Virtual

Este es un proyecto académico de una **tienda virtual de celulares y computadores ** desarrollado con:

- **Backend:** Node.js + Express  
- **Base de datos:** MySQL  
- **Frontend:** HTML, CSS, JavaScript (con Bootstrap)  

Permite gestionar usuarios, autenticación, productos y un carrito de compras, con un panel de administrador.

---

## 📌 Requerimientos previos

- [Node.js](https://nodejs.org) v18 o superior  
- [MySQL](https://dev.mysql.com/downloads/) 8 o superior  
- Navegador web moderno (Chrome, Edge, Firefox)  
- Git (para clonar el proyecto)  

---

## Instalación y configuración

1. **Clonar el repositorio**  
   ```bash
   git clone https://github.com/Jania-3477/Palencia-Gomez-Jania-Yireth--Mondragon-Rios-Cindy-Lorena--Lucas-Gutierrez-Luis-Eduardo.git
   cd Projecto-Backend
Instalar dependencias

bash
Copiar código
npm install
Configurar variables de entorno
Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

ini
Copiar código
DB_HOST=localhost
DB_USER=root
DB_PASS=123456789
DB_NAME=tienda_virtual
PORT=5000
Cambia DB_USER y DB_PASS por los de tu MySQL local.

Importar la base de datos
Copia y ejecuta este script en MySQL (por ejemplo en phpMyAdmin o MySQL Workbench):

sql
Copiar código
-- Crear base y tablas
CREATE DATABASE IF NOT EXISTS tienda_virtual;
USE tienda_virtual;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  correo VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  rol ENUM('cliente','admin') DEFAULT 'cliente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  imagen VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuario administrador (correo: admin@correo.com / contraseña: admin123)
INSERT INTO usuarios (nombre, correo, password, rol)
VALUES (
  'Administrador',
  'admin@correo.com',
  '$2b$10$kKXe9zBx9nb0ZxvB0PWhx.6VPG1xOnpMdjvWjM1yKjqvRMI6e6F6G',
  'admin'
);
Iniciar el servidor

bash
Copiar código
node Server.js
Si todo salió bien, deberías ver:

bash
Copiar código
Servidor funcionando en http://localhost:5000 (API base: /api)
Abrir la aplicación
Ve a tu navegador y abre:
 http://localhost:5000

Usuarios de prueba
Administrador

Usuario: admin@correo.com

Contraseña: 123456

Redirige al Panel de Administrador

Cliente (registro desde la web)

Crea tu cuenta en la página principal.

Rol asignado automáticamente: cliente.

📂 Estructura del proyecto
bash
Copiar código
Projecto-Backend/
│── Server.js               # Servidor principal (Express)
│── db.js                   # Configuración de MySQL
│── routes/                 # Rutas API (productos, usuarios, auth, pedidos, contacto)
│── tienda_virtual/
│   └── public/             # Archivos frontend (HTML, CSS, JS)
│       └── js/app.js       # Lógica frontend
│── package.json            # Dependencias Node
│── .env                    # Variables de entorno (no se sube a GitHub)
🛠️ Herramientas utilizadas
Node.js

Express

MySQL + MySQL2

bcrypt (encriptación de contraseñas)

Bootstrap (frontend)

Git & GitHub

👥 Autores
Jania Yireth Palencia Gómez

Cindy Lorena Mondragón Ríos

Luis Eduardo Lucas Gutiérrez





