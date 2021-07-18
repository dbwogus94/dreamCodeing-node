import express from 'express';
const app = express();

/* ### post request body의 특징
  - post의 requset 메시지에는 body가 있다.
  - body에는 클라이언트가 요청시 보낸 data가 담겨서 온다.
  - 하지만 body는 일반적인 방법으로 읽어오지 못한다.
  - 그렇기 때문에 (IncomingMessage)req객체에는 body필드는 애초에 정의되지 않았다.
  
  ### post 요청에 body의 값을 받는 방법
  방법1. http 모듈에서 했던 것처럼 
    읽기 이벤트(req.on('data', ...))와 
    읽기 완료 이벤트(req.on('end', ...))를 통해 읽어온다.

  방법2. express에서 제공하는 미들웨어를 통해 파싱한다.
    express 4.16.0 이전에는 'body-parser'라는 미들웨어 모듈을 import해서 사용했다.
    express 4.16.0 이후부터는 'body-parser'가 express의 미들웨어로 들어오게 되었다.
    그렇기 때문에 body를 파싱하려면 
    body의 타입이 'json'이면 라우트에 미들웨어로 express.json()을 넣고
    body의 타입이 'x-www-form-urlencoded'라면 라우트에 미들웨어로 express.urlencoded()을 넣고
    body의 타입이 'text'라면 라우트에 미들웨어로 express.text()을 넣는다.
    이외에도 다양한 파싱용 미들웨어를 지원한다.
*/

/* ### 잘못된 코드 
  - 파서나 스트림 없이 body를 읽을수 없다.
*/
app.post('/error', (req, res, next) => {
  console.log(req.body); // undefined : req객체에는 body 필드가 선언되어 있지 않음.
  res.send(req.body);
});

/* ### 방법1를 통해 body읽어온 코드
   - http 모듈을 사용하는 방법과 같다.
 */
app.post('/success1', (req, res, next) => {
  const body = [];
  // 스트림으로 읽기 시작하면 트리거되는 이벤트
  req.on('data', chunk => {
    body.push(chunk);
  });
  // 스트림으로 읽기가 끝나면 트리거되는 이벤트
  req.on('end', () => {
    console.log(body.toString());
    res.header('Content-Type', 'application/json');
    res.send(body.join('').toString());
  });
  // 위 코드는 body의 형식이 json이 아닌경우 json으로 변경시키는 추가적인 작업이 필요하다.
});

/* ### 방법2를 통해 body읽어온 코드
  - express에서 제공하는 미들웨어를 통해 파싱
 */
app.use(express.json()); // 'application/json'를 파싱하는 미들웨어
app.use(express.urlencoded()); // 'application/x-www-form-urlencoded'를 파싱하는 미들웨어
app.post('/success2', (req, res, next) => {
  console.log(req.body);
  res.send(req.body);
});

app.listen(8080);
