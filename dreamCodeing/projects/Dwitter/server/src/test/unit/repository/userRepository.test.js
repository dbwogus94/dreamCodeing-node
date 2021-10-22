/*## repository 테스트
  - data 계층은 DB와 직접적으로 연결하는 계층이다.
  - 때문에 DB로직을 호출하지 않고는 정확한 테스트를 수행 할 수 없다.
  
  Q) 그렇다면 Data계층의 테스트 격리는 어떻게 해야하나?
  A) 크게 보면 3가지 방법이 있다.
  1. 연관된 단위 테스트 종료마다 collection을 초기화(drop, delete all)한다.
  2. 테스트로 생성된 데이터를 종료시마다 제거한다.
  3. RDB라면 Rollback를 사용하여 되돌린다.

  TODO: 나는 위의 3가지 방법중 1번 방법을 선택하였다.
    RDB를 사용했다면 Rollback, Truncate 등 조금 더 효율적인 방법이 있었을 것이다.
    그리고 현재 테스트 하는 시점에서는 MongoDB 트랜잭션을 사용할 줄 모른다.
    때문에 1번을 선택하여 테스트 격리를 하였다.
 */
import database from '../../../db/database.js';
import * as userRepository from '../../../data/userRepository.js';
import { Db } from 'mongodb';

const sampleData = [
  {
    username: 'bob',
    password: '12345',
    name: 'Bob',
    email: 'bob@gmail.com',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
  },
  {
    username: 'jay',
    password: '12345',
    name: 'Jay',
    email: 'jay@gmail.com',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-4-300x300.png',
  },
  {
    username: 'ellie',
    password: '12345',
    name: 'Ellie',
    email: 'ellie@gmail.com',
    url: 'https://cdn.expcloud.co/life/uploads/2020/04/27135731/Fee-gentry-hed-shot-1.jpg',
  },
];

// 전체 테스트 시작시 커넥션 연결
beforeAll(async () => {
  await database.connectDB();
});

// 전체 테스트 종료시 커넥션 해제(db, client 초기화)
afterAll(async () => {
  await database.close();
});

it('should get Db instance', async () => {
  expect(database.getDb()).toBeInstanceOf(Db);
});

describe('findByUsername', () => {
  // 테스트 시작시 Delete All => 테스트 데이터 insert
  beforeAll(async () => {
    await userRepository.getUsers().deleteMany({});
    // or await database.getDb().collection('users').drop();
    // => drop은 존재하지 않는 경우 "ns not found"에러를 내보낸다.

    // 테스트 데이터 넣기
    const db = database.getDb();
    const users = db.collection('users');
    await users.insertMany(sampleData);
  });

  it('should return user document if correct username parament', async () => {
    const findUser = await userRepository.findByUsername('bob');
    expect(findUser).toBeTruthy();
    expect(findUser.username).toBe('bob');
    expect(findUser.name).toBe('Bob');
  });

  it('should return null if incorrect username parament', async () => {
    const findUser = await userRepository.findByUsername('test');
    expect(findUser).toBeNull();
  });

  it('should return null if unexist username parament', async () => {
    await expect(userRepository.findByUsername()).resolves.toBeNull();
  });
});

describe('createUser', () => {
  // 테스트 시작시 Delete All
  beforeAll(async () => {
    await userRepository.getUsers().deleteMany({});
  });

  it('should user document count is 1 if insert success', async () => {
    await userRepository.createUser(sampleData[0]);
    await expect(userRepository.getUsers().count()).resolves.toBe(1);
  });
  /* 테스트 flow
    1. 시작시 user collection delete all
    2. user insert 실행 
    3. user collection안에 document 수가 1이라면 통과 
  */
});

describe('findById', () => {
  let id;

  // 테스트 시작시 delete all => insert many
  beforeAll(async () => {
    const users = userRepository.getUsers();
    await users.deleteMany({});
    const result = await users.insertMany(sampleData);
    id = result.insertedIds[0];
  });

  it('should get user document if correct id parament', async () => {
    const findUser = await userRepository.findById(id);
    expect(findUser).toBeTruthy();
    expect(findUser.username).toBe('bob');
    expect(findUser.name).toBe('Bob');
  });

  it('should return null if incorrect id parament', async () => {
    const findUser = await userRepository.findById('616eb884c2517436998725fa');
    expect(findUser).toBeNull();
  });

  it('should return null if unexist id parament', async () => {
    const findUser = await userRepository.findById();
    expect(findUser).toBeNull();
  });

  it('should Throw an TypeError if incorrect type id parament', async () => {
    /* ### 비동기 에러 테스트 1 - 이미 throw된 에러를 자체를 확인 */
    await expect(userRepository.findById('12314')).rejects.toBeInstanceOf(TypeError);

    /* ### 비동기 에러 테스트 2 - (try-catch)강제로 에러를 던지는 익명함수를 정의하여 테스트 */
    // try {
    //   await userRepository.findById('12314');
    // } catch (error) {
    //   expect(() => {
    //     throw error;
    //   }).toThrow(new TypeError('parament passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters'));
    // }

    /* ### 비동기 에러 테스트 3 - (Promise사용)강제로 에러를 던지는 익명함수를 정의하여 테스트 */
    // return userRepository.findById('1234').catch(error => {
    //   expect(() => {
    //     throw error;
    //   }).toThrow(new TypeError('parament passed in must be a Buffer or string of 12 bytes or a string of 24 hex characters'));
    // });
  });
});
