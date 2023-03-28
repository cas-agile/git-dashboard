const { getProjectById } = require("../utilities/gitlabAPI");
const exec = require('util').promisify(require("child_process").exec);
const { v4: uuidv4 } = require('uuid');
const path = require("path");
const fs = require("fs").promises;

const GitinspectorModel = require("../models/gitinspector");


/**
 * Clones a repository in a temporary directory
 * @returns {string} Path of the cloned repo
 */
async function cloneRepository(req, repo_id, branch) {
    const repo_data = await getProjectById(req, repo_id);
    const clone_url = repo_data.http_url_to_repo.replace(/(^\w+:|^)\/\//, ''); // Removes schema
    const schema = process.env.GITLAB_URL.match(/(^\w+:|^)\/\//)[0];
    const directory_name = uuidv4();

    await exec(`git clone ${schema}oauth2:${req.user.access}@${clone_url} ${directory_name} -b ${branch}`, { cwd: process.env.TMP_DIR });

    return path.join(process.env.TMP_DIR, directory_name);
}

async function getLastCommitHash(repo_path) {
    return ( await exec("git rev-parse HEAD", { cwd: repo_path }) ).stdout;
}

/**
 * Start gitinspector on a repository and caches the result
 * @param {any} req         Request object
 * @param {number} repo_id  Id of the repository to scan
 * @param {string} branch   Branch of the repository to scan
 */
async function runGitinspector(req, repo_id, branch="main") {
    const repo_path = await cloneRepository(req, repo_id, branch);
    const commit_hash = await getLastCommitHash(repo_path);

    if (!(await GitinspectorModel.hasScan(repo_id, branch, commit_hash))) {
        // TODO Replace directory uuid to real repo name
        const gitinspector = ( await exec(`npx gitinspector --format=html --timeline --responsibilities --metrics --weeks --list-file-types`, { cwd: repo_path }) ).stdout;
    
        // Caches results
        await new GitinspectorModel({
            repo_id: repo_id,
            branch: branch,
            last_commit: commit_hash,
            gitinspector_scan: gitinspector
        }).save();
    }

    await fs.rm(repo_path, { recursive: true, force: true });
}


/**
 * Retrieve gitinspector scan of a repository from cache
 * @param {any} req         Request object
 * @param {number} repo_id  Id of the repository of which gitinspector is required
 * @param {string} branch   Branch of the repository
 * @returns {string|null} Gitinspector scan if in cache. null otherwise
 */
async function getGitinspector(req, repo_id, branch="main") {
    const repo_path = await cloneRepository(req, repo_id, branch);
    const commit_hash = await getLastCommitHash(repo_path);

    if (!(await GitinspectorModel.hasScan(repo_id, branch, commit_hash))) {
        return null;
    }

    const gitinspector_result = await GitinspectorModel.findOne({
        repo_id: repo_id, 
        branch: branch, 
        last_commit: commit_hash 
    });

    return gitinspector_result.gitinspector_scan;
}

module.exports = {
    runGitinspector,
    getGitinspector
}