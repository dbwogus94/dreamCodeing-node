const fs = require('fs').promises;
const { join, extname } = require('path');
const os = require('os');

/**
 * 요구사항에 따른 파일 분류용 클래스
 *
 * 핵심 목표
 * - nodejs의 특성에 맞게 비동기를 적절하게 사용한다.
 * - 큰 흐름에 있어서는 동기적으로 만들어서 어떤 일을 하는지 명확하게 한다.
 * <pre>
 */


class PhotoOrganizer {
  /**
   * PhotoOrganizer 생성자
   * @param {*} targetPath 정리 해야할 파일이 있는 폴더 경로
   * @param {*} folderList 조건에 따라 분류 해야하는 폴더 리스트
   */
  constructor(targetPath, folderList) {
    this.targetPath = targetPath;
    this.folderList = folderList;
  }

  run = async () => {
    try {
      // 분류할 폴더 생성
      await this.createDirectorys();
      // 파일 리스트 가져오기
      const fileList = await fs.readdir(this.targetPath);
      // 파일 분류 실행
      await this.classifyFiles(fileList);

      console.info('파일 분류 완료!!\n프로그램을 종료합니다.');
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * create Directory : 분류할 폴더들이 있는지 확인하고 없으면 생성
   * @param {*} path A path is file full name
   * @returns Promise
   */
  createDirectorys = () => {
    // Promise.all(List.map()) : 반복된 비동기를 일괄로 처리하는 방법
    return Promise.all(
      this.folderList.map((folder) => {
        return fs
          .stat(join(this.targetPath, folder))
          .then(() => {
            return true;
          })
          .catch(() => {
            return this.makeDirectory(join(this.targetPath, folder));
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
        // 동영상
        if (this.isVideo(file)) {
          return this.move(file, 'video');
          // 캡쳐
        } else if (this.isCaptured(file)) {
          return this.move(file, 'captured');
          // 보정 있는 원본 사진
        } else if (this.isDuplicated(file, fileList)) {
          return this.move(file, 'duplicated');
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
    const reg = /([.]mp4|[.]mov)$/gm;
    return reg.test(fileName);
  };
  /**
   * Is Captured file
   * @param {*} fileName
   * @returns boolean
   */
  isCaptured = (fileName) => {
    const reg = /([.]png|[.]aae)$/gm;
    return reg.test(fileName);
  };
  /**
   * Is file duplicated
   * @param {*} fileName file + extension
   * @returns boolean
   */
  isDuplicated = (fileName, fileList) => {
    // TODO : (수정) 원본 사진을 duplicated로 보낸다. 그러므로 원본을 찾아야 한다.
    // 기존 코드는 수정본을 찾아서 처리했다. 그로인해 일관성 없는 코드 구조를 가지게 되었다.
    if (!fileName.startsWith('IMG_') || fileName.startsWith('IMG_E')) {
      return false;
    }
    // 파일 리스트에서 원본파일을 기준으로 수정 파일 있는지 확인
    const modFile = `IMG_E${fileName.split('_')[1]}`;
    const found = fileList.find((f) => f.includes(modFile));
    return !!found;
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
        return console.info(`move ${fileName} to ${targetFolder}`);
      })
      .catch(() => {
        fs.stat(moveFile)
          .then(() => {
            console.info(`${fileName}은 이미 이동되었습니다.`);
          })
          .catch(() => {
            throw new Error('에러 발생! 파일을 이동중 에러가 발생했습니다.');
          });
      });
  };
}

// TODO : 강의를 보고 보완한 코드
processRun = async () => {
  const exists = (workingDir) => {
    return fs
      .stat(workingDir) //
      .catch((e) => {
        return false;
      });
  };
  // 1. 사용자 입력 정보 가져오기
  const folder = process.argv[2] || '';
  const workingDir = join(os.homedir(), '_Pictures', folder); // os.homedir() : C:\\Uesers\\1994d

  if (!folder || !(await exists(workingDir))) {
    console.error('Please enter folder name in Pictures');
    return;
  } else {
    // 2. 폴더 생성, 3. 조건별 분류 시작
    new PhotoOrganizer(workingDir, ['video', 'captured', 'duplicated']).run();
  }
};

processRun();
