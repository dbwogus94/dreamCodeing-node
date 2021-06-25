/**
 * Task Queue에 callback를 넣는 함수별 실행 순서 비교
 * - setTimeout()
 * - setImmediate()
 * - process.nextTick()
 */
const process = require('process');

console.log('code1');
setTimeout(() => {
  console.log('setTimeout 0');
}, 0);

console.log('code2');
setImmediate(() => {
  console.log('setImmediate');
});

// process.nextTick는 Task Queue의 가장 앞에 callback를 넣는다.
console.log('code3');
process.nextTick(()=>{
  console.log('process.nextTick');
});
