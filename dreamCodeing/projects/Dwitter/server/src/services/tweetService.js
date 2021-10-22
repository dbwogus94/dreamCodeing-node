import * as tweetRepository from '../data/tweetRepository.js';
import * as userRepository from '../data/userRepository.js';
/**
 * ### service
 * - service 계층은 프로그램의 주 관심사항에 대한 로직이 들어간다
 * - service 계층은 여러 service를 호출할 수도 있다 .
 * - service 로직은 기본적으로 repository를 사용하여 DB와 통신한다.
 * - 때문에 트랜젝션 처리는 service로직에서 주로 호출 처리한다.
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
 * @throws MongoDB insert error
 */
export const createTweet = async (text, userId) => {
  try {
    // 트윗에 추가할 user 조회
    const user = await userRepository.findById(userId);
    // 신규 트윗 생성
    const result = await tweetRepository.createTweet(text, user);
    // 방금 추가한 tweet 찾아서 리턴한다.
    return tweetRepository.findTweetById(result.insertedId);
  } catch (error) {
    // rallback()
    throw error;
  }
};
/**
 * Update Tweet
 * @param {string} id
 * @param {string} text
 * @returns update tweet
 *  - tweet : 수정된 tweet
 * @throws MongoDB update error
 */
export const updateTweet = async (id, text) => {
  try {
    // 수정 내용 DB파일에 적용
    await tweetRepository.updateTweet(id, text);
    // 성공시: 수정한 tweet을 리턴
    return tweetRepository.findTweetById(id);
  } catch (error) {
    // rallback()
    throw error;
  }
};
/**
 * Delete Tweet
 * @param {steing} id
 * @throws MongoDB delete error
 */
export const deleteTweet = async id => {
  try {
    await tweetRepository.deleteTweet(id);
  } catch (error) {
    //rollback()
    throw error;
  }
};
