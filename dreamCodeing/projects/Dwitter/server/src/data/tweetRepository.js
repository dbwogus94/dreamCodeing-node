import database from '../db/database.js';
import { ObjectId } from 'mongodb';
import moment from 'moment-timezone';

// 한국시간으로 타임존 설정
moment.tz.setDefault('Asia/Seoul');
const { getTweets } = database;

/**
 * client에 맞춰 tweet 포멧 플랫하게 변경
 * @param {object} tweet
 * @returns plat tweet
 * - {_id, id, text, createdAt, user_id, userId, username, name, email, url}
 */
function toPlat(tweet) {
  const temp = {};
  const { _id, id, username, name, email, url } = tweet.user;
  Object.keys(tweet).forEach(key => {
    if (key !== 'user') temp[key] = tweet[key];
  });
  return { ...temp, user_Id: _id, userId: id, username, name, email, url };
}

/**
 * Select Tweets
 * @returns tweets || []
 * - tweets : tweet Array
 * - tweet : {id, _id, text, createdAt, user }
 * - user : { id, _id, username, name, url }
 */
export const findTweets = async () => {
  const findCursor = await getTweets().find().sort({ createdAt: -1 }); // 1 오름, -1 내림
  const result = await findCursor.toArray();
  return result.map(tweet => toPlat({ ...tweet, id: tweet._id.toHexString() }));
};

/**
 * Select Tweets by username
 * @param {string} tweet.user.username
 * @returns tweets || []
 * - tweets : tweet Array
 * - tweet : {id, _id, text, createdAt, user }
 * - user : { id, _id, username, name, url }
 */
export const findTweetsByUser = async username => {
  const findCursor = await getTweets() //
    .find({ 'user.username': username })
    .sort({ createdAt: -1 }); // 1 오름, -1 내림;
  const result = await findCursor.toArray();
  return result.map(tweet => toPlat({ ...tweet, id: tweet._id.toHexString() }));
};

/**
 * Select Tweet by id
 * @param {string} tweet.id
 * @returns tweet || null
 * - tweet: {id, _id, text, createdAt, user}
 * - null : 자원이 없는 경우
 */
export const findTweetById = async id => {
  const result = await getTweets().findOne({ _id: ObjectId(id) });
  return result //
    ? toPlat({ ...result, id: result._id.toHexString() })
    : null;
};

/**
 * Create Tweet
 * @param {string} tweet.text - 글 내용
 * @param {object} tweet.user - 작성자 (password, eamil 제외)
 * @returns Promise<InsertOneResult<TSchema>>;
 * - InsertOneResult.acknowledged: 요청 승인 여부
 * - InsertOneResult.insertedId: 생성된 document _id
 */
export const createTweet = async (text, user) => {
  return getTweets().insertOne({
    text,
    createdAt: moment().format(), // ex) 2021-10-21T02:13:03+09:00
    user,
  });
};

/**
 * Update Tweet
 * @param {string} tweet.id
 * @param {string} tweet.text
 * @returns Promise<UpdateResult<>>
 * - UpdateResult.acknowledged: 요청이 승인되었는지 여부
 * - UpdateResult.modifiedCount: 수정 쿼리로 인해 수정된 document 수
 * - UpdateResult.upsertedId: upsert기능으로 신규 생성된 document의 _id
 * - UpdateResult.upsertedCount: upsert기능으로 생성된 document 수
 * - UpdateResult.matchedCount: 수정 요청한 조건과 일치하는 document 수
 * - ex) 수정 대상이 없어서 신규 생성된 결과
 * - UpdateResult: {
 * -  acknowledged: true,
 * -  modifiedCount: 0,
 * -  upsertedId: new ObjectId("6172a0e48170cd38688cb381"),
 * -  upsertedCount: 1,
 * -  matchedCount: 0     // 일치하는 document 없음
 * - }
 * - ex) 수정 대상이 있어서 수정이 실행된 결과
 * - UpdateResult: {
 * -  acknowledged: true,
 * -  modifiedCount: 1,   // 수정된 document 1개
 * -  upsertedId: null,
 * -  upsertedCount: 0,
 * -  matchedCount: 1     // 일치하는 document 1개 있음
 * - }
 * - ex) 수정 대상이 있지만 변경 전/후가 일치하여 수정이 실행되지 않은 결과
 * - UpdateResult: {
 * -  acknowledged: true,
 * -  modifiedCount: 0,   // 수정 실행 없음
 * -  upsertedId: null,
 * -  upsertedCount: 0,
 * -  matchedCount: 1     // 일치하는 document 1개 있음
 * - }
 */
export const updateTweet = async (id, text) => {
  return getTweets() //
    .updateOne(
      { _id: ObjectId(id) }, // 찾을 document
      { $set: { text } }, // 수정할 내용
      { upsert: false } // upsert옵션 사용여부
    );
  /*## updateOne VS replaceOne
    ### updateOne
    - *데이터 갱신에 사용
    - {$set: }을 사용해야 *데이터 갱신으로 동작한다.
    - {$set: }을 사용하지 않으면 *데이터 변경으로 동작함.
    - 데이터가 없으면 INSERT를 수행하는 옵션 제공한다. {upsert: true}

    ### replaceOne
    - *데이터 변경에 사용
    - {$set: }없이 사용한다.
    - 데이터가 없으면 INSERT를 수행하는 옵션 제공한다. {upsert: true}

    **데이터 갱신 - document의 특정 필드만 변경
    **데이터 변경 - document의 _id를 제외한 모든 데이터 변경
    **upsert = update + insert
  */
};

/**
 * Delete Tweet
 * @param {steing} tweet.id
 * @returns Promise<DeleteResult<>>
 * - DeleteResult.acknowledged: 요청 승인 여부
 * - DeleteResult.deletedCount: 삭제된 document 수
 */
export const deleteTweet = async id => {
  return getTweets().deleteOne({ _id: ObjectId(id) });
};
