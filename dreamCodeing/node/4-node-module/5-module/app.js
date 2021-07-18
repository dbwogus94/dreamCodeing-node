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

/* import 1) 모듈에서 사용할 함수별로 import */
import { increase, getCount } from './counter.js';
increase();
increase();
increase();
console.log('import 테스트 1) getCount : ' + getCount());

/* import 2)모듈 전체를 변수에 import 
   - "* as counter" = 모듈 전체(*)를 변수(counter)에 담는다.
*/
import * as counter from './counter-2.js';
counter.increase();
counter.increase();
counter.increase();
console.log('import 테스트 2) getCount : ' + counter.getCount());

/* import 3) 모듈이 단일 값인 경우 단일 변수로 사용할 수 있다.
   - import하는 모듈에 default export가 있는 경우, 모듈을 단일 값으로 받을 수 있다.
*/
import sum from './sum.js';
console.log('import 테스트 3) getSum : ' + sum(10, 5));
