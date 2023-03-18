import { createRouter, createWebHistory } from "vue-router"
import Home from "@/views/home/Home.vue"
import Login from "@/views/login/Login.vue"
import LoginFail from "@/views/login/Fail.vue"

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
})

export default router