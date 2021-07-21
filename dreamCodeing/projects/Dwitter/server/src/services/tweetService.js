import * as fileUtil from '../data/fileUtil.js';

/**
 * model 계층
 * - service 계층 또는 data 계층이라고 한다.
 * - 리소스를 조회, 조작, 가공하는 계층이다.
 * - spring의 경우 Model 계층을 service와 DAO 계층으로 나누어서 사용하였다.
 */

/**
 * tweet Array
 * @returns tweet Array
 * - Array : tweet Array
 * - [] : 파일이 없는 경우, 또는 에러
 */
export const getAllTweets = async () => {
  // 파일을 읽어온다.
  try {
    return await fileUtil.readFile();
  } catch (e) {
    return [];
  }
};
/**
 * select username
 * @param {*} username
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
 * @param {*} id
 * @returns tweet
 * - tweet : 찾은 자원
 * - false : 자원이 없는 경우
 */
export const getTweet = async id => {
  const tweets = await getAllTweets();
  const findIndex = getTweetIndex(tweets, id);
  return findIndex !== -1 //
    ? tweets[findIndex]
    : false;
};
/**
 * Create Tweet
 * @param {*} body
 * @returns tweet
 */
export const createTweet = async body => {
  const tweets = await getAllTweets();
  const newTweet = {};
  const newId = Date.now();
  newTweet.id = newId;
  newTweet.createdAt = new Date(Date.now());
  Object.keys(body).forEach(key => {
    return (newTweet[key] = body[key]);
  });
  tweets.unshift(newTweet);
  // 1. 작성 : 신규 tweet을 추가한 tweets을 파일에 새로 작성
  await fileUtil.writeFile(tweets);
  // 2. 조회 : DB파일에서 방금 추가한 tweet 찾아서 리턴한다.
  const newTweets = await getAllTweets();
  return newTweets.find(tweet => tweet.id === newId);
};
/**
 * Update Tweet
 * @param {*} id
 * @param {*} body
 * @returns tweet
 *  - tweet : 수정된 tweet
 *  - false : 자원이 없는 경우
 */
export const updateTweet = async (id, body) => {
  // 수정할 tweet 찾기
  const tweets = await getAllTweets();
  const findIndex = getTweetIndex(tweets, id);
  if (findIndex === -1) return false;
  // 찾은 tweet 요청 body 내용으로 수정
  for (let key in body) {
    tweets[findIndex][key] = body[key];
  }
  tweets[findIndex].createdAt = new Date(Date.now());

  // 수정 내용 DB파일에 적용
  await fileUtil.writeFile(tweets);
  const newTweets = await getAllTweets();
  return newTweets[findIndex];
};
/**
 * Delete Tweet
 * @param {*} id
 * @returns boolean
 * - true : 자원을 성공적으로 삭제 한 경우
 * - fales : 자원이 없는 경우
 */
export const deleteTweet = async id => {
  // 삭제할 tweet 있는지 확인
  const tweets = await getAllTweets();
  const findIndex = getTweetIndex(tweets, id);
  if (findIndex === -1) return false;

  // 삭제
  tweets.splice(findIndex, 1);
  // 삭제 DB파일에 반영
  await fileUtil.writeFile(tweets);

  // 성공적으로 삭제 됐는지 확인
  const newTweets = await fileUtil.readFile();
  return getTweetIndex(newTweets, id) === -1 //
    ? true
    : false;
};

//
const getTweetIndex = (tweets, id) => {
  return tweets.findIndex(tweet => {
    return tweet.id === Number(id);
  });
};

//export { getAllTweets, getUserTweets, getTweet, createTweet, updateTweet, deleteTweet };
