import * as userRepository from '../data/userRepository.js';
/**
 * user Array
 * @returns user Array
 * - Array : user Array
 * - [] : 파일이 없는 경우, 또는 에러
 */
export const getUsers = async () => {
  // 파일을 읽어온다.
  try {
    return await userRepository.readUsers();
  } catch (e) {
    return [];
  }
};

/**
 * select by username
 * @param {*} username
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
 * @param {*} user
 * @returns new user
 * - user : 신규 등록 성공
 * - undefined : 저장 실패
 */
export const createUser = async user => {
  // 유저저장소에 유저 추가
  const users = await userRepository.readUsers();
  users.push(user);
  await userRepository.writeUsers(users);
  console.log('[users]', users);

  // 성공했다면 추가된 유저를 다시 조회하여 리턴
  return findUser(user.username, user.password);
};

/**
 * name, password가 일치하는 회원 찾기
 * @param {*} username
 * @param {*} hashPassword
 * @returns
 * - user
 * - undefined
 */
export const findUser = async (username, hashPassword) => {
  const users = await userRepository.readUsers();
  return users.find(user => user.username === username && user.password === hashPassword);
};
