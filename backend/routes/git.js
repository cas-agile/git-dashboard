const express = require("express");
const router = express.Router();
const controller = require("../controllers/git");

router.get("/git/repositories/", controller.listRepositories);


module.exports = router;