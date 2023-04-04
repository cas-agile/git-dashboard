require("dotenv").config();
const { runGitinspector, getGitinspector } = require("../utilities/gitinspector");


async function startGitinspectorOnRepo(req, res) {
    try {
        runGitinspector(req, req.params.repo_id, req.params.branch, req.body.extensions, req.body.since, req.body.until);
        return res.sendStatus(202);
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

async function getGitinspectorOnRepo(req, res) {
    try {
        const gitinspector = await getGitinspector(req, req.params.repo_id, req.params.branch, req.query.extensions, req.query.since, req.query.until);
        
        if (!gitinspector) { return res.sendStatus(404); }
        return res.status(200).send(gitinspector);
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}


module.exports = {
    startGitinspectorOnRepo,
    getGitinspectorOnRepo
}