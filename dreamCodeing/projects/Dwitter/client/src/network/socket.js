import socket from 'socket.io-client';

export default class Socket {
  /**
   * ### Socket.io-client를 구현한 Soket 클래스 생성자
   * @param {string} baseURL
   * @param {function} getAccessToken
   */
  constructor(baseURL, getAccessToken) {
    this.io = socket(baseURL, {
      // socket.io에서 권고하는 auth 토큰을 소켓에 적용하는 방법
      auth: cb => cb({ token: getAccessToken() }),
      transports: ['websocket'],
    });
    /* ### auth token사용 주의!! 
      auth token을 요청 query에 담아서 보내는 실수가 종종있다.
      이 경우 개발자 모드에서 확인이 가능하기 때문에 보안상 위험하다.
       ex)
        soket(baseURL, {
          query: { token: this.getAccessToken() },
          transports: ['websocket'],
        });  
    */

    // ### 연결시 발생하는 이벤트
    this.io.on('connect', () => {
      console.log('[socket] connect');
    });

    // ### 연결 해지시 발생하는 이벤트
    this.io.on('disconnect', reason => {
      console.info(`[socket] disconnect - reason : ${reason}`);
      // 서버에서 연결을 끊은 경우
      if (reason === 'io server disconnect') {
        this.io.connect();
      }
      /*
        ### reason 종류
        1. io server disconnect : 서버에서 연결 해제
        2. io client disconnect : 클라이언트에서 .disconnect()또는 .close()를 사용하여 연결 해제
        3. ping itmeout : 서버가 pingInterval + pingTimeout범위 내에서 PING을 보내지 않았습니다.
        4. transport close : 연결이 닫혔습니다.(ex: 서버 종료, 사용자 연결 끊김, 4G에서 WiFi로 변경 등)
        5. transport error : 연결에 오류가 발생 (ex: HTTP 긴 폴딩 주기 동안 서버가 종료됨)

        ** 1. 2.의 경우 다시 연결을 시도하지 않기 때문에 .connent()를 사용하여 재연결 해야한다.
          나머지의 경우는 재연결 시도를 자동으로 한다.
      */
    });

    // ### Socket 연결 오류가 발생하면 호출되는 이벤트
    this.io.on('connect_error', error => {
      console.error('[socket] error - ', error.message);

      // websocket error: 웹 소켓 서버가 없어 발생하는 에러 처리
      if (error.message === 'websocket error') {
        this.io.disconnect(); // == this.io.close();
        // 연결오류시 지속적인 연결을 하지 않기 위해 종료
        // 이 경우 서버가 다시 켜지더라도 연결을 시도하지 않는다.
        // 새로고침이나 웹에 다시 접근하는 방법으로 해결해야한다.
      }
    });
  }

  /**
   * ### Socket에서 사용할 이벤트 생성
   * @param {string} event 생성할 이벤트 명
   * @param {function} callback 이벤트에서 실행할 콜백
   * @returns {function} emitter.removeListener(event, callback)
   * - 생성한 이벤트 제거하는 함수 리턴
   */
  onSync(event, callback) {
    // 소켓이 연결되었는지 확인
    if (!this.io.connected) {
      this.io.connect(); // 연결 시도
    }
    /* ### 이벤트 생성: 
      io.emit(event, value)가 트리거 되면 전달된 콜백이 실행된다. */
    this.io.on(event, message => callback(message));

    /* ### 이벤트 제거 함수를 콜백으로 리턴:
      이 메서드를 사용하는 쪽에서 생성한 이벤트를 제거할 수 있도록 이벤트 제거 함수 리턴 */
    return () => this.io.off(event);
  }

  disconnect() {
    this.io.disconnect();
  }
}
