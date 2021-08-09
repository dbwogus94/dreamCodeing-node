import express from 'express';
import {} from 'express-async-errors';
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as authController from '../controller/auth.js';

const router = express.Router();

// 로그인 관련 유효성 검사 리스트
const validateCredential = [
  body('username') // username : 위생화 -> 필수 확인
    .trim()
    .notEmpty()
    .withMessage('username should be at least 5 characters'),
  body('password') //
    .trim()
    .isLength({ min: 5 })
    .withMessage('password should be at least 5 characters'),
  validate,
];

// 회원가입 관련 유효성 검사 리스트
const validateSignup = [
  ...validateCredential,
  // name : 필수 확인
  body('name').notEmpty().withMessage('name is missing'),
  // email : email 포멧인지 확인 ->
  body('email').isEmail().normalizeEmail().withMessage('invalid email'), // normalizeEmail() ?
  // url : url은 옵션(optional)이다 : url 포멧인지 확인
  body('url') //
    .isURL()
    .withMessage('invalid URL')
    .optional({ nullable: true, checkFalsy: true }),
  // -> nullable: true  - 빈값 사용이 가능하다.
  // -> checkFalsy: true - 값을 불린형으로 판별('', 0, false, null, undefined)했을때 false라도 사용이 가능하다.
  validate,
];

router.post('/signup', validateSignup, authController.signup);

router.post('/login', validateCredential, authController.login);

export default router;
