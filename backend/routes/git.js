const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/git");
const controller = require("../controllers/git");


/**
 * Lists all repositories that the user can access
 * Query
 *  page_number : integer   Pagination offset
 */
router.get("/git/repositories/", middleware.listRepositories, controller.listRepositories);


module.exports = router;