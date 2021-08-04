import * as path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from '../util/fileUtil.js';

// es6의 module을 사용하면 __dirname, __filename를 아래처럼 사용해야 한다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET = 'database/users.json';
const file = path.join(__dirname, TARGET);

export const readUsers = async () => {
  return await readFile(file);
};

export const writeUsers = async users => {
  return await writeFile(file, users);
};
