/**
 * ### 파일정리 스크립트 초기화 코드
 *
 * 핵심 목표 : 다양한 방법으로 비동기 코드 연습
 * - Array.reduce + Promise.resolve를 사용한 비동기 로직 동기적으로 변환
 * - async + await를 사용한 비동기 로직 동기적으로 변환
 * - Promise.all + Array.map를 사용한 반복된 비동기 처리
 *
 */

const os = require('os');
const path = require('path');
const fs = require('fs');

/*  1. 사용자가 원하는 폴더의 이름을 받아온다. */
const folder = process.argv[2] || '';
const workingDir = path.join(os.homedir(), '_Pictures', folder); // os.homedir() : C:\\Uesers\\1994d

if (!folder || !fs.existsSync(workingDir)) {
  console.error('Please enter folder name in Pictures');
  return;
}

const directoryList = ['video', 'captured', 'duplicated'];
const dirPaths = directoryList.map((dir) => {
  return path.join(workingDir, dir);
});

run(dirPaths);
//run_async(dirPaths);

/**
 * ### main process
 *  Array.reduce() + Promise.resolve() 를 사용한 코드
 *    : 반복된 비동기 작업을 동기적 작업으로 수행할 때 사용한다.
 * - 각각 폴더별 동기작업 : 확인 > 읽기 > 모든 파일 이동(비동기)
 * - 폴더 삭제
 * @param {*} dirPaths Directory List
 */
function run(dirPaths) {
  // 누적값, 현재 사용될 배열의 원소
  dirPaths
    .reduce((prevPromise, dirPath) => {
      return prevPromise
        .then(() => {
          // 확인 : 폴더가 있는지 확인
          return fs.promises.stat(dirPath);
        })
        .then(() => {
          // 읽기 : 폴더 안의 파일 리스트 가져오기
          return fs.promises.readdir(dirPath);
        })
        .then((files) => {
          // 이동 : 폴더 안에 파일들 모두 이동(비동기)
          return moveFiles(files, dirPath);
        });
    }, Promise.resolve()) // 시작 초기값 : 프로미스 초기값을 주기위해 설정
    .then(() =>
      // 폴더 삭제 : reduce 작업이 모두 성공적으로 종료되면
      deleteDirs(dirPaths).then(() => {
        console.info('초기화가 완료되었습니다.');
      })
    )
    .catch(console.error);
}

/**
 * ### main process
 * async와 await를 사용한 코드
 * - 각각 폴더별 동기작업 : 확인 > 읽기 > 모든 파일 이동(비동기)
 * - 폴더 삭제
 * @param {*} dirPaths Directory List
 */
async function run_async(dirPaths) {
  try {
    for (let dirPath of dirPaths) {
      await fs.promises.stat(dirPath); // 확인
      const files = await fs.promises.readdir(dirPath); // 읽기
      await moveFiles(files, dirPath); // 이동(비동기)
    }
    await deleteDirs(dirPaths); // 폴더 삭제
    console.info('초기화가 완료되었습니다.');
  } catch (e) {
    console.error(e);
  }
}

/**
 * Promise.all을 통해 파일 이동 비동기 실행
 * @param {*} fileList
 * @param {*} targetDir
 * @returns Promise.all
 */
function moveFiles(fileList, targetDir) {
  return Promise.all(
    fileList.map((file) => {
      return move(file, targetDir);
    })
  );
}
/**
 * 파일 이동 : 폴더별 분류된 파일을 _Pictures/tergetDir 아래로 이동
 * @param {*} file
 * @param {*} targetDir
 * @returns promise
 */
function move(file, targetDir) {
  const oldPath = path.join(targetDir, file); // _Pictures/targetDir/file
  const newPath = path.join(workingDir, file); // _Pictures/file
  return fs.promises
    .rename(oldPath, newPath) //
    .then(() => {
      console.info(`move ${file} to ${path.basename(workingDir)}`);
    });
}
/**
 * 폴더 삭제
 * @param {*} targetDirs Directory List
 * @returns Promise.all
 */
async function deleteDirs(targetDirs) {
  return Promise.all(
    targetDirs.map((targetDir) => {
      return fs.promises
        .rmdir(targetDir) //
        .then(() => {
          console.info(`remove ${path.basename(targetDir)} to ${path.basename(workingDir)}`);
        });
    })
  ).catch(console.error);
}
