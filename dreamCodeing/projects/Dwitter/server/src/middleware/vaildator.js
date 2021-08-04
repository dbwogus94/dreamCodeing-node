import { validationResult } from 'express-validator';

export const errMsg = {
  notEmpty: '필수 값입니다.',
  alpha: '영어만 사용할 수 있습니다.',
  url: 'url 형식이 아닙니다.',
  email: 'email 형식이 아닙니다.',
};

// validation 성공 실패 처리 공통 미들웨어
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // 검증을 통과하지 못한 모든 내용을 errMsg에 담는다.
  const errMsg = errors.array().reduce((accumulator, current) => {
    accumulator[current.param] = current.msg;
    return accumulator;
  }, {});
  console.info('[validation body] : ', req.body);
  console.info('[validation fail] : \n\t', errMsg);
  return res.status(400).json({
    message: errMsg,
  });
};

// TODO 오류메시지 자세한 버전 개발예정
