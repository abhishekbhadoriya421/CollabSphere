import { Router } from "express";
import { createOrganizationAction, getOrganizationAction, addUserAction } from "../controller/OrganizationController";
const router: Router = Router();

router.post('/create-ou', createOrganizationAction);
router.post('/add-user', addUserAction);
router.get('/get-ou', getOrganizationAction);

export default router;