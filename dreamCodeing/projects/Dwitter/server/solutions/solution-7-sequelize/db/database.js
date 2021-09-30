import mysql from 'mysql2';
import { config } from '../config.js';
import SQ from 'sequelize';

// object deconstructor
const { host, user, password, database } = config.mysql;
export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
});

// DB pool 생성  -> TODO: sequelize 적용완료시 제거
const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  database: config.mysql.database,
  password: config.mysql.password,
});

// 비동기 작업을 위해 생성된 pool이 가진 promise()를 내보낸다.
export const db = pool.promise();
