import { Authentication } from '../service/JWT_Authentication';
import { Request, Response, NextFunction } from 'express';


export const ValidateAccessToken = (req: Request, res: Response, next: NextFunction) => {
    const { accessToken } = req.body;
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