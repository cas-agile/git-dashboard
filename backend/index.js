require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const passport = require("passport");
const session = require("express-session");
var fs = require("fs");
var url = require("url");
const mongoose = require("mongoose");
const { JobStatusModel } = require("./models/job-status");

process.env.BASEPATH = url.parse(process.env.PUBLIC_URL).pathname;


const gitlab_sso_router = require("./routes/gitlab_sso");
const git_router = require("./routes/git");
const gitinspector_router = require("./routes/gitinspector");
const gource_router = require("./routes/gource");

app.use(express.json());

app.use(session({ 
    resave: false,
    saveUninitialized: true,
    secret: "secret" 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(`${process.env.BASEPATH}/api`, gitlab_sso_router);
app.use(`${process.env.BASEPATH}/api`, git_router);
app.use(`${process.env.BASEPATH}/api`, gitinspector_router);
app.use(`${process.env.BASEPATH}/api`, gource_router);

app.use(`${process.env.BASEPATH}/`, express.static(path.join(__dirname, "../frontend/dist")));
app.use(`${process.env.BASEPATH}/*`, (req, res) => { res.sendFile(path.join(__dirname, "../frontend/dist/index.html")) });


if (!fs.existsSync(process.env.TMP_DIR)){ fs.mkdirSync(process.env.TMP_DIR); }
if (!fs.existsSync(process.env.VIDEO_DIR)){ fs.mkdirSync(process.env.VIDEO_DIR); }

async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    await JobStatusModel.collection.drop();

    app.listen(process.env.PORT, () => {
        console.log(`Listening at ${process.env.PUBLIC_URL}`);
    });
}

main();