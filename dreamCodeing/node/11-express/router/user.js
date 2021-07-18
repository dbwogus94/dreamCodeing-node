import express from 'express';

// express에서 제공하는 Router 생성자를 통해 라우터 인스턴스화
const router = express.Router();

// app-7-route-after.js에서 설정했기 때문에
// 각 path는 접두사로 "/users"가 붙은 path를 처리하는 것과 같다.
router.get('/', (req, res, next) => {
  res.send('GET: /users');
});

router.post('/', (req, res, next) => {
  console.log('POST /users');
  res.send('POST/ users');
});

export default router;
