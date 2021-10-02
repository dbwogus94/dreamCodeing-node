import db from '../models/index.js';
const { Tweet, User, sequelize, Sequelize } = db;

/* TODO: sequelize 적용 후 생긴 의문.

  ## Q) 리턴시 toJSON() 사용여부

  - sequelize는 select의 결과로 아래와 같은 형식의 결과를 리턴한다.
    - Tweet {dataValuse, _previousDataValues, _changed, _options,isNewRecord}
    - 여기서 dataValuse에 조회결과가 담긴다.

  - sequelize의 toJSON()은 결과 데이터에서 dataValuse만을 꺼내어 리턴한다.

  - express는 응답시 res.json(tweet)사용한다. 
    - res.json()내부에는 JSON.stringify(tweets) 코드를 사용한다.
    - sequelize의 결과 tweet를 res.json(tweet)으로 응답하면 
    - dataValuse만 JSON String로 변환되어 응답된다.

  ### 결론: 
  toJSON을 사용하던 안하던 res.json()에 의해 클라이언트에서 받는 데이터는 동일하다.

  ### 현재 나의 관점: 
  - Repository(DAO) 계층에서 DB 테이블과 일치하는 model(데이터)만을 내보내야 한다고 생각한다.
  - 현재 프로젝트는 model로 Sequelize.Model을 상속하는 class를 정의하여 사용한다.
  - 그렇기 때문에 tweetRepository에서 리턴하는 데이터는 Tweet class에서 정의된 속성(스키마)이여야 한다고 생각한다.
    => 그럼에도 toJSON()을 사용하는 것이 맞는것인지 의문이 든다.

  --- 

  ## Q) 리턴시 toJSON()을 사용하는 것 때문에 findTweetById을 재사용하지 못한다.
  - seqelize에서 update 로직 : 
    1. 먼저 pk를 사용하여 조회한다.
    2. 조회한 tweet을 수정한다.
    3. tweet.save()를 호출한다.

  - 1.번 로직은 findTweetById과 중복되는 코드지만 재사용하지 못한다.. 
  - findTweetById에서 리턴시 tweet.toJSON()을 사용하기 때문이다.
  - update sql을 요청하려면 .toJOSN()을 사용하지 않은 데이터가 필요하다.
  - 결국 toJSON()을 사용한 findTweetById는 재사용 하지 못한다.

  ---

  ## transaction사용에 관하여 
  - createTweet, updateTweet, deleteTweet에서 transaction을 사용한다.
  - mysql은 auto_increment로 올라간 값을 rollback하지 못한다.
  - 때문에 transaction을 사용할 필요 없다.
  - 그럼에도 케이스 연습을 위해 의도적으로 사용하였다. 
  */

/**
 * 연관관계에 있는 데이터 플렛하게 조회하는 옵션.
 * - tweets join users
 */
const INCLUDE_USER = {
  attributes: [
    'id',
    'text',
    'createdAt',
    'userId',
    [Sequelize.col('User.name'), 'name'], // User.name as name
    [Sequelize.col('User.username'), 'username'], // User.username as username
    [Sequelize.col('User.email'), 'email'], // User.email as email
    [Sequelize.col('User.url'), 'url'], // User.url as url
  ],
  // include: JOIN 조회 옵션
  include: {
    model: User,
    // TODO: 기존 응답형식에 맞게 플렛 하게 조회로 변경
    attributes: [],
    // attributes: ['id', 'username', 'name', 'email', 'url'],
    // 별칭 지정 : 'id' as 'userId' =>  [['id', userId], ...]
  },
};

/**
 * select 정렬(ORDER BY) 옵션
 */
const ORDER_DESC = { order: [['createdAt', 'DESC']] };

/**
 * ### Select Tweets
 * @returns tweet Array
 * - Array : tweet Array
 */
export const findTweets = async () => {
  const tweets = await Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,

    //raw: true,
    /* ## raw 옵션 사용 유무 차이점
      - raw 옵션을 사용하지 않은 결과(배열의 구조)
        [{dataValuse, _previousDataValues, _changed, _options,isNewRecord}, ...]
        => dataValuse = {id, text, createdAt, userId, User}
        => 연관관계에 있는 데이터를 object(User)형태로 가진다.

      - raw 옵션을 사용한 결과(배열의 구조)
        [{id, text, createdAt, 'User.id', 'User.username', 'User.name' ...}, ]
        => 위 처럼 Model.attribute 형태로 플렛하게 조회된다.
     */
  });

  // findAll()은 검색 결과가 없으면 빈 배열을 리턴한다.
  return tweets.length !== 0 //
    ? tweets.map(tweet => tweet.toJSON())
    : tweets; // == []
};

/**
 * ### Select Tweets by username
 * @param {string} tweet.username
 * @returns tweet Array
 * - Array : tweet Array
 */
export const findTweetsByUser = async username => {
  const findTweets = await Tweet.findAll({
    // 조회시 가져올 컬럼
    attributes: [
      ...INCLUDE_USER.attributes, //
    ],
    // 연관관계 사용
    include: {
      ...INCLUDE_USER.include,
      where: { username: username }, // join 이후 조건절
    },
    // 정렬 사용
    ...ORDER_DESC,
  });

  return findTweets.length !== 0 //
    ? findTweets.map(tweet => tweet.toJSON())
    : findTweets; // === []
};

/**
 * ### Select Tweet by id
 * @param {string} tweet.id
 * @returns tweet
 * - tweet : 찾은 자원
 * - null : 자원이 없는 경우
 */
export const findTweetById = async id => {
  const findTweet = await Tweet.findByPk(id, INCLUDE_USER);
  return findTweet ? findTweet.toJSON() : null;
};

/**
 * ### Create Tweet
 * @param {string} tweet.text - 글 내용
 * @param {string} tweet.userId - 작성자 id
 * @returns newTweet(join user) - 신규 tweet
 * @throws sql error
 */
export const createTweet = async (text, userId) => {
  // 트랜잭션 시작(생성)
  const t = await sequelize.transaction();
  // sequelize는 생성한 transaction을 인자로 넘기면 같은 트랜잭션으로 취급한다.
  const transaction = { transaction: t };
  try {
    // create는 INSERT SQL로 생성된 row data를 리턴한다.
    const newTweet = await Tweet.create({ text, userId }, transaction);
    const tweet = await Tweet.findByPk(newTweet.id, { ...INCLUDE_USER, ...transaction });
    // 성공시
    await t.commit();
    return tweet.toJSON();
  } catch (error) {
    // 실패시
    await t.rollback();
    throw error; // 에러 미들웨어가 처리하도록 예외를 던진다.
  }
};

/**
 * ### Update Tweet
 * @param {string} tweet.id
 * @param {object} tweet.text
 * @returns update tweet(join user) - 수정된 tweet
 * @throws sql error
 */
export const updateTweet = async (id, text) => {
  const t = await sequelize.transaction();
  const transaction = { transaction: t };
  try {
    // 1) 연관관계 포함한 조회
    const tweet = await Tweet.findByPk(id, { ...INCLUDE_USER, ...transaction });
    // 2) 조회한 데이터 수정
    tweet.text = text;
    // 3) save 재조회: 데이터가 변경되었다면 UPDATE SQL을 요청한다.
    //  => 처음에 연관관계 포함하여 조회했으면, 재조회도 연관관계를 포함한다.(같은 형식으로)
    await tweet.save(transaction);
    await t.commit();
    return tweet.toJSON();
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

/**
 * ### Delete Tweet
 * @param {steing} tweet.id
 * @returns boolean
 * - true : 자원을 성공적으로 삭제 한 경우
 * - null : 자원이 없는 경우
 */
export const deleteTweet = async id => {
  const t = await sequelize.transaction();
  try {
    // select
    const tweet = await Tweet.findByPk(id, { transaction: t });
    // 찾은 트윗삭제
    await tweet.destroy({ transaction: t });
    await t.commit();
    return true;
  } catch (error) {
    t.rollback();
    throw error;
  }
};
