require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");


app.use("/", express.static(path.join(__dirname, "../frontend/dist")));
app.use("/*", (req, res) => { res.sendFile(path.join(__dirname, "../frontend/dist/index.html")) });


app.listen(process.env.PORT, () => {
    console.log(`Listening at http://localhost:${process.env.PORT}`)
})
