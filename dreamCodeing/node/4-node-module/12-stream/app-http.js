/**
 * 서버에서 파이프 사용 간단 예시
 */
const http = require('http');
const fs = require('fs');
// 절대경로 리턴
const util = require('../10-file/util.js').joinName;   

// 비효율적 : 파일을 모두 다읽고 완료되면 response 한다.
const server01 = http.createServer((req, res) => {
  fs.readFile(util(__dirname, 'file.txt'), (err, data) => {
    res.end(data);
  });
});
server01.listen(3000);

// 효율적 : 스트림 만큼 파일을 읽으면서 response 한다.
const server02 = http.createServer((req, res) => {
  const stream = fs.createReadStream(util(__dirname, 'file.txt'));
  stream.pipe(res);
});
server02.listen(4000);