const mongoose = require("mongoose");

const gitinspectorSchema = mongoose.Schema({
    scan_id: { type: String, required: true, unique: true },
    repo_id: { type: Number, required: true },
    branch: { type: String, required: true },
    last_commit: { type: String, required: true },
    extensions: String,
    since: String,
    until: String,

    gitinspector_scan: { type: String, required: true }
});

/**
 * @param {string} scan_id 
 * @returns {Promise<boolean>} True if a scan for the given configuration is in cache. False otherwise
 */
gitinspectorSchema.statics.hasScan = async function(scan_id) {
    const gitinspector_result = await this.findOne({ 
        scan_id: scan_id
    });

    return gitinspector_result ? true : false;
};

module.exports = mongoose.model("gitinspector", gitinspectorSchema);