require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const passport = require("passport");
const session = require("express-session");

const gitlab_sso_router = require("./routes/gitlab_sso");
const git_router = require("./routes/git");


app.use(session({ 
    resave: false,
    saveUninitialized: true,
    secret: "secret" 
}));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", gitlab_sso_router);
app.use("/api", git_router);

app.use("/", express.static(path.join(__dirname, "../frontend/dist")));
app.use("/*", (req, res) => { res.sendFile(path.join(__dirname, "../frontend/dist/index.html")) });



app.listen(process.env.PORT, () => {
    console.log(`Listening at ${process.env.PUBLIC_URL}`)
})
