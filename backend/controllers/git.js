require("dotenv").config();
const { gitlabAPI } = require("../utilities/gitlabAPI");
const { runGitinspector } = require("../utilities/gitinspector");

async function listRepositories(req, res) {
    try {
        const repositories = ( await gitlabAPI(req, "get", "/api/v4/projects", {
            params: {
                page: req.query.page_number ?? 1
            }
        }) ).data;

        res.status(200).json(
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
        res.sendStatus(500);
    }
}


async function gitinspectorOnRepoId(req, res) {
    try {
        res.status(200).send(await runGitinspector(req, req.params.repo_id));
    }
    catch (err) {
        res.sendStatus(500);
    }
}


module.exports = {
    listRepositories,
    gitinspectorOnRepoId
}