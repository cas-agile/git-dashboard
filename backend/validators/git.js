const GitlabAPI = require("../utilities/gitlabAPI");

/**
 * 
 * @param {*} req 
 * @param {number} project_id 
 * @returns {Promise<boolean>}
 */
async function doesProjectExists(req, project_id) {
    try {
        await GitlabAPI.getProjectById(req, project_id);
        return true;
    }
    catch (err) {
        return false;
    }
}

/**
 * 
 * @param {*} req 
 * @param {number} project_id 
 * @param {string} branch_name 
 * @returns {Promise<boolean>}
 */
async function doesBranchExists(req, project_id, branch_name) {
    try {
        const branches = await GitlabAPI.getBranchListByProject(req, project_id);
        for (const branch of branches) {
            if (branch.name === branch_name) { return true; }
        }
    }
    catch (err) {
        return false;
    }

    return false;
}


module.exports = {
    doesProjectExists,
    doesBranchExists
}