// validation 편의 기능을 제공하는 외부 미들웨어
import { body, validationResult } from 'express-validator';
import { validate, errMsg } from '../middleware/vaildator.js';

export const postValidator = [
  body('text').trim().isLength({ min: 3 }).withMessage('3글자 이상 작성하세요').notEmpty().withMessage(errMsg.notEmpty),
  // **수정 auth 적용으로 제거
  // body('username').trim().isAlpha().withMessage(errMsg.alpha).notEmpty().withMessage(errMsg.notEmpty).toLowerCase(),
  // body('name').trim().isAlpha().withMessage(errMsg.alpha).notEmpty().withMessage(errMsg.notEmpty),
  // body('url').trim().isURL().withMessage(errMsg.url),
  validate,
];

export const putValidator = [
  body('text').trim().isLength({ min: 3 }).withMessage('3글자 이상 작성하세요').notEmpty().withMessage(errMsg.notEmpty), //
  validate,
];
