import { Router } from "express";
import { LoginAction, RegisterAction, PageReloadAction, LogoutAction, ValidateAccessTokenAction } from "../controller/AuthenticationController";
const router: Router = Router();

router.post('/login', LoginAction);
router.post('/register', RegisterAction);
router.post('/refresh', PageReloadAction);
router.post('/logout', LogoutAction);
router.post('/validate-token', (req, res, next) => {
    console.log('validate token called');
    next();
}, ValidateAccessTokenAction);

export default router;