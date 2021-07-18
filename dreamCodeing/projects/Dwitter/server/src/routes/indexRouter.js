import express from 'express';
const router = express.Router();

router.all('/', (req, res, next) => {
  console.log('test index ==================');
  res.redirect(301, '/tweets');
});

export default router;
