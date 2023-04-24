const exec = require("child_process").exec;
const fs = require("fs").promises;
const path = require("path");
const { cloneRepository, getLastCommitHash, getProjectById } = require("./gitlabAPI");
const crypto = require("crypto");

const GourceModel = require("../models/gource");
const { JobStatusModel, JOB_STATUSES } = require("../models/job-status");


/**
 * Starts Gource on a repo
 * @param {any} req                 Request object
 * @param {number} repo_id          Id of the repository to scan
 * @param {string} branch           Branch of the repository to scan
 * @returns {Promise<string>} Identifier of the request
 */
async function runGource(req, repo_id, branch="main") {
    const repo_path = await cloneRepository(req, repo_id, branch);
    const commit_hash = await getLastCommitHash(repo_path);
    const job_id = crypto.createHash("sha1").update(JSON.stringify(["gource", repo_id, commit_hash, branch])).digest("hex");

    // Scan already done or currently running
    if (await GourceModel.hasVideo(job_id) || (await JobStatusModel.getStatus(job_id)) === JOB_STATUSES.RUNNING) {
        await fs.rm(repo_path, { recursive: true, force: true });
        return job_id;
    }

    await JobStatusModel.deleteOne({ job_id: job_id });
    await new JobStatusModel({
        job_id: job_id,
        status: JOB_STATUSES.RUNNING
    }).save();

    exec(`xvfb-run gource -1280x720 -o - | ffmpeg -y -r 30 -f image2pipe -vcodec ppm -i - -pix_fmt yuv420p ${path.join(process.env.VIDEO_DIR, job_id+".mp4")}`, { cwd: repo_path }, 
    async (error, stdout, stderr) => {
        if (error) {
            await JobStatusModel.updateOne({ job_id: job_id }, { status: JOB_STATUSES.ERROR });
            return;
        }

        // Caches results
        await new GourceModel({
            job_id: job_id,
            repo_id: repo_id,
            branch: branch,
            last_commit: commit_hash,
            video_path: path.join(process.env.VIDEO_DIR, `${job_id}.mp4`)
        }).save();
        await JobStatusModel.deleteOne({ job_id: job_id });

        await fs.rm(repo_path, { recursive: true, force: true });
    });

    return job_id;
}


/**
 * Gets the video of a given Gource request (if it exists)
 * @param {string} job_id         Identifier of the scan request
 * @returns {Promise<string>} path to the video
 */
async function getGource(job_id) {
    const gource_result = await GourceModel.findOne({
        job_id: job_id
    });
    
    return gource_result?.video_path;
}

module.exports = {
    runGource,
    getGource
}