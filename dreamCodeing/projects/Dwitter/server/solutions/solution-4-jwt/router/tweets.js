/**
 * ### router은 MVC에서 view를 담당한다.
 * - Model : data/tweet.js
 * - View : router/tweets.js
 * - Controller : controller/tweet.js
 */
import express from 'express';
import 'express-async-errors';
// validation을 제공하는 외부 모듈
import { body, validationResult } from 'express-validator';

// router에서 controller 계층을 사용한다.
import * as tweetController from '../controller/tweet.js';
// validation 관련 공통 미들웨어
import { validate } from '../middleware/validator.js';

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
router.get('/', tweetController.getTweets);

// GET /tweets/:id
router.get('/:id', tweetController.getTweet);

// POST /tweets
// validateTweet 추가
router.post('/', validateTweet, tweetController.createTweet);

// PUT /tweets/:id
// validateTweet 추가
router.put('/:id', validateTweet, tweetController.updateTweet);

// DELETE /tweets/:id
router.delete('/:id', tweetController.deleteTweet);

export default router;
