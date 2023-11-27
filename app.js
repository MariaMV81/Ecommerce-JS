const express = require("express");
const app = express();
const mysql = require("mysql2");
const { message } = require("prompt");

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

app.get("/", function (request, response){
  connection.query("select * fron productos", function (error, result, fields){
    handleSQLError(response, error, result, function (result){
      let total = request.query.total;
      let productos = [];

      for (let i = 0; i < total; i++){
        productos[i] = result[i];
      }

      response.send(productos);
    });
  });
});



app.listen(8000, () => {
  console.log("API up and running");
});
