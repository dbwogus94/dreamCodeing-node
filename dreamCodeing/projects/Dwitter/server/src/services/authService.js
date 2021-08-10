import jwt from 'jsonwebtoken'; // jwt
import bcrypt from 'bcrypt'; // 비밀번호 암호화
import * as userService from '../services/userService.js';
import { ObjUtil } from '../util/util.js';

/**
 * Sign Up
 * @param {object} user
 * @returns boolean
 * - true : 회원가입 성공
 * - false : 회원가입 실패
 */
export const signUp = async user => {
  // **수정: Object Destructuring를 사용하도록 변경
  const { username, password, name, email, url } = user;
  // 1) username 중복 확인
  const isExist = await userService.findByUsername(username);
  if (isExist) {
    return false; // 중복된 name
  }
  // 2) 비밀번호 암호화 실행
  const hashed = await bcrypt.hash(password, Number(process.env.BCRYPT_ROUND));

  // 3) DB에 추가
  return await userService.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });
};

/**
 * login
 * @param {string} username
 * @param {string} password
 * @returns JWT
 * - JWT : 로그인 성공 - userId를 payload에 담는다.
 * - false : 로그인 실패 - 가입된 유저 x || 비밀번호 불일치
 */
export const login = async (username, password) => {
  // 1) DB에서 username로 일치하는 유저 찾기
  const user = await userService.findByUsername(username);
  // 유저가 존재하지 않는다면?
  if (!user) {
    return false;
  }
  // 존재한다면?
  // 2) body의 비밀번호 해쉬된 비밀번호 비교
  const result = await bcrypt.compare(password, user.password);

  const JWTOptions = {
    expiresIn: process.env.JWT_EXPIRESIN, // 만료시간
    issuer: process.env.JWT_ISSUER, // 발행인
    subject: process.env.JWT_SUHJECT, // 내용
  };
  // 3) jwt 생성
  return result //
    ? jwt.sign(
        { id: user.id }, // payload
        process.env.JWT_SECRET, // 비밀키
        JWTOptions // jwt 옵션
      )
    : false;
};
