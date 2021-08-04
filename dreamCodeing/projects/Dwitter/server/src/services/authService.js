import jwt from 'jsonwebtoken'; // jwt
import bcrypt from 'bcrypt'; // 비밀번호 암호화
import * as userService from '../services/userService.js';

// TODO : 설정 파일을 만들어서 외부에서 설정하도록 변경 해야한다.
// jwt 설정
export const secret = 'Tmkiqod&nGrmn7MS#udJmOlZSv8aZ&K8';
const JWTOptions = {
  expiresIn: '2h', // 만료시간
  issuer: 'Dwitter.com', // 발행인
  subject: 'userInfo', // 내용
};
// bcrypt 설정
const saltRound = 10;

/**
 * Sign Up
 * @param {*} user
 * @returns user
 * - user : 회원가입 성공
 * - undefined : 저장 실패
 */
export const signUp = async user => {
  const isExist = await userService.findByUsername(user.username);
  if (isExist) {
    return false; // 중복된 name
  }
  const hashed = await bcrypt.hash(user.password, saltRound);
  user.password = hashed;
  return userService.createUser(user);
};

/**
 * Create JWT
 * @param {*} username
 * @param {*} hashPassword
 * @returns JWT
 * - JWT : 가입된 유저인 경우
 * - false : 가입된 유저가 아닌경우
 */
export const createJWT = async (username, hashPassword) => {
  const user = await userService.findUser(username, hashPassword);
  // user이 존재하지 않는다면
  if (!user) {
    return false;
  }
  // 존재한다면?
  delete user.password; // 패스워드는 제거
  return jwt.sign(user, secret, JWTOptions);
};

/**
 * login
 * @param {*} username
 * @param {*} password
 * @returns JWT
 * JWT : 로그인 성공
 * false : 로그인 실패
 */
export const login = async (username, password) => {
  // username로 일치하는 유저 찾기
  const user = await userService.findByUsername(username);
  if (!user) {
    return false;
  }
  // 존재한다면? 해쉬된 비밀번호와 비교
  const result = await bcrypt.compare(password, user.password);
  delete user.password; // 패스워드는 제거
  return result //
    ? jwt.sign(user, secret, JWTOptions)
    : false;
};
