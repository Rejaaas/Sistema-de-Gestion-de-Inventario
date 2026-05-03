

//parte login
const loginForm = document.getElementById('loginForm');


if (loginForm) {

    // cuando se activa el boton de entrar 
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); //  evita que la página se recargue al clicar


        const usernameInput = document.getElementById('username').value;
        const passwordInput = document.getElementById('password').value;
        const mensajeDiv = document.getElementById('mensaje');

        try {
            // hacemos la peticion post a nuestra api


            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: usernameInput,
                    password: passwordInput
                })

            });

            const data = await response.json();

            if (response.ok && data.success) {
                mensajeDiv.style.color = "green";

                mensajeDiv.textContent = `Bienvenido, ${data.user} ! Redirigiendo...`;
                // redireccion
                window.location.href = "panel.html";
            } else {
                mensajeDiv.style.color = "red";
                mensajeDiv.textContent = data.message;

            }

        } catch (error) {
            mensajeDiv.style.color = "red";
            mensajeDiv.textContent = 'Error al intentar conectar con el servidor.';
        }
    });
}


// parte crear usuario
const createUserForm = document.getElementById('createUserForm');


if (createUserForm) {


    createUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const newUserInput = document.getElementById('newusername').value;
        const newpasswordInput = document.getElementById('newpassword').value;
        const mensajeDiv = document.getElementById('mensaje');


        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newusername: newUserInput,
                    newpassword: newpasswordInput
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {

                mensajeDiv.style.color = "green";
                mensajeDiv.textContent = data.message;

                //vaciar 
                document.getElementById('newusername').value = '';
                document.getElementById('newpassword').value = '';
            } else {
                mensajeDiv.style.color = "red";
                mensajeDiv.textContent = data.message;
            }



        } catch {
            mensajeDiv.style.color = "red";
            mensajeDiv.textContent = 'Error al connectar con el servidor';
        }



    });
} //cierre  



//parte añadir productos
const addproductForm = document.getElementById('addProductoForm');

if (addproductForm) {
    addproductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombreInput = document.getElementById('prodNombre').value;
        const precioInput = document.getElementById('prodPrecio').value;
        const stockInput = document.getElementById('prodStock').value;
        const categoriaInput = document.getElementById('prodCategoria').value;
        const mensajeDiv = document.getElementById('mensajeProducto');

        try {
            const response = await fetch('/api/productos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombre: nombreInput,
                    precio: parseFloat(precioInput),
                    stock: parseInt(stockInput),
                    categoria_id: parseInt(categoriaInput)
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                mensajeDiv.style.color = "green";
                mensajeDiv.textContent = data.message;
                addproductForm.reset();
            } else {
                mensajeDiv.style.color = "red";
                mensajeDiv.textContent = data.message;
            }

        } catch (error) {
            mensajeDiv.style.color = "red";
            mensajeDiv.textContent = 'Error al conectar con el servidor.';
        }
    });
}


// parte mostrar todos los productos 


const cuerpoTablaProductos = document.getElementById('cuerpoTablaProductos');

if (cuerpoTablaProductos) {
    // funcion asincrona para pedir los datos
    const cargarProductos = async () => {
        try {
            //el camarero pide los productos 
            const response = await fetch('/api/productos'); // no hace falta decirle que es get pq por defecto ya lo es asi, si fuese post u otro si 
            const data = await response.json();





            if (response.ok && data.success) {
                cuerpoTablaProductos.innerHTML = ''; //vaciar mensaje cargando productos 

                if (data.productos.length === 0) {
                    cuerpoTablaProductos.innerHTML = `<tr><td colspan="5" style="text-align: center; padding: 20px; color: #ff7300;">No hay productos en la tienda.</td></tr>`;
                    return;
                }
                data.productos.forEach(producto => {
                    cuerpoTablaProductos.innerHTML += `
                    <tr style="border-bottom: 1px solid #333;">
                            <td style="padding: 10px;">${producto.id}</td>
                            <td style="padding: 10px; font-weight: bold;">${producto.nombre}</td>
                            <td style="padding: 10px; color: #4CAF50;">${producto.precio} €</td>
                            <td style="padding: 10px;">${producto.categoria}</td>
                            <td style="padding: 10px;">${producto.stock} uds.</td>
                        </tr>
                    `;
                });

            } else {
                cuerpoTablaProductos.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Error al cargar los datos</td></tr>`;
            }

        } catch (error) {
            console.error("EL ERROR SECRETO ES:", error);
            cuerpoTablaProductos.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Error de conexión con el servidor</td></tr>`;

        }
    };
    cargarProductos();

}



//  parte eliminar producto 

const deleteProductForm = document.getElementById('deleteProductForm');
if (deleteProductForm) {
    deleteProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const idInput = document.getElementById('deleteId').value;
        const nombreInput = document.getElementById('deleteNombre').value;
        const mensajeDiv = document.getElementById('mensajeDelete');

        if (!idInput && !nombreInput) {
            mensajeDiv.style.color = "red";
            mensajeDiv.textContent = "Escribe el ID o nombre del producto";
            return;
        }

        const confirmacion = confirm(`Estás seguro de que quieres borrar el producto?`);
        if (!confirmacion) return; // si clian  cancelar paramos



        try {
            const response = await fetch('/api/productos', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: idInput ? parseInt(idInput) : null,
                    nombre: nombreInput || null
                })



            });

            const data = await response.json();

            if (response.ok && data.success) {
                mensajeDiv.style.color = "green";
                mensajeDiv.textContent = data.message;
                deleteProductForm.reset();
            } else {
                mensajeDiv.style.color = "red";
                mensajeDiv.textContent = data.message;
            }
        } catch (error) {
            console.error("Error al eliminar:", error);
            mensajeDiv.style.color = "red";
            mensajeDiv.textContent = 'Error de conexión con el servidor.';
        }

    });
}



// parte actualizar producto 
const updateProductoForm = document.getElementById('updateProductoForm');

if (updateProductoForm) {
    updateProductoForm.addEventListener('submit', async (e) => {
        e.preventDefault();


        const idInput = document.getElementById('updId').value;


        const nombreInput = document.getElementById('updNombre').value;
        const precioInput = document.getElementById('updPrecio').value;
        const stockInput = document.getElementById('updStock').value;
        const categoriaInput = document.getElementById('updCategoria').value;

        const mensajeDiv = document.getElementById('mensajeUpdate');


        const confirmacion = confirm(` Vas a modificar el producto con ID ${idInput}. ¿Continuar?`);
        if (!confirmacion) return;

        try {
            const response = await fetch(`/api/productos/${idInput}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    //  si  no esta vacio ("") manda el dato formateado
                    // si esta vacio manda null 
                    nombre: nombreInput !== "" ? nombreInput : null,
                    precio: precioInput !== "" ? parseFloat(precioInput) : null,
                    stock: stockInput !== "" ? parseInt(stockInput) : null,
                    categoria_id: categoriaInput !== "" ? parseInt(categoriaInput) : null
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                mensajeDiv.style.color = "green";
                mensajeDiv.textContent = data.message;
                //vaciar formulario
                updateProductoForm.reset();
            } else {
                mensajeDiv.style.color = "red";
                mensajeDiv.textContent = data.message;
            }

        } catch (error) {
            console.error("Error al actualizar:", error);
            mensajeDiv.style.color = "red";
            mensajeDiv.textContent = 'Error de conexión con el servidor.';
        }
    });
}



// parte buscar producto por id 

const buscarproductoForm = document.getElementById('buscarProductoForm');

if (buscarproductoForm) {
    buscarproductoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const idABuscar = document.getElementById('buscarId').value;
        const tabla = document.getElementById('cuerpoTablaProducto');
        tabla.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #ff7300;">Buscando en la despensa...</td></tr>`;
        try {
            // nota, por defecto es el metodo get 
            const response = await fetch(`/api/productos/${idABuscar}`);
            const data = await response.json();

            if (response.ok && data.success) {

                const producto = data.producto;

                tabla.innerHTML = `
                    <tr style="border-bottom: 1px solid #333;">
                        <td style="padding: 10px;">${producto.id}</td>
                        <td style="padding: 10px; font-weight: bold;">${producto.nombre}</td>
                        <td style="padding: 10px; color: #4CAF50;">${producto.precio} €</td>
                        <td style="padding: 10px;">${producto.categoria}</td>
                        <td style="padding: 10px;">${producto.stock} uds.</td>
                    </tr>
                `;
            } else {
                // si no existe
                tabla.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">${data.message}</td></tr>`;
            }

        } catch (error) {
            console.error("Error al buscar por ID:", error);
            tabla.innerHTML = `<tr><td colspan="5" style="color:red; text-align:center;">Error de conexión con el servidor</td></tr>`;
        }

    });
}




