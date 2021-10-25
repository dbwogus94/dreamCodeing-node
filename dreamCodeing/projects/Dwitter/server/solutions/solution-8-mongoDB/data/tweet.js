import * as userRepository from '../data/auth.js';
import { getTweets } from '../db/database.js';
import { ObjectId } from 'mongodb';

/** ## NOSQL (정보의 중복 > 관계)
 *  - NOSQL은 RDB에 비해 조인쿼리의 성능이 많이 떨어진다
 *  - 때문에 NOSQL은 관계를 가지는 것보다 중복을 허용하는 쪽을 택하는 경우가 많다.
 *
 *  ### 모든 사용자가 트윗을 쿼리하는 횟수 vs 사용자가 사용자의 정보를 업데이트 하는 횟수
 *
 *  1) 모든 사용자가 트윗을 쿼리하는 횟수 > 사용자가 사용자의 정보를 업데이트 하는 횟수
 *   -> dwitter 프로젝트 특성을 보면 트윗을 빠르게 CRUD하는 것이 주 목적이다.
 *    이러한 서비스에 document간에 관계를 가지는 것은 너무나 비효율적이다.
 *    때문에 tweet document에서 필요한 유저의 정보를 중복하여,
 *    가지게 하는 방법을 많이 사용한다.
 *   -> 만약 user의 정보가 변경된다면?
 *    즉각 반영해야하는 서비스라면 바로 모든 tweets를 돌면서 update를 실행한다.
 *    즉각 반영하지 않아도 되는 서비스라면 스케줄링같은 기술을 사용하여 트래픽이 적은 시간에 처리한다.
 *
 *  2) 모든 사용자가 트윗을 쿼리하는 횟수 < 사용자가 사용자의 정보를 업데이트 하는 횟수
 *   -> 서비스 특성상 사용자의 정보가 빈번하게 변경되고,
 *    그 데이터를 즉각 반영해야 한다면 관계를 가지는게 나을 수도 있다.
 *    이 경우 조금 느린 조회 성능을 감수하고 NoSQL 관계를 가지던가,
 *    RDB를 사용하는 것이 더 나은 방법일 수도 있다.
 */

// let tweets = [
//   {
//     id: '1',
//     text: '솔루션 코드는 재밌습니다.',
//     createAt: new Date().toString(),
//     userId: '1', // userId를 통해 유저의 정보에 접근
//   },
//   {
//     id: '2',
//     text: 'Hi~',
//     createAt: new Date().toString(),
//     userId: '1',
//   },
// ];

export async function getAll() {
  return getTweets() //
    .find()
    .sort({ createAt: -1 }) // -1: 내림차순
    .toArray()
    .then(mapTweets);
}

export async function getAllByUsername(username) {
  return getTweets() //
    .find({ username })
    .sort({ createdAt: -1 })
    .toArray()
    .then(mapTweets);
}

export async function getById(id) {
  return getTweets()
    .findOne({ _id: new ObjectId(id) })
    .then(mapOptionalTweet);
}

export async function create(text, userId) {
  const { name, username, url } = await userRepository.findById(userId);
  const tweet = {
    text,
    createdAt: new Date(),
    userId,
    name: name,
    username: username,
    url: url,
  };

  return getTweets() //
    .insertOne(tweet)
    .then(data => mapOptionalTweet({ ...tweet, _id: data.insertedId }));
}

export async function update(id, text) {
  // updataOne()는 update이후 수정된 값을 리턴하지 않는다.
  // 그래서 API에서는 리턴 값이 필요한 경우 findOneAndUpdate()를 사용하도록 권고한다.
  return getTweets() //
    .findOneAndUpdate(
      { _id: new ObjectId(id) }, // 찾을 document
      { $set: { text } }, // 수정할 내용
      { returnDocument: 'after' } // 수정 후 결과를 문서를 리턴하도록 설정
      /* findOneAndUpdate()의 returnDocument 옵션
        - findOneAndUpdate는 기본적으로 수정하기 전 document를 리턴한다.
        - 하지만 returnDocument에 'after'를 값으로 지정하면 수정후 document를 리턴한다.
      */
    )
    .then(result => result.value)
    .then(mapOptionalTweet);
}

export async function remove(id) {
  return getTweets().deleteOne({ _id: new ObjectId(id) });
}

/**
 * service나 client에서 사용하는 데이터 형식으로 tweet을 변경한다.
 * @param {object} tweet
 * @returns tweet || null
 * - tweet: { id, text, createdAt, userId, username, name, url }
 * - null: 자원 없음
 */
function mapOptionalTweet(tweet) {
  return tweet //
    ? { ...tweet, id: tweet._id.toString() }
    : tweet; // null
}

/**
 * service나 client에서 사용하는 데이터 형식으로 tweets을 변경한다.
 * @param {array} tweets
 * @returns tweets || []
 * - tweets: {tweet, tweet, ...}
 * - tweet: { id, text, createdAt, userId, username, name, url }
 */
function mapTweets(tweets) {
  return tweets.map(mapOptionalTweet);
}

/*Q) mapOptionalTweet와 mapTweets를 정의하여 사용하는 이유
  A) Repository는 서비스에서 사용하는 data를 조회 가공하는 책임을 가지기 때문이다.

  ### 데이터 가공이 필요한 이유
  조건1. mongoDB는 DB 특성에 따라서 고유 식별자를 _id로 가진다.
  조건2. dwitter에서는 문자열 id를 식별자로 사용한다.
  - 위처럼 "DB에서 사용하는 데이터"와 "앱에서 사용하는 데이터" 간에 차이가 발생하면,
  - repository에서 필요한 데이터를 추가로 만들어주는 가공의 작업이 들어간다.

  Q) 그렇다면 _id는 서비스에서 사용하지 않는데 왜 제거하지 않을까?
  - 사실 앱에서 _id를 사용하지 않기 때문에 repository에서 제거하여 service로 리턴해도 된다.
  - 하지만 service로직에서 _id를 통한 작업을 할 수 있기 때문에 편의상 제거하지 않는 경우도 많다.
  
  ### 설계에 따라 service에서 데이터를 한번 더 가공하여 controller에게 전달하기도 한다.
  ex) Spring은 DTO, Entity를 구분하여 사용한다.
  - Service <-> DAO(Repository)
    => 두 계층 간에는 Entity를 사용하여 데이터를 주고 받는다.

  - Controller <-> Service
    => 두 계층 간에는 DTO를 사용하여 데이터를 주고 받는다.
    => 최종적으로 client에는 DTO의 데이터가 json으로 파싱되어 전달된다.
  
  Q) 왜 하나의 포멧을 사용하지 않고 불편하게 가공의 작업을 할까?
  A) 그것은 repository에는 절대 원칙이 있기 때문이다.

  ### repository에는 절대 원칙.
  1) 데이터베이스에서 필요한 데이터만 읽어 온다
  2) 불필요한 데이터가 불가피하게 포함되어 있다면 읽어온 데이터를
    백엔드/프롣트엔드에 필요한(앱에서 필요한)데이터 모델로 변경한다.
*/
