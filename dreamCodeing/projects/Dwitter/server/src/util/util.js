export const ObjUtil = {
  /**
   * deep copy
   * @param {object} obj 복사 대상
   * @returns {object} Object 복사 결과
   */
  copyObj: obj => {
    const result = {};
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        result[key] = copyObj(obj[key]);
      } else {
        result[key] = obj[key];
      }
    }
    return result;
  },
};
