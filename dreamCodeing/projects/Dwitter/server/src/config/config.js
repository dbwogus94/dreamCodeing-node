// dotenv은 환경 설정을 위한 모듈이다.
import dotenv from 'dotenv';
import path from 'path';

// dotenv은 루트 경로의 .env 파일을 읽어서 환경변수를 설정한다.
// -> process.env를 사용하여 설정한 정보에 접근 할 수 있다.

// 1) 단순 사용
// dotenv.config();

// 2) 사용환경에 따라 다른 환경변수를 읽어오게 설정
dotenv.config({
  path: path.resolve(getEnvFile()),

  /*### path.resolve('.env')
    - path.resolve()에 '경로 구분자' 없는 문자열을 인자로 전달하는 경우
    - process.cwd()를 포함한 경로를 문자열로 내보낸다.
    - 즉, path.join(process.cwd(), '.env');과 동일 하다.
  */
});

/**
 * ### 노드 실행 환경에 따른 .env 파일명 리턴
 * @returns {string} .env file name
 */
function getEnvFile() {
  switch (process.env.NODE_ENV) {
    // 개발 환경
    case 'production':
      return '.env.dev';
    // 테스트 환경 => jest를 사용하는 경우 자동으로 NODE_ENV를 'test'로 설정한다.
    case 'test':
      return '.env.test';
    // 서비스 환경
    default:
      return '.env';
  }
}

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
    port: required('HOST_PORT', '8080'),
  },
  mongoDB: {
    host: required('MONGO_DB_HOST'),
  },
};
