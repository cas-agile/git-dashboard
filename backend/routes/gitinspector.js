const express = require("express");
const router = express.Router();
const controller = require("../controllers/gitinspector");


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