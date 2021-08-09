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
 */

let tweets = [
  {
    id: '1',
    text: '솔루션 코드는 재밌습니다.',
    createAt: Date.now().toString(),
    name: 'Bob',
    username: 'bob',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
  },
  {
    id: '2',
    text: 'Hi~',
    createAt: Date.now().toString(),
    name: 'Ellie',
    username: 'ellie',
  },
];

// 전체 조회
export async function getAll() {
  return tweets;
}
// username으로 조회
export async function getAllByUsername(username) {
  return tweets.filter(tweet => tweet.username === username);
}
// id로 조회
export async function getById(id) {
  return tweets.find(tweet => tweet.id === id); // 없으면 undefined
}
// tweet 작성
export async function create(text, name, username, url) {
  const tweet = {
    id: Date.now().toString(),
    text,
    createAt: new Date(),
    name,
    username,
    url,
  };
  tweets = [tweet, ...tweets];
  return tweet;
}
// tweet 수정
export async function update(id, text) {
  const tweet = tweets.find(tweet => tweet.id === id);
  if (tweet) {
    tweet.text = text;
  }
  return tweet;
}
// tweet 삭제
export async function remove(id) {
  tweets = tweets.filter(tweet => tweet.id !== id);
}
