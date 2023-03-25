const { getProjectById } = require("../utilities/gitlabAPI");
const exec = require('util').promisify(require("child_process").exec);
const { v4: uuidv4 } = require('uuid');
const path = require("path");
const fs = require("fs").promises;

async function runGitinspector(req, repo_id) {
    const repo_data = await getProjectById(req, repo_id);
    const clone_url = repo_data.http_url_to_repo.replace(/(^\w+:|^)\/\//, ''); // Removes schema
    const schema = process.env.GITLAB_URL.match(/(^\w+:|^)\/\//)[0];
    const directory_name = uuidv4();

    await exec(`git clone ${schema}oauth2:${req.user.access}@${clone_url} ${directory_name}`, { cwd: process.env.TMP_DIR });
    const gitinspector = await exec(`npx gitinspector --format=html --timeline --responsibilities --metrics --weeks --list-file-types`, { cwd: path.join(process.env.TMP_DIR, directory_name) });
    await fs.rm(path.join(process.env.TMP_DIR, directory_name), { recursive: true, force: true });

    // TODO Replace directory uuid to real repo name
    return gitinspector.stdout;
}

module.exports = {
    runGitinspector
}