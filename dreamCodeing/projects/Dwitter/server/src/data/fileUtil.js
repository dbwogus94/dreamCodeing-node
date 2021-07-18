import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

// es6의 module을 사용하면 __dirname, __filename를 아래처럼 사용해야 한다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET = 'tweets.json';
const file = path.join(__dirname, TARGET);

const readFile = async () => {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (e) {
    throw new Error('[파일 없음] 또는 [읽기 중 에러 발생]');
  }
};
//const res = await readFile(file);

// 쓰기
const writeFile = async data => {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }
  try {
    await fs.writeFile(file, data);
  } catch (e) {
    throw new Error('[이어쓰기 중 에러 발생]');
  }
};

export { readFile, writeFile };
