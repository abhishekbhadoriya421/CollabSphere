import { Router } from "express";
const router: Router = Router();
import authRoute from "./authRoute";
import serviceRoute from './serviceRoute';
import channeRoute from './channelRoute';
import { ValidateAccessToken } from '../middleware/ValidateAccessTokenMiddleware';
import organizationRoute from './organizationRoute';

router.use('/auth', authRoute);
router.use('/service', ValidateAccessToken, serviceRoute);
router.use('/channel', ValidateAccessToken, channeRoute);
router.use('/organization', ValidateAccessToken, organizationRoute);

export default router;