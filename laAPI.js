
require('dotenv').config();

//configuración express
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3000;


//configuración de la connexion a la base de datos 

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

//middlewares
/* un middlewares es una funcion que se ejecuta en medio del proceso entre que llega la peticion request y se envia una respuesta respone*/
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // 

//Ruta POST para procesar el login
// req lo que entra, usuario y contraseña
// res lo que se devuelve, pasa o contraseña incorrecta



// parte iniciar sesion
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    // consulta a la base de datos para verificar si el usuario y contraseña coinciden
    const query = 'SELECT * FROM users WHERE username = ?';

    db.query(query, [username], async (err, results) => {

        if (err) {
            console.error('ERROR al consultar la base de datos:', err);
            return res.status(500).json({ error: 'ERROR interno del servidor' });

        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrecta' });
        }

        const user = results[0];

        //comparación
        const passwordCorrecta = await bcrypt.compare(password, user.password);

        // si  encuentra coincidencia,
        if (passwordCorrecta) {
            res.json({ success: true, message: 'Login exitoso', user: results[0].username });
        } else {
            res.status(401).json({ succes: false, message: 'Usuario o contraseña incorrecta' });

        }
    });

});

// parte crear usuarios
// () nombre de la  nueva "ventanilla"
app.post('/api/register', async (req, res) => {

    const { newusername, newpassword } = req.body;
    const passwordHasheada = await bcrypt.hash(newpassword, 10);
    // consulta para meter un nuevo usuario 
    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

    db.query(query, [newusername, passwordHasheada], (err, results) => {
        if (err) {
            console.error('ERROR al crear el usuario', err);
            return res.status(500).json({ success: false, message: 'Error al crear el usuario' });

        }

        res.json({ success: true, message: '¡Usuario creado correctamente!' });

    });


});// cierre.post




//parte añadir producto 
app.post('/api/productos', (req, res) => {
    //recibir los datos 
    const { nombre, precio, stock, categoria_id } = req.body;

    //consulta a la base de datos
    const query = 'INSERT INTO productos (nombre, precio, stock, categoria_id) VALUES(?,?,?,?)';

    //ejecutamos la consulta
    db.query(query, [nombre, precio, stock, categoria_id], (err, results) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            return res.status(500).json({ success: false, message: 'Error interno al guardar el producto' });
        }
        res.json({ success: true, message: 'Producto añadido con éxito!' });
    });
});//cierre post;//cierre post



// parte  ver productos 
app.get('/api/productos', (req, res) => {

    //ejecutar sonsulta
    const query = `
        SELECT p.id, p.nombre, p.precio, p.stock, c.nombre AS categoria
        FROM productos p
        INNER JOIN categorias c on c.id = p.categoria_id
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.log('Error al mostrar productos: ', err);
            return res.status(500).json({ success: false, message: 'Error interno al cargar productos' });
        }

        res.json({ success: true, productos: results });
    });



});

//parte eliminar productos
app.delete('/api/productos', (req, res) => {
    const { id, nombre } = req.body;

    let query = '';
    let parametro = [];

    if (id) {
        query = 'DELETE FROM productos where id = ?';
        parametro = [id]; // <-- ¡Metido en un array!
    } else if (nombre) {
        query = 'DELETE FROM productos where nombre = ?';
        parametro = [nombre];
    } else {
        return res.status(400).json({ success: false, message: 'Debes proporcionar un ID o un Nombre' });
    }

    db.query(query, parametro, (err, results) => {
        if (err) {

            console.error('Error al eliminar producto:', err);
            return res.status(500).json({ success: false, message: 'Error interno al intentar eliminar' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No se encontró ningún producto con esos datos' });
        }
        res.json({ success: true, message: '¡Producto eliminado con éxito! 🗑️' });
    });



});



//parte modificar producto:

app.put('/api/productos/:id', (req, res) => {
    const productoId = req.params.id;


    const { nombre, precio, stock, categoria_id } = req.body; // nuevos datos


    //coalesce hace que si hay un dato lo usa si no deja el que hay
    const query = `
        UPDATE productos 
        SET 
            nombre = COALESCE(?, nombre), 
            precio = COALESCE(?, precio), 
            stock = COALESCE(?, stock), 
            categoria_id = COALESCE(?, categoria_id) 
        WHERE id = ?
    `;
    db.query(query, [nombre, precio, stock, categoria_id, productoId], (err, results) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            return res.status(500).json({ success: false, message: 'Error interno al actualizar' });
        }


        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'No se ha encontrado un producto con ese ID' });
        }

        res.json({ success: true, message: '¡Producto actualizado correctamente! ✏️' });
    });

});



// parte buscar producto por id 

app.get('/api/productos/:id', (req, res) => {
    const productoId = req.params.id;

    const query = `
        SELECT p.id, p.nombre, p.precio, p.stock, c.nombre AS categoria
        FROM productos p
        INNER JOIN categorias c on c.id = p.categoria_id
        WHERE p.id = ?
    `;

    //ejecutar consulta 

    db.query(query, [productoId], (err, results) => {
        if (err) {
            console.log('Error al buscar producto:', err);
            return res.status(500).json({ success: false, message: 'Error interno al buscar el producto' });
        }


        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No existe ningún producto con ese ID' });
        }


        res.json({ success: true, producto: results[0] });
    });
});








//inicia el servidor

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});