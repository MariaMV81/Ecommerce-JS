let express = require("express");
let mysql = require("mysql2");
const { message } = require("prompt");
const app = express();

app.use("/",express.static("public"));
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


// app.get("/hola", (request, response) => {
//   response.send({ message: "hello World" });
// });

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

// Obtener todos los productos desde la BBDD
app.get("/productos", function (request, response) {
  const total = request.query.total || 6;
  connection.query(`select * from productos LIMIT ${total}` , function (error, result, fields) {
    handleSQLError(response, error, result, function (result) {

      response.send(result);
    });
  });
});

app.get("/productos/:idproducto", function (request, response) {
  const idproducto = request.params.idproducto;

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






app.listen(8000, () => {
  console.log("API up and running");
});
