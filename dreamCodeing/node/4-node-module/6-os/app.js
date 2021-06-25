/**
 * ### os 모듈
 * 노드가 실행되고 있는 OS의 정보를 받아온다.
 */

const os = require('os');

// mac의 경우 줄 바꿈 확인
console.log(os.EOL === '\n');  // win에서 false 출력

// win의 경우 줄 바꿈 확인
console.log(os.EOL === '\r\n'); // win에서 true 출력

console.log(os.totalmem());   // 최종 메모리
console.log(os.freemem());    // 사용 가능한 메모리
console.log(os.type());       // 운영체제 타임
console.log(os.userInfo());   // 사용자 정보
console.log(os.cpus());       // cpu 정보
console.log(os.homedir());    // 메인 폴더
console.log(os.hostname());   // 호스트 이름 확인