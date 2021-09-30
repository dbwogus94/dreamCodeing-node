import { db } from '../db/database.js';

export async function findByUsername(username) {
  return db
    .execute(
      ` SELECT
          id, username, password, name, email, url
        FROM users
        WHERE username = ?`,
      [username]
    )
    .then(result => result[0][0]);
}

export async function findById(id) {
  return db
    .execute(
      ` SELECT
          id, username, password, name, email, url
        FROM users
        WHERE id = ?`,
      [id]
    )
    .then(result => result[0][0]);
}

// 유저 생성
export async function createUser(user) {
  const { username, password, name, email, url } = user;
  return db
    .execute(
      `INSERT INTO
        users (username, password, name, email, url)
        VALUES (?, ?, ?, ?, ?)`,
      [username, password, name, email, url]
    )
    .then(result => result[0].insertId); // insertId:  insert 성공시 AUTO_INCREMENT로 생성된 id를 리턴한다.
}
