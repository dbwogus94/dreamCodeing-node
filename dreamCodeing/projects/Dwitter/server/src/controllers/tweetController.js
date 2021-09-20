import * as tweetService from '../services/tweetService.js';
import { getSocketIO } from '../connection/socket.js';

/**
 * ### Controller
 * - 컨트롤러는 MVC에서 Controller에 대한 책임이 있다.
 * - 컨트롤러는 Model을 사용한다.
 * - 컨트롤러는 로직적인 처리를 담당한다.
 * - 요청에 대한 로직(분기)는 컨트롤러가 처리한다.
 */

/* ### Controller 계층 MVC 패턴 강의를 진행하고 변경(피드백) 내용
    1. tweetRouter에서 처리하던 요청에 대한 로직 처리를 
      getTweets()로 이동시켰다.
    2. 처리할 라우트가 있지만 자원이 없는 경우 단순하게 404를 응답하는 것보단,
      자원이 존재하지 않는다는 메시지를 함께 보내는 것이 좋다.
 */

// select All
// select All by username
const getTweets = async (req, res) => {
  const username = req.query.username;
  const data = username //
    ? await tweetService.getUserTweets(username)
    : await tweetService.getTweets();

  return data.length !== 0 //
    ? res.status(200).json(data)
    : res.sendStatus(404);
};
// Select Tweet
const getTweet = async (req, res) => {
  const resJson = await tweetService.getTweetById(req.params.id);
  return resJson //
    ? res.status(200).json(resJson)
    : res.sendStatus(404);
};
// Create Tweet
const createTweet = async (req, res) => {
  // 신규 트윗 생성
  const newTweet = await tweetService.createTweet(req.body.text, req.id);
  // 신규 트윗 소켓으로 전파
  getSocketIO().emit('tweets', newTweet);
  return res.status(201).json(newTweet);
};
// Update Tweet
const updateTweet = async (req, res) => {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = await tweetService.getTweetById(id);
  if (!tweet) {
    return res.status(404).json({ message: `Tweet id(${req.params.id}) not found` });
  }
  /* Authorization(인가) 코드 : 작성자가 아니라면 수정 불가*/
  if (tweet.userId !== req.id) {
    return res.sendStatus(403); // 권한 없음
  }
  const updated = await tweetService.updateTweet(id, text);
  return res.status(201).json(updated);
};
// Delete Tweet
const deleteTweet = async (req, res) => {
  const id = req.params.id;
  const tweet = await tweetService.getTweetById(id);
  if (!tweet) {
    return res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
  /* Authorization(인가) 코드 : 작성자가 아니라면 삭제 불가 */
  if (tweet.userId !== req.id) {
    return res.sendStatus(403); // 권한 없음
  }
  await tweetService.deleteTweet(req.params.id);
  return res.sendStatus(204);
};

export { getTweets, getTweet, createTweet, updateTweet, deleteTweet };
