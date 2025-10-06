import { Router } from "express";
import { createOrganizationAction, getOrganizationAction, addUserAction, deleteUserAction, updateOrganizationAction } from "../controller/OrganizationController";
const router: Router = Router();

router.post('/create-ou', createOrganizationAction);
router.post('/add-user', addUserAction);
router.post('/update-ou', updateOrganizationAction);
router.delete('/delete-user/:user_id', deleteUserAction);
router.get('/get-ou', getOrganizationAction);

export default router;