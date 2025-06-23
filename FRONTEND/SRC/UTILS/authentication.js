import { getAuthToken } from "./localstorage";

function isLoggedIn() {
    return getAuthToken() !== null;
}

function getLoginDetails() {
    const token = getAuthToken();
    if (token === null) return {};

    const payload = token.split('.')[1];
    const data = atob(payload);
    return JSON.parse(data);
}



export { isLoggedIn, getLoginDetails };