import { config } from '../config.js';
import MongoDb from 'mongodb';

/**
 * Connect mongoDB
 * @returns Db class instance
 * - Db class : MongoDB 데이터베이스 클래스
 */
export async function connectDB() {
  // MongoClient를 통해 client가 가진 db를 받아온다.
  return MongoDb.MongoClient.connect(config.mongoDB.host) //
    .then(client => client.db());
}
