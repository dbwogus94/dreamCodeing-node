/**
 * fs 모듈
 * file를 다루는데 필요한 기능을 모아둔 모듈
 */
const fs = require('fs');
const util = require('./util');

/* fs의 API는 3가지 형태로 제공된다.
  1. 비동기 - 실패 또는 성공 결과를 콜백의 인자로 전달한다.
      rename(...., callback(error, data) );
  2. 동기 - 실패하는 경우 앱이 죽을 수 있기 때문에 예외 처리가 필요
      try { renameSync(....); } catch(e) { }
  3. 프로미스 : 
      promises.rename().then().catch(0);
*/

/* ### 동기 예시 : 
  - 동기 코드를 사용하는 경우 필히 예외처리를 해서 앱이 죽지 않게 해야한다.
  - 또한 노드에서 동기코드는 가능하면 사용하지 말아야 한다.
*/
try {
  // 아래 동기 작업이 종료 될때까지 blocking 된다.
  fs.renameSync(util.joinName(__dirname, 'text.txt'), util.joinName(__dirname, 'text-new.txt'));
  console.log('[동기로 파일이름 변경 성공]');
} catch (error) {
  console.log('[동기 에러나면 실행] ');
  console.error(error);
} finally {
  console.log('[무조건 실행] \n\n');
}

/* ### 비동기 코드 예시
  - 비동기 API에서 제공하는 callback는 API를 확인하면 볼 수 있다.
  - fs.rename()은 callback의 인자로 실패시 에러코드만 제공한다.
*/
fs.rename(util.joinName(__dirname, 'text-new.txt'), util.joinName(__dirname, 'text.txt'), (error) => {
  if (error != null) {
    console.log('[비동기 에러나면 실행]');
    console.error(error);
  } else {
    console.log('[비동기로 파일이름 변경 성공]');
  }
});
console.log('========> rename는 비동기 함수이기 때문에 해당 로그가 먼저 실행된다.\n\n');

/* ### promises 코드 예시
  프로미스는 비동기 함수, 성공시 실행 함수, 실패시 실행 함수를 
  정의하여 사용할 수 있게 한다.
*/
fs.promises
  // 비동기
  .rename(util.joinName(__dirname, 'text.txt'), util.joinName(__dirname, 'text-new.txt'))
  // 성공시
  .then(() => console.log('Done!'))
  // 실패시
  .catch(console.error); // == catch((error) => console.error(error));

console.log('promises도 비동기 요청이기 때문에 promises보다 먼저 실행!!');

/* ### 중요한 점 ### 
  위의 fs.rename와 fs.promises가 동시에 요청되는 경우 에러가 발생 할 수 있다.
  - 정상 실행) fs.rename의 비동기 작업이 먼저 끝나고 넘겨진 callback 실행 됨.
  - 에러 발생) fs.promises의 비동기 작업이 먼저 끝나고 넘겨진 callback 실행 됨.

  이유 : 
  비동기 작업은 언제 끝날지 알 수 없다. 
  그리고 node APIs은 끝난 순서대로 받은 callback를 Task Queus에 넣는다.
  - fs.rename가 먼저 끝나면 callback에서 text.txt로 변경함 
    -> text.txt는 존재 -> 정상 실행.
  - fs.promises가 먼저 끝나면 callback에서 text.txt를 text-new.txt로 변경하려함.
    -> text.txt는 존재하지 않음 -> 에러발생.
*/
