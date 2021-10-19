import * as userRepository from '../data/userRepository.js';
/**
 * ### 수정
 * - 기존 :
 *  userService에는 비즈니스와 관련없는 데이터 관련 로직이 들어있어 분리하였음.
 * - 변경 :
 *  데이터 관련 로직은 userRepository로 이동함.
 */

/**
 * select by username
 * @param {string} username
 * @returns
 * - user { username, password, name, email, url }
 * - null
 */
export const findByUsername = async username => {
  return userRepository.findByUsername(username);
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
  return !!(await userRepository.createUser(user));
};

/**
 * 유저의 id로 조회
 * @param {string} user.id
 * @returns
 * - user { username, name, email, url }
 * - null
 */
export const findById = async id => {
  return userRepository.findById(id);
};
