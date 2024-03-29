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


/**
 * Lists all branches of a given repository
 * Params
 *  repo_id : integer   Id of the repository
 */
router.get("/git/repositories/:repo_id/branches/", middleware.listBranches, controller.listBranches);


/**
 * Lists all extensions of a repository branch
 * Params
 *  repo_id : integer   Id of the repository
 *  branch  : string    Branch of the repository
 */
router.get("/git/repositories/:repo_id/:branch/extensions/", middleware.listExtensions, controller.listExtensions);


module.exports = router;