import { Request } from "express";
import { Authentication } from "../service/JWT_Authentication";

export function getUserId(req: Request) {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) {
        return false;
    }
    const authenticate = Authentication.getInstance();
    return authenticate.Verify_Access_Token(accessToken);
}