// dotenv은 환경 설정을 위한 모듈이다.
import dotenv from 'dotenv';
import path from 'path';

// dotenv은 루트 경로의 .env 파일을 읽어서 환경변수를 설정한다.
// -> process.env를 사용하여 설정한 정보에 접근 할 수 있다.

// 1) 단순 사용
// dotenv.config();

// 2) 사용환경에 따라 다른 환경변수를 읽어오게 설정
dotenv.config({
  path: path.resolve(
    process.cwd(), // 프로젝트 루트 경로
    process.env.NODE_ENV == 'production' //
      ? '.env' // 서비스 환경인 경우
      : '.env.dev' // 개발 환경인 경우
  ),
});

/**
 * ### key에 해당하는 값을 환경변수에서 가져온다.
 * @param {string} key 필요한 값을 가진 환경설정 key
 * @param {*} defaultValue 가져온 값이 없을때 설정할 기본값
 * @returns value key에 대응하는 환경설정의 값
 * @throws key에 대한 값이 없다면(null, undefined)라면 에러를 던진다.
 */
function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    // null || undefined 라면?
    throw new Error(`key ${key} is undefined`);
  }
  return value;
}
// 설정값을 가진 객체
export const config = {
  jwt: {
    secreKey: required('JWT_SECRET'), // 비밀키
    expiresIn: required('JWT_EXPIRESIN', '1d'), // 만료시간
    issuer: required('JWT_ISSUER'), // 공급자
    subject: required('JWT_SUBJECT'), // 주제
  },
  bcrypt: {
    saltRounds: Number(required('BCRYPT_SALT_ROUNDS')),
  },
  host: {
    port: required('HOST_PORT', 8080),
  },
  mysql: {
    host: required('MYSQL_HOST', 'localhost'),
    user: required('MYSQL_USER', 'root'),
    database: required('MYSQL_DATABASE'),
    password: required('MYSQL_PASSWORD'),
  },
};
