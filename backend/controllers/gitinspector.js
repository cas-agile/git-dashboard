require("dotenv").config();
const { runGitinspector, getGitinspector } = require("../utilities/gitinspector");
const { JobStatusModel, JOB_STATUSES } = require("../models/job-status");


async function startGitinspectorOnRepo(req, res) {
    try {
        const job_id = await runGitinspector(req, req.params.repo_id, req.params.branch, req.body.extensions, req.body.since, req.body.until);
        return res.status(202).json({ id: job_id });
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

async function getGitinspectorOnRepo(req, res) {
    try {
        const scan_status = await JobStatusModel.getStatus(req.params.job_id);
        if (scan_status === JOB_STATUSES.RUNNING) { return res.sendStatus(202); }
        if (scan_status === JOB_STATUSES.ERROR) { return res.sendStatus(500); }

        const gitinspector = await getGitinspector(req.params.job_id);
        if (!gitinspector) { return res.sendStatus(404); }
        return res.status(200).send(gitinspector);
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}


module.exports = {
    startGitinspectorOnRepo,
    getGitinspectorOnRepo
}