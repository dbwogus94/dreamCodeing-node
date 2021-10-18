// 날짜에 대한 포멧을 지원하는 모듈
import moment from 'moment';
// 설정값을 가진 객체 호출
import { config } from './config/config.js';
// app에 적용되는 공통 모듈
import express from 'express';
import cors from 'cors'; // cors 헤더 설정
import morgan from 'morgan'; // 모니터링 로거
import helmet from 'helmet'; // 공통 보안 헤더 설정
import cookieParser from 'cookie-parser'; // 쿠키 파서 미들웨어
import 'express-async-errors'; // 비동기 에러 처리 미들웨어
// 라우터
import indexRouter from './routes/indexRouter.js';
import tweetRouter from './routes/tweetRouter.js';
import authRouter from './routes/authRouter.js';
// 소켓
import { initSocket } from './connection/socket.js';
// mongoDB
import database from './db/database.js';
const { connectDB, dropCollection } = database;

const app = express();

/* 1. 미들웨어 설정 : 파서, 로간, 헤더 */
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

/* 2. 라우터 설정 : app.js는 라우터에만 의존한다. */
app.all('/', indexRouter);
app.use('/tweets', tweetRouter); // 트윗
app.use('/auth', authRouter); // 인증

/* 3. 서버 에러 처리 미들웨어 */
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ msg: 'server error' });
});

/* 4. 404 요청 처리 */
app.use((req, res, next) => {
  console.info('[라우트 없음 : 404]');
  res.sendStatus(404);
});

/* 5. 네트워크 : mongoDB connected, express listen, socket connected */

// 1) mongoDB 연결
connectDB()
  .then(async db => {
    // 존재하는 collection 모두 drop
    await dropCollection(db);

    // 2) expree http server listen
    const server = app.listen(config.host.port, () => {
      const koreaDate = moment().format('yyyy-MM-DD HH:mm:ss');
      console.log(`[${koreaDate}] listen on Server, port is ${config.host.port}`);
    });
    // 3) 웹 소켓 생성 및 연결
    initSocket(server);
  })
  .catch(console.error);
