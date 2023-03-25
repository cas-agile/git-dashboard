import axios from "axios";


export async function getGitinspectorHTML(repo_id :number) :Promise<string> {
    return ( await axios({
        method: "get",
        url: `/api/stats/gitinspector/${encodeURIComponent(repo_id)}`,
    }) ).data;
}