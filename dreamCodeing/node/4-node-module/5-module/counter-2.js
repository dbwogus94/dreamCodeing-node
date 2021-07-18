let count = 0;

function increase() {
  count++;
}

function getCount() {
  return count;
}

/* export 방법 2) 목록으로 내보내기 
  - 방법이 다를 뿐 counter.js를 export한 결과와 같다.
*/
export { increase, getCount };
