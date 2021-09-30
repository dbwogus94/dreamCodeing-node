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
 *
 * ### solution-6-db
 * - 모든 tweet 메서드 db에서 조회하도록 변경
 */

import { db } from '../db/database.js'; // MySQL DB connection pool을 가진 모듈

const SELECT_JOIN = `
        SELECT 
          tw.id, tw.text, tw.createdAt, tw.userId, us.username, us.name, us.email, us.url
        FROM tweets tw JOIN users us
        ON tw.userId = us.id `;

const ORDER_DESC = ' ORDER BY tw.createdAt DESC ';

/**
 * 유저의 정보를 담은 전체 tweet을 가져온다.
 * @returns
 * tweets = [tweet + user, ...]
 */
export async function getAll() {
  return db
    .execute(`${SELECT_JOIN} ${ORDER_DESC}`) // 최신 기준으로 정렬
    .then(result => result[0]);
}
/**
 * username(작성자)와 일치하는 모든 tweet 조회
 * @param {string} username
 * @returns
 * tweets = [tweet + user, ...]
 */
export async function getAllByUsername(username) {
  return db
    .execute(`${SELECT_JOIN} WHERE us.username = ? ${ORDER_DESC}`, [username]) // 최신 기준으로 정렬
    .then(result => result[0]);
}
/**
 * tweet의 id와 일치하는 tweet 조회
 * @param {string} id
 * @returns
 * tweet
 */
export async function getById(id) {
  return db
    .execute(`${SELECT_JOIN} WHERE tw.id = ?`, [id]) //
    .then(result => result[0][0]);
}
/**
 * 신규 tweet 생성
 * @param {string} text
 * @param {string} userId
 * @returns
 * tweet + user
 */
export async function create(text, userId) {
  return db
    .execute('INSERT INTO tweets(text, createdAt, userId) VALUES(?, NOW(), ?)', [text, userId]) //
    .then(result => getById(result[0].insertId));
  // insertId: insert되 row PK
  // 리턴받은 insertId를 사용하여 조회
}
/**
 * tweet의 id와 일치하는 tweet 수정
 * @param {string} id
 * @param {string} text
 * @returns
 * tweet + user
 */
export async function update(id, text) {
  return db
    .execute('UPDATE tweets SET text = ? WHERE id = ?', [text, id]) //
    .then(result => {
      return getById(id);
    }); // 수정 결과 조회
}
/**
 * tweet의 id와 일치하는 트윗 삭제
 * @param {string} id
 */
export async function remove(id) {
  return db
    .execute('DELETE FROM tweets WHERE id = ?', [id]) //
    .then(result => console.log(result[0].affectedRows));
  // result[0].affectedRows : 삭제 요청 결과를 가지고 있음,
  // ex) 1개 삭제 쿼리에서 성공이면 1, 10개 요청중 9개 성공이면 9를 가진다.
}
