// validation 편의 기능을 제공하는 외부 미들웨어
import { body, validationResult } from 'express-validator';
import { validate } from '../middleware/vaildator.js';

const errMsg = {
  notEmpty: '필수 값입니다.',
  alpha: '영어만 사용할 수 있습니다.',
};

export const postValidator = [
  body('text').trim().isLength({ min: 3 }).withMessage('3글자 이상 작성하세요').notEmpty().withMessage(errMsg.notEmpty),
  body('username').trim().isAlpha().withMessage(errMsg.alpha).notEmpty().withMessage(errMsg.notEmpty).toLowerCase(),
  body('name').trim().isAlpha().withMessage(errMsg.alpha).notEmpty().withMessage(errMsg.notEmpty),
  body('url').trim().isURL().withMessage('url 형식이 아닙니다.'),
  validate,
];

export const putValidator = [
  body('text').trim().isLength({ min: 3 }).withMessage('3글자 이상 작성하세요').notEmpty().withMessage(errMsg.notEmpty), //
  validate,
];
