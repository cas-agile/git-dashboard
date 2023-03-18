import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./routes/router"
import { createI18n } from "vue-i18n";
import { getLocale } from "@/utilities/locale_handler"

const app = createApp(App);

console.log(getLocale());

app.use(router);
app.use(createI18n({
    legacy: false,
    locale: getLocale(),
    fallbackLocale: "it",
    messages: { "en": {}, "it": {} },
}));
app.mount("#app");
