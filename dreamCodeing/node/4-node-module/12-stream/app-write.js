const fs = require('fs');
const util = require('../10-file/util.js').joinName;

/**
 * Stream을 사용한 효율적인 파읽 쓰기 예시
 */

/*
  ### createWriteStream() : Event 베이스의 함수이다.
*/
const writeStream = fs.createWriteStream(util(__dirname, 'file3.txt'));

// 작성이 완료되면 발생
writeStream.on('finish', () => {
  console.log('finished!');
});

// 스트림을 통한 글 작성
writeStream.write('hello!');
writeStream.write('world!');

// 종료 코드가 들어가야 'finish' 이벤트가 발생한다.
writeStream.end();