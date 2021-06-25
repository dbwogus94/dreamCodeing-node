/**
 * ### timer
 * Call Stack과 Task Queue를 넘나들 수 있는 기능을 제공한다.
 * - global 객체에 정의되어 있어 import x
 */
let num = 1;

/* ### setInterval() 
  일정한 시간 간격으로 작업 실행하게 하는 함수
  - 이 함수는 종료코드를 넣지 않으면 무한히 반복된다.
  - 종료코드는 이 함수가 리턴하는 값을 변수에 담고
  - 그 값을 clearInterval() 함수에 인자로 넘기면 된다.
*/ 
const interval = setInterval(() => {
  console.log(num++);
}, 1000); // 1초

// 6초 뒤에 종료 코드를 Task Queue에 넣는다.
setTimeout(() => {
  console.log('Time out!');
  clearInterval(interval);
}, 6000);

