/**
 * ### json을 응답하는 서버 만들기
 *  - 웹, 모바일 같은 다양한 클라이언트에서
 *    사용할 수 있는 JSON 데이터 응답하기
 *  - GET, POST에 따른 응답 선언
 */
const http = require('http');
const fs = require('fs');

// DB에서 받아온 데이터라고 가정한다.
const courses = [
  //
  { name: 'HTML' },
  { name: 'CSS' },
  { name: 'JS' },
  { name: 'node' },
  { name: 'frontend' },
];

/* ### http모듈로 서버 생성 : */
const server = http.createServer((req, res) => {
  const url = req.url; // 1) what?
  const method = req.method; // 2) how? action?

  if (url === '/courses') {
    if (method === 'GET') {
      // GET : courses JSON으로 변환해서 응답
      res.writeHead(200, { 'Content-Type': 'application/json' }); // (statusCode, headers)
      res.end(JSON.stringify(courses)); // end()에 인자로 write할 데이터 전달 후 응답
    } else if (method === 'POST') {
      // POST : 요청 받은 body에 있는 데이터를 읽어서 기존 courses에 추가해 JSON으로 응답한다.

      /* ### req가 구현한 ReadableStream 설명
          req는 기본적으로 ReadableStream을 구현하였다.
          그리고 ReadableStream에는 6가지 이벤트가 구현되어 있다.
          'data' : 스트림에서 버퍼단위로 데이터를 읽어올 때마다 호출
          'error' : 스트림에서 데이터를 읽는 중 에러 발생시 호출
          'end' : 스트림의 모든 데이터를 다 읽었을 때 호출
          ...

        ### POST 로직 설명
          http 모듈은 POST body의 값을 한번에 가져오지 못한다.
          그렇기 때문에 POST의 body를 가져오려면 req가 구현한 
          ReadableStream을 이용하여 데이터를 읽어와야 한다.
          1. 'data'이벤트를 통해 읽어온 버퍼(데이터)를 배열에 담는다.
          2. 'end' 이벤트를 통해 읽기가 완료된 버퍼 배열을 하나로 묶고 문자열로 변환한다.
          3. 변환된 문자열을 courses에 넣고, courses를 JSON으로 변환해 응답한다. */

      // 버퍼를 담을 배열 선언
      const body = [];

      /* data 이벤트 : 버퍼가 읽어질 때마다 배열에 담는다. */
      req.on('data', chunk => {
        body.push(chunk);
      });

      /* end 이벤트 : POST body를 읽기 완료 후 처리해 응답한다. */
      req.on('end', () => {
        // Buffer.conat을 사용하여 버퍼배열 병합 그리고 toString()를 통해 문자열로 인코딩 한다.
        const bodyStr = Buffer.concat(body).toString();
        // 문자열 JSON으로 변환
        const course = JSON.parse(bodyStr);
        // 기존 courses 배열의 마지막 인덱스에 추가
        courses.push(course);
        // 응답 헤더 설정
        res.writeHead(201, { 'Content-Type': 'application/json' }); // {'Content-Type': 'application/json'}
        // 데이터 담아서 응답
        res.end(JSON.stringify(courses));
      });
    }
  }
});

/* ### 서버 리스너 등록 */
server.listen(8080); // 포트 설정
