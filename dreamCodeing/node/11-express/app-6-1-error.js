import express from 'express';
import fs from 'fs';
import fsAsync from 'fs/promises';
const app = express();

/* 
 ### express에서 동기적, 비동기적으로 에러를 처리하는 방법 
  1. 비동기
  2. 동기
  3. promise
  4. async ~ await

  ### 핵심
  - 에러는 발생한 곳에서 처리하라
  - 에러 미들웨어는 마지막 보루다.
  - 4버전에서는 비동기 로직의 에러를 미들웨어로 처리할 수 없다.
*/

// json을 파싱하는 미들웨어 선언
app.use(express.json());

/* 비동기 코드 에러 처리 */
app.get('/file', (req, res) => {
  fs.readFile('/file1.txt', (err, data) => {
    // 에러를 처리한 코드
    if (err) {
      console.log('/file : 파일 없음');
      // 파일이 없어서 발생하는 에러이기 때문에 404를 보낸다.
      res.sendStatus(404); // -> Not Found 응답된다.
    }
  });
});

/* 동기 코드에러 처리 */
app.get('/file1', (req, res) => {
  try {
    const data = fs.readFileSync('/file1.txt');
    res.send(data);
  } catch (e) {
    console.log('/file1 : 파일 없음');
    res.sendStatus(404);
  }
});

/* ### promise를 사용한 코드 
  - 비동기에서 발생하는 에러는 에러 미들웨어로 처리하지 못한다.
  - 즉, 비동기로 처리를 예외처리를 하지 않으면 서버를 죽일 수 있다.
*/
app.get('/file2', (req, res) => {
  fsAsync
    .readFile('/file2.txt') //
    .then(data => res.send(data))
    .catch(error => {
      console.log('/file2 : 파일 없음');
      res.sendStatus(404);
    });
});

/* ### async ~ await 코드 
  - async를 선언한 함수는 내부적으로 promise를 리턴한다.
  - async를 선언한 함수에서 await 동작을 할 수 있다.
  - await는 promise를 리턴하는 함수를 동기적으로 호출할 때 쓰인다. */
app.get('/file3', async (req, res) => {
  try {
    const data = await fsAsync.readFile('/file2.txt');
    res.send(data);
  } catch (e) {
    console.log('/file3 : 파일 없음');
    res.sendStatus(404);
  }
});

/* 
  ### 에러를 처리하는 미들웨어 선언 
  - 에러 미들웨어를 통해 에러를 처리하는 것도 방법이다.
  - 하지만 이렇게 하면 정확히 어떤 에러인지 알 수 없다.

  ### 가장 좋은 방법은 해당 로직에서 catch를 통해 예외처리를 하고
  - 처리하지 못한 경우만 에러 미들웨어를 사용하는 것이 좋다.
*/
app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(500) // 500 : 서버에러
    // json 파싱 미들웨어를 통해 json으로 응답
    .json({ massage: 'Something went wrong' });
});

/* 요청에 대한 라우트가 없는 경우 404처리 */
app.use((req, res, next) => {
  res.status(400).json({ massage: 'Not Found' });
});

/* promise + 비동기 로직에서 예외를 처리하지 않았을때 서버를 죽이지 않는 방법?
  - express 4버전에서는 하나하나 처리하지 않는 방법 말고는 없다.
  - express 5버전에서는 에러 미들웨어를 통해 예외를 처리가 가능하다고 한다.
*/

app.listen(8080);
