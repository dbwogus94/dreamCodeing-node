// 앱 구동시 .env 설정값을 읽어서 환경설정에 추가하는 모듈
import dotenv from 'dotenv';
dotenv.config({ path: '.env.solution' });

/*## config 모듈을 만들어서 설정값을 관리한다.

  ### config 사용하여 설정값을 관리하는 이유
    환경변수의 값을 저장하고 가져와 사용하는 것은 보안상 안전하지만.
    개발자가 오류를 범할 위험이 크다.(게다가 에디터 도움도 받을 수 없다) 
    런타임까지 해당 값이 오타가 있는지 빈값인지 알 수 없기 때문이다.
    이러한 문제점과 편의성을 위해 해당 모듈을 정의한다.

  ### 모듈의 기능
   1. 보안을 위해 .env파일을 읽어서 환경변수를 설정
   2. 오류를 방지하기 위해 설정값을 가진 config 객체를 만들어 export 한다.
    - 환경변수에 접근하여 값을 설정하는 것은 오류가 발생할 위험이 크다.
      ex) process.env.JWT_SECRET
    - config 객체를 만들어서 사용하면 vsCode의 도움을 받을수 있다.
      ex) config.jwt.secreKey
   3. 빈값에 대한 오류를 방지하기 위해 required() 함수를 정의하고 사용한다.
    - 모든 값을 설정할 때 하드코딩이 아닌 required()를 사용하여 설정한다.
    - 구동시 설정값이 빈값이라면 에러를 던저 설정할 수 있도록 가이드한다.
*/

/**
 * ### 환경변수에서 값을 가져온다.
 * - 값이 없으면 오류를 발생
 * @param {string} key 환경변수에서 가져올 key 값
 * @param {*} defaultValue :
 * @returns key에 대한 설정 값
 * @throws key가 설정되어 있지 않다면 에러를 던진다.
 */
function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    // null || undefineds 라면?
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}

/**
 * 환경설정에서 값을 꺼내 config 객체를 만든다.
 * - required() 함수를 사용하여, 기본값을 설정
 * - 값이 설정되어 있지 않으면 구동시 에러를 내보낸다.
 */
export const config = {
  jwt: {
    secreKey: required('JWT_SECRET'),
    expiresInSec: required('JWT_EXPIRES_SEC', 86400),
  },
  bcrypt: {
    saltRounds: Number(required('BCRYPT_SALT_ROUNDS', 12)), // number 타입만 가능하다.
  },
  host: {
    port: required('HOST_PORT', 8080),
  },
  mongoDB: {
    host: required('MONGO_DB_HOST'),
  },
};
