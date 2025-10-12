import { Router } from "express";
import { ValidateAccessToken } from '../middleware/ValidateAccessTokenMiddleware';
const router: Router = Router();
import authRoute from "./authRoute";
import serviceRoute from './serviceRoute';
import channeRoute from './channelRoute';
import userRoute from './userRoute';
import chatRoute from './chatRoute';

import organizationRoute from './organizationRoute';

router.use('/auth', authRoute);
router.use('/service', ValidateAccessToken, serviceRoute);
router.use('/channel', ValidateAccessToken, channeRoute);
router.use('/organization', ValidateAccessToken, organizationRoute);
router.use('/user', ValidateAccessToken, userRoute);
router.use('/chat', ValidateAccessToken, chatRoute);

export default router;