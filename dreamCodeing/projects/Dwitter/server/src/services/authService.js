import jwt from 'jsonwebtoken'; // jwt
import bcrypt from 'bcrypt'; // 비밀번호 암호화
import * as userService from '../services/userService.js';
import { ObjUtil } from '../util/util.js';

/**
 * Sign Up
 * @param {object} user
 * @returns user
 * - user : 회원가입 성공
 * - undefined : 저장 실패
 */
export const signUp = async user => {
  const isExist = await userService.findByUsername(user.username);
  if (isExist) {
    return false; // 중복된 name
  }
  // 비밀번호 암호화 실행
  const hashed = await bcrypt.hash(user.password, Number(process.env.BCRYPT_ROUND));
  // **수정 : 깊은 복사로직으로 변경
  const newUser = ObjUtil.copyObj(user);
  newUser.password = hashed;
  // DB에 추가
  return await userService.createUser(newUser);
};

/**
 * login
 * @param {string} username
 * @param {string} password
 * @returns JWT
 * JWT : 로그인 성공
 * false : 로그인 실패
 */
export const login = async (username, password) => {
  // DB에서 username로 일치하는 유저 찾기
  const user = await userService.findByUsername(username);
  // 존재하지 않는다면?
  if (!user) {
    return false;
  }

  // 존재한다면? -> body의 비밀번호 해쉬된 비밀번호 비교
  const result = await bcrypt.compare(password, user.password);
  delete user.password; // jwt를 생성하기전에 패스워드는 제거한다.

  const JWTOptions = {
    expiresIn: process.env.JWT_EXPIRESIN, // 만료시간
    issuer: process.env.JWT_ISSUER, // 발행인
    subject: process.env.JWT_SUHJECT, // 내용
  };
  return result //
    ? jwt.sign(user, process.env.JWT_SECRET, JWTOptions) // 비밀번호 일치
    : false; // 비밀번호가 일치하지 않는다면
};
