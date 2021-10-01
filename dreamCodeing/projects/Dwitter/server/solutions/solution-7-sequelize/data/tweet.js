/**
 * ### Model 계층 : DATA에 관한 보관, CRUD, 가공을 담당한다.
 * - data(리소스) 조작(CURD)과 가공을 담당하는 계층이다.
 * - Spring으로 생각하면 service계층과 DAO 계층이 여기에 속한다.
 */

// app.js에서 인스턴스화된 sequelize import
import { sequelize } from '../db/database.js';
import { User } from './auth.js';

/* ES6 module에서 sequlize 사용하는 방법 
   - sequlize는 CommonJS를 기본적으로 지원한다.
   - 때문에 object deconstructor를 바로 사용할 수 없다.
   - 즉, object deconstructor 불가 => import { DataTypes, Sequelize } from 'sequelize'; X
*/
import SQ from 'sequelize';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

/* ### 1. sequelize 모델 생성 */
const Tweet = sequelize.define(
  'tweet',
  {
    id: {
      type: DataTypes.INTEGER, // int
      autoIncrement: true, // AUTO_INCREMENT 사용
      allowNull: false, // null 허용 x
      primaryKey: true, // PK로 사용
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'tweets_solution',
  }
);

/* ### 2. 연관관계 정의  */
// N:1관계 정의 => Tweet(N) : User(1)
// => 트윗은 유저에 포함한다.
Tweet.belongsTo(User);

/* ### 3. 연관관계를 가진 tweet, user를 플렛한 형태로 가져오는 속성 정의 */
const INCLUDE_USER = {
  attributes: [
    'id',
    'text',
    'createdAt',
    'userId',
    // 플렛한 형태로 조회 하기 1) : user.name as name
    [Sequelize.col('user.name'), 'name'],
    [Sequelize.col('user.username'), 'username'],
    [Sequelize.col('user.email'), 'email'],
    [Sequelize.col('user.url'), 'url'],
  ],
  // 연관관계 포함하여 조회
  include: {
    model: User, // User과 포함관계를 가진다.
    // 플렛한 형태로 조회 하기 2) : 포함관계 attribute는 없음
    attributes: [],
  },
};

/* ### 4. 정렬 속성 정의 */
const ORDER_DESC = { order: [['createdAt', 'DESC']] };

/**
 * 유저의 정보를 담은 전체 tweet을 가져온다.
 * @returns
 * tweets = [tweet + user, ...]
 */
export async function getAll() {
  return Tweet.findAll({ ...INCLUDE_USER, ...ORDER_DESC });
}
/**
 * username(작성자)와 일치하는 모든 tweet 조회
 * @param {string} username
 * @returns
 * tweets = [tweet + user, ...]
 */
export async function getAllByUsername(username) {
  return Tweet.findAll({
    ...INCLUDE_USER,
    ...ORDER_DESC,
    include: {
      ...INCLUDE_USER.include,
      where: { username }, // where user.username = ${username}
    },
  });
}
/**
 * tweet의 id와 일치하는 tweet 조회
 * @param {string} id
 * @returns
 * tweet
 */
export async function getById(id) {
  // id로 연관관계 플렛하게 조회
  return Tweet.findByPk(id, INCLUDE_USER);
}
/**
 * 신규 tweet 생성
 * @param {string} text
 * @param {string} userId
 * @returns
 * tweet + user
 */
export async function create(text, userId) {
  return Tweet.create({ text, userId }).then(data => {
    // data = {dataValues: {…}, _previousDataValues: {…}, _changed: Set(0), _options: {…}, isNewRecord: false}
    // => dataValues는 INSERT SQL로 생성된 row 데이터를 가진다.
    // => 즉, 생성된 row 데이터가 가진 id를 사용하여 getById 조회
    return getById(data.dataValues.id);
  });
}
/**
 * tweet의 id와 일치하는 tweet 수정
 * @param {string} id
 * @param {string} text
 * @returns
 * tweet + user
 */
export async function update(id, text) {
  return Tweet.findByPk(id, INCLUDE_USER) //
    .then(tweet => {
      tweet.text = text;
      // 재조회 : tweet.save() UPDATE SQL 이후 데이터를 리턴한다.
      // save()의 장점은 이전 조회에 연관관계가 포함되어 있다면,
      // 자동으로 연관관계를 포함하여 재조회한다.
      return tweet.save();
    });
}
/**
 * tweet의 id와 일치하는 트윗 삭제
 * @param {string} id
 */
export async function remove(id) {
  return Tweet.findByPk(id) //
    .then(tweet => {
      // 조회한 row를 삭제 한다. -> DELETE SQL
      tweet.destroy();
    });
}
