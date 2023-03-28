require("dotenv").config();
const { gitlabAPI } = require("../utilities/gitlabAPI");
const { runGitinspector, getGitinspector } = require("../utilities/gitinspector");

async function listRepositories(req, res) {
    try {
        const repositories = ( await gitlabAPI(req, "get", "/api/v4/projects", {
            params: {
                page: req.query.page_number ?? 1
            }
        }) ).data;

        return res.status(200).json(
            repositories.map((repo) => (
                {
                    id: repo.id,
                    name: repo.name,
                    path_with_namespace: repo.path_with_namespace,
                    description: repo.description ?? "",
                    avatar_url: repo.avatar_url
                }
            ))
        );
    }
    catch (err) {
        return res.sendStatus(500);
    }
}


async function startGitinspectorOnRepo(req, res) {
    try {
        runGitinspector(req, req.params.repo_id, req.params.branch);
        return res.sendStatus(202);
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

async function getGitinspectorOnRepo(req, res) {
    try {
        const gitinspector = await getGitinspector(req, req.params.repo_id, req.params.branch);
        
        if (!gitinspector) { return res.sendStatus(404); }
        return res.status(200).send(gitinspector);
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}


module.exports = {
    listRepositories,
    startGitinspectorOnRepo,
    getGitinspectorOnRepo
}