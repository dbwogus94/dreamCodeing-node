import { config } from '../config/config.js';
import { MongoClient } from 'mongodb';

/**
 * MongoDB connection
 * @returns Db instance
 * - mongo database Db class instance
 */
export async function connectDB() {
  return MongoClient.connect(config.mongoDB.host) //
    .then(client => client.db());
}

/**
 * 존재하는 collection 모두 drop
 * @param {Db} db - Db instance
 */
export async function dropCollection(db) {
  /*db.listCollections() : db에 존재하는 모든 collection 정보를 가진 커서 ListCollectionsCursor를 가져온다.
    - ListCollectionsCursor에서 얻어온 collection은 실제 컬렉션 객체(db.collection()) 과 다르다
    - ListCollectionsCursor에서 얻어온 collection은 컬렉션 정보를 가진 object를 내보낸다.
    - ListCollectionsCursor에서 얻어온 collection은 
      실제 컬랙션 객체(db.collection())에서 사용하는 몇 가지 메서드를 사용 할 수 있다.
  */
  const collections = await db.listCollections().toArray();
  collections.filter(collection => collection.type === 'collection');
  // drop 요청
  await Promise.all(
    collections.map(collection => {
      return db.collection(collection.name).drop();
    })
  );
  // 결과 log,
  collections.forEach(collection => {
    console.info(`[${db.s.namespace.db}] Drop '${collection.name}' Collection`);
  });

  // TODO: MongoDB 트랜잭션 적용하여 모두 성공하지 않은 경우 롤백과 예외 던지도록 해야한다.
}
