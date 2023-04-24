const mongoose = require("mongoose");

const gourceSchema = mongoose.Schema({
    job_id: { type: String, required: true, unique: true },
    repo_id: { type: Number, required: true },
    branch: { type: String, required: true },
    last_commit: { type: String, required: true },

    video_path: { type: String, required: true }
});

/**
 * @param {string} job_id 
 * @returns {Promise<boolean>} True if a video for the given configuration is in cache. False otherwise
 */
gourceSchema.statics.hasVideo = async function(job_id) {
    const gource_result = await this.findOne({ 
        job_id: job_id
    });

    return gource_result ? true : false;
};

module.exports = mongoose.model("gource", gourceSchema);