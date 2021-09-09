import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as userRepository from '../data/auth.js';
// 설정 정보를 가진 객체
import { config } from '../config.js';

// 회원가입
export async function signup(req, res, next) {
  const { username, password, name, email, url } = req.body;
  // 1) 중복확인
  const found = await userRepository.findByUsername(username);
  if (found) {
    // 409(충돌) : 이미 사용중인 자원(이름)이라서 충돌 발생
    return res.status(409).json({ message: `${username} already existe` });
  }
  // 2) 비밀번호 암호화(해싱)
  const hashed = await bcrypt.hash(password, config.bcrypt.saltRounds);
  // 3) DB에 등록 : id를 반환받는다.
  const userId = await userRepository.createUser({
    username,
    password: hashed,
    name,
    email,
    url,
  });
  // 4) jwt 토큰 발행
  const token = createJwtToken(userId);
  // 5) 응답
  res.status(201).json({ token, username });
}

// 로그인
export async function login(req, res, next) {
  const { username, password } = req.body;
  // 1) 유저 조회
  const user = await userRepository.findByUsername(username);
  if (!user) {
    // 등록된 유저가 없는 경우
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  // 2) 비밀번호 확인
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    // 비밀번호가 일치하지 않는 경우
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  // 3) jwt 토큰 발행
  const token = createJwtToken(user.id);
  // 4) 응답
  res.status(200).json({ token, username });
}

// 토큰 생성
function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secreKey, { expiresIn: config.jwt.expiresInSec });
}

export async function me(req, res, next) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, username: user.username });
}
