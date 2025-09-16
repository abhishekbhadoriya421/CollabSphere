import { Router } from "express";
import { LoginAction, RegisterAction, PageReloadAction } from "../controller/AuthenticationController";
const router: Router = Router();

router.post('/login', LoginAction);
router.post('/register', RegisterAction);
router.post('/refresh', PageReloadAction);

export default router;