# **API de Gestión de Inventario - Tienda de Pádel**

## Características Principales


*   **Gestión de Productos (CRUD):** El sistema cuenta con una interfaz web que interactúa asíncronamente con la API para permitir la consulta, alta, modificación y eliminación de los productos del inventario.

*   **Autenticación y Seguridad:** El acceso al panel principal de administración está restringido mediante un sistema  Login.

*   **Registro Seguro:** Se ha implementado un menú de registro para nuevos usuarios. Las credenciales están protegidas: las contraseñas nunca se almacenan en texto plano en la base de datos, sino que se guarda el  hash criptográfico utilizando  `bcrypt`.

*   **Variables de Entorno:** Toda la configuración sensible (conexión a BBDD, puertos) se ha aislado en un archivo `.env` por seguridad, es decir que no se tiene en texto plano ninguno de los datos.

## Tecnologías Utilizadas

* **Backend:** Node.js, Express
* **Base de Datos:** MySQL
* **Frontend:** HTML5, CSS3, JavaScript
* **Seguridad:** bcrypt, dotenv


## Estructura del proyecto

```text
API-Padel/
 ┣ documentacion/
 ┣ public/
 ┃ ┣ actions/
 ┃ ┃ ┣ delete-eliminar-producto.html
 ┃ ┃ ┣ get-buscar-por-id.html
 ┃ ┃ ┣ get-mostrar-productos.html
 ┃ ┃ ┣ post-añadir-producto.html
 ┃ ┃ ┣ put-modificar-producto.html
 ┃ ┃ ┗ styles-actions.css
 ┃ ┣ css/
 ┃ ┣ create-user.html
 ┃ ┣ index.html
 ┃ ┣ panel.html
 ┃ ┗ script.js
 ┣ .env
 ┣ .gitignore
 ┣ laAPI.js
 ┗ package.json

## Futuras mejoras

- tokens para mantener  sesión iniciada 
- añadir imagen por producto
- implementar el patrón MVC (Modelo-Vista-Controlador) routes controlers models
- migrar a servidor 
