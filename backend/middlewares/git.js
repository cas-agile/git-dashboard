function listRepositories(req, res, next) {
    if (req.query.page_number && parseInt(req.query.page_number) <= 0) {
        return res.status(400).json({ message: "Invalid page number" });
    }

    req.query.page_number = req.query.page_number ? parseInt(req.query.page_number) : 1;
    next();
}

function validateRepoId(req, res, next) {
    if (!req.params.repo_id) {
        return res.status(400).json({ message: "Invalid repository id" });
    }

    next();
}


module.exports = {
    listRepositories,
    validateRepoId
}