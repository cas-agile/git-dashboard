require("dotenv").config();
const { gitlabAPI } = require("../utilities/gitlabAPI");


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
        console.error(err);
        return res.sendStatus(500);
    }
}

async function listBranches(req, res) {
    try {
        const branches = ( await gitlabAPI(req, "get", `/api/v4/projects/${req.params.repo_id}/repository/branches`) ).data;

        return res.status(200).json(
            branches.map((branch) => (
                {
                    name: branch.name
                }
            ))
        );
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}


module.exports = {
    listRepositories,
    listBranches
}