import database from '../../../db/database.js';
import * as tweetRepository from '../../../data/tweetRepository.js';
import { Db } from 'mongodb';

// moment를 사용하여 한국시간으로 타임존 설정
import moment from 'moment-timezone';
moment.tz.setDefault('Asia/Seoul');

const mismatchId = '617286b650716612eb621f94';
const sampleUsers = [
  {
    username: 'bob',
    password: '12345',
    name: 'Bob',
    email: 'bob@gmail.com',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
  },
  {
    username: 'jay',
    password: '12345',
    name: 'Jay',
    email: 'jay@gmail.com',
    url: '',
  },
];

let sampleTweets = [
  {
    text: 'New Massage -1 :)',
    createdAt: moment().format(), // ex) 2021-10-21T02:13:03+09:00
  },
  {
    text: 'New Massage -2 :)',
    createdAt: moment().format(),
  },
  {
    text: '안녕하세요. 코딩은 재밌습니다.',
    createdAt: moment().format(),
  },
];

let user, users, tweets;
beforeAll(async () => {
  /* DB 연결 */
  await database.connectDB();

  /* get collection */
  const db = database.getDb();
  users = db.collection('users');
  tweets = db.collection('tweets');

  /* delete all collection */
  await users.deleteMany({});
  await tweets.deleteMany({});

  /* 테스트에 사용될 유저 데이터 insert one*/
  const userId = (await users.insertMany(sampleUsers)).insertedIds[0];

  /* tweet에 포함될 user 정보 조회 후 가공 */
  user = await users.findOne({ _id: userId }, { projection: { password: 0, email: 0 } });
  user = { id: user._id.toString(), ...user };

  /* 테스트에 사용될 트윗 가공 */
  sampleTweets = sampleTweets.map(tweet => ({ ...tweet, user }));
});

afterAll(async () => {
  /* 테스트 종료시 DB 연결 해제 */
  database.getClient().close();
});

it('should get Db instance', async () => {
  expect(database.getDb()).toBeInstanceOf(Db);
});

describe('findTweets', () => {
  // 테스트 격리를 위한 작업
  beforeAll(async () => {
    await tweets.deleteMany({});
    await tweets.insertMany(sampleTweets);
  });

  test('should length of result equal count of all tweet document', async () => {
    const result = await tweetRepository.findTweets();
    const count = await tweets.count();
    expect(result.length).toBe(count);
  });
});

describe('findTweetsByUser', () => {
  // 테스트 격리를 위한 작업 - describe 시작시 한번 실행
  beforeAll(async () => {
    await tweets.deleteMany({});
    await tweets.insertMany(sampleTweets);
  });

  it('should get tweets that matches user.username', async () => {
    const tweets = await tweetRepository.findTweetsByUser('bob');
    expect(tweets.length).toBe(sampleTweets.length);
  });

  it('should get empty array if mismatch user.username', async () => {
    const tweets = await tweetRepository.findTweetsByUser('jay');
    expect(tweets.length).toBe(0);
  });
});

describe('findTweetById', () => {
  // 테스트 격리를 위한 작업 - describe 시작시 한번 실행
  let tweetId;
  beforeAll(async () => {
    await tweets.deleteMany({});
    const result = await tweets.insertMany(sampleTweets);
    tweetId = result.insertedIds[0].toString();
  });

  it('should get tweet that matches id', async () => {
    const tweet = await tweetRepository.findTweetById(tweetId);
    expect(tweet).toBeTruthy();
  });

  it('should return null if incorrect id parament', async () => {
    const tweet = await tweetRepository.findTweetById(mismatchId);
    expect(tweet).toBeNull();
  });

  it('should return null if empty id parament', async () => {
    const tweet = await tweetRepository.findTweetById();
    expect(tweet).toBeNull();
  });

  it('should Throw an TypeError if incorrect type id parament', async () => {
    await expect(tweetRepository.findTweetById('1234')).rejects.toBeInstanceOf(TypeError);
  });
});

describe('createTweet', () => {
  // 테스트 격리를 위한 작업 - describe 시작시 한번 실행
  beforeAll(async () => {
    await tweets.deleteMany({});
  });

  test('should tweet document count is 1 if insert success', async () => {
    await tweetRepository.createTweet('unit test insert tweet!', user);
    await expect(tweets.count()).resolves.toBe(1);
  });

  test('should text of the inserted tweet equal first parament', async () => {
    const text = 'insert tweet!';
    const _id = (await tweetRepository.createTweet(text, user)).insertedId;
    const found = await tweets.findOne({ _id });
    expect(found.text).toBe(text);
  });
});

describe('updateTweet', () => {
  // 테스트 격리를 위한 작업 - describe의 it실행 전마다 실행
  let tweetId;
  beforeEach(async () => {
    await tweets.deleteMany({});
    const result = await tweets.insertMany(sampleTweets);
    tweetId = result.insertedIds[0];
  });

  it('[수정 전/후 불일치로 수정 실행] should update if the id matches', async () => {
    const result = await tweetRepository.updateTweet(tweetId, 'update tweet');
    expect(result.matchedCount).toBe(1); // 일치하는 document
    expect(result.modifiedCount).toBe(1); // 수정된 document
  });

  it('[수정 전/후 일치로 수정 미실행] should not update if the id and update_text matches', async () => {
    const result = await tweetRepository.updateTweet(tweetId, 'New Massage -1 :)');
    expect(result.matchedCount).toBe(1); // 일치하는 document
    expect(result.modifiedCount).toBe(0); // 수정된 document
  });

  it('should return obj.matchedCount is 0 if the id mismatch', async () => {
    const result = await tweetRepository.updateTweet(mismatchId, 'update tweet');
    expect(result.matchedCount).toBe(0); // 일치하는 document
  });

  it('should Throw an TypeError if incorrect type id parament', async () => {
    await expect(tweetRepository.updateTweet('1234', 'update tweet')).rejects.toBeInstanceOf(TypeError);
  });
});

describe('deleteTweet', () => {
  let tweetId;
  beforeAll(async () => {
    await tweets.deleteMany({});
    const result = await tweets.insertMany(sampleTweets);
    tweetId = result.insertedIds[0];
  });

  it('should delete if the id matches', async () => {
    const result = await tweetRepository.deleteTweet(tweetId);
    expect(result.deletedCount).toBe(1);
  });

  it('should return obj.deletedCount is 0 if the id mismatch', async () => {
    const result = await tweetRepository.deleteTweet(mismatchId);
    expect(result.deletedCount).toBe(0);
  });

  it('should Throw an TypeError if incorrect type id parament', async () => {
    await expect(tweetRepository.deleteTweet('1234')).rejects.toBeInstanceOf(TypeError);
  });
});
