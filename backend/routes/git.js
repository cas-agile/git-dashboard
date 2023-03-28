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
 * Gets gitinspector results on a repo
 * Params:
 *  repo_id : integer   Id of the repository to analyze
 *  branch : string     Branch of the repository to analyze
 */
router.get("/stats/gitinspector/:repo_id/:branch", controller.getGitinspectorOnRepo);

/**
 * Starts gitinspector on a repo
 * Params:
 *  repo_id : integer   Id of the repository to analyze
 *  branch : string     Branch of the repository to analyze
 */
router.post("/stats/gitinspector/:repo_id/:branch", controller.startGitinspectorOnRepo);



module.exports = router;