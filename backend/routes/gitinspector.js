const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/gitinspector");
const controller = require("../controllers/gitinspector");


/**
 * Gets gitinspector results on a repo
 * Params:
 *  scan_id : string   Identifier of the request
 * 
 * Response
 *  200: Scan completed
 *          gitinspector : string   Git inspector results
 *  202: Still processing
 *  404: Scan not found (maybe the starting request is missing)
 *  500: Internal server error
 */
router.get("/stats/gitinspector/:scan_id", middleware.getGitinspectorOnRepo, controller.getGitinspectorOnRepo);


/**
 * Starts gitinspector on a repo
 * Params:
 *  repo_id : integer   Id of the repository to analyze
 *  branch : string     Branch of the repository to analyze
 * Query:
 *  extensions : string[]       Extentions to scan
 *  since : string              Starting date of the scan (format: format: YYYY-MM-DD HH:mm:ss)
 *  until : string              Ending date of the scan (format: format: YYYY-MM-DD HH:mm:ss)
 * 
 * Response
 *  202: Request accepted
 *          id : string     Identifier of the request
 *  500: Internal server error
 */
router.post("/stats/gitinspector/:repo_id/:branch", middleware.startGitinspectorOnRepo, controller.startGitinspectorOnRepo);



module.exports = router;