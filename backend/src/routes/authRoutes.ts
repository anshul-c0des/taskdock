import { Router } from 'express';
import { login, logout, register } from '../controllers/authController';
import { validate } from '../utils/validate';
import { createUserSchema, loginUserSchema } from '../schemas/userSchema';

const router = Router();

router.post('/register', validate(createUserSchema), register);  // register new user, with data validation
router.post('/login', validate(loginUserSchema), login);   // logs in existing user with email pass validation
router.post('/logout', logout);   // logs out current user

export default router;
