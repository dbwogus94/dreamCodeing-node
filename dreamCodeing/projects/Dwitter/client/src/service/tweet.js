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

  // http 모듈에서 base URL을 받는다.
  constructor(http) {
    this.http = http;
  }

  async getTweets(username) {
    const query = username ? `?username=${username}` : '';
    /* http 모듈로 변경
    const response = await fetch(`${this.baseURL}/tweets${query}`, {
      method: 'GET',
    });
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.message);
    } */
    return this.http.fetch(`/tweets/${query}`, { method: 'GET' });
  }

  async postTweet(text) {
    /* http 모듈로 변경
    const requestData = {
      method: 'POST',
      body: JSON.stringify({ name: 'Ellie', username: 'ellie', text, }),
      headers: { 'Content-Type': 'application/json', },
    };
    const response = await fetch(`${this.baseURL}/tweets`, requestData);
    const data = await response.json();
    if (response.status !== 201) {
      throw new Error(response.message);
    }*/
    return this.http.fetch(`/tweets`, {
      method: 'POST',
      body: JSON.stringify({ name: 'Ellie', username: 'ellie', text }),
    });
  }

  async deleteTweet(tweetId) {
    /* http 모듈로 변경
    const response = await fetch(`${this.baseURL}/tweets/${tweetId}`, { method: 'DELETE' });
    if (response.status !== 204) {
      throw new Error(response.message);
    }*/
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'DELETE',
    });
  }

  async updateTweet(tweetId, text) {
    /* http 모듈로 변경
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
    }*/
    return this.http.fetch(`/tweets/${tweetId}`, {
      method: 'PUT',
      body: JSON.stringify({ text }),
    });
  }
}
