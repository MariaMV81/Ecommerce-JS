let express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/hola", (request, response) => {
  response.send({ message: "hello World" });
});

app.listen(8000, () => {
  console.log("API up and running");
});
