import { Router } from "express";
const router: Router = Router();
import { GetChannelsByIdAction, GetDmChannel } from '../controller/ChannelController';

router.get('/get-dm-channel/:target_user_id', GetDmChannel);
router.post('/get-user-channel', GetChannelsByIdAction);


export default router;