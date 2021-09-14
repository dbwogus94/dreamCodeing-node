import { pool } from '../db/database.js';

async function getConnection() {
  return await pool.getConnection(async conn => conn);
}

const USERS_JOIN_SQL = ` 
  SELECT 
    tw.id
    , tw.text
    , tw.createdAt
    , tw.userId
    , us.username
    , us.name
    , us.email
    , us.url
  FROM tweets tw JOIN users us
  ON tw.userId = us.id
  `;

const ORDER_DESC = ' ORDER BY tw.createdAt DESC ';

/**
 * ### Select Tweets
 * - user의 정보가 포함된 모든 tweets
 * - ex) SQL : select * from tweet t join user u on t.userId = u.id;
 * @returns tweet Array
 * - Array : tweet Array
 */
export const findTweets = async () => {
  const sql = USERS_JOIN_SQL + ORDER_DESC;
  const con = await getConnection();
  const [rows] = await con.execute(sql);
  con.release(); // connection pool로 반납
  return rows;
};

/**
 * ### Select Tweets by username
 * - ex) SQL :
 *  select *
 *  from tweet t join user u
 *  on t.userId = u.id
 *  where t.username = ${tweet.username};
 * @param {string} tweet.username
 * @returns tweet Array
 * - Array : tweet Array
 * - false : 일치하는 작성자가 없는 경우
 */
export const findTweetsByUser = async username => {
  const sql = USERS_JOIN_SQL + ' WHERE us.username = ?' + ORDER_DESC;
  const con = await getConnection();
  const [rows] = await con.execute(sql, [username]);
  con.release();
  return rows.length //
    ? rows
    : false;
};

/**
 * ### Select Tweet by id
 * - ex) SQL :
 *  select *
 *  from tweet t join user u
 *  on t.userId = u.id
 *  where t.id = ${tweet.id};
 * @param {string} tweet.id
 * @returns tweet
 * - tweet : 찾은 자원
 * - null : 자원이 없는 경우
 */
export const findTweetById = async id => {
  const sql = USERS_JOIN_SQL + ' WHERE tw.id = ?';
  const con = await getConnection();
  const [rows] = await con.execute(sql, [id]);
  con.release();
  return rows[0] !== undefined ? rows[0] : null;
};

/**
 * ### Create Tweet
 * - ex) SQL :
 *  insert into
 *  tweet(text, userId)
 *  values(${tweet.text}, ${tweet.userId});
 * @param {string} tweet.text - 글 내용
 * @param {string} tweet.userId - 작성자 id
 * @returns newTweet.id
 * @throws mysql.QueryError
 */
export const createTweet = async (text, userId) => {
  const sql = 'INSERT INTO tweets(text, createdAt, userId) VALUES(?, NOW(), ?)';
  // 1) pool에서 connection 가져온다
  const con = await getConnection();
  // 2) 트랜잭션 시작
  con.beginTransaction();
  try {
    // 3) sql 실행 및 리턴
    const [result] = await con.execute(sql, [text, userId]);
    // 4) 성공시 저장
    con.commit();
    return result.insertId; // AUTO_INCREMENT생성된 id
  } catch (error) {
    // 4) 실패시 롤백
    con.rollback();
    throw error; // error middleware가 처리하도록 에러를 throw를 한다.
  } finally {
    // 5) connection 반납
    con.release();
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
 * @returns result.affectedRows
 * - UPDATE sql과 일치하는 row 수
 * @throws mysql.QueryError
 */
export const updateTweet = async (id, text) => {
  const sql = 'UPDATE tweets SET text = ? WHERE id = ?';
  const con = await getConnection();
  con.beginTransaction();

  try {
    const [result] = await con.execute(sql, [text, id]);
    con.commit();
    return result.affectedRows;
    // affectedRows : update Sql의 경우 조건에 따라 찾은 row 개수이다.
    // changedRows : update Sql의 경우 변경된 row 개수이다.
    // -> changedRows는 수정 전후 값이 같은 경우 0을 리턴한다.
  } catch (error) {
    con.rollback();
    throw error;
  } finally {
    con.release();
  }
};

/**
 * ### Delete Tweet
 * - ex) SQL : delete from tweet where id = ${tweet.id}
 * @param {steing} tweet.id
 * @returns result.affectedRows
 * - 삭제 성공한 row수
 * @throws mysql.QueryError
 */
export const deleteTweet = async id => {
  const sql = 'DELETE FROM tweets WHERE id = ?';
  const con = await getConnection();
  con.beginTransaction();

  try {
    const [result] = await con.execute(sql, [id]);
    con.commit();
    return result.affectedRows;
  } catch (error) {
    con.rollback();
    throw error;
  } finally {
    con.release();
  }
};
