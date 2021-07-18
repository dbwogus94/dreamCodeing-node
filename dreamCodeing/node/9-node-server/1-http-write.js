/**
 * ### node는 http_v1과 http_v2를 둘다 제공한다.
 * - http_v1 = http
 * - http_v2 = http2
 *
 * ### http2를 사용해야 한다.
 * 그렇게 되면 ssl 인증서가 필요하다
 * (ssl 인증서가 없으면 브라우저에서 동작하지 않는다.)
 * 그렇기 때문에 http를 사용해서 개발하고
 * 배포시 http2로 버전을 올린다.
 */
const http = require('http');
//const http2 = require('http2');

//console.log(http.STATUS_CODES); // 상태코드 확인
//console.log(http.METHODS); // HTTP 메서드 확인

/* ### http모듈로 서버 생성 : 
  - 첫 인장에 옵션을 줄 수 있다.
  - 기본적으로 RequestListener(callback)를 등록해야 한다.
*/
const server = http.createServer((req, res) => {
  console.log('incoming...');
  console.log(req.headers); // 요청에 사용된 헤더
  console.log(req.httpVersion); // http 버전
  console.log(req.method); // 요청에 사용된 메서드
  console.log(req.url); // 요청에 사용된 도메인을 제외한 url

  const url = req.url;
  if (url === '/') {
    res.setHeader('Content-Type', 'text/html'); // 헤더 설정
    res.write('<html>'); // 응답에 보낼 내용
    res.write('<head><title>Academy</title></head>');
    res.write('<body><h1>Welcome!</h1></body>');
    res.write('</html>');
  } else if (url === '/courses') {
    res.setHeader('Content-Type', 'text/html'); // 헤더 설정
    res.write('<html>'); // 응답에 보낼 내용
    res.write('<head><title>Academy</title></head>');
    res.write('<body><h1>Courses</h1></body>');
    res.write('</html>');
  } else if (url === '/typetest') {
    // 헤더가 설정되 있지 않으면 단순 text로 응답한다.
    res.write('text content');
  } else {
    res.setHeader('Content-Type', 'text/html'); // 헤더 설정
    res.write('<html>'); // 응답에 보낼 내용
    res.write('<head><title>Academy</title></head>');
    res.write('<body><h1>Not found</h1></body>');
    res.write('</html>');
  }

  res.end(); // write를 종료하고 응답을 보낼때 사용한다.
});

/* ### 서버 리스너 등록 
  서버 리스너 등록이 완료되야 서버가 시작된다.
*/
server.listen(8080); // 포트 설정
