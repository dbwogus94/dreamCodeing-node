import express from 'express';
const app = express();

/* ### CORS 정책 
  브라우저에는 CORS(Cross Origin Resource Sharing) 정책이 있다.
  - 클라이언트와 서버가 동일한 IP에서 동작하고 있다면 리소스를 제약없이 주고 받을 수 있다.
  - 만약 클라이언트가 다른 IP를 가진 도메인에 리소스를 요청한다면 원칙적으로는 
    그 어떤 데이터도 주고 받을 수 없다. 이것이 CORS 정책이다.

  ### 브라우저에서 CORS 정책을 동작하는 순서
    1. 브라우저는 클라이언트에서 다른 IP주소를 가진 서버에 요청 메세지를 보낸다.
    2. 서버는 요청에 따른 응답 메세지를 클라이언트로 보낸다.
    3. 응답 메세지가 클라이언트에게 도착하면 브라우저는 해당 메세지를 검사한다.
    4. 이 때 **IP가 다르다면 해당 응답을 폐기한다.**
        
  ### CORS 정책을 허용하는 방법 
  CORS 정책에도 예외가 존재한다.
  - 예외 방법은 서버에서 응답메세지를 보낼 때 "Access-Control-Allow-Origin" 헤더를 넣는 것이다.
  - 서버에서 "Access-Control-Allow-Origin" 헤더를 넣으면 브라우저는 
    다른 IP주소에서 응답된 메세지라도 폐기하지 않고 브라우저에 출력한다.
*/

app.use((req, res, next) => {
  res.setHeader(
    'Access-Control-Allow-Origin', // CORS 정책 허용
    'http://127.0.0.1:5500' // 허용하는 클라이언트 ip 주소
  );
  res.setHeader(
    'Access-Control-Allow-Methods', // CORS 정책 허용 Method 설정 헤더
    'OPTIONS, GET, POST, PUT, DELETE' //
  );
  next();
});

app.get('/', (req, res) => {
  res.send('Welcome!!');
});

app.listen(8080);
