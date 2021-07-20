/**
 * # 강의 솔루션 진행 코드
 */
import express from 'express';
import 'express-async-errors'; // 비동기 예외 처리

import cors from 'cors'; // cors 헤더 설정
import morgan from 'morgan'; // 편의성 로거
import helmet from 'helmet'; // 보안 공통 헤더 설정

import tweetsRouter from './router/tweets.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));

app.use('/tweets', tweetsRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});

app.listen(8080);
