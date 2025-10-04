import { Router } from "express";
import { SearchUserAction } from "../controller/UserController";
const router: Router = Router();

router.get('/search', SearchUserAction);

export default router;