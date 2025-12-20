import { Router } from "express";
import { getProfile, searchUsers } from "../controllers/userController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

router.get("/", searchUsers);   // search users to assign
router.get("/me", requireAuth, getProfile);   // current logged in user details

export default router;
