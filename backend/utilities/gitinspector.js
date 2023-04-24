const exec = require("child_process").exec;
const fs = require("fs").promises;
const path = require("path");
const { cloneRepository, getLastCommitHash, getProjectById } = require("../utilities/gitlabAPI");
const { validateDate } = require("../validators/date");
const crypto = require("crypto");
const ms = require("ms");

const GitinspectorModel = require("../models/gitinspector");
const { JobStatusModel, JOB_STATUSES } = require("../models/job-status");


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
    const job_id = crypto.createHash("sha1").update(JSON.stringify(["gitinspector", repo_id, commit_hash, branch, extensions, since, until])).digest("hex");

    // Scan already done or currently running
    if (await GitinspectorModel.hasScan(job_id) || (await JobStatusModel.getStatus(job_id)) === JOB_STATUSES.RUNNING) {
        await fs.rm(repo_path, { recursive: true, force: true });
        return job_id;
    }

    await JobStatusModel.deleteOne({ job_id: job_id });
    await new JobStatusModel({
        job_id: job_id,
        status: JOB_STATUSES.RUNNING
    }).save();

    exec(`npx gitinspector --format=html --timeline --responsibilities --metrics --weeks --list-file-types ` + 
        `--file-types="${parseExtensionParams(extensions)}" ${since ? '--since="'+since+'"' : ""}  ${until ? '--until="'+until+'"' : ""}`, { cwd: repo_path }, 
    async (error, stdout, stderr) => {
        if (error) {
            await JobStatusModel.updateOne({ job_id: job_id }, { status: JOB_STATUSES.ERROR });
            return;
        }

        const gitinspector = stdout;

        // Caches results
        await new GitinspectorModel({
            job_id: job_id,
            repo_id: repo_id,
            branch: branch,
            last_commit: commit_hash,
            extensions: parseExtensionParams(extensions),
            gitinspector_scan: gitinspector.replace(new RegExp(`${path.basename(repo_path)}`, "g"), (await getProjectById(req, repo_id)).path_with_namespace),
            since: since,
            until: until
        }).save();
        await JobStatusModel.deleteOne({ job_id: job_id });

        await fs.rm(repo_path, { recursive: true, force: true });
    });

    return job_id;
}


/**
 * Retrieve gitinspector scan of a repository from cache
 * @param {string} job_id         Identifier of the scan request
 * @returns {Promise<string|null>} Gitinspector scan if in cache. null otherwise
 */
async function getGitinspector(job_id) {
    const gitinspector_result = await GitinspectorModel.findOne({
        job_id: job_id
    });

    if (gitinspector_result) {
        gitinspector_result.last_access = Date.now();
        await gitinspector_result.save();
    }
    
    return gitinspector_result?.gitinspector_scan;
}

async function cleanOldGitinspector() {
    const threshold = Date.now() - ms(process.env.GITINSPECTOR_CACHE_LIFE);

    await GitinspectorModel.deleteMany({
        last_access: { "$lt": threshold }
    });
}

module.exports = {
    runGitinspector,
    getGitinspector,
    cleanOldGitinspector
}