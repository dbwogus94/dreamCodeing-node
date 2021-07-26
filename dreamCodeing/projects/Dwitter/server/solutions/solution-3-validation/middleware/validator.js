import { validationResult } from 'express-validator';
/* 유효성 검증 통과 여부 확인하는 미들웨어 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  // 검증에 실패한 첫번째 값의 msg만 응답
  return res.status(400).json({ message: errors.array()[0].msg });
};
