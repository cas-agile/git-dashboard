require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const passport = require("passport");
const session = require("express-session");
var fs = require("fs");
const mongoose = require("mongoose");

const gitlab_sso_router = require("./routes/gitlab_sso");
const git_router = require("./routes/git");
const gitinspector_router = require("./routes/gitinspector");

app.use(express.json());

app.use(session({ 
    resave: false,
    saveUninitialized: true,
    secret: "secret" 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", gitlab_sso_router);
app.use("/api", git_router);
app.use("/api", gitinspector_router);

app.use("/", express.static(path.join(__dirname, "../frontend/dist")));
app.use("/*", (req, res) => { res.sendFile(path.join(__dirname, "../frontend/dist/index.html")) });


if (!fs.existsSync(process.env.TMP_DIR)){ fs.mkdirSync(process.env.TMP_DIR); }

async function main() {
    await mongoose.connect(process.env.MONGO_URL);

    app.listen(process.env.PORT, () => {
        console.log(`Listening at ${process.env.PUBLIC_URL}`);
    });
}

main();