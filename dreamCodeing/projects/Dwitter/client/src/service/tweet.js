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
  url = 'http://localhost:8080/tweets';

  async getTweets(username) {
    const res = await fetch(this.url, { method: 'GET' });
    const tweets = await res.json();
    return username //
      ? tweets.filter(tweet => tweet.username === username)
      : tweets;
  }

  async postTweet(text) {
    const tweet = {
      // id: Date.now(),
      // createdAt: new Date(),
      name: 'Ellie',
      username: 'ellie',
      text,
      url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-4-300x300.png',
    };

    const reqData = {
      method: 'POST',
      body: JSON.stringify(tweet),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await fetch(this.url, reqData);
    const tweets = await res.json();
    return tweets[0];
  }

  async deleteTweet(tweetId) {
    const res = await fetch(this.url + '/' + tweetId, { method: 'DELETE' });
    if (res.status === 204) {
    }
    //this.tweets = this.tweets.filter(tweet => tweet.id !== tweetId);
  }

  async updateTweet(tweetId, text) {
    const request = await fetch(this.url, { method: 'GET' });
    const tweets = await request.json();

    const tweet = tweets.find(tweet => tweet.id === tweetId);

    if (!tweet) {
      throw new Error('tweet not found!');
    }
    tweet.text = text;

    const reqData = {
      method: 'PUT',
      body: JSON.stringify(tweet),
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const res = await fetch(this.url + '/' + tweetId, reqData);
    const newTweet = await res.json();
    return newTweet;
  }
}
