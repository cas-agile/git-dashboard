const git_validator = require("../validators/git");
const gitinspector_validator = require("../validators/gitinspector");
const date_validator = require("../validators/date");

async function getGitinspectorOnRepo(req, res, next) {
    if ( !(await git_validator.doesProjectExists(req, req.params.repo_id)) ) { return res.status(400).json({ message: "The project does not exist" }); }
    if ( !(await git_validator.doesBranchExists(req, req.params.repo_id, req.params.branch)) ) { return res.status(400).json({ message: "The branch does not exist" }); }
    if ( req.query.extensions && !gitinspector_validator.isExtensionsList(req.query.extensions) ) { return res.status(400).json({ message: "Invalid extensions list" }); }
    if ( req.query.since && !date_validator.validateDate(req.query.since) ) { return res.status(400).json({ message: "Invalid date (since)" }); }
    if ( req.query.until && !date_validator.validateDate(req.query.until) ) { return res.status(400).json({ message: "Invalid date (until)" }); }
    return next();
}

async function startGitinspectorOnRepo(req, res, next) {
    if ( !(await git_validator.doesProjectExists(req, req.params.repo_id)) ) { return res.status(400).json({ message: "The project does not exist" }); }
    if ( !(await git_validator.doesBranchExists(req, req.params.repo_id, req.params.branch)) ) { return res.status(400).json({ message: "The branch does not exist" }); }
    if ( req.body.extensions && !gitinspector_validator.isExtensionsList(req.body.extensions) ) { return res.status(400).json({ message: "Invalid extensions list" }); }
    if ( req.body.since && !date_validator.validateDate(req.body.since) ) { return res.status(400).json({ message: "Invalid date (since)" }); }
    if ( req.body.until && !date_validator.validateDate(req.body.until) ) { return res.status(400).json({ message: "Invalid date (until)" }); }
    return next();
}

module.exports = {
    getGitinspectorOnRepo,
    startGitinspectorOnRepo
};