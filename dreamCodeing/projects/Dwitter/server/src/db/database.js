import { config } from '../config/config.js';
import { MongoClient } from 'mongodb';
import moment from 'moment';

/** @type mongodb.MongoClient */
let client;

/** @type mongodb.Db */
let db;

/**
 * MongoDB connection
 * @returns Db instance
 * - mongo database Db class instance
 */
async function connectDB() {
  client = await MongoClient.connect(config.mongoDB.host);
  db = client.db();
  return db;
}

/**
 * get Db instance
 * @returns Db instance
 */
function getDb() {
  if (!db) {
    throw new Error('Please call connectDB first');
  }
  return db;
}

/**
 * get MongoClient instance
 * @returns MongoClient instance
 */
function getClient() {
  if (!client) {
    throw new Error('Please call connectDB first');
  }
  return client;
}

/**
 * close MongoDB connection
 * - mongoClient.close()를 사용하지 말고
 * - database.close()를 사용해야 한다.
 * - 그래야 app구동시 생성된 MongoClient와 Db 인스턴스를 제거가 가능하다.
 */
async function close() {
  await client.close();
  db = undefined;
  client = undefined;
}

/**
 * get users collection
 * @returns {Collection} users collection
 */
function getUsers() {
  return db.collection('users');
}

/**
 * get tweets collection
 * @returns {Collection} tweets collection
 */
function getTweets() {
  return db.collection('tweets');
}

/**
 * 존재하는 collection 모두 drop
 * @param {Db} db - Db instance
 * @throws fail drop collections
 */
async function dropCollection(db) {
  const collections = await getCollections(db);
  const results = await asyncDrop(collections);

  if (!results.includes(false)) {
    printDropLog(collections);
  } else {
    throw new Error('fail drop collections');
    // TODO: MongoDB 트랜잭션 적용하여 모두 성공하지 않은 경우 롤백과 예외 던지도록 해야한다.
  }

  async function asyncDrop(collections) {
    // Promise.all을 사용하여 collcetion drop 일괄 요청
    const results = await Promise.all(
      collections.map(collection => {
        return collection.drop();
      })
    );
    return results;
  }
  function printDropLog(collections) {
    collections.forEach(collection => {
      //console.info(`[${collection.s.namespace.db}] Drop '${collection.s.namespace.collection}' Collection`);
      console.info(`[${moment().format('yyyy-MM-DD HH:mm:ss')}] Drop Collection '${collection.namespace}'`);
    });
  }
}

/**
 * get database collections
 * @param {Db} db
 * @returns collections
 */
async function getCollections(db) {
  /*db.listCollections() : db에 존재하는 모든 collection 정보를 가진 커서 ListCollectionsCursor를 가져온다.
    - ListCollectionsCursor에서 얻어온 collection은 실제 컬렉션 객체(db.collection()) 과 다르다
    - ListCollectionsCursor에서 얻어온 collection은 컬렉션 정보를 가진 object를 내보낸다.
    - ListCollectionsCursor에서 얻어온 collection은 
      실제 컬랙션 객체(db.collection())에서 사용하는 몇 가지 메서드를 사용 할 수 있다.
  */
  const collections = await db.listCollections().toArray();
  collections.filter(collection => collection.type === 'collection');
  return collections.map(collection => db.collection(collection.name));
}

const database = { connectDB, dropCollection, getCollections, getClient, getDb, close, getUsers, getTweets };
export default database;
