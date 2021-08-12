import express from 'express';
import 'express-async-errors';
import * as authController from '../controllers/authController.js';
import { loginValidator, signupValidator } from '../validator/authValidator.js';
// jwt가 유효한지 확인하는 미들웨어
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

// auth/signup
router.post('/signup', signupValidator, authController.signUp);

// auth/login
router.post('/login', loginValidator, authController.login);

// auth/me : jwt 토큰이 유효한지 확인하는 API
// -> 토큰 확인을 통해 자동 로그인같은 것을 구현한다.
router.get('/me', isAuth, authController.me);

export default router;
