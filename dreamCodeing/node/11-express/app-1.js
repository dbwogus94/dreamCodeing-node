import express from 'express'; // es6 모듈
const app = express(); // express 생성

/* express 미들웨어 생성 */
app.get('/', (req, res, next) => {
  res.send('hi');
});

/* express는 리스너 설정만으로 서버는 동작한다. */
app.listen(8080);
