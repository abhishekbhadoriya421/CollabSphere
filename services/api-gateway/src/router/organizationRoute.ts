import { Router } from "express";
import { createOrganizationAction } from "../controller/OrganizationController";
const router: Router = Router();

router.post('/get-ou', createOrganizationAction);

export default router;