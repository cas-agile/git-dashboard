import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/home/Home.vue";
import Login from "@/views/login/Login.vue";
import LoginFail from "@/views/login/Fail.vue";
import { isLogged } from "@/utilities/api/auth";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "home",
            component: Home
        },
        {
            path: "/login",
            name: "login",
            component: Login,
        },
        {
            path: "/login/fail",
            name: "login_fail",
            component: LoginFail,
        }
    ]
});

router.beforeEach(async (to, from) => {
    const is_logged = await isLogged();

    if (["home"].includes(to.name as string)) {
        if ( !(is_logged) ) {
            return { name: "login" };
        }
    }

    if (is_logged && to.name === "login") { return { name: "home" }; }
})

export default router