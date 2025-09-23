import { Router } from "express";
const router: Router = Router();
import authRoute from "./authRoute";
import serviceRoute from './serviceRoute';
import channeRoute from './channelRoute';

router.use('/auth', authRoute);
router.use('/service', serviceRoute);
router.use('/channel', channeRoute)

export default router;