const path = require("path");

/* js는 오버로드(다형성)을 지원하지 않는다. 
  같은 이름의 함수가 정의되면 가장 마지막에 선언된 함수로 적용된다.*/
// function joinName(fileName) {
//   return path.join(__dirname, fileName);
// }

function joinName(dirname, fileName) {
  return path.join(dirname, fileName);
}

module.exports.joinName = joinName;
