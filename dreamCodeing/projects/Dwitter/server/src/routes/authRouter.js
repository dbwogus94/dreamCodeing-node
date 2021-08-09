import express from 'express';
import 'express-async-errors';
import * as authController from '../controllers/authController.js';
import { loginValidator, signupValidator } from '../validator/authValidator.js';

const router = express.Router();

// auth/signup
router.post('/signup', signupValidator, authController.signUp);

// auth/login
router.post('/login', loginValidator, authController.login);

// auth/me
// TODO: 솔루션 이후 진행
router.get('/me');

export default router;
