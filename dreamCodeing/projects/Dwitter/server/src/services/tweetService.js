import * as tweetRepository from '../data/tweetRepository.js';
import * as userService from '../services/userService.js';
/**
 * model 계층
 * - service 계층 또는 data 계층이라고 한다.
 * - 리소스를 조회, 조작, 가공하는 계층이다.
 * - spring의 경우 Model 계층을 service와 DAO 계층으로 나누어서 사용하였다.
 */

/**
 * get Original Tweets
 * @returns
 */
const getOriginalTweets = async () => {
  return await tweetRepository.readTweets();
};

/**
 * tweet Array
 * @returns tweet Array
 * - Array : tweet Array
 */
export const getAllTweets = async () => {
  // 1) DB에서 읽어온다.
  const tweets = await getOriginalTweets();
  const users = await userService.getUsers();

  // 2) tweets에 있는 userId를 통해 {...tweet, ...user} 형태의 데이터를 만든다.
  const result = [];
  tweets.forEach(tweet => {
    const { username, name, url } = users.find(user => user.id === tweet.userId);
    result.push({ ...tweet, username, name, url });
  });

  return result;
};
/**
 * select username
 * @param {string} username
 * @returns tweet Array
 * - Array : tweet Array
 * - false : 일치하는 작성자가 없는 경우
 */
export const getUserTweets = async username => {
  const tweets = await getAllTweets();
  const findList = tweets.filter(tweet => {
    return tweet.username === username;
  });
  return findList.length //
    ? findList
    : false;
};
/**
 * get Tweet
 * @param {string} id
 * @returns tweet
 * - tweet : 찾은 자원
 * - null : 자원이 없는 경우
 */
export const getTweet = async id => {
  const tweets = await getOriginalTweets();
  // id와 일치하는 트윗 가져오기
  const found = tweets.find(tweet => tweet.id === id);
  if (!found) {
    return null;
  }
  const { username, name, url } = await userService.findById(found.userId);
  return { ...found, username, name, url };
};
/**
 * Create Tweet
 * @param {string} text
 * @param {string} userId
 * @returns new tweet
 */
export const createTweet = async (text, userId) => {
  // 1) 신규 트윗 생성
  const newTweet = {
    id: Date.now().toString(),
    createdAt: new Date(Date.now()),
    text,
    userId,
  };
  // 2) 작성: 신규 tweet을 추가한 tweets을 파일에 새로 작성
  const tweets = await getOriginalTweets();
  await tweetRepository.writeTweets([newTweet, ...tweets]);
  // 3) 조회: 방금 추가한 tweet 찾아서 리턴한다.
  return await getTweet(newTweet.id);
};
/**
 * Update Tweet
 * @param {string} id
 * @param {object} body
 * @returns update tweet
 *  - tweet : 수정된 tweet
 *  - null : 자원이 없는 경우
 */
export const updateTweet = async (id, text) => {
  // 1) 수정할 tweet 찾기
  const tweets = await getOriginalTweets();
  const found = tweets.find(tweet => tweet.id === id);
  if (!found) {
    return null;
  }
  // 2) tweet 수정
  found.text = text;
  // 3) 수정 내용 DB파일에 적용
  await tweetRepository.writeTweets(tweets);
  // 4) 수정한 tweet을 리턴
  return await getTweet(id);
};
/**
 * Delete Tweet
 * @param {steing} id
 * @returns boolean
 * - true : 자원을 성공적으로 삭제 한 경우
 * - null : 자원이 없는 경우
 */
export const deleteTweet = async id => {
  // 1) 삭제할 tweet 찾기
  const tweets = await getOriginalTweets();
  const findIndex = tweets.findIndex(tweet => tweet.id === id);
  if (findIndex === -1) {
    return null;
  }
  // 2) tweet 제거
  tweets.splice(findIndex, 1);
  // 삭제 DB파일에 반영
  await tweetRepository.writeTweets(tweets);
  return true;
};
