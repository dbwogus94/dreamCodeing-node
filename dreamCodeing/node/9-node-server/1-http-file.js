/**
 * ### node는 http_v1과 http_v2를 둘다 제공한다.
 *  - html을 stream으로 읽어 응답하기
 *
 */
const http = require('http');
const fs = require('fs');

/* ### http모듈로 서버 생성 : 
  - stream을 사용하여 HTML 파일 응답
  - 파일을 버퍼 단위로 읽어올 때마다 데이터를 보낸다.
*/
const server = http.createServer((req, res) => {
  const url = req.url;
  console.log(url);
  res.setHeader('Content-Type', 'text/html');
  if (url === '/') {
    fs.createReadStream('./html/index.html').pipe(res);
  } else if (url === '/courses') {
    fs.createReadStream('./html/courses.html').pipe(res);
  } else {
    fs.createReadStream('./html/not-found.html').pipe(res);
  }
});

/* ### 서버 리스너 등록 
  서버 리스너 등록이 완료되야 서버가 시작된다.
*/
server.listen(8080); // 포트 설정
