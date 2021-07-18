const sum = (x, y) => {
  return x + y;
};

/* export 방법 3. 모듈에서 대표하는 객체 내보내기
   - default 키워드는 한 모듈에 하나만 가능하다.
   - default 키워드로 지정 가능한 값은 객체, 함수, 클래스이다.
   - default로 지정된 모듈을 import하는 것은 default로 지정된 객체를 import하는 것이다.
   - 즉, import sum from './sum.js'; 처럼 사용이 가능하다.(단일 값을 import)
*/
export default sum;
