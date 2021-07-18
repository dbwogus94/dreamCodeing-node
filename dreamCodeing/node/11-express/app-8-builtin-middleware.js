import express from 'express';
const app = express();

/* # express에서 제공하는 내장 미들웨어 
   예전 버전의 express에서는 아래 같은 미들웨어가 내장되지 않았다.
   하지만 점차 버전이 올라가면서 많은 미들웨어가 편의성에 의해 포함되었다.
*/

/* ## express.json()
  'application/json'타입의 데이터를 파싱하는데 사용하는 미들웨어
*/
app.use(express.json()); // REST API -> Body

/*  
 ## express.urlencoded() 미들웨어 
 urlencoded 미들웨어는 'application/x-www-form-urlencoded' 타입의 데이터 파싱에 사용한다.

 ### 'application/x-www-form-urlencoded' 이란?
  form태그에서 method를 post로 설정하고, submit으로 서버로 요청을 하게되면 
  post의 요청의 body에는 'application/x-www-form-urlencoded' 타입의 데이터가 담겨서 온다.  

 ### express.urlencoded()을 사용하면 경고 메세지가 출력된다.
  "body-parser deprecated undefined extended: provide extended option"
  -> urlencoded() 더 이상 사용하지 않고, 확장 옵션을 사용하라는 메세지이다.

  ### 확장 옵션을 사용하는 방법
  1. express.urlencoded({ extended: true });
    -> true :  qs library를 사용한다.
  2. express.urlencoded({ extended: false });  
    -> false : querystring library를 사용한다.

  ### qs library VS querystring library
  qs library가 보안부터 더 많은 유틸을 제공하는 라이브러리이다.
 */
app.use(express.urlencoded({ extended: true })); // HTML From -> Body

/* ## express.static() 미들웨어
  정적 파일을 관리하는 미들웨어이다.
  - 인자로 전달된 경로의 폴더를 static 미들웨어가 관리한다.
  - 그리고 static 미들웨어가 관리하는 폴더안에 파일은 웹에서 접근 할 수 있다.
  - 즉, 파일을 응답하기 위한 일련의 과정을 express가 해주는 것이다.
  - 옵션을 통해 관리도 가능하다.
 */
const options = {
  dotfiles: 'ignore', // 숨긴 파일은 접근 제한
  etag: false,
  index: false,
  maxAge: '1d', // 캐시는 1일
  redirect: false,
  // 응답시 마다 추가할 헤더 정의
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now());
  },
};
app.use(express.static('public', options));

app.listen(8080);
