import { Request } from "express";
import { Authentication } from "../service/JWT_Authentication";

export function getUserId(req: Request) {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) {
        return false;
    }
    const authenticate = Authentication.getInstance();
    const userAuth = authenticate.Verify_Access_Token(accessToken);
    if (!userAuth) {
        const refreshToken = req.cookies.refreshToken;
        const userAuth = authenticate.Verify_Refresh_Token(refreshToken);
        return userAuth ? userAuth.user_id : false;
    }
    return userAuth.user_id;
}