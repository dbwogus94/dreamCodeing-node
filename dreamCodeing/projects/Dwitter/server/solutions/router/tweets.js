import express from 'express';
// 비동기 에러를 잡는 미들웨어 라우터 마다 선언해야한다.
import 'express-async-errors';

let tweets = [
  {
    id: '1',
    text: '솔루션 코드는 재밌습니다.',
    createAt: Date.now().toString(),
    name: 'Bob',
    username: 'bob',
    url: 'https://widgetwhats.com/app/uploads/2019/11/free-profile-photo-whatsapp-1.png',
  },
  {
    id: '2',
    text: 'Hi~',
    createAt: Date.now().toString(),
    name: 'Ellie',
    username: 'ellie',
  },
];

const router = express.Router();

// GET /tweets
// GET /tweets?username=:username
router.get('/', (req, res, next) => {
  const username = req.query.username;
  const data = username //
    ? tweets.filter(t => {
        return t.username === username;
      })
    : tweets;
  return res.status(200).json(data);
});
// GET /tweets/:id
router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  const tweet = tweets.find(tweet => tweet.id === id);
  if (tweet) {
    return res.status(200).json(tweet);
  } else {
    return res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
});
// POST /tweets
router.post('/', (req, res, next) => {
  const { text, name, username, url } = req.body;
  const tweet = {
    id: Date.now().toString(),
    text,
    createAt: new Date(),
    name,
    username,
  };
  // 새로운 배열 선언, 맨앞에 tweet 이후로는 tweets의 모든 item을 추가
  tweets = [tweet, ...tweets];
  return res.status(201).json(tweet);
});

// PUT /tweets/:id
router.put('/:id', (req, res, next) => {
  const id = req.params.id;
  const text = req.body.text;
  const tweet = tweets.find(tweet => tweet.id === id);
  if (tweet) {
    tweet.text = text;
    return res.status(201).json(tweet);
  } else {
    return res.status(404).json({ message: `Tweet id(${id}) not found` });
  }
});

// DELETE /tweets/:id
router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  // 삭제할 대상이 아닌 item으로 tweets 다시 구성
  //tweets = tweets.filter(tweet => tweet.id !== id);
  const findIndex = tweets.findIndex(tweet => tweet.id === id);
  if (findIndex === -1) {
    return res.status(404).json({ message: `Tweet id(${id}) not found` });
  } else {
    tweets.splice(findIndex, 1);
    return res.sendStatus(204);
  }
});

export default router;
