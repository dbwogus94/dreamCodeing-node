/**
 * ### this 객체
 * 노드의 this는 브라우저의 this와 조금 차이가 있다.
 * 
 * ## 최상위 함수 선언식에서 this
 * - 노드에서 최상위 함수 선언식의 this는 global이다.
 * - 브라우저에서 최상위 함수 선언식의 this는 window이다.
 * 
 * ## 전역에서 this
 * - 먼저 브라우저에서 전역에 사용하는 this는 window를 의미한다.
 * Q) 노드는 어떨까? 
 * A) 노드는 여기서 차이가 발생한다.
 *    >> 노드의 전역의 this는 module.exports를 의미한다.
 */

// 1. 최상위 함수 선언식에서 this 확인
function hello(){
  console.log(this);            // == console.log(global);
  console.log(this === global); // >> true
}
hello();

// 2. 클래스에서 this 확인
class A {
  constructor(num) {
    this.num = num;
  }
  memberFunction() {
    console.log('----- class -----');
    console.log(this);             // >> A { num: 1 }
    console.log(this === global);  // >> false
  }
}
const a = new A(1);
a.memberFunction();

// 3. 전역에서 this 확인
console.log("--- global scope ---");
console.log(this);                      // >> {}
console.log(this === global);           // >> false
console.log(this === module.exports);   // >> true