const exec = require("child_process").exec;
const fs = require("fs").promises;
const path = require("path");
const { cloneRepository, getLastCommitHash, getProjectById } = require("../utilities/gitlabAPI");
const { validateDate } = require("../validators/date");

const GitinspectorModel = require("../models/gitinspector");
const { GitinspectorStatusModel, GI_STATUSES } = require("../models/gitinspector-status");


function parseExtensionParams(extensions) {
    if (extensions.length === 0) { return "**"; }
    return extensions.join(",")
                     .replace(/(["'$`\\])/g,'\\$1'); // Escaping
}

/**
 * Start gitinspector on a repository and caches the result
 * @param {any} req                 Request object
 * @param {number} repo_id          Id of the repository to scan
 * @param {string} branch           Branch of the repository to scan
 * @param {string[]} extensions     Extensions to scan
 * @param {string} since            Starting date of the scan (format: YYYY-MM-DD HH:mm:ss)
 * @param {string} until            Ending date of the scan (format: YYYY-MM-DD HH:mm:ss)
 * @returns {Promise<string>} Identifier of the scan request
 */
async function runGitinspector(req, repo_id, branch="main", extensions=[], since=null, until=null) {
    const repo_path = await cloneRepository(req, repo_id, branch);
    const commit_hash = await getLastCommitHash(repo_path);
    if (since && !validateDate(since)) { since = null; }
    if (until && !validateDate(until)) { until = null; }
    const scan_id = JSON.stringify([repo_id, branch, extensions, since, until]);

    // Scan already done or currently running
    if (await GitinspectorModel.hasScan(scan_id) || (await GitinspectorStatusModel.getStatus(scan_id)) === GI_STATUSES.SCANNING) {
        await fs.rm(repo_path, { recursive: true, force: true });
        return scan_id;
    }

    await GitinspectorStatusModel.deleteOne({ scan_id: scan_id });
    await new GitinspectorStatusModel({
        scan_id: scan_id,
        status: GI_STATUSES.SCANNING
    }).save();

    exec(`npx gitinspector --format=html --timeline --responsibilities --metrics --weeks --list-file-types ` + 
        `--file-types="${parseExtensionParams(extensions)}" ${since ? '--since="'+since+'"' : ""}  ${until ? '--until="'+until+'"' : ""}`, { cwd: repo_path }, 
    async (error, stdout, stderr) => {
        if (error) {
            await GitinspectorStatusModel.updateOne({ scan_id: scan_id }, { status: GI_STATUSES.ERROR });
            return;
        }

        const gitinspector = stdout;

        // Caches results
        await new GitinspectorModel({
            scan_id: scan_id,
            repo_id: repo_id,
            branch: branch,
            last_commit: commit_hash,
            extensions: parseExtensionParams(extensions),
            gitinspector_scan: gitinspector.replace(new RegExp(`${path.basename(repo_path)}`, "g"), (await getProjectById(req, repo_id)).path_with_namespace),  // TODO Replace directory uuid to real repo name
            since: since,
            until: until
        }).save();
        await GitinspectorStatusModel.deleteOne({ scan_id: scan_id });

        await fs.rm(repo_path, { recursive: true, force: true });
    });

    return scan_id;
}


/**
 * Retrieve gitinspector scan of a repository from cache
 * @param {string} scan_id         Identified of the scan request
 * @returns {Promise<string|null>} Gitinspector scan if in cache. null otherwise
 */
async function getGitinspector(scan_id) {
    const gitinspector_result = await GitinspectorModel.findOne({
        scan_id: scan_id
    });
    
    return gitinspector_result?.gitinspector_scan;
}

module.exports = {
    runGitinspector,
    getGitinspector
}