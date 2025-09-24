import { Router } from "express";
const router: Router = Router();
import authRoute from "./authRoute";
import serviceRoute from './serviceRoute';
import channeRoute from './channelRoute';
import { ValidateAccessToken } from '../middleware/ValidateAccessTokenMiddleware';

router.use('/auth', authRoute);
router.use('/service', ValidateAccessToken, serviceRoute);
router.use('/channel', ValidateAccessToken, channeRoute)

export default router;