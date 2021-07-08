/**
 * ### javaScript에서 제공하는 import export 사용하기
 *  → es6부터 제공하는 js공식 모듈이다.
 *  1. package.json 생성 : mpn을 사용하여 모듈로 사용될 위치에 package.json 생성하기
 *    >> 명령어 : npm init --yes
 *  2. package.json 수정 : 값을 추가해 모듈로 사용 설정
 *    >> "type": "module",
 *  3. export할 함수 지정 : 함수명에 export 명령어를 추가한다.
 *  4. import 하기
 */

/* 1. 사용할 함수별로 import */
//import {increase, getCount} from './counter.js';
// increase();
// increase();
// increase();
// console.log("getCount : " + getCount());

/* 2.모듈 전체를 변수에 import */
import * as counter from './counter.js';

counter.increase();
counter.increase();
counter.increase();
console.log('getCount : ' + counter.getCount());
