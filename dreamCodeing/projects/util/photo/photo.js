const fs = require('fs').promises;
const path = require('path');

/**
 * 요구사항에 따른 파일 분류용 클래스
 * <pre>
 * - 핵심 목표
 * nodejs를 사용하는 의미가 있게 비동기를 적절하게 사용한다.
 * 큰 흐름에 있어서는 동기적으로 만들어서 어떤 일을 하는지 명확하게 한다..
 * <pre>
 */
class Photo {
  constructor() {
    this.DEFAULT_PATH = 'C:/VS_code/dreamCodeing/projects/util/Pictures';
    this.folderList = ['video', 'captured', 'duplicated'];
    this.targetPath = '';
  }

  run = async (target) => {
    this.targetPath = path.join(this.DEFAULT_PATH, target);
    try {
      // 분류할 폴더 생성
      const result = await this.createDirectorys(this.targetPath);
      // 파일 리스트 가져오기
      const fileList = await fs.readdir(this.targetPath);
      // 파일 분류 실행
      await this.classifyFiles(fileList);
      console.log('파일 분류 완료!!\n프로그램을 종료합니다.');
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * create Directory : 분류할 폴더들이 있는지 확인하고 없으면 생성
   * @param {*} path A path is file full name
   * @returns Promise
   */
  createDirectorys = (targetPath) => {
    // Promise.all(List.map()) : 반복된 비동기를 일괄로 처리하는 방법
    return Promise.all(
      this.folderList.map((folder) => {
        return fs
          .stat(path.join(targetPath, folder))
          .then(() => {
            return true;
          })
          .catch(() => {
            return this.makeDirectory(path.join(targetPath, folder));
          });
      }) // List.map() : return List
    );
    //return result;
  };
  /**
   * make Directory
   * @param {*} path A path is file full name
   * @returns Promise
   */
  makeDirectory = (path) => {
    return fs
      .mkdir(path)
      .then(() => {
        return true;
      })
      .catch(() => {
        throw new Error('에러 발생! 폴더를 생성중 오류가 발생했습니다.');
      });
  };

  /**
   * classify file : 요구사항에 따른 파일 분류
   * @param {*} fileList
   * @returns
   */
  classifyFiles = (fileList) => {
    return Promise.all(
      fileList.map((file) => {
        const extension = path.extname(file);
        const reg = new RegExp('_E');
        // 동영상
        if (extension === '.mp4' || extension === '.mov') {
          return this.move(file, 'video');
          // 캡쳐
        } else if (extension === '.png' || extension === '.aae') {
          return this.move(file, 'captured');
          // 보정 있는 원본 사진
        } else if (reg.test(file)) {
          const findFile = file.replace('E', '');
          return this.move(findFile, 'duplicated');
        }
      })
    );
  };

  /**
   * move file
   * @param {*} fileName
   * @returns
   */
  move = (fileName, targetFolder) => {
    const targetFile = path.join(this.targetPath, fileName);
    const moveFile = path.join(this.targetPath, targetFolder, fileName);
    return fs
      .rename(targetFile, moveFile)
      .then(() => {
        return console.log(`move ${fileName} to ${targetFolder}`);
      })
      .catch(() => {
        fs.stat(moveFile)
          .then(() => {
            console.log(`${fileName}은 이미 이동되었습니다.`);
          })
          .catch(() => {
            throw new Error('에러 발생! 파일을 이동중 에러가 발생했습니다.');
          });
      });
  };
}

if (process.argv[2] === undefined) {
  console.log('사용할 폴더를 입력하세요.');
  return false;
} else {
  new Photo().run(process.argv[2]);
}
