import * as tweetService from '../services/tweetService.js';

/**
 * 컨트롤러는 서비스에만 의존한다.
 */

// Select All
const getAllTweets = async (req, res) => {
  const resJson = await tweetService.getAllTweets();
  return resJson.length !== 0 //
    ? res.status(200).json(resJson)
    : res.sendStatus(404);
};
// Select username
const getUserTweets = async (req, res) => {
  const resJson = await tweetService.getUserTweets(req.query.username);
  return resJson //
    ? res.status(200).json(resJson)
    : res.sendStatus(404);
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
    return res.status(400).json({ msg: 'Bad Request, must have a request body', contentType: 'json' });
  }
  return res.status(201).json(await tweetService.createTweet(req.body));
};
// Update Tweet
const updateTweet = async (req, res) => {
  const resJson = await tweetService.updateTweet(req.params.id, req.body);
  return resJson //
    ? res.status(201).json(resJson)
    : res.sendStatus(404);
};
// Delete Tweet
const deleteTweet = async (req, res) => {
  return (await tweetService.deleteTweet(req.params.id)) //
    ? res.sendStatus(204)
    : res.sendStatus(404);
};

export { getAllTweets, getUserTweets, getTweet, createTweet, updateTweet, deleteTweet };
