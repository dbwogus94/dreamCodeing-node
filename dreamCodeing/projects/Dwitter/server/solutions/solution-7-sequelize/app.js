/**
 * # 강의 솔루션 진행 코드
 */
import express from 'express';
import 'express-async-errors'; // 비동기 예외 처리
import cors from 'cors'; // cors 헤더 설정
import morgan from 'morgan'; // 편의성 로거
import helmet from 'helmet'; // 보안 공통 헤더 설정
/* 설정 정보를 가진 객체 */
import { config } from './config.js';
/* 라우터 */
import tweetsRouter from './router/tweets.js';
import authRouter from './router/auth.js';
/* 소켓 */
import { initSocket } from './connection/socket.js';
/* sequelize 인스턴스화 */
import { sequelize } from './db/database.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

app.use('/tweets', tweetsRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

// ### sequelize models과 DB tables 동기화 => models에 맞춰 DB에 table 생성
// ** 해당 옵션은 개발시점에만 사용해야한다.
await sequelize.sync();

// ### express 서버 리스닝
const server = app.listen(config.host.port);

// ### socket.io를 구현한 class Socket 인스턴스화
initSocket(server);
