export default class TweetService {
  // tweets = [
  //   {
  //     id: 1,
  //     text: '드림코딩에서 강의 들으면 너무 좋으다',
  //     createdAt: '2021-05-09T04:20:57.000Z',
  //     name: 'Bob',
  //     username: 'bob',
  //     url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
  //   },
  // ];

  // 생성자를 통해 base URL을 받도록 설정
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async getTweets(username) {
    const query = username ? `?username=${username}` : '';

    // 서버와 통신
    const response = await fetch(`${this.baseURL}/tweets${query}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    // 서버에서 받은 데이터 파싱
    const data = await response.json();

    // 에러 처리
    if (response.status !== 200) {
      throw new Error(data.message);
    }

    return data;
  }

  async postTweet(text) {
    const requestData = {
      method: 'POST',
      body: JSON.stringify({
        name: 'Ellie',
        username: 'ellie',
        text,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${this.baseURL}/tweets`, requestData);

    const data = await response.json();

    if (response.status !== 201) {
      throw new Error(response.message);
    }

    return data;
  }

  async deleteTweet(tweetId) {
    const response = await fetch(`${this.baseURL}/tweets/${tweetId}`, { method: 'DELETE' });

    if (response.status !== 204) {
      throw new Error(response.message);
    }
  }

  async updateTweet(tweetId, text) {
    const requestData = {
      method: 'PUT',
      body: JSON.stringify({ text }),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(`${this.baseURL}/tweets/${tweetId}`, requestData);

    const data = await response.json();

    if (response.status !== 201) {
      throw new Error(response.message);
    }

    return data;
  }
}
