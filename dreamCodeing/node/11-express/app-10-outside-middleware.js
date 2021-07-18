import express from 'express';
import cookieRouter from './router/cookie.js';
/* 1. cookie-parser : cookie를 파싱하는 외부 미들웨어 */
import cookieParser from 'cookie-parser';
/* 2. morgan : 서버 모니터링 로그 생성기능을 제공하는 미들웨어 */
import morgan from 'morgan';
/* 3. helmet : 공통 보안 헤더를 생성해주는 미들웨어  */
import helmet from 'helmet';

const app = express();

/* ### cookie 파서 미들웨어 등록 
  - req.cookies에 쿠키가 파싱된다.
*/
app.use(cookieParser());
/* ### morgan 미들웨어 등록 
  - 등록만 해도 서버 모니터링에 유용한 로그를 출력한다.
  - morgan은 인자로 로그 출력 format 타입을 받는다.
  - defult는 'combined'(아파치 결합 형식)이다.
  - 이외에도 [common, dev, short, tiny] 같은 것이 있다.
*/
app.use(morgan('dev'));

/* ### helmet 미들웨어 등록
  - 공통적으로 보안에 필요한 헤더를 등록해주는 미들웨어이다.
  - 아래는 설정만 해도 기본적으로 추가 되는 헤더이다.
    X-Content-Type-Options: nosniff
    X-DNS-Prefetch-Control: off
    X-Download-Options: noopen
    X-Frame-Options: SAMEORIGIN
    X-Permitted-Cross-Domain-Policies: none
    X-XSS-Protection: 0
 */
app.use(helmet());

// 쿠키 관련 처리 라우터
app.use('/cookies', cookieRouter);
app.listen(8080);
