import express from 'express';
import postRouter from './router/post.js';
import userRouter from './router/user.js';
const app = express();

/* ### app-7-route-before.js의 문제를 해결하기 위한 코드이다. */

/* ### 모든 경로 전처리 작업 */
// json 파싱
app.use(express.json());
// logger
app.use('/', (req, res, next) => {
  console.log(new Date(Date.now()));
  console.log(req.method + ': ' + req.path);
  next();
});

/* 도메인 별로 라우터가 처리 하도록 로직 변경 
	- use()를 통해 해당 path가 포함된 요청은 라우터로 넘긴다.
*/
app.use('/posts', postRouter);
app.use('/users', userRouter);

/* 에러처리 */
app.use((err, req, res, next) => {
  res.status(500).json({ message: 'server Error' });
});
/* 404 처리 */
app.use((req, res, next) => {
  res.sendStatus(404);
});

app.listen(8080);
