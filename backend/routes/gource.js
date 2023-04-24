const express = require("express");
const router = express.Router();
const middleware = require("../middlewares/gource");
const controller = require("../controllers/gource");


/**
 * Gets Gource result on a repo
 * Params:
 *  job_id : string   Identifier of the request
 * 
 * Response
 *  200: Video available and sent as a stream
 *  202: Still processing
 *  404: Video not found (maybe the starting request is missing)
 *  500: Internal server error
 */
router.get("/stats/gource/:job_id", middleware.getGourceOnRepo, controller.getGourceOnRepo);


/**
 * Starts Gource on a repo
 * Params:
 *  repo_id : integer   Id of the repository to analyze
 *  branch : string     Branch of the repository to analyze
 * 
 * Response
 *  202: Request accepted
 *          id : string     Identifier of the request
 *  500: Internal server error
 */
router.post("/stats/gource/:repo_id/:branch", middleware.startGourceOnRepo, controller.startGourceOnRepo);



module.exports = router;