import { config } from '../config.js';
import MongoDb from 'mongodb';

/** @type {MongoDb.Db} */
let db; // db 접속정보를 담을 모듈 전역변수

/**
 * Connect mongoDB
 * @returns Db class instance
 * - Db class : MongoDB 데이터베이스 클래스
 */
export async function connectDB() {
  return MongoDb.MongoClient.connect(config.mongoDB.host) //
    .then(client => {
      db = client.db();
    });
}

/**
 * get users collection
 * @returns Collection instance
 */
export function getUsers() {
  return db.collection('users');
}

/**
 * get tweets collection
 * @returns Collection instance
 */
export function getTweets() {
  return db.collection('tweets');
}
