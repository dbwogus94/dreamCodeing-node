import db from '../models/index.js';
const { User, sequelize } = db;

/**
 * ### Select user by username
 * - ex) SQL : select * from user where username = ${user.username}
 * @param {string} user.username
 * @returns
 * - user
 * - null : 자원없음
 */
export const findByUsername = async username => {
  const findUser = await User.findOne({
    where: { username },
  });
  return findUser ? findUser.toJSON() : null;
};

/**
 * ### Create user
 * - ex) SQL :
 * insert into
 * user(username, password, name, email, url)
 * values(${user.username}, ${user.password}, ${user.name}, ${user.email}, ${user.url});
 * @param {object} user { username, password, name, email, url }
 * @return newUser.id
 * @throws SQL Error
 */
export const createUser = async user => {
  const { username, password, name, email, url } = user;
  /* ## sequelize 비관리 트랜잭션 예시 
    - sequelize에 트랜잭션 방법에는 "관리", "비관리"가 있다.
    - "관리"의 경우 commit(), rollback()를 명시하지 않아도 트랜잭션을 자동으로 처리한다.
    - "비관리"의 경우는 commit(), rollback()를 명시해야 처리가 가능하다.

    ** 참고
    - MySQL은 AUTO_INCREMENT를 rallback 할 수 없다.
    - 그렇기 때문에 해당 로직에서 트랜잭션을 사용할 필요가 없다.
    - 하지만 sequelize의 트랜잭션을 연습하기 위해 사용하도록 한다.
  */
  // 1) 트랜잭션 시작(생성)
  const t = await sequelize.transaction();
  try {
    // 2) Insert SQL 생성 및 요청
    const newUser = await User.create(
      {
        username,
        password,
        name,
        email,
        url,
      },
      { transaction: t } // 두 번째 인자로 트랜잭션을 전달해야 같은 작업으로 인식된다.
    );
    // 3) 성공시
    await t.commit(); // 성공시 commit()
    return newUser.id; // 성공시 생성된 id 전달
  } catch (error) {
    // 3) 실패시
    await t.rollback(); // 실패시 rollback()
    throw error; // 에러를 에러 미들웨어가 처리할 수 있도록 던진다.
  }
};

/**
 * ### Select user by id
 * - ex) SQL : select * from user where id = ${user.id}
 * @param {string} user.id
 * @returns
 * - user
 * - null
 */
export const findById = async id => {
  const findUser = await User.findByPk(id);
  return findUser ? findUser.toJSON() : null;
};
