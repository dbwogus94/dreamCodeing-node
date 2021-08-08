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

// 설정한 정보를 읽는 방법 : ex) process.env.port
