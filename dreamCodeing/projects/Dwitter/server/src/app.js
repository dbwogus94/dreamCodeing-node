import express from 'express';
import cors from 'cors'; // cors 헤더 설정
import morgan from 'morgan'; // 모니터링 로거
import helmet from 'helmet'; // 공통 보안 헤더 설정
import cookieParser from 'cookie-parser';

// 모든 라우터 마다 선언해야한다.
import 'express-async-errors'; // 비동기 에러를 미들웨어가 잡을 수 있도록 처리

// dotenv를 사용한 환경설정
import '../src/config/env.js';

// 라우터
import indexRouter from './routes/indexRouter.js';
import tweetRouter from './routes/tweetRouter.js';
import authRouter from './routes/authRouter.js';

const app = express();

/* 1. 미들웨어 설정 : 파서, 로가, 헤더 */
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

/* 2. 라우터 설정 : app.js는 라우터에만 의존한다. */
app.all('/', indexRouter);
app.use('/tweets', tweetRouter); // 트윗
app.use('/auth', authRouter); // 인증

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

app.listen(process.env.PORT);
