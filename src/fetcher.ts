import { IYasRoute } from "./abstract/IYasRoute";
import { DefaultYasUser, IYasUser } from "./abstract/IYasUser";

const baseUrl = window.location.origin; // "https://ib-nuc.ivan-b.com" //

export async function FetchUser(telegramId: number): Promise<IYasUser> {
    var yasUser = DefaultYasUser;
    try {
        const response = await fetch(`${baseUrl}/yas-api/user-store/users/${telegramId}`);
        if (response.ok)
            yasUser = await response.json();
    } catch (error) {
        console.log(error);
    }
    return yasUser;
}

export async function FetchRoutes(token: string): Promise<IYasRoute[]> {
    try {
        const response = await fetch(`${baseUrl}/yas-api/route-store/users/${token}/routes`);
        if (response.ok)
            return await response.json();
    } catch (error) {
        console.log(error);
    }
    return [];
}

export async function FetchRenameRoute(token: string, routeId: number, routeName: string): Promise<boolean> {

    try {
        const response = await fetch(
            `${baseUrl}/yas-api/route-store/users/${token}/routes/${routeId}`, 
            {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ routeName: routeName })
            });
        if (response.ok)
            return true;
    } catch (error) {
        console.log(error);
    }
    return false;
}

export async function FetchDeleteRoute(token: string, routeId: number): Promise<boolean> {

    try {
        const response = await fetch(
            `${baseUrl}/yas-api/route-store/users/${token}/routes/${routeId}`, 
            {
                method: "DELETE",
            });
        if (response.ok)
            return true;
    } catch (error) {
        console.log(error);
    }
    return false;
}
