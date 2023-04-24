const mongoose = require("mongoose");
const JOB_STATUSES = {
    RUNNING: "running",
    ERROR: "error"
}

const jobStatusSchema = mongoose.Schema({
    job_id: { type: String, required: true, unique: true },
    status: { type: String, required: true, enum: [JOB_STATUSES.RUNNING, JOB_STATUSES.ERROR] }
});

/**
 * @param {string} job_id 
 * @returns {Promise<string|null>} Status of the job if exists. null otherwise
 */
jobStatusSchema.statics.getStatus = async function(job_id) {
    const job_result = await this.findOne({ 
        job_id: job_id
    });

    return job_result ? job_result.status : null;
};

module.exports = {
    JobStatusModel: mongoose.model("jobStatus", jobStatusSchema),
    JOB_STATUSES: JOB_STATUSES
}