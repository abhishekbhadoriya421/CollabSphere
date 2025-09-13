import { Router } from "express";
const router: Router = Router();
import authRoute from "./authRoute";

router.use('/auth', authRoute);

export default router;