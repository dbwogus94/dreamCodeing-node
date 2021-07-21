/**
 * 반복되는 fetch API 코드를 재사용하기 위해서 가공하는 클래스
 * @param {*} url baseURL (도메인)
 */
export default class HttpClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  /**
   * fetch API util
   * @param {*} url APIs url
   * @param {*} options fetch API options
   * @returns response body(json)
   */
  async fetch(url, options) {
    /* ### fetch API 사용 */
    const res = await fetch(`${this.baseURL}${url}`, {
      ...options, // ... 연산자 : 배열(iterator)의 item을 하나씩 꺼내서 넣는다.
      headers: {
        'Content-Type': 'application/json',
        ...options.headers, //
      },
    });

    /* ### json() 예외 처리
      - fetch API는 response에 json()에서 즉, body가 없으면 undefined를 내보낸다.
      - 즉, json()이 undefined일 수 있으니 처리해야 한다.
    */
    let data;
    try {
      data = await res.json();
    } catch (error) {
      // 이 예외는 로직상 자연스러운 예외다. 그렇기 때문에 로그만 출력한다.
      console.error(error);
    }

    /* ### 성공 이외의 코드 처리 
      - fatch API는 4xx나 5xx 코드가 응답되어도 에러를 내보내지 않는다.
      - 그렇기 때문에 꼭!! 실패 코드에 대한 예외 처리를 구현해야 한다.
    */
    if (res.status > 299 || res.status < 200) {
      const message =
        data && data.message //
          ? data.message
          : 'Something went wrong!';
      throw new Error(message);
    }
    return data;
  }
}
