/**
 * ### router은 MVC에서 view를 담당한다.
 * - Model : data/tweet.js
 * - View : router/tweets.js
 * - Controller : controller/tweet.js
 */
import express from 'express';
import 'express-async-errors';

// router에서 controller 계층을 사용한다.
import * as tweetController from '../controller/tweet.js';

const router = express.Router();

// GET /tweets
// GET /tweets?username=:username
router.get('/', tweetController.getTweets);

// GET /tweets/:id
router.get('/:id', tweetController.getTweet);

// POST /tweets
router.post('/', tweetController.createTweet);

// PUT /tweets/:id
router.put('/:id', tweetController.updateTweet);

// DELETE /tweets/:id
router.delete('/:id', tweetController.deleteTweet);

export default router;
