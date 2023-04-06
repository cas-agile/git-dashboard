const git_validator = require("../validators/git");

function listRepositories(req, res, next) {
    if (req.query.page_number && parseInt(req.query.page_number) <= 0) {
        return res.status(400).json({ message: "Invalid page number" });
    }

    req.query.page_number = req.query.page_number ? parseInt(req.query.page_number) : 1;
    next();
}

async function listBranches(req, res, next) {
    if ( !(await git_validator.doesProjectExists(req, req.params.repo_id)) ) { return res.status(400).json({ message: "The project does not exist" }); }
    return next();
}

async function listExtensions(req, res, next) {
    if ( !(await git_validator.doesProjectExists(req, req.params.repo_id)) ) { return res.status(400).json({ message: "The project does not exist" }); }
    if ( !(await git_validator.doesBranchExists(req, req.params.repo_id, req.params.branch)) ) { return res.status(400).json({ message: "The branch does not exist" }); }
    return next();
}


module.exports = {
    listRepositories,
    listBranches,
    listExtensions
}