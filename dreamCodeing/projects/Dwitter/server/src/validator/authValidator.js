import { body } from 'express-validator';
import { errMsg, validate, validate_detailMsg } from '../middleware/vaildator.js';

const firstToUpperCase = value => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

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

// 회원가입 validator
export const signupValidator = [
  // **수정 : 중복된 코드 Spread Syntax를 사용하여 처리
  ...loginValidator,
  body('name') // 이름 : 영어 -> 첫글자 대문자로 변경 -> 필수
    .trim()
    .isAlpha()
    .withMessage(errMsg.alpha)
    .customSanitizer(firstToUpperCase)
    .notEmpty()
    .withMessage(errMsg.notEmpty),
  body('email') // 메일 : 메일 포멧 확인 -> normalizeEmail -> errMsg.email
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage(errMsg.email),
  body('url') // 프로필 사진 : url 포멧 확인 -> optional 설정
    .trim()
    .isURL()
    .withMessage(errMsg.url)
    .optional({ nullable: true, checkFalsy: true }), // null 가능, fasle(0, '', ...)가능
  validate,
  //validate_detailMsg,
];
