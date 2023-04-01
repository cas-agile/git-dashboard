const express = require("express");
const router = express.Router();
const controller = require("../controllers/gitinspector");


/**
 * Gets gitinspector results on a repo
 * Params:
 *  repo_id : integer   Id of the repository to analyze
 *  branch : string     Branch of the repository to analyze
 * Query:
 *  extensions : string[]     Extentions to scan
 */
router.get("/stats/gitinspector/:repo_id/:branch", controller.getGitinspectorOnRepo);

/**
 * Starts gitinspector on a repo
 * Params:
 *  repo_id : integer   Id of the repository to analyze
 *  branch : string     Branch of the repository to analyze
 * Body:
 *  extensions : string[]     Extentions to scan
 */
router.post("/stats/gitinspector/:repo_id/:branch", controller.startGitinspectorOnRepo);



module.exports = router;