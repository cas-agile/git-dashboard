const exec = require('util').promisify(require("child_process").exec);
const fs = require("fs").promises;
const { cloneRepository, getLastCommitHash } = require("../utilities/gitlabAPI");

const GitinspectorModel = require("../models/gitinspector");


function parseExtensionParams(extensions) {
    if (extensions.length === 0) { return "**"; }
    return extensions.join(",");
}

/**
 * Start gitinspector on a repository and caches the result
 * @param {any} req         Request object
 * @param {number} repo_id  Id of the repository to scan
 * @param {string} branch   Branch of the repository to scan
 * @param {string[]} extensions     Extensions to scan
 */
async function runGitinspector(req, repo_id, branch="main", extensions=[]) {
    const repo_path = await cloneRepository(req, repo_id, branch);
    const commit_hash = await getLastCommitHash(repo_path);

    if (!(await GitinspectorModel.hasScan(repo_id, branch, commit_hash))) {
        // TODO Replace directory uuid to real repo name
        const gitinspector = ( await exec(`npx gitinspector --format=html --timeline --responsibilities --metrics --weeks --list-file-types --file-types ${parseExtensionParams(extensions)}`, 
                                { cwd: repo_path }) ).stdout;
    
        // Caches results
        await new GitinspectorModel({
            repo_id: repo_id,
            branch: branch,
            last_commit: commit_hash,
            extensions: parseExtensionParams(extensions),
            gitinspector_scan: gitinspector
        }).save();
    }

    await fs.rm(repo_path, { recursive: true, force: true });
}


/**
 * Retrieve gitinspector scan of a repository from cache
 * @param {any} req                 Request object
 * @param {number} repo_id          Id of the repository of which gitinspector is required
 * @param {string} branch           Branch of the repository
 * @param {string[]} extensions     Extensions to scan
 * @returns {Promise<string|null>} Gitinspector scan if in cache. null otherwise
 */
async function getGitinspector(req, repo_id, branch="main", extensions=[]) {
    const repo_path = await cloneRepository(req, repo_id, branch);
    const commit_hash = await getLastCommitHash(repo_path);

    const gitinspector_result = await GitinspectorModel.findOne({
        repo_id: repo_id, 
        branch: branch, 
        last_commit: commit_hash,
        extensions: parseExtensionParams(extensions)
    });
    
    await fs.rm(repo_path, { recursive: true, force: true });
    return gitinspector_result?.gitinspector_scan;
}

module.exports = {
    runGitinspector,
    getGitinspector
}