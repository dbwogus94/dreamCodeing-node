import Sequelize from 'sequelize';

export default class Tweet extends Sequelize.Model {
  /**
   * Tweet Model initialize
   * @param {object} sequelize sequelize instance
   * @param {object} DataTypes sequelize module DataTypes
   */
  static init(sequelize, DataTypes) {
    /* 아래는 sequelize auto를 사용하여 이미 생성된 user table 정보를 모델로 추출한 내용이다. */
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          comment: 'Tweets PK',
        },
        text: {
          type: DataTypes.TEXT,
          allowNull: false,
          comment: '트윗 내용',
        },
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          comment: '트윗 작성자의 식별자(FK)',
          /* 이미 생성된 테이블 FK 설정: 
            - sequelize는 테이블을 생성하면서 외래키를 설정할 수가 없다.
            - 그래서 해당 설정은 이미 생성되어 있는 테이블에만 사용이 가능하다.
            => 때문에 일반적으로 연관관계 설정은 
              클래스 메서드 associate()를 사용하여 외부에서 설정한다. */
          // references: {
          //   model: 'users',
          //   key: 'id',
          // },
        },
      },
      {
        sequelize,
        tableName: 'tweets_sequelize',
        timestamps: true, // createdAt, updatedAt 컬럼 생성 옵션 끄기
        createdAt: true, // createdAt 컬럼 자동생성 사용 켜기, *문자열을 전달하면 컬럼 명을 바꿀 수 있다.
        updatedAt: false,
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
            name: 'id_idx',
            using: 'BTREE',
            fields: [{ name: 'userId' }],
          },
        ],
      }
    );
  }
  /**
   * Tweet Model 연관관계 설정
   * @param {object} db
   */
  static associate(db) {
    Tweet.belongsTo(db.User, { foreignKey: 'userId' });
    /*
      - User는 여러개의 Tweet을 가질 수 있다.
      - Tweet은 하나의 User를 필수로 가진다. 
    */
  }
}
