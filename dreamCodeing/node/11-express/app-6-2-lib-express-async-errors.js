import express from 'express';
import fs from 'fs';
import fsAsync from 'fs/promises';
/* 
 ### express 4버전에서 비동기 예외를 처리하는 방법
  - express-async-errors : 외부 라이브러리를 사용한다. 
  - 선언만 하면 5버전에서 제공하는 방법으로 사용이 가능하다.

 ### 사용방법
  1. 미들웨어가 promise를 리턴하도록 만들어라.
  2. async 키워드를 통해 내부적으로 promise를 리턴하도록 만들어라.

*/
import 'express-async-errors';

const app = express();

// json을 파싱하는 미들웨어 선언
app.use(express.json());

/* ### promise를 사용한 코드 */
app.get('/file2', async (req, res) => {
  return fsAsync
    .readFile('/file2.txt') //
    .then(data => res.send(data));
});

/* ### async ~ await 코드 */
app.get('/file3', async (req, res) => {
  const data = await fsAsync.readFile('/file2.txt');
  res.send(data);
});

/*  ### 에러를 처리하는 미들웨어 선언 */
app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(500) // 500 : 서버에러
    // json 파싱 미들웨어를 통해 json으로 응답
    .json({ massage: 'Something went wrong' });
});

app.listen(8080);
