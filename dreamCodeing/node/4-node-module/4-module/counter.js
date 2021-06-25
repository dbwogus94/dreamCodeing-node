let count = 0;

function increase() {
  count++;
}

function getCount() {
  return count;
}

/* ## module.exports을 exports하기
   exports에 속성으로 부여된 값만 외부에서 접근이 가능하다.
   - 변수 count는 외부에서 접근이 불가능 하다.
*/ 
module.exports.getCount = getCount;
module.exports.increase = increase;

// 최초 사용시 module를 선언했으면 module를 생략 할 수 있다.
//exports.increase = increase;    

// **exports 사용시 주의할 점 : exports에 값을 할당 하면 안된다.
console.log(module.exports === exports);  // 같은 exports를 바라본다.
exports = {};                             // exports에 어떠한 값을 할당하면
console.log(module.exports === exports);  // 이후로는 서로 다른 exports를 바라본다.


console.log(module); // 출력하면 exports된 값을 확인 할 수 있다.
console.log("=============== counter.js 끝 =============");