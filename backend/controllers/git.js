require("dotenv").config();
const { gitlabAPI } = require("../utilities/gitlabAPI");

async function listRepositories(req, res) {

    try {
        const repositories = ( await gitlabAPI(req, "get", "/api/v4/projects") ).data;
        res.status(200).json(repositories);
    }
    catch (err) {
        res.sendStatus(500);
    }
}


module.exports = {
    listRepositories
}