import * as authService from '../services/authService.js';

/**
 * 회원가입 로직 실행 : 회원가입 -> 로그인 수행
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 * - success : 201 {token, username}
 * - fail : 409 {message}
 */
export const signUp = async (req, res, next) => {
  const user = req.body;
  const { username, password } = user;
  // 회원가입
  const isSuccess = await authService.signUp(user);
  if (!isSuccess) {
    return res.status(409).json({ message: `${username}는 이미 사용중인 username 입니다` });
    // **응답 코드 수정 : 400 -> 409
    // 400은 유효성 검증, 필수 여부에 대한 오류 응답이다.
    // 409는 충돌에 대한 응답으로 사용된다.
    // 회원가입시 id의 중복의 경우 충돌로 보기 때문에 409를 사용한다.
  }
  // login(JWT 발행) 실행
  return res.status(201).json({
    token: await authService.login(username, password),
    username: username,
  });
  // **응답 코드 수정 : 200 -> 201
  // 회원가입 이후 로그인을 수행한다 하더라도
  // 최초의 요청은 POST(자원의 생성)이기 때문에 201을 응답한다.
};

/**
 * login
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 * - success : 200 {token, username}
 * - fail : 401 {message}
 */
export const login = async (req, res, next) => {
  const { username, password } = req.body;
  const jwt = await authService.login(username, password);
  return jwt //
    ? res.status(200).json({ token: jwt, username: username })
    : res.status(401).json({ message: '등록된 사용자가 아니거나, 정보가 일치하지 않습니다.' });
  // **응답 코드 변경 : 400 -> 401
  // 401은 인증관한 오류
  // id, pw로 로그인을 시도하고 id, pw가 유효하지 않기 때문에 400으로 오해하기 쉽다.
  // 하지만 로그인은 인증에 관한 로직이고 로그인 실패는 인증의 실패이다.
  // 이때 사용할 수 있는 코드가 401 코드이다.
};

/**
 * me
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 * - 200 { token, username }
 */
export const me = (req, res, next) => {
  return res.status(200).json({
    token: req.token,
    username: req.username,
  });
};
