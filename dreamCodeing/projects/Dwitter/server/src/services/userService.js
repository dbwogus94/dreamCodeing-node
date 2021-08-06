import * as userRepository from '../data/userRepository.js';
/**
 * user Array
 * @returns user Array
 * - Array : user Array
 */
export const getUsers = async () => {
  // 파일을 읽어온다.
  return await userRepository.readUsers();
};

/**
 * select by username
 * @param {string} username
 * @returns
 * - user
 * - undefined
 */
export const findByUsername = async username => {
  const users = await getUsers();
  return users.find(user => user.username === username);
  // find : 찾는 값이 없으면 undefined
};

/**
 * create user
 * @param {object} user
 * @returns boolean
 */
export const createUser = async user => {
  // 유저저장소에 유저 추가
  const users = await userRepository.readUsers();
  users.push(user);
  await userRepository.writeUsers(users);

  // 성공확인을 위해 추가된 유저를 다시 조회
  return (await findByUsername(user.username)) //
    ? true
    : false;
};
