import { getUsers } from '../db/database.js';
import MongoDb from 'mongodb';
const ObjectId = MongoDb.ObjectId;

export async function findByUsername(username) {
  return getUsers() //
    .findOne({ username })
    .then(mapOptionalUser);
}

export async function createUser(user) {
  return getUsers()
    .insertOne(user)
    .then(data => data.insertedId.toString());
}

export async function findById(id) {
  return getUsers()
    .findOne({ _id: new ObjectId(id) })
    .then(mapOptionalUser);
}

/*### 변수명 이유  
  - map : a를 b로 변경한 값을 리턴하는 연산이다
  - Optional :  필수가 아니다. 즉 값이 null일 수 있다를 의미한다.
  - User : 리턴할 데이터 의미
  - 즉, 
    user를 받아 새로운 객체로 리턴하는 함수이며, 
    결과는 null일 수 있다.
*/
function mapOptionalUser(user) {
  return user
    ? { ...user, id: user._id } // 서비스에 필요한 데이터 형식으로 변경
    : user; // null
}
