/*
  ## sequelize init 로직 구현 
  - sequelize init는 es6 moduel를 지원하지 않음.
  - 그래서 es6 문법에 맞게 로직을 구성하였음
*/
import * as path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { config } from '../config/config.js';

import pkg from 'sequelize';
const { Sequelize, DataTypes } = pkg;
const mysql = config.mysql;
// export 할 객체 선언
const db = {};

// ### 1. Sequelize 생성
const sequelize = new Sequelize({
  database: mysql.database,
  username: mysql.user,
  password: mysql.password,
  host: mysql.host,
  // DB 방언 설정
  dialect: 'mysql',
  define: {
    // 테이블 이름 추론생성 옵션 끄기
    freezeTableName: true,
  },
});

// 현재 파일 풀 경로
const __filename = fileURLToPath(import.meta.url);
// 현재 파일 상위 폴더 풀 경로
const __dirname = path.dirname(__filename);
// 현재 파일 명
const basename = path.basename(__filename);

// ### 2. 모델 파일 목록 가져오기
const files = fs
  .readdirSync(__dirname) //
  // index.js 파일 제외
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js');

// ### 3. 모델 import 및 초기화
await Promise.all(
  files.map(async file => {
    // 1) 동적 import
    const export_model = await import(`./${file}`); //
    const Model = export_model.default;
    // 2) 초기화
    Model.init(sequelize, DataTypes);
    // 3) 초기화된 Model db에 담기
    db[Model.name] = Model;
  })
);

// ### 4. 모델 연관관계 설정
Object.keys(db).forEach(modelName => {
  // 각 Model 클래스 메서드 associate를 호출하여 연관관계 설정
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// ### 5. 설정 끌난 db 객체 export
// db = {...Model, sequelize, Sequelize}
export default db;
