/**
 * ### router은 MVC에서 view를 담당한다.
 * - Model : data/tweet.js
 * - View : router/tweets.js
 * - Controller : controller/tweet.js
 */
import express from 'express';
import 'express-async-errors';
// validation을 제공하는 외부 모듈
import { body } from 'express-validator';
import { validate } from '../middleware/validator.js';
import * as tweetController from '../controller/tweet.js';
// auth가 유요한지 확인하는 미들웨어
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

const validateTweet = [
  body('text') //
    .trim()
    .isLength({ min: 3 })
    .withMessage('text should be at least 3 characters'),
  validate,
];

// GET /tweets
// GET /tweets?username=:username
router.get('/', isAuth, tweetController.getTweets);

// GET /tweets/:id
router.get('/:id', isAuth, tweetController.getTweet);

// POST /tweets
// validateTweet 추가
router.post('/', isAuth, validateTweet, tweetController.createTweet);

// PUT /tweets/:id
// validateTweet 추가
router.put('/:id', isAuth, validateTweet, tweetController.updateTweet);

// DELETE /tweets/:id
router.delete('/:id', isAuth, tweetController.deleteTweet);

export default router;
