/**
 * ### controller 계층 : 로직적인 조작을 담당한다.
 * - controller는 로직에 따라 data 계층을 사용한다.(의존한다)
 * - controller는 data 계층의 결과에 따른 응답을 한다.
 *
 * ### costroller 계층이 동작하는 순서
 *  1. controller는 router에서 req, res를 받아서 호출된다.
 *  2. req에서 데이터를 조작하기 위해 필요한 데이터를 꺼낸다.
 *  3. 리소스를 찾기(조작) 위해 data 계층을 호출한다.
 *  4. data 계층에서 넘겨받은 결과를 확인한다.
 *  5. 결과에 따른 응답을 한다.
 *
 */

// controller에서 data 계층을 사용한다.
import * as tweetRepository from '../data/tweet.js';

export function getTweets(req, res) {
  const username = req.query.username;
  const data = username //
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll();
  return res.status(200).json(data);
}

export function getTweet(req, res) {
  const id = req.params.id;
  const tweet = tweetRepository.getById(id);
  if (tweet) {
    return res.status(200).json(tweet);
  } else {
    return res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
}

export function createTweet(req, res) {
  const { text, name, username, url } = req.body;
  const tweet = tweetRepository.create(text, name, username, url);
  return res.status(201).json(tweet);
}

export function updateTweet(req, res) {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = tweetRepository.update(id, text);
  if (tweet) {
    return res.status(201).json(tweet);
  } else {
    return res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
}

export function deleteTweet(req, res) {
  const id = req.params.id;
  tweetRepository.remove(id);
  return res.sendStatus(204);
}
