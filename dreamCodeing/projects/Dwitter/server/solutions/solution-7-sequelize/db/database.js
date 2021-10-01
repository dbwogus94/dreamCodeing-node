import { config } from '../config.js';
import SQ from 'sequelize';

// object deconstructor
const { host, user, password, database } = config.mysql;
export const sequelize = new SQ.Sequelize(database, user, password, {
  host,
  dialect: 'mysql',
  logging: true, // default(true), sql 실행 로그 사용 유무
});
