import { ObjectId } from 'mongodb';
import database from '../db/database.js';
const { getUsers } = database;

/**
 * mongoDB에서 조회한 user data를 service와 client에서 필요한 데이터 형식으로 변환
 * @param {object} user
 * @returns user // null
 * - user: {..user, id: user._id.toHexString()}
 * - null: 자원 없음
 */
function mapOptionalUser(user) {
  return user
    ? { ...user, id: user._id.toHexString() } // 앱에서 필요한 데이터 형식으로 변환
    : user; // null
}

/**
 * Select user by username
 * @param {string} user.username
 * @returns
 * - user : {_id, id, username, name, password, email, url}
 * - null : 자원없음
 */
export const findByUsername = async username => {
  const user = await getUsers().findOne({ username });
  return mapOptionalUser(user);
};

/**
 * Create user
 * @param {object} user { username, password, name, email, url }
 * @return Promise<InsertOneResult<TSchema>>;
 * - InsertOneResult.acknowledged: 생성 성공 여부
 * - InsertOneResult.insertedId: 생성된 document _id
 */
export const createUser = async user => {
  return getUsers().insertOne(user);
};

/**
 * Select user by id
 * @param {string} user.id
 * @returns
 * - user : {_id, id, username, name, url}
 * - null : 자원없음
 */
export const findById = async id => {
  const user = await getUsers().findOne({ _id: ObjectId(id) }, { projection: { password: 0, email: 0 } }); // 제외할 필드 설정
  return mapOptionalUser(user);
};
