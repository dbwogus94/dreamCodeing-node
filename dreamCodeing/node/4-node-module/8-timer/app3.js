/**
 * ### setTimeout() callback까지 시간 측정
 * time()와 timeEnd()를 사용하여 시간 측정하기
 */
console.time('timeout 0');
setTimeout(() => {
  console.timeEnd('timeout 0');
  console.log('setTimeout 0')
}, 0);
