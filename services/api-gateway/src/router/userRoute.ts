import { Router } from "express";
import { SearchUserAction } from "../controller/UserController";
const router: Router = Router();


router.get('/search-user', SearchUserAction);

export default router;