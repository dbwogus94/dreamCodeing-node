import express from 'express';

// express에서 제공하는 Router 생성자를 통해 라우터 인스턴스화
const router = express.Router();

// app-7-route-after.js에서 설정했기 때문에
// 각 path는 접두사로 "/posts"가 붙은 path를 처리하는 것과 같다.
router.get('/', (req, res, next) => {
  res.status(201).send('GET: /posts');
});

router.post('/', (req, res, next) => {
  res.status(201).send('POST: /posts');
});

router.put('/:id', (req, res, next) => {
  res.status(201).send('PUT: /posts/' + req.params.id);
});

router.delete('/:id', (req, res, next) => {
  res.status(201).send('DELETE: /posts/' + req.params.id);
});

export default router;
