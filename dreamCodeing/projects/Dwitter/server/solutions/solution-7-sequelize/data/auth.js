// app.js에서 인스턴스화된 sequelize를 import
import { sequelize } from '../db/database.js';
import SQ from 'sequelize';
const DataTypes = SQ.DataTypes;

/* ### 1. sequelize 모델 생성 */
// 인스턴스화된 Sequelize를 사용해 Model을 정의한다.
const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER, // int
      autoIncrement: true, // AUTO_INCREMENT 사용
      allowNull: false, // null 허용 x
      primaryKey: true, // PK로 사용
    },
    username: {
      type: DataTypes.STRING(45), // varcher(45)
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: true, // default
    },
  },
  {
    tableName: 'users_solution',
    // tableName: DB 테이블 명
    // tableName의 기본 값은 model의 복수형이다.
    timestamps: false,
    // timestamps 사용안함
    // timestamps : sequelize는 기본적으로 Date 타입으로 createdAt, updatedAt 컬럼을 만든다.
  }
);

/* ### 2. sequelize model인 User를 사용하여 DB에 sql 요청 */

// username로 유저 찾기
export async function findByUsername(username) {
  // select * FROM users_solution WHERE username = ${username};
  return User.findOne({ where: { username } });
}

// id로 유저 찾기
export async function findById(id) {
  // SELECT * FROM users_solution WHERE id = ${id}
  return User.findByPk(id);
}

// 유저 생성
export async function createUser(user) {
  // INSERT INTO
  //  users_solution(username, password, name, email, url)
  //  VALUES(${user.username}, ${user.name}, ${user.email}, ${user.url});
  return User.create(user).then(data => {
    return data.dataValues.id;
    // data.dataValues : insert로 생성된 row data
  });
}
