const fs = require('fs');
const util = require('../10-file/util.js').joinName;
/**
 * 아래 예시는 단순하게 순차적으로
 * file.txt의 파일을 읽어서 file2.txt에 쓰는 작업이다.
 * 그리고 그 과정에 메모리 사용량을 계산 출력한다.
 */

// 현재 사용중인 메모리 상태 저장
const beforeMem = process.memoryUsage().rss; 

fs.readFile(util(__dirname, 'file.txt'), (_, data) => {   // data : 읽은 데이터(buffer)
  fs.writeFile(util(__dirname, 'file2.txt'), data, () => {});

  // calculate : 실행 후 메모리 사용량 출력
  const afterMem = process.memoryUsage().rss;
  const diff = afterMem - beforeMem;
  const consumed = diff / 1024 / 1024;
  console.log(diff);
  console.log(`Consumed Memory: ${consumed}MB`);
});

/* Q) 위 코드는 효율적인가?
   A)모든 파일을 전부 읽은 후에 새로운 파일에 쓰는 것은 비효율 적이다.
   
   Q) 비효율적인 이유는 무엇일까?
   A) 1. 메모리가 낭비된다.
      파일이 10기가의 대용량이라고 한다면 어떨까? 
      단순하게 계산해도 30기가가 필요하다.
      - 원본파일 10기가
      - 읽어온 데이터를 가진 10기가의 임시 메모리 
      - 복사된 10기가 파일
   A) 2. 느리다
      대용량 동영상 파일을 업로드 하고, 업로드된 동영상을 재생하는 서비스라면?
      업로드가 완료되어야 비로서 재생할 수 있다.
  
  위 처럼 파일을 읽고 쓰는 작업을 단순하게 사용한다면 
  매우 비효율적인 프로그램이 된다.
  이러한 것을 효율적으로 만들려면 buffer와 Stream을 적절하게 사용하면 된다.
 */