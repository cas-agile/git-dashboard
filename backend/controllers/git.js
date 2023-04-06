require("dotenv").config();
const { gitlabAPI, cloneRepository, getBranchListByProject } = require("../utilities/gitlabAPI");
const getDirectoryExtensions = require("../utilities/list-extensions").listExtensions;
const fs = require("fs").promises;


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
        const branches = await getBranchListByProject(req, req.params.repo_id);

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

async function listExtensions(req, res) {
    try {
        const repo_path = await cloneRepository(req, req.params.repo_id, req.params.branch);
        const extensions = await getDirectoryExtensions(repo_path);
        await fs.rm(repo_path, { recursive: true, force: true });

        return res.status(200).json(extensions);
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}


module.exports = {
    listRepositories,
    listBranches,
    listExtensions
}