import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

/**
 * socket.io를 구현한 class Socket
 */
class Socket {
  /**
   * ### class Socket 생성자
   * @param {object} server http.Server
   */
  constructor(server) {
    this.clientCnt = 0;
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    // ### 소켓 미들웨어 선언: 연결전에 요청정보의 토큰 검증
    this.io.use((socket, next) => {
      /* socket.handshake
        {
          headers: '핸드셰이크의 일부로 전송된 헤더,
          time: '생성 날짜(문자열)',
          address: '클라이언트의 ip',
          xdomain: '연결 여부',
          secure:  '연결이 안전한가 여부',
          issued: '생성 날자(타임스탬프)',
          url: '요청 URL 문자열',
          query: ' 첫 번째 요청의 쿼리 매개변수',
          auth: '인증 페이로드'
        }
       */
      // 소켓전송에서 받은 인증토큰을 가져온다.
      const token = socket.handshake.auth.token;
      // 토큰 존재 확인
      if (!token) {
        return next(new Error('Authentication error - 1')); // 클라이언트에 에러를 전달
      }
      // 토큰 유효한지 검증
      jwt.verify(token, config.jwt.secreKey, (error, decoded) => {
        if (error) {
          return next(new Error('Authentication error - 2')); // 클라이언트에 에러를 전달
        }
        next(); // 다음 미들웨어 호출 또는 'connection' 이벤트 호출
      });
    });

    // 위의 use가 통과되어야 연결이 허가된다. ->  connection 이벤트 호출된다.

    // ### 클라이언트가 연결되면 호출되는 연결 이벤트
    this.io.on('connection', socket => {
      console.log('[Socket] client connected');
      console.log('[Socket] clientCnt - ', ++this.clientCnt);

      // ### 클라이언트에서 연결을 해제하면 호출되는 이벤트
      socket.on('disconnecting', reason => {
        console.log('[Socket] client disconnect - ', reason);
        console.log('[Socket] clientCnt - ', --this.clientCnt);

        /* ### reason 종류
          1. server namespace disconnect :	socket.disconnect() 로 소켓이 강제로 연결 해제되었습니다.
          2. client namespace disconnect :	클라이언트가 socket.disconnect()를 사용하여 소켓을 수동으로 연결 해제했습니다.
          3. server shutting down :	서버가 종료됩니다.
          4. ping timeout :	클라이언트가 pingTimeout지연 시간에 PONG 패킷을 보내지 않았습니다.
          5. transport close :	연결이 닫혔습니다(예: 사용자가 연결이 끊겼거나 네트워크가 WiFi에서 4G로 변경됨)
          6. transport error :	연결에 오류가 발생했습니다.
        */
      });
    });
  }
}

/* ## js에서 싱글톤(Singleton)으로 클래스를 관리하는 방법 
  -> 클래스를 export하지 않고 클래스를 생성(initSocket())과 
    생성된 인스턴를 가져오는 메서드(getSocketIO())를 구현하여 export한다.
*/

let socket;

/**
 * ### Socket 클래스를 Singleton으로 생성
 * @param {object} server http.Server
 */
export function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}

/**
 * ### initSocket()를 통해 생성된 Socket 인스턴스의 io 필드를 리턴
 * @returns socket.io
 */
export function getSocketIO() {
  if (!socket) {
    throw new Error('Please call init first');
  }
  return socket.io; // Socket의 this.io 필드를 리턴
}
