import { GetActivityAction } from '../controller/ServicesController';
import { Router } from "express";
const router: Router = Router();

router.get('/get-activity', GetActivityAction)


export default router;