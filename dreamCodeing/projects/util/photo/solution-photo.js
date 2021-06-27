const path = require('path');
const os = require('os');
const fs = require('fs');
/**
 * 파일 스크립트 엘리님 코드
 * - 강의 코드 따라서 작성
 */

/*  계획
    1. 사용자가 원하는 폴더의 이름을 받아온다.
    2. 그 폴더안에 video, captured, duplicated 폴더를 만든다.
    3. 폴더안에 있는 파일은 다 돌면서 요구사항에 맞춰서 분류 
        - mp4/mov -> video           
        - png/aae -> captured
        - IMG_1234(IMG_E1234) -> duplicated
 */

/*  1. 사용자가 원하는 폴더의 이름을 받아온다. */
const folder = process.argv[2] || ''; // 실행시 전달받은 인자를 가지고 있다.
const workingDir = path.join(os.homedir(), '_Pictures', folder); // os.homedir() : C:\\Uesers\\1994d

if (!folder || !fs.existsSync(workingDir)) {
  // 정리할 폴더를 입력 받았는지 OR 폴더가 있는지 확인
  console.error('Please enter folder name in Pictures');
  return;
}

/* 2. 입력받은 폴더 안에 video, captured, duplicated 폴더를 만든다. */
const videoDir = path.join(workingDir, 'video');
const capturedDir = path.join(workingDir, 'captured');
const duplicatedDir = path.join(workingDir, 'duplicated');

// 동기 : 폴더가 있는지 확인(existsSync) 없으면 생성(mkdirSync)
!fs.existsSync(videoDir) && fs.mkdirSync(videoDir);
!fs.existsSync(capturedDir) && fs.mkdirSync(capturedDir);
!fs.existsSync(duplicatedDir) && fs.mkdirSync(duplicatedDir);

/* 3. 폴더안에 있는 파일들을 다 돌면서 해당하는 조건으로 분류한다. */
// readdir : 경로안에 있는 파일 리스트를 읽어오기
fs.promises
  .readdir(workingDir) //
  .then(ProcessFiles)
  .catch(console.error);

// 파일 읽어오기 성공시 사용할 파일 분류 함수
function ProcessFiles(files) {
  files.forEach((file) => {
    // 동영상
    if (isVideoFile(file)) {
      console.log('video', file);
      move(file, videoDir);
      // 캡쳐
    } else if (isCapturedFile(file)) {
      console.log('captured', file);
      move(file, capturedDir);
      // 보정된 사진 원본
    } else if (isDuplicatedFile(files, file)) {
      console.log('duplicated', file);
      move(file, duplicatedDir);
    }
  });
}

/* 3-1) 조건에 따른 파일 확인용 함수들 */
// 확장자가 mp4이거나 mov라면 true
function isVideoFile(file) {
  const regExp = /(mp4|mov)$/gm; // gm: 전역, 다중행, $ : 끝나는 부분
  const match = file.match(regExp); // match는 일치하는 내용을 배열로 리턴한다.(안하면 null)
  return !!match; // 값을 Boolean으로 변환하는 가장 빠른 방법이다.
}

// 확장자가 png이거나 aag라면 true
function isCapturedFile(file) {
  const regExp = /(png|aae)$/gm;
  const match = file.match(regExp);
  return !!match;
}

// "IMG_"중에 "IMG_E"가 있는 파일이라면 true를 리턴
function isDuplicatedFile(files, file) {
  // startsWith : 문자열이 특정 문자로 시작하는지 확인하여 결과를 리턴
  if (!file.startsWith('IMG_') || file.startsWith('IMG_E')) {
    return false; // 빠른 종료 코드
  }
  // IMG_xxx => IMG_Exxx : IMG_ 파일중 E가 붙은 파일 찾기
  const edited = `IMG_E${file.split('_')[1]}`;
  // Array.find : 전달된 조건(callback )에 처음으로 일치하는 item을 리턴한다.
  const found = files.find((f) => {
    return f.includes(edited); // String.includes : 전달된 인자와 문자열이 같으면 treu리턴
  });
  return !!found;
}

/* 3-2) (비동기)파일 이동 함수  */
function move(file, targetDir) {
  const oldPath = path.join(workingDir, file);
  const newPath = path.join(targetDir, file);
  fs.promises
    .rename(oldPath, newPath) //
    .then(() => {
      console.info(`move ${file} to ${path.basename(targetDir)}`);
    })
    .catch(console.log);
}
