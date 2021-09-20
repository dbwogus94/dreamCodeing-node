import db from '../models/index.js';
const { Tweet, User, sequelize } = db;
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
 * - ex) SQL :
 *  SELECT
 *    t.id, t.text, t.createAt, t.userId,
 *    u.id, t.username, u.name, u.email, u.url
 *  FROM tweet t JOIN user u
 *  ON t.userId = u.id;
 * @returns tweet Array
 * - Array : tweet Array
 */
export const findTweets = async () => {
  const tweets = await Tweet.findAll({
    // ### include: JOIN 조회
    include: [
      {
        model: User,
        attributes: ['id', 'username', 'name', 'email', 'url'],
        // 별칭 지정 : 'id' as 'userId' =>  [['id', userId], ...]
      },
    ],
    //raw: true,
    /* ## raw 옵션 사용 유무 차이점
      - raw 옵션을 사용하지 않은 결과(배열의 구조)
        [
          {dataValuse, _previousDataValues, _changed, _options,isNewRecord},
          ...
        ]
        => dataValuse = {id, text, createdAt, userId, User}
        => 연관관계에 있는 데이터를 object형태로 가진다.

      - raw 옵션을 사용한 결과(배열의 구조)
        [
          {id, text, createdAt, 'User.id', 'User.username', 'User.name' ...}
        ]

      ### 결론 
      - raw 옵션을 사용하지 않으면 한번 더 가공이 필요하다.
        => tweets.map(tweet => tweet.toJOSN());
      - raw 옵션을 사용하면 배열의 item 사용 방법을 변경해야한다.
        => tweets[0]['User.id']
     */
  });

  // 검색 결과가 없으면 빈 배열을 리턴한다.
  return tweets.length !== 0 //
    ? tweets.map(tweet => tweet.toJSON()) // JSON 문자열로 반환 : JSON.stringify(findTweets, null, 2)
    : tweets; // == []
};

/**
 * ### Select Tweets by username
 * - ex) SQL :
 *  SELECT
 *    t.id, t.text, t.createAt, t.userId,
 *    u.id, t.username, u.name, u.email, u.url
 *  FROM tweet t JOIN user u
 *  ON t.userId = u.id
 *  WHERE t.username = ${tweet.username};
 * @param {string} tweet.username
 * @returns tweet Array
 * - Array : tweet Array
 */
export const findTweetsByUser = async username => {
  const findTweets = await Tweet.findAll({
    include: {
      model: User,
      attributes: ['id', 'username', 'name', 'email', 'url'],
      where: { username: username }, // join 이후 조건절
    },
  });

  return findTweets.length !== 0 //
    ? findTweets.map(tweet => tweet.toJSON())
    : findTweets; // === []
};

/**
 * ### Select Tweet by id
 * - ex) SQL :
 *  SELECT
 *    t.id, t.text, t.createAt, t.userId,
 *    u.id, t.username, u.name, u.email, u.url
 *  FROM tweet t JOIN user u
 *  ON t.userId = u.id
 *  where t.id = ${tweet.id};
 * @param {string} tweet.id
 * @returns tweet
 * - tweet : 찾은 자원
 * - null : 자원이 없는 경우
 */
export const findTweetById = async id => {
  const findTweet = await Tweet.findByPk(id, {
    include: {
      model: User,
      attributes: ['id', 'username', 'name', 'email', 'url'],
    },
  });
  return findTweet ? findTweet.toJSON() : null;
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
 * @throws sql error
 */
export const createTweet = async (text, userId) => {
  // 트랜잭션 시작(생성)
  const t = await sequelize.transaction();
  try {
    const newTweet = await Tweet.create(
      {
        text,
        userId,
      },
      { transaction: t }
    );
    // 성공시
    await t.commit();
    return newTweet.id;
  } catch (error) {
    // 실패시
    await t.rollback();
    throw error; // 에러 미들웨어가 처리하도록 예외를 던진다.
  }
};

/**
 * ### Update Tweet
 * - ex) SQL :
 *  update tweet
 *  set text = ${tweet.text}
 *  where id = ${tweet.id}
 * @param {string} tweet.id
 * @param {object} tweet.text
 * @returns tweet.id
 * @throws sql error
 */
export const updateTweet = async (id, text) => {
  const t = await sequelize.transaction();
  try {
    const tweet = await Tweet.findByPk(id, { transaction: t });
    tweet.text = text;
    await tweet.save({ transaction: t });
    await t.commit();
    return id;
  } catch (error) {
    await t.rollback();
    throw error;
  }
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
  const t = await sequelize.transaction();
  try {
    const tweet = await Tweet.findByPk(id, { transaction: t });
    const res = await tweet.destroy({ transaction: t });
    await t.commit();
    return true;
  } catch (error) {
    t.rollback();
    throw error;
  }
};
