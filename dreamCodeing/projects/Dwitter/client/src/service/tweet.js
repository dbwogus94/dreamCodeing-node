export default class TweetService {
  /**
   * TweetService 생성자
   * @param {*} http - HttpClient
   * @param {*} tokenStorage - TokenStorage
   */
  constructor(http, tokenStorage) {
    this.http = http;
    this.tokenStorage = tokenStorage;
  }

  /* ### auth적용 : 
      API 서버에 tweet관련 요청을 보내려면 헤더에 인증정보(jwt)가 필요하다.
      - 모든 메서드에 요청시 인증정보 헤더를 포함하도록 추가하였음
  */

  async getTweets(username) {
    const query = username ? `?username=${username}` : '';
    return this.http.fetch(`/tweets/${query}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });
  }

  async postTweet(text) {
    return this.http.fetch(`/tweets`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
      // **수정: 작성자 정보 제거
      // -> 작성자의 정보는 서버에서 로그인된 사용자(jwt)를 통해 생성한다.
    });
  }

  async updateTweet(tweetId, text) {
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ text }),
    });
  }

  async deleteTweet(tweetId) {
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
  }

  // 인증정보 헤더를 리턴
  getHeaders() {
    const token = this.tokenStorage.getToken();
    return {
      Authorization: `Bearer ${token}`,
      /* Authorization은 인증정보를 담는 위한 정식 헤더이다.
          - Bearer는 인증정보가 token 형태임을 알리는 접두사(type)이다. 
        */
    };
  }
}
