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

/**
 * ### Select users
 * - ex) SQL : select * from user;
 * @returns users
 */
export const findUsers = async () => {
  return await readUsers();
};

/**
 * ### Select user by username
 * - ex) SQL : select * from user where username = ${user.username}
 * @param {string} user.username
 * @returns user
 * - null : 자원없음
 */
export const findByUsername = async username => {
  const users = await findUsers();
  const result = users.find(user => user.username === username);
  return result ? result : null;
};

/**
 * ### Create user
 * - ex) SQL :
 * insert into
 * user(username, password, name, email, url)
 * values(${user.username}, ${user.password}, ${user.name}, ${user.email}, ${user.url});
 * @param {object} user { username, password, name, email, url }
 * @return boolean - 성공 실패 여부
 */
export const createUser = async user => {
  const newUser = { id: Date.now().toString(), ...user };
  const users = await findUsers();
  users.push(newUser);
  await writeUsers(users);
  return !!1;
  // TODO: DB추가시 응답 코드리턴 ex) 성공시 1, 실패 0
};

/**
 * ### Select user by id
 * - ex) SQL : select * from user where id = ${user.id}
 * @param {string} user.id
 * @returns
 * - user
 * - null
 */
export const findById = async id => {
  const users = await findUsers();
  const result = users.find(user => user.id === id);
  return result //
    ? result
    : null;
};
