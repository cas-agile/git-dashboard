const axios = require("axios");
const path = require("path");

function gitlabAPI(req, method, endpoint, data={}) {
    return axios({
        method: method,
        url: new URL(path.join("./", endpoint), process.env.GITLAB_URL).href,
        headers: { Authorization: `Bearer ${req.user.access}` },
        data: data
    });
}

module.exports = {
    gitlabAPI
}