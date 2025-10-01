import { Router } from "express";
import { createOrganizationAction, getOrganizationAction, addUserAction, deleteUserAction } from "../controller/OrganizationController";
const router: Router = Router();

router.post('/create-ou', createOrganizationAction);
router.post('/add-user', addUserAction);
router.delete('/delete-user/:user_id', deleteUserAction);
router.get('/get-ou', getOrganizationAction);

export default router;