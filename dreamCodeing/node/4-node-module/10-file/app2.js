/**
 * fs 모듈에서 promises를 가져와 사용한다.
 * - fs 모듈에서 promises객체를 export한 것
 */
const fs = require('fs').promises; // == fs.promises
const util = require('./util');

const fileName = util.joinName(__dirname, 'text.txt');

/* read a file : 파일 읽기 */
// readFile()
fs.readFile(fileName)
  // API를 보면 return이 Promise<Buffer>;로 되어 있다. -> data는 Buffer 형태이다.
  .then((data) => console.log(data))
  .catch(console.error);

// readFile() : 문자열로 읽어 오기
fs.readFile(fileName, 'utf8') // 두 번째 인자로 인코딩을 넣으면
  .then((data) => console.log(data)) // Buffer가 아닌 utf8 문자열로 읽어 온다.
  .catch(console.error);

/* writing a file */
// writeFile() : 파일 전체를 새로 쓴다.
fs.writeFile(fileName, 'Hello, Dream Coders! :)')
  // API를 보면 return이 Promise<void>;로 정의되어 있음 -> "then은 선택"
  .catch(console.error); // == catch((error) => {console.error(error)})

// appendFile() : 기존 파일에 이어서 작성
fs.appendFile(fileName, '\nYo!, Dream Coders! :)')
  // write 완료 -> 파일 복사
  .then(() => {
    fs.copyFile(fileName, util.joinName(__dirname, 'text2.txt')).catch(console.error);
  })
  .catch(console.error);

/* copy */
// copyFile : 파일의 내용을 복사하여 새로운 파일로 생성
// fs.copyFile(fileName, util.joinName(__dirname, 'text2.txt'))
// .catch(console.error);

/* ### 파일 복사 주의 사항 ###
  비동기는 순차적으로 진행 될 수도 안될 수도 있다. 
  그렇기 때문에 파일 쓰기와 파일 복사를 같이 수행하면 
  파일 생성은 되지만 내용이 복사가 안될 수 있다.
  
  그렇기 때문에 writeFile와 appendFile의 로직이 
  모두 실행되고 난 후에 파일을 복사를 해야한다.

  즉, appendFile()의 callback에 파일복사 코드를 넣어야 한다.
*/

/* folder */
// mkdir() : 폴더 생성
fs.mkdir(util.joinName(__dirname, 'sub-folder')).catch(console.error);

// readdir() : 해당 경로의 모든 파일을 읽어 온다.
fs.readdir(__dirname)
  .then((data) => console.log(data)) // callback에 리턴되는 인자는 String[]이다.
  .catch(console.errer);
