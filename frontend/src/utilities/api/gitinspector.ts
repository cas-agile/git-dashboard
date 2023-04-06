import axios from "axios";


export async function startGitinspectorScan(repo_id :number, branch :string="main", extensions :string[], since :string|null, until :string|null) :Promise<void> {
    await axios({
        method: "post",
        url: `/api/stats/gitinspector/${encodeURIComponent(repo_id)}/${encodeURIComponent(branch)}`,
        data: {
            extensions: extensions,
            since: since,
            until: until
        }
    });
}

export async function getGitinspectorScan(repo_id :number, branch :string="main", extensions :string[], since :string|null, until :string|null) :Promise<string> {
    return ( await axios({
        method: "get",
        url: `/api/stats/gitinspector/${encodeURIComponent(repo_id)}/${encodeURIComponent(branch)}`,
        params: {
            extensions: extensions,
            since: since,
            until: until
        }
    }) ).data;
}