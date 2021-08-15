import * as tweetRepository from '../data/tweetRepository.js';
/**
 * model 계층
 * - service 계층 또는 data 계층이라고 한다.
 * - 리소스를 조회, 조작, 가공하는 계층이다.
 * - spring의 경우 Model 계층을 service와 DAO 계층으로 나누어서 사용하였다.
 *
 * ### 수정
 * - 기존 :
 *  tweetService에는 비즈니스와 관련없는 데이터 관련 로직이 들어있어 분리하였음.
 * - 변경 :
 *  데이터 관련 로직은 tweetRepository로 이동함.
 */

/**
 * get All tweets
 * @returns tweet Array
 * - Array : tweet Array
 */
export const getTweets = async () => {
  return await tweetRepository.findTweets();
};
/**
 * get tweets by username
 * @param {string} username
 * @returns tweet Array
 * - Array : tweet Array
 */
export const getUserTweets = async username => {
  return await tweetRepository.findTweetsByUser(username);
};
/**
 * get Tweet by id
 * @param {string} id
 * @returns tweet
 * - tweet : 찾은 자원
 * - null : 자원이 없는 경우
 */
export const getTweetById = async id => {
  return await tweetRepository.findTweetById(id);
};
/**
 * Create Tweet
 * @param {string} text
 * @param {string} userId
 * @returns new tweet
 * @throws insert tweet fail
 */
export const createTweet = async (text, userId) => {
  // 신규 트윗 생성
  const result = await tweetRepository.createTweet(text, userId);
  // 실패시
  if (!result) {
    throw new Error('[insert] 트윗 생성 실패');
    // rollback()
  }
  // 성공시 : 방금 추가한 tweet 찾아서 리턴한다.
  return await tweetRepository.findTweetById(result);
};
/**
 * Update Tweet
 * @param {string} id
 * @param {object} body
 * @returns update tweet
 *  - tweet : 수정된 tweet
 *  - null : 자원이 없는 경우
 * @throws update tweet fail
 */
export const updateTweet = async (id, text) => {
  // 수정 내용 DB파일에 적용
  const result = await tweetRepository.updateTweet(id, text);
  if (result === null) {
    return null;
  }
  // 실패시
  if (!result) {
    throw new Error('[update] 트윗 수정 실패');
    // rollback()
  }
  // 성공시: 수정한 tweet을 리턴
  return await tweetRepository.findTweetById(id);
};
/**
 * Delete Tweet
 * @param {steing} id
 * @returns boolean
 * - null : 자원이 없는 경우
 * - true : 자원을 성공적으로 삭제 한 경우
 * @throws delete tweet fail
 */
export const deleteTweet = async id => {
  const result = await tweetRepository.deleteTweet(id);
  if (result === null) {
    return null;
  }
  // 실패시
  if (!result) {
    throw new Error('[delete] 트윗 삭제 실패');
  }
  // 성공시
  return result;
};
