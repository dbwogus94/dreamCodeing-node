/**
 * ### console 객체 
 * 콘솔을 잘 활용하면 생산성을 높일 수 있다.
 * - log
 * - clear
 * - info, warn, error
 * - assert
 * - table, dir
 * - tiem, timeEnd
 * - count, countReset
 * - trace
 */ 

// ## log : 단순로그
console.log('logging....');
// ## clear : 현재 출력된 모든 로그 제거
console.clear();

/*  ## log level : 로그는 레벨에 따라 다르게 출력해야 한다.
  - 브라우저는 아래의 로그 레벨마다 다른 색상으로 출력이된다. 
  - node의 콘솔은 기본적으로 색상을 지원하지 않는다.
  - 색상은 개발의 편의를 위한 부가 적인 기능이다. 
  - 레벨을 나누는 이유는 기본적으로 운영시 오류 기록을 남기기 위함이다.
*/
console.log("\n================== log level =================="); 
console.log('log');     // 개발 O, 운영 x
console.info('info');   // 중요한 정보를 기록
console.warn('warn');   // 경고 기록용
console.error('error'); // 에러, 사용자에러, 시스템 에러

// ## assert : 첫번째로 전달한 인자가 "거짓"인 경우만 출력
console.log("\n===================== assert ====================="); 
console.assert(false, 'not same');    // Assertion failed: not same
console.assert(true, 'same');

/* ## print object 
  객체를 출력하는 다양한 방법 
*/ 
console.log("\n================== print Object =================="); 
const student = { name: 'ellie', age: 20, company: {name: 'AC'} };
// ### log : json 형식으로 출력
console.log(student);
// ### table : 객체를 표 형식으로 출력
console.table(student);
/* ### dir : dir는 옵션을 전달할 수 있다.
    - showHidden : true라면 key를 숨김(기본 false)
    - colors : 출력되는 색상을 지정(기본 false)
    - depth : 중첩된 객체를 어느 레벨까지 보일지 지정한다. (기본 2)
*/
console.dir(student,{showHidden : true, colors : false, depth: 0});
// >>> { name: 'ellie', age: 20, company: [Object] }
console.dir(student,{showHidden : true, colors : false, depth: 2});
// >>> { name: 'ellie', age: 20, company: { name: 'AC' } }


/* ## measuring time
  성능 측정에 사용되는 로그이다.
  - tiem 부터 timeEnd 까지 실행 시간을 측정한다.
  - 주의! time와 timeEnd에 전달된 인자는 같은 값이여야 한다..

*/ 
console.log("\n================== measuring time ==================");
console.time('for loop');
for (let i = 0; i < 10; i++){
  i++;
}
console.timeEnd('for loop');

/* counting
   작성한 로그가 몇 번 출력되었는지 카운트 해주는 로그이다.
   - 보통 반복되는 함수안에 예상한 결과와 실행 결과가 같은지 측정할때 사용
   - 주의! 인자로 전달된 값이 같아야 카운트 된다.
 */
console.log("\n================== counting ==================");
function a() {
  console.count('a function');
}
a();
a();
// 카운트를 초기화 한다.(특정 동작에서 초기화가 필요한 경우 사용)
console.countReset("a function");   
a();
a();
a();

/* ## trace
  함수가 출력된 콜 스택 트리를 볼 수 있다.
 */
console.log("\n=================== trace ====================");
function f1() {
  f2();
}
function f2() {
  f3();
}
function f3() { 
  console.log('f3');
  console.trace();  // 함수가 호축된 콜 스택 트리를 볼 수 있다.
}

f1();