/**
 * ### Model 계층 : DATA에 관한 보관, CRUD, 가공을 담당한다.
 * - data(리소스) 조작(CURD)과 가공을 담당하는 계층이다.
 * - Spring으로 생각하면 service계층과 DAO 계층이 여기에 속한다.
 *
 * ### 리펙터링
 * 1단계) data를 다루는 코드는 data 계층으로
 *  기존 tweets.js에 있던 data를 조작하는 로직을 해당 data 계층으로 이동시킨다.
 * 2단계) 함수명에서 중복되는 이름을 제거한다.
 *  data 계층을 사용하는 곳에서 이름을 tweetRepository로 사용한다
 *  그렇기 때문에 함수명에 tweet에 들어가지 않게 명명한다.
 *
 * ### solution-4-jwt에서 수정
 * 유저의 정보는 data/auth.js에서 관리하기 한다.
 * 그렇기 때문에 tweets에 있던 유저의 정보를 userId로 변경하고
 * userId를 통해 유저의 정보에 접근하도록 변경한다.
 *
 * 아래 함수 모두 userId를 통해 user의 정보에 접근하도록 변경
 * - getAll()
 * - getAllByUsername
 * - getById()
 * - create()
 * - update()
 */

import * as userRepository from '../data/auth.js';

let tweets = [
  {
    id: '1',
    text: '솔루션 코드는 재밌습니다.',
    createAt: new Date().toString(),
    userId: '1', // userId를 통해 유저의 정보에 접근
  },
  {
    id: '2',
    text: 'Hi~',
    createAt: new Date().toString(),
    userId: '1',
  },
];

/**
 * 유저의 정보를 담은 전체 tweet을 가져온다.
 * @returns
 * tweets = [
 *  { tweet, usernaem, name, url },
 *   ...
 * ]
 */
export async function getAll() {
  return Promise.all(
    tweets.map(async tweet => {
      const { username, name, url } = await userRepository.findById(tweet.userId);
      return { ...tweet, username, name, url };
      // async를 사용했기 때문에 promise를 리턴한다.
      // 그렇기 때문에 Promise.all의 인자로 사용이 가능하다.
    })
  );
}
/**
 * username(작성자)와 일치하는 모든 tweet 조회
 * @param {string} username
 * @returns
 * tweets = [
 *  { tweet, usernaem, name, url },
 *   ...
 * ]
 */
export async function getAllByUsername(username) {
  // username는 userRepository에서 가지고 있다. 그렇기 때문에 getAll 호출
  const tweets = await getAll();
  return tweets.filter(tweet => tweet.username === username);
}
/**
 * tweet의 id와 일치하는 tweet 조회
 * @param {string} id
 * @returns
 * tweet = { tweet, username, name, url }
 */
export async function getById(id) {
  // 1) tweets에서 인자로 받은 id와 일치하는 tweet 찾기
  const found = tweets.find(tweet => tweet.id === id); // 없으면 undefined
  if (!found) {
    return null;
  }
  // 2) 찾은 tweet에서 userId를 통해 유저의 정보를 찾기
  const { username, name, url } = await userRepository.findById(found.userId);
  // 3) 찾은 tweet과 user의 정보를 합하여 리턴한다.
  return { ...found, username, name, url };
}
/**
 * 신규 tweet 생성
 * @param {string} text
 * @param {string} userId
 * @returns
 * tweet = {tweet, username, name, url}
 */
export async function create(text, userId) {
  // 1) 트윗 생성
  const tweet = {
    id: Date.now().toString(),
    text,
    createAt: new Date().toString(),
    userId,
  };
  // 2) 기존 tweets 가장 앞에 신규 트윗 추가
  tweets = [tweet, ...tweets];
  // 3) user정보가 포함된 tweet을 리턴한다.
  return getById(tweet.id);
}
/**
 * tweet의 id와 일치하는 tweet 수정
 * @param {string} id
 * @param {string} text
 * @returns
 * tweet = {tweet, username, name, url}
 */
export async function update(id, text) {
  // 1) 일치하는 트윗 찾기
  const tweet = tweets.find(tweet => tweet.id === id);
  if (!tweet) {
    return null;
  }
  // 2) tweet 수정
  tweet.text = text;
  // 3) user의 정보를 포함한 tweet을 리턴
  return getById(id);
}
/**
 * tweet의 id와 일치하는 트윗 삭제
 * @param {string} id
 */
export async function remove(id) {
  tweets = tweets.filter(tweet => tweet.id !== id);
}
