const axios = require("axios");
const path = require("path");
const exec = require('util').promisify(require("child_process").exec);
const spawn = require("child_process").spawn;
const { v4: uuidv4 } = require('uuid');

function gitlabAPI(req, method, endpoint, args={}) {
    if (!args.headers) { args.headers = {}; }
    args.headers.Authorization = `Bearer ${req.user.access}`;
    args.method = method;
    args.url = new URL(path.join("./", endpoint), process.env.GITLAB_URL).href;

    return axios(args);
}

async function getProjectById(req, id) {
    return ( await gitlabAPI(req, "get", `/api/v4/projects/${id}`) ).data;
}



/**
 * Clones a repository in a temporary directory
 * @returns {Promise<string>} Path of the cloned repo
 */
async function cloneRepository(req, repo_id, branch) {
    const repo_data = await getProjectById(req, repo_id);
    const clone_url = repo_data.http_url_to_repo.replace(/(^\w+:|^)\/\//, ''); // Removes schema
    const schema = process.env.GITLAB_URL.match(/(^\w+:|^)\/\//)[0];
    const directory_name = uuidv4();

    return new Promise((resolve, rejects) => {
        const git_clone = spawn("git", [ "clone", `${schema}oauth2:${req.user.access}@${clone_url}`, directory_name, "-b", branch ], { cwd: process.env.TMP_DIR });
        
        git_clone.on("close", (exit_code) => {
            if (exit_code === 0) {
                resolve( path.join(process.env.TMP_DIR, directory_name) );
            }
            else {
                rejects();
            }
        });
    });
}

async function getLastCommitHash(repo_path) {
    return ( await exec("git rev-parse HEAD", { cwd: repo_path }) ).stdout;
}


module.exports = {
    gitlabAPI,
    getProjectById,
    cloneRepository,
    getLastCommitHash
}