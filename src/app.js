const express = require("express");
require("./db/mongoose");
const videoRouter = require("./routers/video");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const viewsPath = path.join(__dirname, "/../views");
const publicDirectoryPath = path.join(__dirname, "../public");

app.set("view engine", "ejs");
app.set("views", viewsPath);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(videoRouter);
app.use(express.static(publicDirectoryPath));

module.exports = app;
