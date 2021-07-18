/*
  ### route를 사용하여 같은 path끼리 묶을 수 있다.
  - 같은 url로 시작하지만 Method마다 다르게 처리하는 경우
  매번 선언해서 사용하는 것은 비효율적이다.
  이런경우 app.route를 통해 체이닝이 가능하다.

  ### 문제는 미들웨어가 복잡하다면 이 또한 
      비효율적이고, 유지보수에서도 좋지 않다.
  - app-7-route-after.js는 이러한 문제를 해결하고 있다.
 */
import express from 'express';
const app = express();

app.use(express.json());

app.use('/', (req, res, next) => {
  console.log(new Date(Date.now));
  next();
});

/* route를 사용하지 않는 코드 
  - 같은 url이 Method에 따라서 반복된다.
*/
app.get('/posts', (req, res, next) => {
  res.status(201).send('GET: /posts');
});
app.post('/posts', (req, res, next) => {
  res.status(201).send('POST: /posts');
});

app.put('posts/:id', (req, res, next) => {
  res.status(201).send('PUT: /posts/' + req.params.id);
});
app.delete('/posts/:id', (req, res, next) => {
  res.status(201).send('DELETE: /posts/' + req.params.id);
});

/* route를 사용하는 코드  */
app // route를 통해 URL이 같은 라우트를 체이닝한다.
  .route('/posts')
  .get((req, res, next) => {
    res.status(201).send('GET: /posts');
  })
  .post((req, res, next) => {
    res.status(201).send('POST: /posts');
  });

app
  .route('/posts/:id')
  .put((req, res, next) => {
    res.status(201).send('PUT: /posts/' + req.params.id);
  })
  .delete((req, res, next) => {
    res.status(201).send('DELETE: /posts/' + req.params.id);
  });

app.listen(8080);
