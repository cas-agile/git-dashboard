export function getLocale():string {
    return localStorage.getItem("locale") ?? window.navigator.language.split("-")[0];
}

export function setLocale(locale:string):void {
    localStorage.setItem("locale", locale);
}