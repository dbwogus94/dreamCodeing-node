import express from 'express';
import * as tweetController from '../controllers/tweetController.js';
/**
 * default url : /tweets
 * - 라우터는 컨트롤러에만 의존한다.
 */
const router = express.Router();

// GET (/tweets || /tweets?username='')
router.get('/', async (req, res) => {
  const isQuery = Object.keys(req.query).length != 0;
  if (isQuery) {
    return tweetController.getUserTweets(req, res);
  } else {
    return tweetController.getAllTweets(req, res);
  }
});
// GET /tweets/:id
router.get('/:id', tweetController.getTweet);
// POST /tweets/:id
router.post('/', tweetController.createTweet);
// PUT /tweets/:id
router.put('/:id', tweetController.updateTweet);
// DELETE /tweets/:id
router.delete('/:id', tweetController.deleteTweet);

export default router;
