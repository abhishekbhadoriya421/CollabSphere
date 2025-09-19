import { Router } from "express";
const router: Router = Router();
import authRoute from "./authRoute";
import serviceRoute from './serviceRoute';

router.use('/auth', authRoute);
router.use('/service', serviceRoute)

export default router;