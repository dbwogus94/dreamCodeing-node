/**
 * ### EJS 탬플릿을 사용하여 HTML응답
 *  - EJS를 통해 서버 사이드 렌터링하기
 * 
 * ** EJS는 간단한 작업에 사용되는 경우가 많다.
 * >> node는 주로 리엑트, 뷰, 엥귤라 같은 프레임워크와 많이 사용된다.
 */
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');

// ejs에 전달할 데이터를 정의
const name = 'Ellie';
const courses = [
  {name: 'HTML'},
  {name: 'CSS'},
  {name: 'JS'},
  {name: 'node'},
  {name: 'frontend'},
];

/* ### http모듈로 서버 생성 : */
const server = http.createServer((req, res) => {
  const url = req.url;
  console.log(url);
  res.setHeader('Content-Type', 'text/html');

  // ejs를 통해 ejs파일을 읽어서 동적인 페이지 생성
  if (url === '/') {
    ejs
      .renderFile('./templates/index.ejs', { name }) // {name} == {name: name}
      .then(data => res.end(data)); 
      // res.end() 인자로 write할 데이터를 넣을 수 있다.
  } else if (url === '/courses') {
    ejs
      .renderFile('./templates/courses.ejs', { courses })
      .then(data => res.end(data));
  } else {
    ejs
      .renderFile('./templates/not-found.ejs', { name })
      .then(data => res.end(data));
  }
});

/* ### 서버 리스너 등록 */
server.listen(8080); // 포트 설정
