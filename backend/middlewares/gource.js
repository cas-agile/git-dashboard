const git_validator = require("../validators/git");

async function getGourceOnRepo(req, res, next) {
    if ( !req.params.job_id ) { return res.status(400).json({ message: "Missing parameter" }); }
    return next();
}

async function startGourceOnRepo(req, res, next) {
    if ( !(await git_validator.doesProjectExists(req, req.params.repo_id)) ) { return res.status(400).json({ message: "The project does not exist" }); }
    if ( !(await git_validator.doesBranchExists(req, req.params.repo_id, req.params.branch)) ) { return res.status(400).json({ message: "The branch does not exist" }); }
    return next();
}

module.exports = {
    getGourceOnRepo,
    startGourceOnRepo
};