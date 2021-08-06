import * as authService from '../services/authService.js';

/**
 * 회원가입 로직 실행 : 회원가입 -> JWT 발행
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 * - success : 200 {token, username}
 * - fail : 400 {message}
 */
export const signUp = async (req, res, next) => {
  // 회원가입
  const user = req.body;
  const isSuccess = await authService.signUp(user);
  if (!isSuccess) {
    return res.status(400).json({ message: `${req.body.username}는 이미 사용중인 username 입니다` });
  }
  // login(JWT 발행) 실행
  return res.status(200).json({
    token: await authService.login(user.username, user.password),
    username: user.username,
  });
};

/**
 * login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 * - success : 200 {token, username}
 * - fail : 400 {message}
 */
export const login = async (req, res, next) => {
  const jwt = await authService.login(req.body.username, req.body.password);
  return jwt //
    ? res.status(200).json({ token: jwt, username: req.body.username })
    : res.status(400).json({ message: '등록된 사용자가 아니거나, 정보가 일치하지 않습니다.' });
};

export const me = (req, res, next) => {};
