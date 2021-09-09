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
// 소켓을 구현한 클래스
import { getSocketIO } from '../connection/socket.js';

export async function getTweets(req, res) {
  const username = req.query.username;
  const data = await (username //
    ? tweetRepository.getAllByUsername(username)
    : tweetRepository.getAll());
  return res.status(200).json(data);
}

export async function getTweet(req, res) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if (tweet) {
    return res.status(200).json(tweet);
  } else {
    return res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
}

// 트윗 생성 -> 소켓 전파 -> http응답
export async function createTweet(req, res) {
  // 1) 신규 트윗 생성
  const { text } = req.body;
  const userId = req.userId; // middleware/auth.js에서 생성한 userId 사용
  const tweet = await tweetRepository.create(text, userId);
  // 2) 신규 트윗 소켓 전파: 'tweets'이벤트를 듣고 있는 모든 소켓에게 전파
  getSocketIO().emit('tweets', tweet);
  // 3) http 응답
  res.status(201).json(tweet);
}

export async function updateTweet(req, res) {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = await tweetRepository.getById(id);

  if (!tweet) {
    return res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
  // Authorization(인가) 코드 추가
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }

  const updated = await tweetRepository.update(id, text);
  return res.status(201).json(updated);
}

export async function deleteTweet(req, res) {
  const id = req.params.id;
  const tweet = await tweetRepository.getById(id);
  if (!tweet) {
    return res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
  // Authorization(인가) 코드 추가
  if (tweet.userId !== req.userId) {
    return res.sendStatus(403);
  }
  await tweetRepository.remove(id);
  return res.sendStatus(204);
}
