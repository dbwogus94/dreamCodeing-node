import { body } from 'express-validator';
import { errMsg, validate } from '../middleware/vaildator.js';

const firstToUpperCase = value => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

// 회원가입 validator
export const signupValidator = [
  body('username') // 아이디 : 영어 -> 필수
    .trim()
    .isAlpha()
    .withMessage(errMsg.alpha)
    .notEmpty()
    .withMessage(errMsg.notEmpty),
  body('password') // 패스워드 : 필수
    .trim()
    .notEmpty()
    .withMessage(errMsg.notEmpty),
  body('name') // 이름 : 영어 -> 첫글자 대문자 -> 필수
    .trim()
    .isAlpha()
    .withMessage(errMsg.alpha)
    .customSanitizer(firstToUpperCase)
    .notEmpty()
    .withMessage(errMsg.notEmpty),
  body('email') // 메일 : 메일 -> 필수
    .trim()
    .isEmail()
    .withMessage(errMsg.email)
    .notEmpty()
    .withMessage(errMsg.notEmpty),
  body('url') // 프로필 사진 : url
    .trim()
    .isURL()
    .withMessage(errMsg.url),
  validate,
];

export const loginValidator = [
  body('username') // 아이디 : 영어 -> 필수
    .trim()
    .isAlpha()
    .withMessage(errMsg.alpha)
    .notEmpty()
    .withMessage(errMsg.notEmpty),
  body('password') // 패스워드 : 필수
    .trim()
    .notEmpty()
    .withMessage(errMsg.notEmpty),
  validate,
];
