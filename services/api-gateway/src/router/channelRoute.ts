import { Router } from "express";
const router: Router = Router();
import { GetChannelsByIdAction } from '../controller/ChannelController';

router.post('/get-user-channel', GetChannelsByIdAction);


export default router;