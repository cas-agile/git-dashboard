const mongoose = require("mongoose");
const GI_STATUSES = {
    SCANNING: "scanning",
    ERROR: "error"
}

const gitinspectorStatusSchema = mongoose.Schema({
    scan_id: { type: String, required: true, unique: true },
    status: { type: String, required: true, enum: [GI_STATUSES.SCANNING, GI_STATUSES.ERROR] }
});

/**
 * @param {string} scan_id 
 * @returns {Promise<string|null>} Status of the scan if exists. null otherwise
 */
gitinspectorStatusSchema.statics.getStatus = async function(scan_id) {
    const gitinspector_result = await this.findOne({ 
        scan_id: scan_id
    });

    return gitinspector_result ? gitinspector_result.status : null;
};

module.exports = {
    GitinspectorStatusModel: mongoose.model("gitinspectorStatus", gitinspectorStatusSchema),
    GI_STATUSES
}