import { Router } from "express";
import { LoginAction, RegisterAction, PageReloadAction, LogoutAction, ValidateRefreshTokenAction } from "../controller/AuthenticationController";
const router: Router = Router();

router.post('/login', LoginAction);
router.post('/register', RegisterAction);
router.post('/refresh', PageReloadAction);
router.post('/logout', LogoutAction);
router.post('/validate-token', ValidateRefreshTokenAction);

export default router;