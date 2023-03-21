export function getLocale():string {
    return localStorage.getItem("locale") ?? window.navigator.language.split("-")[0];
}

export function setLocale(locale:string, i18n:any):void {
    localStorage.setItem("locale", locale);

    i18n.locale.value = locale;
    document?.querySelector("html")?.setAttribute("lang", locale);
}