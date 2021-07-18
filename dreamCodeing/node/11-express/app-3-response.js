import os from 'os';
import path from 'path';
import express from 'express'; // es6 모듈
const app = express(); // express 생성

/* ### 상태 코드 응답 */
app.get('/', (req, res, next) => {
  /* 헤더 설정 */
  res.setHeader('key', 'value'); // 헤더는 key, value 형식으로 보내야 한다.
  /* 상태 코드 설정 */
  res.status(200).send('hi');
});

/* ### 상태 코드 설정후 바로 응답 */
app.get('/bad', (req, res, next) => {
  res.sendStatus(400); // 응답 메시제 : Bad Request
});

/* ### json으로 응답 */
app.get('/json', (req, res, next) => {
  /* json으로 응답 */
  res.json({ msg: 'hi' });
});

/* ### file로 응답 */
app.get('/file', (req, res, next) => {
  res.sendFile(path.join(os.homedir(), '_Pictures', 'test', 'js.png'), console.log);
});

/* express는 리스너 설정만으로 서버는 동작한다. */
app.listen(8080);
