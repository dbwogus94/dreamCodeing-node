import Sequelize from 'sequelize';

export default class User extends Sequelize.Model {
  /**
   * User Model Initialize
   * @param {object} sequelize sequelize instance
   * @param {object} DataTypes sequelize module DataTypes
   */
  static init(sequelize, DataTypes) {
    /* 아래는 sequelize auto를 사용하여 이미 생성된 user table 정보를 모델로 추출한 내용이다. */
    super.init(
      // 1. table attributes
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          comment: 'Users PK',
        },
        username: {
          type: DataTypes.STRING(45),
          allowNull: false,
          comment: '유저 아이디',
          unique: 'username_UNIQUE',
        },
        password: {
          type: DataTypes.STRING(128),
          allowNull: false,
          comment: '패스워드',
        },
        name: {
          type: DataTypes.STRING(128),
          allowNull: false,
          comment: '유저 이름',
        },
        email: {
          type: DataTypes.STRING(128),
          allowNull: false,
          comment: '유저의 이메일',
        },
        url: {
          type: DataTypes.TEXT,
          allowNull: true,
          comment: '유저 프로필 url',
        },
      },
      // 2. options
      {
        sequelize,
        tableName: 'users_sequelize', // sequelzie는 기본적으로 model은 단수, table명은 복수를 사용한다.
        timestamps: false, // createdAt, updatedAt 컬럼 생성 옵션 - 사용안함.
        indexes: [
          {
            name: 'PRIMARY',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'id_UNIQUE',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'id' }],
          },
          {
            name: 'username_UNIQUE',
            unique: true,
            using: 'BTREE',
            fields: [{ name: 'username' }],
          },
        ],
      }
    );
  }

  /**
   * User Model 연관관계 설정
   * @param {object} db
   */
  static associate(db) {
    User.hasMany(db.Tweet, { foreignKey: 'userId' });
    /*
      - User는 여러개의 Tweet을 가질 수 있다.
      - Tweet은 하나의 User를 필수로 가진다. 
    */
  }
}
