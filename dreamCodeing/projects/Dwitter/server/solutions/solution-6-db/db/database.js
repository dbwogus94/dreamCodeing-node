import mysql from 'mysql2';
import { config } from '../config.js';

// DB pool 생성
const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  database: config.mysql.database,
  password: config.mysql.password,
});

// 비동기 작업을 위해 생성된 pool이 가진 promise()를 내보낸다.
export const db = pool.promise();
