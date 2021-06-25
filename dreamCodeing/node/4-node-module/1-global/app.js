/**
 * ### node의 global 객체
 * 
 * ## 브라우저의 최상위 전역객체는 window이다.
 *  - 브라우저에서 함수나 변수를 정의하면 그것은 window에 함수나 변수가 된다.
 *    -> window.함수() || window.변수
 *  - 브라우저에서 전역적으로 사용가능한 함수는 window 객체에 정의된 함수를 
 *    가져와 사용하는 것이다.
 *    -> window.console.log("hello") == console.log("hello")
 * 
 * ## 노드의 최상위 전역객체는 global이다.
 *  - 노드에서 함수나 변수를 정의하면 그것은 global에 함수나 변수가 된다.
 *    -> global.함수() || global.변수 
 *  - 노드에서 전역적으로 사용가능한 함수는 global 객체에 정의된 함수를 
 *    가져와 사용하는 것이다.
 *    -> global.console.log("hello"); == console.log("hello");
 * 
 * 
 */

// fs 모듈을 선언하면 global이 정의된 라이브러리를 확인할 수 있다.
const fs = require("fs"); 

// 전역 객체 global 출력
console.log(global);

// 전역 객체 global에 함수명 hello로 함수 선언
global.hello = () => {
  console.log("hello");
};

// 선언한 함수 사용
global.hello();

// 전역객체는 생략이 가능하다.
hello();
