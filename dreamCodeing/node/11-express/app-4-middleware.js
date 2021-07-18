import express from 'express';
import usersRouter from './usersRouter.js';
// import { usersRouter } from './usersRouter.js';
// import * as usersRouter from './usersRouter.js';
const app = express();

/* ### app.all()과 app.use()의 차이점
  - use는 설정된 path를 포함한 하위 경로까지 모두 받는다.
  - all은 설정된 path만을 받는다.
  - all을 use와 동일하게 동작시키려면 path에 '*'을 붙인다.
  ex) use('/test) == all('/test/*)
*/
app.use('/api', (req, res, next) => {
  // ex) /api/123 받음
  console.log('use');
  res.send('api');
});
app.all('/sky', (req, res, next) => {
  // ex) /sky/123 안받음
  console.log('all');
  res.send('sky');
});

/*
  ### express의 app.METHOD()와, 미들웨어 선언 순서의 중요성
  express는 요청에 따른 라우팅의 결과로 app.METHOD(라우트)를 호출한다.
  그리고 호출된 app.METHOD()의 callback로 미들웨어가 전달된다. 
  그렇기 때문에 express는 미들웨어의 선언 순서가 중요하다.
  (미들웨어는 선언한 순서대로 미들웨어를 찾고 체이닝 하기 때문이다.)
  - next()를 호출하지 않는다면 체이닝 되지 않음
  - res를 통해 응답을 하게되면 체이닝은 끝나고 바로 응답이 된다.
  - next()와 res.send()를 둘다 사용하지 않는다면 무한 로딩이 된다.
*/

/* ### 모든 요청에 호출 
  - 요청이 들어온 시간을 로그로 출력하는 미들웨어
*/
app.use('/', (req, res, next) => {
  console.log(new Date(Date.now()));
  // res.send('test); : 여기서 응답을 하게 되면 미들웨어 체이닝은 끝난다.
  next();
});

/* ### GET '/' 요청에 대한 라우트 1번
  - 3개의 미들웨어를 전달  */
app.get(
  '/',
  (req, res, next) => {
    console.log('first');
    next();
    // next() 바로 연결된 다음 미들웨어 호출
  },
  (req, res, next) => {
    console.log('first2');
    next('route');
    /* Q) next()에 인자로 'route'를 전달하면?
       A)아래 연결된 미들웨어를 스킵하고
         해당 요청을 처리하는 다음 라우트(app.METHOD)를 찾는다. */
  },
  (req, res, next) => {
    console.log('first3');
    next(new Error('error'));
    /* Q) next()에 인자로 Error객체를 전달하면?
       A) error을 처리하는 라우트(app.use)를 찾는다.
       만약 error을 처리하는 라우트가 없다면, 
       클라이언트에게 error메세지가 응답돤다.
    */
  }
);

/* ### GET '/' 요청에 대한 라우트 2번 
  - GET방식 '/' 요청에 대해 최종 응답을 실행하는 미들웨어  */
app.get('/', (req, res, next) => {
  console.log('second');
  res.send('home');
});

app.get('/boards', (req, res, next) => {
  console.log('게시판 목록');
  res.send('board List');
});

/* ### 추가 : 조건에 따라 응답시 주의점 */
// error 발생 => Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
app.get('/test/error', (req, res, next) => {
  if (Object.keys(req.query).length) {
    res.send('1. test/error : ' + JSON.stringify(req.query));
    // 이 코드가 실행되면 아래 코드에서 에러가 발생한다.
    // 응답은 함수는 종료코드 아니기 때문이다.
    // 그래서 응답을 두번하면 안된다는 에러가 발행한다.
  }
  res.send('2. test/error');
});
// 정상작동 코드 : 분기에 따라 응답을 하는 경우 종료코드를 명시해야 한다.
app.get('/test/success', (req, res, next) => {
  if (Object.keys(req.query).length) {
    return res.send('1. test/success : ' + JSON.stringify(req.query));
  }
  return res.send('2. test/success');
});

/* ### 아래 선언된 3개의 메서드는 순서가 다르면 안된다.
  - app.METHOD 선언순서와 실행하는 미들웨어의 순서는 express에서 너무나 중요하다.
  - 아래 순서 중요!
  - GET방식 '/boards/*' URL을 처리하는 메서드 3개
  1. GET /boards/* : 
    요청이 들어올 때마다 로그 출력
  2. GET /boards/title
    요청이 들어올 때마다 로그와, 'select title!'를 응답한다.
  3. GET /boards/:id
    요청이 들어올 때마다 id에 해당하는 URL을 가져와서(req.params.id) 출력, 및 응답  

  ### 선언된 순서와 다르다면 전혀 다른 동작을 하게된다.
  Q) 3 -> 2 -> 1 순으로 선언하고 [ GET '/boards/title' ] 요청이 들어오면?
  A) 3번 이외에 호출되지 않는다.
  - 3번 호출이 가장 먼저되고 res.send()로 응답이 되므로 나머지는 호출되지 않는다.

  Q) 2 -> 1 -> 3 순으로 선언 [ GET '/boards/name' ] 요청이 들어오면?
  A) 1번 호출 -> 3번 호출이 된다.
  GET '/boards/name' 요청에 대해서는 정상적으로 동작하는 것으로 보인다.
  하지만 GET '/boards/title' 요청이 들어온다면 2번만 호출되고 1번 동작하지 않을 것이다.

*/
app.get('/boards/*', (req, res, next) => {
  console.log('게시판 선택');
  next();
});

app.get('/boards/title', (req, res, next) => {
  console.log('게시판 제목 선택');
  res.send('select title!');
});

app.get('/boards/:id', (req, res, next) => {
  console.log('게시판 아이디 선택 : ' + req.params.id);
  res.send('select boards/id : ' + req.params.id);
});

/* ### 라우터 설정  -> 뒤에서 다룬다.
  - '/users'로 들어온 모든 요청(.use)은 usersRouter에게 위임한다.
*/
//app.use('/users', usersRouter);

/* ### 에러 처리 미들웨어 
  - 서버에서 발생하는 에러를 처리하는 미들웨어 선언
  - 에러를 처리하는 미들웨어는 항상 마지막 쯤에 선언한다.
  - 404 처리는 서버에서 발생한 에러가 아니기 때문에 
  에러 처리 미들웨어를 사용하면 안된다.
*/
app.use((error, req, res, next) => {
  console.error(error);
  res
    .status(500) // 500 : 서버에러
    .send('Sorry, try later!');
});

/* ### 404를 처리하는 미들웨어 
  - express에서 404를 처리를 위한 미들웨어가 따로 존재하지는 않는다.
  - 다만 path를 없이, 그리고 가장 마지막에 선언하여 404를 처리할 뿐이다.
  
  Q) 왜 path가 없을까? 그리고 왜 가장 마지막에 선언할까?
  A) 라우팅에서 일치하는 라우터가 없을 때 실행 시키기 위해서이다.
  라우팅을 수행하는 라우팅 계층에서는 요청에 일치하는 라우트를 찾는다. 
  이때 라우트를 찾기위해서 선언된 라우트를 위에서부터 아래로 순차적으로 탐색한다.
  일치하는 라우트를 찾지 못하고 가장 마지막에 있는 path가 없는 라우트를 만나면 
  해당 라우트가 실행된다. 즉, 요청에 일치하는 응답이 없는 경우 404이다. 
  그래서 express에서는 이러한 원리로 404를 처리한다.
*/
app.use((req, res, next) => {
  console.log('처리할 라우트 없음');
  res
    .status(404) // 404 : 처리할 응답이 없음
    .send('Not available!');
});

app.listen(8080);
