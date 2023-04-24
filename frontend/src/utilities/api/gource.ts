import axios from "axios";


export async function startGource(repo_id :number, branch :string="main") :Promise<string> {
    return ( await axios({
        method: "post",
        url: `${import.meta.env.BASE_URL}/api/stats/gource/${encodeURIComponent(repo_id)}/${encodeURIComponent(branch)}`,
    }) ).data.id;
}

export async function getGourceVideoURL(job_id :string) :Promise<string|null> {
    const res = await axios({
        method: "get",
        url: `${import.meta.env.BASE_URL}/api/stats/gource/${encodeURIComponent(job_id)}`
    });

    switch (res.status) {
        case 200:
            return `${import.meta.env.BASE_URL}/api/stats/gource/${encodeURIComponent(job_id)}`;
        case 202:
        case 404:
            return null;
        default:
            throw Error();
    }
}