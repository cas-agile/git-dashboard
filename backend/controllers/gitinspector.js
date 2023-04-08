require("dotenv").config();
const { runGitinspector, getGitinspector } = require("../utilities/gitinspector");
const { GitinspectorStatusModel, GI_STATUSES } = require("../models/gitinspector-status");


async function startGitinspectorOnRepo(req, res) {
    try {
        const scan_id = await runGitinspector(req, req.params.repo_id, req.params.branch, req.body.extensions, req.body.since, req.body.until);
        return res.status(202).json({ id: scan_id });
    }
    catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

async function getGitinspectorOnRepo(req, res) {
    try {
        const scan_status = await GitinspectorStatusModel.getStatus(req.params.scan_id);
        if (scan_status === GI_STATUSES.SCANNING) { return res.sendStatus(202); }
        if (scan_status === GI_STATUSES.ERROR) { return res.sendStatus(500); }

        const gitinspector = await getGitinspector(req.params.scan_id);
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