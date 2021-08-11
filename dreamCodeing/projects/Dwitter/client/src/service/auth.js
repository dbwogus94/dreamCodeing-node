export default class AuthService {
  /**
   * AuthService 생성자
   * @param {*} http - HttpClient
   * @param {*} tokenStorage - TokenStorage
   */
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
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

  // 로그아웃 : 클라이언트에서 토큰을 삭제한다.
  async logout() {
    this.tokenStorage.clearToken();
    return;
  }
}
