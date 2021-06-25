/**
 * ### path 모듈
 * 노드는 pc위에서 동작하기 때문에 파일시스템에 접근하기가 쉽다.
 * 이때 path는 파일 경로에 접근 처리 하는데 유용한 모듈이다.
 */
/*
 * #### 경로를 표현하는 방법은 운영체제에 따라 다를 수 있다.
 * 
 * POSIX(Unix: Max, Linux) 계열 : 'Users/temp/myfile.html'
 * Window 계열 : 'C:\\temp\\myfile.html'
 * ->그렇기 때문에 소스상에서 하드코딩으로 경로를 작성하는 것은 피해야한다.
 */

const path = require('path');

// global.__dirname :  현재 파일이 있는 디렉토리 경로
console.log(__dirname);
// global.__filename : 현재 파일을 포함한 풀 경로
console.log(__filename);
// path.sep : 현재 운영체제의 경로 구분 기호를 알 수 있다.
console.log(path.sep);
// path.delimiter : 현재 운영체제의 환경변수 구분 기호를 알 수 있다.
console.log(path.delimiter);


/* basename() */
// 파일 경로에서 "파일명 + 확장자"를 가져온다.
console.log(path.basename(__filename));
// 파일 경로에서 확장자를 제외한 "파일명"만 가져온다.
console.log(path.basename(__filename, '.js'));    // 두번째 인자에 확장자를 전달한다.

/* dirname() : 파일 경로에서 디렉토리 이름만 가져온다.*/
console.log(path.dirname(__filename));

/* extension(extname()) : 파일 경로에서 확장자만 가져온다.*/ 
console.log(path.extname(__filename));


/* parse : 전체 경로를 분해하는 기능을 제공 */
const parsed = path.parse(__filename);
console.log(parsed);          // 파싱된 내용을 Object 형태로 가지고 있다.
console.log(parsed.root);     // 루트 디렉토리
console.log(parsed.dir);      // 파일의 풀 경로
console.log(parsed.base);     // 파일 이름 + 확장자
console.log(parsed.ext);      // 확장자
console.log(parsed.name);     // 파일 이름

/* format : 파싱된 경로 Object를 문자열로 변환하는 함수 */
const str = path.format(parsed);
console.log(str);


/* isAbsolute : 절대경로인지 상대 경로인지 확인하는 함수 
  - 절대 경로라면 true, 상대경로라면 false를 내보낸다. */
// 
console.log('isAbsolute?', path.isAbsolute(__dirname));
console.log('isAbsolute?', path.isAbsolute('../'));   // ../ 은 상대경로에 사용됨.


/* normalize : 
  잘못된 경로 정상 경로로 수정해 리턴하는 함수 
  - 보통 경로 구분자가 너무 많이 작성된 경우 1개로 줄여주는데 사용한다. */ 
console.log(path.normalize('./folder////////sub'));


/* join : 파일 경로에 새로운 하위 경로를 만들고 싶을 때 사용한다. */

// 파일 경로 합치기 예시
// 1) 문자열로 하드 코딩 -> 잘못된 방법 
console.log(__dirname + '/' + 'image');   // '/'은 Mac용 구분자이다.
// 2) path.sep을 사용한 방법 -> 옳은 방법
console.log(__dirname + path.sep + 'image');
// 3) join()을 사용한 방법 -> 옳은 방법
console.log(path.join(__dirname, 'image'));