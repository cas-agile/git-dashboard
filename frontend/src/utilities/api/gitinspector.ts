import axios from "axios";


export async function startGitinspectorScan(repo_id :number, branch :string="main") :Promise<void> {
    await axios({
        method: "post",
        url: `/api/stats/gitinspector/${encodeURIComponent(repo_id)}/${encodeURIComponent(branch)}`,
    });
}

export async function getGitinspectorScan(repo_id :number, branch :string="main") :Promise<string> {
    return ( await axios({
        method: "get",
        url: `/api/stats/gitinspector/${encodeURIComponent(repo_id)}/${encodeURIComponent(branch)}`,
    }) ).data;
}