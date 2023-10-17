const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const routes = require("./router/routes");

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use(bodyParser.json());
app.use("/", routes);
app.use("/book", routes);
app.use('/public', express.static(__dirname + '/public'));

app.listen(3000, () => {
    console.log(`Сервер начинает прослушивать порт 3000!`)
});