import { pool } from '../db/database.js';

// SQL
const SQL_USER = 'SELECT id, username, password, name, email, url FROM users ';

/**
 * ### Get Connection
 * - conncetion 생성 || pool에서 connection 가져오기
 * @returns connection
 */
async function getConnection() {
  return await pool.getConnection(async conn => conn);
}

/**
 * ### Select user by username
 * - ex) SQL : select * from user where username = ${user.username}
 * @param {string} user.username
 * @returns user
 * - null : 자원없음
 */
export const findByUsername = async username => {
  const sql = SQL_USER + ' WHERE username = ?';
  const con = await getConnection();
  const [row] = await con.execute(sql, [username]);
  return row[0] !== undefined ? row[0] : null; // 명시적으로 null 처리
};

/**
 * ### Create user
 * - ex) SQL :
 * insert into
 * user(username, password, name, email, url)
 * values(${user.username}, ${user.password}, ${user.name}, ${user.email}, ${user.url});
 * @param {object} user { username, password, name, email, url }
 * @return boolean - 성공 실패 여부
 */
export const createUser = async user => {
  const { username, password, name, email, url } = user;
  const sql = `
    INSERT INTO 
      users(username, password, name, email, url) 
      VALUES(?, ?, ?, ?, ?)`;

  // 1) connection 가져오기
  const con = await getConnection();
  // 2) 트랜잭션 시작
  con.beginTransaction();

  try {
    // 3) SQL 요청 및 응답
    const [result] = await con.execute(sql, [username, password, name, email, url]);
    // 4) 성공시 commit
    con.commit();
    return result.insertId; // 생성된 row id
  } catch (error) {
    // 4) sql 에러시 rollback
    con.rollback();
    // ** MySQL은 AUTO_INCREMENT로 올라간 id는 rollback 되지 않는다.
    //    그렇기 때문에 이 코드에서 사실상 rollback 할 필요는 없다.
    console.error(`[INSERT User SQL ERROR]\nsql: ${sql}\nmessage: ${error.sqlMessage}`);
    throw new Error(error);
  } finally {
    // 5) connection pool에게 반납
    con.release();
  }
};

/**
 * ### Select user by id
 * - ex) SQL : select * from user where id = ${user.id}
 * @param {string} user.id
 * @returns
 * - user
 * - null
 */
export const findById = async id => {
  const sql = SQL_USER + ' WHERE id = ?';
  const con = await getConnection();
  const [row] = await con.execute(sql, [id]);
  return row[0] !== undefined ? row[0] : null;
};
