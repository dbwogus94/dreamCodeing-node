export default class AuthService {
  /**
   * AuthService 생성자
   * @param {*} http - HttpClient
   * @param {*} tokenStorage - TokenStorage
   */
  constructor(http, tokenStorage, socket) {
    this.http = http;
    this.tokenStorage = tokenStorage;
    this.socket = socket;
  }

  async signup(username, password, name, email, url) {
    const data = await this.http.fetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password, name, email, url }),
    });

    // 응답 body의 jwt를 저장소에 저장한다.
    this.tokenStorage.saveToken(data.token);
    return data;
  }

  async login(username, password) {
    const data = await this.http.fetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    // 응답 body의 jwt를 저장소에 저장한다.
    this.tokenStorage.saveToken(data.token);
    return data;
  }

  // 클라이언트가 가진 토큰이 유효한지 확인
  async me() {
    const token = this.tokenStorage.getToken();
    return this.http.fetch('/auth/me', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    // Authorization: 인증 관련 정보를 담는 정식 헤더
    // Bearer는 인증 정보가 토큰형태임을 알리는 type 접두사
  }

  // 로그아웃
  async logout() {
    // 토큰 제거
    // -> HTTP 프로토콜은 무상태이다. 때문에 로그아웃은 token만 제거하면 된다.
    this.tokenStorage.clearToken();
    // 연결된 소켓 닫기
    // -> ws 프로토콜은 상태가 있다. 때문에 연결을 끊는다는 이벤트를 호출하여 서버에게 알린다.
    this.socket.disconnect();
    return;
  }
}
