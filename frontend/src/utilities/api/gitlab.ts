import axios from "axios";

export interface GitlabRepository {
    id: number,
    name: string,
    path_with_namespace: string,
    description: string,
    avatar_url: string | null
}

export interface GitlabBranch {
    name: string,
}


export async function listRepositories(page_number:number=1) : Promise<GitlabRepository[]> {
    return ( await axios({
        method: "get",
        url: `${import.meta.env.BASE_URL}/api/git/repositories`,
        params: {
            page_number: page_number
        }
    }) ).data;
}

export async function listBranches(repo_id :number) : Promise<GitlabBranch[]> {
    return ( await axios({
        method: "get",
        url: `${import.meta.env.BASE_URL}/api/git/repositories/${encodeURIComponent(repo_id)}/branches`,
    }) ).data;
}

export async function listExtensions(repo_id :number, branch :string) : Promise<string[]> {
    return ( await axios({
        method: "get",
        url: `${import.meta.env.BASE_URL}/api/git/repositories/${encodeURIComponent(repo_id)}/${encodeURIComponent(branch)}/extensions/`,
    }) ).data;
}