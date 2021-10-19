/* db/database.js unit test 
  - mongoDB environment: MongoDB Atlas host 
  - 명명규칙: should_기대결과_When_테스트상태
  */

import database from '../../db/database.js';
import { config } from '../../config/config.js';
import { MongoClient, Db } from 'mongodb';
const mongoHost = config.mongoDB.host;
const errorHost = 'MONGO_DB_HOST=mongodb+srv://errorDB:errorPW@cluster0.rro6r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
//const { getCollections } = database;

it('should node environment is test', () => {
  expect(process.env.NODE_ENV).toBe('test');
});

describe('connectDB', () => {
  it('should be a function', () => {
    expect(typeof database.connectDB).toBe('function');
  });

  it('should be connected if correct argument', async () => {
    const client = await MongoClient.connect(mongoHost);
    expect(client).toBeInstanceOf(MongoClient);
    await client.close();
    // TODO 위 테스트로 생긴 connection을 닫아야함.
  });

  it('should throw an error if incorrect argument', async () => {
    await expect(MongoClient.connect(errorHost)).rejects.toThrowError();
  });

  it('should be get Db instance if connected', async () => {
    const client = await MongoClient.connect(mongoHost);
    expect(client.db()).toBeInstanceOf(Db);
    await client.close();
  });

  it('should return Db instance if connected', async () => {
    const db = await database.connectDB();
    expect(db).toBeInstanceOf(Db);
    await database.close();
  });
});

describe('getCliet', () => {
  it('should call connectDB first', async () => {
    await database.connectDB();
    const client = database.getClient();
    expect(client).toBeInstanceOf(MongoClient);
    await database.close();
  });

  it("should throw an error if don't call connectDB first", async () => {
    expect(database.getClient).toThrow(new Error('Please call connectDB first'));
  });
});

describe('getDb', () => {
  it('should call connectDB first', async () => {
    await database.connectDB();
    const db = database.getDb();
    expect(db).toBeInstanceOf(Db);
    await database.close();
  });

  it("should throw an error if don't call connectDB first", async () => {
    expect(database.getDb).toThrow(new Error('Please call connectDB first'));
  });
});

describe('dropCollection', () => {
  let db, client;
  beforeAll(async () => {
    // connected
    client = await MongoClient.connect(mongoHost);
    db = client.db();
  });

  afterAll(async () => {
    await client.close();
  });

  it('getCollections', async () => {
    //getCollections = jest.fn()  => 'Assignment to constant variable' 에러 발생
    database.getCollections = jest.fn();
    await database.getCollections(db);
    /* ### 주의!! ###
      - const { getCollections } = database;를 전역에 선언한 후
      - getCollections(db);를 호출하면 해당 테스트는 실패한다.
      - "database.getCollections(db) !== getCollections(db)"로 인식하기 때문이다.
      - 다르게 인식하는 이유는 "babel"이 자바스크립트를 컴파일하는 방식 때문이라고 한다. 
    */
    expect(database.getCollections).toBeCalled();
  });

  // TODO: 의존성이 있는 함수가 같은 모듈내 함수라면 mock가 되지 않는 문제로 테스트 로직 보류
  // it('dropCollection', async () => {
  //
  // });
});
