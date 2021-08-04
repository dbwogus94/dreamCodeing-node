import * as fs from 'fs/promises';

const readFile = async file => {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (e) {
    throw new Error(`[Target file] : ${file}\n[파일 없음] 또는 [읽기 중 에러 발생]`);
  }
};
//const res = await readFile(file);

// 쓰기
const writeFile = async (file, data) => {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  try {
    await fs.writeFile(file, data);
  } catch (e) {
    throw new Error(`[Target file] : ${file}\n[이어쓰기 중 에러 발생]`);
  }
};

export { readFile, writeFile };
