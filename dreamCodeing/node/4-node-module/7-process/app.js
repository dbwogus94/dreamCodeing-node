/**
 * ### process 모듈
 * 프로세스(실행중인 노드)의 정보를 가져오는 모듈
 * - 이외에도 다양한 기능을 제공한다.
 */
const process = require('process');

console.log(process.execPath);    // 노드의 위치
console.log(process.version);     // 노드의 버전
console.log(process.pid);         // 프로세스 버전
console.log(process.ppid);        // 프로세스 부모의 버전
console.log(process.platform);    // 플렛폼 정보
console.log(process.env);         // 현재 pc에 저장된 환경변수 모든 정보
console.log(process.uptime);      // 프로세스(노드)의 실행 시간
console.log(process.cwd);         // 실행되고 있는 노드의 경로
console.log(process.cpuUsage);    // cpu 사용량

// 0초 뒤에 callback를 task queue에 넣는다.
setTimeout(() => {
  console.log('setTimeout');
}, 0);

// 현재 실행하고 있는 코드가 끝나면 넘겨진 callback를 task queue에 넣는다.
process.nextTick(() => {
  console.log('nextTick');
});

for(let i = 0; i< 100; i++){
  console.log('for loop');
}

/*
  Q) 위의 코드의 동작 순서를 예상 해보자

  먼저 알고 있어야 할 점
  - node에서 비동기 동작 원리
    1. node APIs에서 비동기 작업이 끝나면 인자로 받은 callback를 Task Queue에 넣는다.
    2. Event loop는 App의 Call Stack의 함수가 모두 실행되어 텅텅 빌때까지 기다린다.
    3. Call Stack이 비면 Event loop는 Task Queue의 callback를 App의 Call Stack에 넣는다.
    4. Stack에 넣어진 callback이 실행된다.

  - process.nextTick()
   이 함수는 전달된 callback을 Task Queue의 가장 앞에 넣게 하는 명령이다.

  A) 동작 순서
    1. 가장 먼저 for loop의 반복문이 Call Stack에 push된다.
    2. setTimeout()에 전달된 callback는 0초 뒤 Task Queue에 넣어진다.
    3. process.nextTick()에 전달된 callback는 Task Queue의 가장 앞에 넣어진다.   
    4. for문이 끝나고 Call Stack이 텅텅 비면 
      Event Loop는 Task Queue의 가장 앞에 있는 callback을 Call Stack에 넣는다.
      ->  process.nextTick()에 전달된 callback이 Stack 넣어진다.

    5. console.log('nextTick');이 실행되고 Call Stack이 다시 비면 
      Event Loop는 Task Queue의 가장 앞에 있는 callback를 Call Stack에 넣는다.
      -> setTimeout()에 넣어진 callback이 Stack에 넣어진다.

    6. console.log('setTimeout'); 실행 

    7. 종료

*/
