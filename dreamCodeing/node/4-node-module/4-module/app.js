/**
 * ### node에서 제공하는 export모듈과 import모듈 사용하기
 * 2015년 es6부터 제공되는 기능이다.
 * 1. 모듈 export 하기 :  .js파일에서 module.exports를 사용하여 export 하기 
 * 2. 모듈 import 하기 : require('${파일명.js}')를 사용하여  모듈 import 하기
 */

/* require를 통해 export된 모듈을 import 할 수 있다.
    **주의점! import를 할때 counter.js에 선언된 log가 출력된다.
*/ 
const counter = require('./counter.js');

counter.increase();
counter.increase();
counter.increase();
console.log("getCount : " + counter.getCount());