import express from 'express';

import 'express-async-errors'; // 비동기 에러를 미들웨어가 잡을 수 있도록 처리
import cors from 'cors'; // cors 헤더 설정
import morgan from 'morgan'; // 모니터링 로거
import helmet from 'helmet'; // 공통 보안 헤더 설정
import cookieParser from 'cookie-parser';

import indexRouter from './routes/indexRouter.js';
import tweetRouter from './routes/tweetRouter.js';

const app = express();
const port = 8080;
const corsOptions = { origin: 'http://127.0.0.1:3000' };

/* 1. 미들웨어 설정 : 파서, 로가, 헤더 */
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

/* 2. 라우터 설정 : app.js는 라우터에만 의존한다. */
app.all('/', indexRouter);
app.use('/tweets', tweetRouter);

/* 3. 에러 처리 */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: 'server error' });
});

/* 4. 404 요청 처리 */
app.use((req, res, next) => {
  console.info('[라우트 없음 : 404]');
  res.sendStatus(404);
});

app.listen(port);
