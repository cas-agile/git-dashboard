require("dotenv").config();
const { runGource, getGource } = require("../utilities/gource");
const { JobStatusModel, JOB_STATUSES } = require("../models/job-status");


async function startGourceOnRepo(req, res) {
    try {
        const job_id = await runGource(req, req.params.repo_id, req.params.branch);
        return res.status(202).json({ id: job_id });
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

async function getGourceOnRepo(req, res) {
    try {
        const scan_status = await JobStatusModel.getStatus(req.params.job_id);
        if (scan_status === JOB_STATUSES.RUNNING) { return res.sendStatus(202); }
        if (scan_status === JOB_STATUSES.ERROR) { return res.sendStatus(500); }

        const gource_path = await getGource(req.params.job_id);
        if (!gource_path) { return res.sendStatus(404); }

        res.setHeader("Content-Type", "video/mp4");
        res.status(200).sendFile(gource_path);
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}


module.exports = {
    startGourceOnRepo: startGourceOnRepo,
    getGourceOnRepo: getGourceOnRepo
}