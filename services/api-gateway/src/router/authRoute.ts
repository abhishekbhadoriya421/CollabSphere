import { Router } from "express";
import { LoginAction } from "../controller/AuthenticationController";
const router: Router = Router();

router.post('/login', LoginAction);

export default router;