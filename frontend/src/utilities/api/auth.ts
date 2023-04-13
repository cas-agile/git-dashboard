import axios from "axios";

export async function isLogged() : Promise<boolean> {
    try {
        await axios({
            method: "get",
            url: `/api/auth`,
        });

        return true;
    }
    catch (err) {
        return false;
    }
}