const axios = require("axios");
const path = require("path");

function gitlabAPI(req, method, endpoint, args={}) {
    if (!args.headers) { args.headers = {}; }
    args.headers.Authorization = `Bearer ${req.user.access}`;
    args.method = method;
    args.url = new URL(path.join("./", endpoint), process.env.GITLAB_URL).href;

    return axios(args);
}

async function getProjectById(req, id) {
    return ( await gitlabAPI(req, "get", `/api/v4/projects/${id}`) ).data;
}


module.exports = {
    gitlabAPI,
    getProjectById
}