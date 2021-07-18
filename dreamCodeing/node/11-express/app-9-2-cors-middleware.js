import express from 'express';
import cors from 'cors';
const app = express();

/* ### CORS 정책을 쉽게 처리할 수 있는 미들웨어 사용 */

// 1. 기본 사용
// 'Access-Control-Allow-Origin : *' 로 설정되기 때문에 보안상 위험하다.
app.use(cors());

// 2. ip를 지정하여 사용
// 'Access-Control-Allow-Origin : http://127.0.0.1:5500'으로 설정
app.use(
  cors({
    //origin: 'http://127.0.0.1:5500',
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
);

// 3. 다른 옵션 사용
app.use(
  cors({
    origin: 'http://127.0.0.1:5500', // 허용할 클라이언트 ip
    optionsSuccessStatus: 200, // 응답 상태 코드 지정
    credentials: true,
    // == Access-Control-Allow-Credentials: true
    // 헤더에 사용자의 토큰 정보등 새로운 정보를 추가 허용
  })
);

app.get('/', (req, res) => {
  res.send('Welcome!!');
});

app.listen(8080);
