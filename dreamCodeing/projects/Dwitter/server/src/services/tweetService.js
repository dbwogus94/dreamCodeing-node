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
 */
export const createTweet = async (text, userId) => {
  return await tweetRepository.createTweet(text, userId);
};
/**
 * Update Tweet
 * @param {string} id
 * @param {object} body
 * @returns update tweet
 *  - tweet : 수정된 tweet
 */
export const updateTweet = async (id, text) => {
  return await tweetRepository.updateTweet(id, text);
};
/**
 * Delete Tweet
 * @param {steing} id
 * @returns boolean
 * - true : 자원을 성공적으로 삭제 한 경우
 */
export const deleteTweet = async id => {
  return await tweetRepository.deleteTweet(id);
};
