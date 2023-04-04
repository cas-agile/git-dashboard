const mongoose = require("mongoose");

const gitinspectorSchema = mongoose.Schema({
    repo_id: { type: Number, required: true },
    branch: { type: String, required: true },
    last_commit: { type: String, required: true },
    extensions: String,
    since: String,
    until: String,

    gitinspector_scan: { type: String, required: true }
});

/**
 * @param {number} repo_id 
 * @param {string} branch 
 * @param {string} last_commit 
 * @param {string} extensions 
 * @returns {Promise<boolean>} True if a scan for the given configuration is in cache. False otherwise
 */
gitinspectorSchema.statics.hasScan = async function(repo_id, branch, last_commit, extensions, since, until) {
    const gitinspector_result = await this.findOne({ 
        repo_id: repo_id, 
        branch: branch, 
        last_commit: last_commit,
        extensions: extensions,
        since: since, 
        until: until
    });

    return gitinspector_result ? true : false;
};

module.exports = mongoose.model("gitinspector", gitinspectorSchema);