let express = require("express");
let mysql = require("mysql2");
const { message } = require("prompt");
const app = express();

app.use("/", express.static("public"));
app.use(express.json());

// crear conexion con mysql
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "08886544Mj",
  database: "ecommerce_js",
});

// conectar con mysql
connection.connect(function (error) {
  if (error) {
    return console.error(`error: ${error.message}`);
  }

  console.log("Conectado a MySQL!!!");
});




/**
 * Funciones utiles ------------------------------------------------------------------------------------
 */

function handleSQLError(response, error, result, callback) {
  if (error) {
    response.status(400).send(`error: ${error.message}`);

    return;
  }

  callback(result);
}



/**
 * ENDPOINTS------------------------------------------------------------------------
 */

/**
 * CARRITO---------------------------------------------------------------------------
 */

// Obtener todos los productos desde la BBDD
app.get("/productos", function (request, response) {
  const total = request.query.total || 6;
  connection.query(`select * from productos LIMIT ${total}`, function (error, result, fields) {
    handleSQLError(response, error, result, function (result) {

      response.send(result);
    });
  });
});

// Ruta para agregar productos al carrito /*****Aquí lo mismo deberia ir un get****** */
app.post("/productos/:id_producto", function (request, response) {
  const idproducto = request.params.id_producto;

  connection.query(
    `select * from productos where id = ${idproducto}`,
    function (error, result, fields) {
      handleSQLError(response, error, result, function (result) {
        if (result.length == 0) {
          response.send({});
        } else {
          response.send(result[0]);
        }
      });
    }
  );
});


// Ruta para sincronizar el carrito con el servidor
app.post("/carrito", function (request, response) {
  const carrito = request.body.carrito;
  // const idUsuario = obtenerIdUsuarioDesdeSesion(request);

  // Inicia una transacción para garantizar la consistencia en las actualizaciones
  connection.beginTransaction(function (err) {
    if (err) {
      throw err;
    }

    // Actualiza la tabla de compras (o crea una nueva compra si no existe)
    // connection.query(
    //   "INSERT INTO compras (id_usuario, direccion_envio, n_tarjeta, precio_final) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE direccion_envio = VALUES(direccion_envio), n_tarjeta = VALUES(n_tarjeta), precio_final = VALUES(precio_final)",
    //   [idUsuario, "", "", 0], 
    //   function (error, result, fields) {
    //     if (error) {
    //       return connection.rollback(function () {
    //         throw error;
    //       });
    //     }

    //     const idCompra = result.insertId || result[0].id;

    // Elimina los productos existentes de la compra en compras_productos
    //     connection.query(
    //       "DELETE FROM compras_productos WHERE id_compra = ?",
    //       [idCompra],
    //       function (error, result, fields) {
    //         if (error) {
    //           return connection.rollback(function () {
    //             throw error;
    //           });
    //         }

    //         // Inserta los nuevos productos en compras_productos
    //         const productosValues = carrito.map((producto) => [
    //           idCompra,
    //           producto.id,
    //           producto.cantidad,
    //           producto.precio,
    //         ]);

    //         connection.query(
    //           "INSERT INTO compras_productos (id_compra, id_producto, cantidad, precio) VALUES ?",
    //           [productosValues],
    //           function (error, result, fields) {
    //             if (error) {
    //               return connection.rollback(function () {
    //                 throw error;
    //               });
    //             }

    //             // Commit la transacción si todo fue exitoso
    //             connection.commit(function (err) {
    //               if (err) {
    //                 return connection.rollback(function () {
    //                   throw err;
    //                 });
    //               }

    //               // Después de actualizar el carrito en la base de datos, puedes devolver el nuevo estado
    //               response.json({ carrito: carrito });
    //             });
    //           }
    //         );
    //       }
    //     );
    //   }
    // );
  });
});


function actualizarCarritoEnBaseDeDatos(idUsuario, carrito) {
  // Conecta con la base de datos y actualiza el carrito para el usuario dado
  const query = `UPDATE carrito SET productos = ? WHERE idUsuario = ?`;
  const valores = [JSON.stringify(carrito), idUsuario];

  // Ejecuta la consulta
  connection.query(query, valores, function (error, result) {
    if (error) {
      console.error(
        "Error al actualizar el carrito en la base de datos:",
        error
      );
      // Maneja el error según tus necesidades
    } else {
      console.log("Carrito actualizado en la base de datos:", result);
    }
  });

  // Devuelve el nuevo estado del carrito
  return carrito;
}


// Exportar la función para que pueda ser usada en otros archivos
module.exports = {
  actualizarCarritoEnBaseDeDatos,
};

// Definir la función obtenerNuevoEstadoDelCarrito
function obtenerNuevoEstadoDelCarrito(carrito, idUsuario) {
  const nuevoEstadoCarrito = actualizarCarritoEnBaseDeDatos(idUsuario, carrito);
  return nuevoEstadoCarrito;
}

// Exportar la función
module.exports = {
  obtenerNuevoEstadoDelCarrito,
};





/**
 * REGISTRO USUARIOS---------------------------------------------------------------------------
 */

app.post("/login", function (request, response) {

  console.log("Datos recibidos:", request.body);

  const email = request.body.email;
  const contraseña = request.body.contraseña;

  connection.query(
    "SELECT * FROM usuarios WHERE email = ? AND contraseña = ?",
    [email, contraseña],
    function (error, result, field) {
      handleSQLError(response, error, result, function (result) {
        console.log(result);

        if (result.length == 0) {
          response.send({ message: "Email o password no validos" });
        } else {
          response.send({ message: "Usuario logueado", nombreUsuario: result[0].nombre });
        }
      });
    }
  )
    });
  



app.post("/registro", function (request, response) {
  let nombre = request.body.nombre;
  let apellidos = request.body.apellidos;
  let email = request.body.email;
  let contraseña = request.body.contraseña;

  const nombreCliente = nombre;
  // 1. Insertar un nuevo usuario en la tabla usuarios
  connection.query(
    "INSERT INTO usuarios (nombre, apellidos, email, contraseña) VALUES (?, ?, ?, ?)",
    [nombre, apellidos, email, contraseña],
    function (error, result, fields) {
      if (error) {
        console.error(error);
        response.status(500).send("Error al crear el usuario");
        return;
      }

      console.log("Usuario Insertado");

      // 2. Seleccionar desde usuarios el id que hemos creado
      connection.query(
        `SELECT id FROM usuarios WHERE email = '${email}'`,
        function (error, result, fields) {
          if (error) {
            console.error(error);
            response.status(500).send("Error al obtener el ID del usuario");
            return;
          }

          const usuarioid = result[0].id;

          // 3. Insertar en la tabla empleados_clientes el id del nuevo usuario creado
          // connection.query(
          //   "INSERT INTO empleados_clientes (nombre, apellidos,  dni, email, contraseña) VALUES (?, ?, ?, ?, ?)", //? marcador de posicion: especifica los valores que se van a insertar, en lugar de valores concretos
          //   [nombre, apellidos, dni, email, contraseña], //valores reales que se insertaran en esta columna se pasan como array en el segundo argumento de la función y sonn las variables que hemos declarado al principio
          //   function (error, result, fields) {
          //     if (error) {
          //       console.error(error);
          //       response
          //         .status(500)
          //         .send(
          //           "Error al insertar en la tabla empleados_clientes: " +
          //           error.message
          //         );
          //       return; 
          //     }

          //     console.log("Registro completado");
          //     response.send({ message: "registro" });
          //   }
          // );

          response.send({ message: "Usuario registrado correctamente", nombreCliente });
        }
      );
    }
  );
});




app.listen(8000, () => {
  console.log("API up and running");
});
