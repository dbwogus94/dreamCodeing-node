import express from 'express';
// 비동기 에러를 잡는 미들웨어 라우터 마다 선언해야한다.
import 'express-async-errors';
const router = express.Router();

router.all('/', (req, res, next) => {
  console.log('test index ==================');
  res.redirect(301, '/tweets');
});

export default router;
