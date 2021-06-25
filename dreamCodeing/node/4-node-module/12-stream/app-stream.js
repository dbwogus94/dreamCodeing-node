const fs = require('fs');
const util = require('../10-file/util.js').joinName;

/**
 * Stream을 사용한 효율적인 파읽 읽기 예시
 */

/*
  ### createReadStream() : Event 베이스의 함수이다.
  지정한 크기 많큼 데이터를 읽어올 때마다. Event를 발생한다.
  이외에도 다양한 Event가 있다.
  - API에서 확인이 가능하다.
*/ 
const data = [];
const readStream = fs.createReadStream(util(__dirname,'file.txt'), {
//  highWaterMark : 8,      // 디폴트 64kb, 한번에 얼마 만큼의 데이터를 읽어올지 선언
//  encoding : 'utf-8',     // stream으로 받아올 버퍼의 인코딩을 지정
});
// 데이터를 읽어 올때마다 호출
readStream.on('data', (chunk) => {    // chunk: 스트림으로 읽어온 데이터 일부
  data.push(chunk);
});
// 읽기가 완료 되면 호출
readStream.on('end', () => {
  // buffer 배열에 join()을 사용하면 자동 toString()가 된다.
  console.log(data.join(''));   
});
// 에러가 발생하면 호출
readStream.on('error', error => {
  console.error(error)
});

/*
* ### 이벤트는 체이닝이 가능하다.
* API를 확인해 보면 모든 이벤트는 this(ReadSteam)를 리턴한다. 
* 그렇기 때문에 아래처럼 변수선언 없이 모두 하나로 연결이 가능하다.
*/
const data2 = [];
fs.createReadStream(util(__dirname,'file.txt'))
.on('data', (chunk) => {
  data2.push(chunk);
}).on('end', () => {
  console.log(data2.join(''));   
}).on('error', error => {
  console.error(error)
});

/**
 * ### once 이벤트
 * API를 확인하면 on이벤트 말고도 once라는 이벤트도 있다.
 * on은 이벤트가 호출될때 마다 사용할 수 있는 함수이다.
 * once는 이벤트를 한번만 호출 할 때 사용한다.
 */
 fs.createReadStream(util(__dirname,'file.txt'), {
   highWaterMark : 8
}).once('data', (chunk) => {    // 한 번만 호출된다.
  data.push(chunk);
}).on('end', () => {
  console.log(data.join(''));   // 한 번 읽어온 8KB를 문자열로 출력
}).on('error', error => {
  console.error(error)
});