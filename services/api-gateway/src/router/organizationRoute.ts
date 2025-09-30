import { Router } from "express";
import { createOrganizationAction, getOrganizationAction } from "../controller/OrganizationController";
const router: Router = Router();

router.post('/create-ou', createOrganizationAction);
router.get('/get-ou', getOrganizationAction);

export default router;