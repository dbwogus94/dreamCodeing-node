import express from 'express';
// 비동기 에러를 잡는 미들웨어 라우터 마다 선언해야한다.
import 'express-async-errors';
import * as tweetController from '../controllers/tweetController.js';
// 유효성 검증 모듈
import { postValidator, putValidator } from '../validator/tweetValidator.js';

/**
 * ### View
 * - 라우터는 MVC에서 View에 대한 책임이 있다.
 * - 라우터는 Controller만 사용한다.
 * - 라우터에서는 요청에 대한 유효성 검증을 수행할 수 있다.
 */
const router = express.Router();

// GET /tweets
// GET /tweets?username=:username
router.get('/', tweetController.getTweets);
// GET /tweets/:id
router.get('/:id', tweetController.getTweet);
// POST /tweets/:id
router.post('/', postValidator, tweetController.createTweet);
// PUT /tweets/:id
router.put('/:id', putValidator, tweetController.updateTweet);
// DELETE /tweets/:id
router.delete('/:id', tweetController.deleteTweet);

export default router;
