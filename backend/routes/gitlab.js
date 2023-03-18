const express = require('express');
const router = express.Router();
const passport = require("passport");
const GitLabStrategy = require("passport-gitlab2");


passport.use(
    new GitLabStrategy(
        {
            clientID: process.env.GITLAB_SSO_CLIENT,
            clientSecret: process.env.GITLAB_SSO_SECRET,
            callbackURL: `${process.env.PUBLIC_URL}/api/gitlab/callback`,
            baseURL: process.env.GITLAB_URL
        },
        function (accessToken, refreshToken, profile, cb) {
            // Sets tokens and profile as session data
            return cb(null, {
                access: accessToken,
                refresh: refreshToken,
                profile: profile
            });
        }
    )
);
passport.serializeUser(function (user, cb) {
    cb(null, user);
});
passport.deserializeUser(function (user, cb) {
    cb(null, user);
});


router.get("/gitlab", passport.authenticate("gitlab", { scope: ["api"] }));

router.get("/gitlab/callback",
    passport.authenticate("gitlab", {
        successRedirect: "/",
        failureRedirect: "/login/fail",
    })
);
    
router.get("/logout", (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(200);
});


module.exports = router;