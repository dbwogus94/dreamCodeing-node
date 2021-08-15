import * as userRepository from '../data/userRepository.js';
/**
 * ### 수정
 * - 기존 :
 *  userService에는 비즈니스와 관련없는 데이터 관련 로직이 들어있어 분리하였음.
 * - 변경 :
 *  데이터 관련 로직은 userRepository로 이동함.
 */

/**
 * get All Users
 * @returns user Array
 * - Array : user Array
 */
export const getUsers = async () => {
  return await userRepository.findUsers();
};

/**
 * select by username
 * @param {string} username
 * @returns
 * - user
 * - null
 */
export const findByUsername = async username => {
  return await userRepository.findByUsername(username);
};

/**
 * create user
 * @param {object} user { username, password, name, email, url }
 * @returns boolean
 * - true : 저장 성공
 * - false : 저장 실패
 */
export const createUser = async user => {
  // 신규 유저 생성
  const result = await userRepository.createUser(user);
  // 실패시
  if (!result) {
    throw new Error('[insert] 유저 생성 실패');
    // rollback()
  }
  // 성공시
  return true;
};

/**
 * 유저의 id로 조회
 * @param {string} user.id
 * @returns
 * - user
 * - null
 */
export const findById = async id => {
  return await userRepository.findById(id);
};
