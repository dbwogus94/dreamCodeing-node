/**
 * express 5.x.x 버전 테스트
 * - 비동기 중 발생하는 에러 미들웨어로 예외를 처리 테스트
 *
 * ### 테스트 결과를 보고 알 수 있는 중요한 포인트
 * 1. promise를 사용하는 미들웨어 비동기 예외 처리
 *  - promise를 사용하는 미들웨어에서 예외를 처리하려면
 *    반드시 return 키워드를 통해 promise를 리턴해야 한다.
 *  Q) return을 하지 않는다면?
 *  A) express는 해당 미들웨어에서 비동기 예외가 발생하는지 알지 못해 예외를 처리할 수 없다.
 *
 * 2. async를 사용하는 미들웨어 비동기 예외 처리
 *  - async를 사용하는 함수는 내부적으로 promise 리턴하도록 만든다.
 *    그렇기 때문에 async를 사용하는 미들웨어에서 예외가 발생하면 express는
 *    예외가 발생한 것을 인지하고 에러 미들웨어를 호출 예외를 처리한다.
 *
 * ### 5버전에서 비동기 예외처리를 하는 방법을 정리해보면
 *   - promise에서 발생하는 예외를 미들웨어에서 받으려면 promise를 return 해야한다
 *   - async는 자동으로 promise를 리턴하기 때문에 미들웨어 예외를 받을 수 있다.
 */
import express from 'express';
import fs from 'fs';
import fsAsync from 'fs/promises';
const app = express();

// json을 파싱하는 미들웨어 선언
app.use(express.json());

/* ### promise를 사용한 코드 */
// promise를 리턴하는 함수에는 async를 붙여주는것이 관례이다.
app.get('/file2', async (req, res) => {
  return fsAsync
    .readFile('/file2.txt') //
    .then(data => res.send(data));
});

/* ### async ~ await 코드 
   - async를 선언한 함수는 내부적으로 promise를 리턴한다.
   - async를 선언한 함수에서 await 동작을 할 수 있다.
   - await는 promise를 리턴하는 함수를 동기적으로 호출할 때 쓰인다. */
app.get('/file3', async (req, res) => {
  const data = await fsAsync.readFile('/file2.txt');
  res.send(data);
});

/* 
   ### 에러를 처리하는 미들웨어 선언 
   - 에러 미들웨어를 통해 에러를 처리하는 것도 방법이다.
   - 하지만 이렇게 하면 정확히 어떤 에러인지 알 수 없다.
 
   ### 가장 좋은 방법은 해당 로직에서 catch를 통해 예외처리를 하고
   - 처리하지 못한 경우만 에러 미들웨어를 사용하는 것이 좋다.
 */
app.use((error, req, res, next) => {
  console.error('[전역 예외 처리]', error);
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
