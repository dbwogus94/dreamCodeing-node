// DB 추가시 아래 코드제거 예정 (...writeFile 까지)
import * as userService from '../services/userService.js';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { readFile, writeFile } from '../util/fileUtil.js';

// es6의 module을 사용하면 __dirname, __filename를 아래처럼 사용해야 한다.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET = 'database/tweets.json';
const file = path.join(__dirname, TARGET);

// DB 추가시 제거
export const readTweets = async () => {
  return await readFile(file);
};
// DB 추가시 제거
export const writeTweets = async tweets => {
  return await writeFile(file, tweets);
};

/**
 * ### Select Only Tweets
 * - ex) SQL
 * select * form tweet;
 * @returns tweet
 */
const findOnlyTweets = async () => {
  return await readTweets();
};

/**
 * ### Select Tweets
 * - user의 정보가 포함된 모든 tweets
 * - ex) SQL : select * from tweet t join user u on t.userId = u.id;
 * @returns tweet Array
 * - Array : tweet Array
 */
export const findTweets = async () => {
  // 1) DB에서 읽어온다.
  const tweets = await findOnlyTweets();
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
 * ### Select Tweets by username
 * - ex) SQL :
 *  select *
 *  from tweet t join user u
 *  on t.userId = u.id
 *  where t.username = ${tweet.username};
 * @param {string} tweet.username
 * @returns tweet Array
 * - Array : tweet Array
 * - false : 일치하는 작성자가 없는 경우
 */
export const findTweetsByUser = async username => {
  const tweets = await findTweets();
  const findList = tweets.filter(tweet => {
    return tweet.username === username;
  });
  return findList.length //
    ? findList
    : false;
};

/**
 * ### Select Tweet by id
 * - ex) SQL :
 *  select *
 *  from tweet t join user u
 *  on t.userId = u.id
 *  where t.id = ${tweet.id};
 * @param {string} tweet.id
 * @returns tweet
 * - tweet : 찾은 자원
 * - null : 자원이 없는 경우
 */
export const findTweetById = async id => {
  const tweets = await findOnlyTweets();
  // id와 일치하는 트윗 가져오기
  const found = tweets.find(tweet => tweet.id === id);
  if (!found) {
    return null;
  }
  const { username, name, url } = await userService.findById(found.userId);
  return { ...found, username, name, url };
};

/**
 * ### Create Tweet
 * - ex) SQL :
 *  insert into
 *  tweet(text, userId)
 *  values(${newTweet.text}, ${newTweet.userId});
 * @param {string} tweet.text - 글 내용
 * @param {string} tweet.userId - 작성자 id
 * @returns newTweet.id - 생성된 tweet id
 */
export const createTweet = async (text, userId) => {
  // 신규 트윗
  const newTweet = {
    id: Date.now().toString(), // TODO: DB에서 생성
    createdAt: new Date(Date.now()), // TODO: DB에서 생성
    text,
    userId,
  };
  // 작성: 기존 tweets에 신규 트윗을 추가한다.
  const tweets = await findOnlyTweets();
  await writeTweets([newTweet, ...tweets]);
  // TODO: DB추가시 실패 코드 필요

  // 성공시 생성한 트윗 id 리턴
  return newTweet.id;
};

/**
 * ### Update Tweet
 * - ex) SQL :
 *  update tweet
 *  set text = ${tweet.text}
 *  where id = ${tweet.id}
 * @param {string} tweet.id
 * @param {object} tweet.text
 * @returns boolean : !!성공 실패 코드
 */
export const updateTweet = async (id, text) => {
  // 1) 수정할 tweet 찾기
  const tweets = await findOnlyTweets();
  const found = tweets.find(tweet => tweet.id === id);
  if (!found) {
    return null;
  }
  // 2) tweet 수정
  found.text = text;
  // 3) 수정 내용 DB파일에 적용
  await writeTweets(tweets);
  return !!1;
  // TODO: DB추가시 응답 코드리턴 ex) 성공시 1, 실패 0
};

/**
 * ### Delete Tweet
 * - ex) SQL : delete from tweet where id = ${tweet.id}
 * @param {steing} tweet.id
 * @returns boolean
 * - true : 자원을 성공적으로 삭제 한 경우
 * - null : 자원이 없는 경우
 */
export const deleteTweet = async id => {
  // 1) 삭제할 tweet 찾기
  const tweets = await findOnlyTweets();
  const findIndex = tweets.findIndex(tweet => tweet.id === id);
  if (findIndex === -1) {
    return null;
  }
  // 2) tweet 제거
  tweets.splice(findIndex, 1);
  // 삭제 DB파일에 반영
  await writeTweets(tweets);
  return !!1;
  // TODO: DB추가시 응답 코드리턴 ex) 성공시 1, 실패 0
};
