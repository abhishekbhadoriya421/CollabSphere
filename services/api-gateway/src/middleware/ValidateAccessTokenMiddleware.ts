import { Authentication } from '../service/JWT_Authentication';
import { Request, Response, NextFunction } from 'express';


export const ValidateAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader?.split(' ')[1];
    if (!accessToken) {
        return res.redirect('back');
    }

    const authenticate = Authentication.getInstance();
    const isValid = authenticate.Verify_Access_Token(accessToken);
    if (!isValid) {
        return res.redirect('back');
    }
    next();
}


export const ValidateRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
    const refreshToken = authHeader?.split(' ')[1];
    if (!refreshToken) {
        return res.redirect('back');
    }

    const authenticate = Authentication.getInstance();
    const isValid = authenticate.Verify_Refresh_Token(refreshToken);
    if (!isValid) {
        return res.redirect('back');
    }
    next();
}