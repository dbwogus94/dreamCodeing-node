const fs = require('fs').promises;
const { join, extname } = require('path');

/**
 * 요구사항에 따른 파일 분류용 클래스
 * <pre>
 * 핵심 목표
 * - nodejs의 특성에 맞게 비동기를 적절하게 사용한다.
 * - 큰 흐름에 있어서는 동기적으로 만들어서 어떤 일을 하는지 명확하게 한다.
 * <pre>
 */
class Photo {
  constructor() {
    this.DEFAULT_PATH = 'C:/VS_code/dreamCodeing/projects/util/Pictures';
    this.folderList = ['video', 'captured', 'duplicated'];
    this.targetPath = '';
  }

  run = async (target) => {
    this.targetPath = join(this.DEFAULT_PATH, target);
    try {
      // 분류할 폴더 생성
      await this.createDirectorys(this.targetPath);
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
          .stat(join(targetPath, folder))
          .then(() => {
            return true;
          })
          .catch(() => {
            return this.makeDirectory(join(targetPath, folder));
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
        const extension = extname(file);
        // 동영상
        if (this.isVideo(file)) {
          return this.move(file, 'video');
          // 캡쳐
        } else if (this.isCaptured(file)) {
          return this.move(file, 'captured');
          // 보정 있는 원본 사진
        } else if (this.isDuplicated(file)) {
          const originalFile = file.replace('E', '');
          return this.move(originalFile, 'duplicated');
        }
      })
    );
  };
  /**
   * Is video file
   * @param {*} fileName file + extension
   * @returns boolean
   */
  isVideo = (fileName) => {
    const reg = /([.]mp4|[.]mov)$/m;
    return reg.test(fileName);
  };
  /**
   * Is Captured file
   * @param {*} fileName
   * @returns boolean
   */
  isCaptured = (fileName) => {
    const reg = /([.]png|[.]aae)$/m;
    return reg.test(fileName);
  };
  /**
   * Is file duplicated
   * @param {*} fileName file + extension
   * @returns boolean
   */
  isDuplicated = (fileName) => {
    const reg = /_E/;
    return reg.test(fileName);
  };

  /**
   * move file
   * @param {*} fileName file + extension
   * @returns void
   */
  move = (fileName, targetFolder) => {
    const targetFile = join(this.targetPath, fileName);
    const moveFile = join(this.targetPath, targetFolder, fileName);
    return fs
      .rename(targetFile, moveFile)
      .then(() => {
        return console.log(`move ${fileName} to ${targetFolder}`);
      })
      .catch(() => {
        fs.stat(moveFile)
          .then(() => {
            if (extname(fileName) === '.jpg') return; // 이 코드는 개선 필요
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
