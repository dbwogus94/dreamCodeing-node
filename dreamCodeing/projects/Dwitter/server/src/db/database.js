import mysql from 'mysql2/promise';
import { config } from '../config/config.js';

/* ##  DB pool 생성 - connection을 가지고 있는 pool
  ### connection 라이프 사이클 
  1) connection 생성 : DB 접속정보를 사용하여 생성한다.
  2) sql 요청 : connection 객체를 사용하여 DB서버에 sql을 요청한다.
  3) connection제거 : sql 요청에 대한 응답이 오면 connection을 제거한다.

  ### pool을 사용한 라이프 사이클
  1) connection 가져오기 : pool에서 connetion을 가져온다.
    -> 사용가능한 connection이 없다면 새로운 connection을 생성한다.
  2) sql 요청
  3) connection 반납: 사용이 끝난 connection을 pool에게 반납한다.

  ** pool을 사용하여 connection을 관리하게 되면 매 요청마다 발생하는 
     connection생성 과정을 생략하여 오버헤드를 줄일 수 있다.

  ### pool을 사용시 주의점
  1) pool을 사용하여 생성한 connection은 사용이 끝나면 반드시 반납해야 한다.
    -> connection.release();
  2) pool에서 생성하여 관리되는 connection의 개수에는 제한이 있다.
    -> 앱에서 pool이 가질수 있는 모든 connection을 사용하면 
      더 이상 SQL을 요청 할 수 없다.(에러도 발생하지 않으니 주의!!)
*/
export const pool = mysql.createPool({
  host: config.mysql.host,
  user: config.mysql.user,
  database: config.mysql.database,
  password: config.mysql.password,
  connectionLimit: 10, // connection 최대 개수 10개 제한
});
