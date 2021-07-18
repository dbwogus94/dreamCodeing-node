import express from 'express'; // es6 모듈
const app = express(); // express 생성

/* ### req에 들어 있는 값 확인 */
app.get('/', (req, res, next) => {
  //console.log('path : ', req.path); // 요청 루트 확인
  //console.log('headers : ', req.headers); // 요청 헤더 확인
  //console.log('params : ', req.params); // params는 아래에서 설명
  //console.log('query', req.query); // 요청 쿼리 스트링 확인

  res.send('hi');
});

/* ### query string 사용방법
  - req.query안에 object 형태로 파싱해서 가지고 있다. */
app.get('/boards', (req, res, next) => {
  console.log('query', req.query); // 쿼리 스트링 확인
  if (!req.query.no) {
    res.send(`Here's the board List`);
  } else if (req.query.no) {
    res.send(`This is boards number ${req.query.no}.`);
  }
});
/*
  ### req.params 사용방법 
  - URL 
    => 'boards/하위 모든 path'
  - 'boards/:writer' 의미 
    => boards의 하위 루트는 모두 작성자(writer)이다.
    => :writer 설정을 하면 'req.params.writer'로 접근 할 수 있다.
    => 즉, 'boards/jay' 요청이 오면 req.params.writer의 결과는 'jay'이디.
  - 중첩도 가능하다.
    => boards/:writer/:no 일때 'boards/jay/13'으로 요청이 들어온다면?
    => req.params = {writer: 'jay', no: '13'}
*/
app.get('/boards/:writer', (req, res, next) => {
  console.log('params : ', req.params);
  res.send(`This board the writer is ${req.params.writer}`);
});

/* express는 리스너 설정만으로 서버는 동작한다. */
app.listen(8080);
