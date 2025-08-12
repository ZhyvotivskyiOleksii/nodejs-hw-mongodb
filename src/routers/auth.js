import express from 'express';
import { registerController, loginController, refreshController, logoutController, sendResetEmail, resetPassword } from '../controllers/authController.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, sendResetEmailSchema, resetPwdSchema } from '../schemas/authSchemas.js';

export const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), registerController);
authRouter.post('/login', validateBody(loginSchema), loginController);
authRouter.post('/refresh', refreshController);
authRouter.post('/logout', logoutController);
authRouter.post('/send-reset-email', validateBody(sendResetEmailSchema), sendResetEmail);
authRouter.post('/reset-pwd', validateBody(resetPwdSchema), resetPassword);
