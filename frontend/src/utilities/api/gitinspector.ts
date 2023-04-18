import axios from "axios";

export class ScanNotCompleted extends Error {
    constructor(message :string="") {
        super(message);
    }
}

export class ScanError extends Error {
    constructor(message :string="") {
        super(message);
    }
}

export async function startGitinspectorScan(repo_id :number, branch :string="main", extensions :string[], since :string|null, until :string|null) :Promise<string> {
    return ( await axios({
        method: "post",
        url: `${import.meta.env.BASE_URL}/api/stats/gitinspector/${encodeURIComponent(repo_id)}/${encodeURIComponent(branch)}`,
        data: {
            extensions: extensions,
            since: since,
            until: until
        }
    }) ).data.id;
}

export async function getGitinspectorScan(scan_id :string) :Promise<string> {
    const res = await axios({
        method: "get",
        url: `${import.meta.env.BASE_URL}/api/stats/gitinspector/${encodeURIComponent(scan_id)}`
    });

    switch (res.status) {
        case 200:
            return res.data;
        case 202:
        case 404:
            throw new ScanNotCompleted();
    }

    throw new ScanError();
}