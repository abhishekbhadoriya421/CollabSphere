import { Router } from "express";
import { LoginAction, RegisterAction } from "../controller/AuthenticationController";
const router: Router = Router();

router.post('/login', LoginAction);
router.post('/register', RegisterAction);

export default router;