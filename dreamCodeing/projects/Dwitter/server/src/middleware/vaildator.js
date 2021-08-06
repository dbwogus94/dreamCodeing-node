import { validationResult } from 'express-validator';

export const errMsg = {
  notEmpty: '필수 값입니다.',
  alpha: '영어만 사용할 수 있습니다.',
  url: 'url 형식이 아닙니다.',
  email: 'email 형식이 아닙니다.',
};

const printMsg = (body, errMsg) => {
  console.info('[validation body] : ', body);
  console.info('[validation fail] : \n\t', errMsg);
};

/**
 * validation 성공 실패 처리 공통 미들웨어 - 심플 메시지
 */
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

  printMsg(req.body, errMsg);

  return res.status(400).json({
    message: errMsg,
  });
};

/**
 * validation 성공 실패 처리 공통 미들웨어 - 자세한 메시지
 */
export const validate_detailMsg = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // 검증을 통과하지 못한 모든 내용을 errMsg에 담는다.
  const errMsg = errors.array().reduce((accumulator, current) => {
    let obj = {};
    obj['location'] = current.location;
    obj['param'] = current.param;
    obj['value'] = current.value;
    obj['message'] = current.msg;
    accumulator.push(obj);
    return accumulator;
  }, []);

  printMsg(req.body, errMsg);

  return res.status(400).json({
    errors: errMsg,
  });
};
