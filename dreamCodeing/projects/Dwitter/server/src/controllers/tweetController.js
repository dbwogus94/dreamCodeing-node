import * as tweetService from '../services/tweetService.js';

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
    : await tweetService.getAllTweets();

  return data //
    ? res.status(200).json(data)
    : res.status(404).json({ message: `Tweet username(${username}) not found` });
};
// Select Tweet
const getTweet = async (req, res) => {
  const resJson = await tweetService.getTweet(req.params.id);
  return resJson //
    ? res.status(200).json(resJson)
    : res.sendStatus(404);
};
// Create Tweet
const createTweet = async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    // body가 없으면 400 응답
    // TODO : 요청에 대한 유효성 검사는 라우터로 가야하지 않을까?
    return res.status(400).json({ message: 'Bad Request, must have a request body', contentType: 'json' });
  }
  return res.status(201).json(await tweetService.createTweet(req.body));
};
// Update Tweet
const updateTweet = async (req, res) => {
  const resJson = await tweetService.updateTweet(req.params.id, req.body);
  return resJson //
    ? res.status(201).json(resJson)
    : res.status(404).json({ message: `Tweet id(${req.params.id}) not found` });
};
// Delete Tweet
const deleteTweet = async (req, res) => {
  return (await tweetService.deleteTweet(req.params.id)) //
    ? res.sendStatus(204)
    : res.status(404).json({ message: `Tweet id(${req.params.id}) not found` });
};

export { getTweets, getTweet, createTweet, updateTweet, deleteTweet };
