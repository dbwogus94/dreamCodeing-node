import express from 'express';
const router = express.Router();

/* ### req.cookies 읽기 
  - cookies도 body와 마찬가지로 req에 정의되어 있지 않다. (res.cookies == undefined)
  - 요청이 들어오면 cookie-parser 미들웨어가 Cookie를 파싱하여
    req.cookies를 생성한다. (res.cookies == [Object: null prototype] {}) */
router.get('/', (req, res, next) => {
  console.log('[Cookies]', req.cookies);
  const msg = Object.keys(req.cookies).length !== 0 ? JSON.stringify(req.cookies) : 'No cookies';
  res.send('cookies : ' + msg);
});

/* ### 쿠키 등록 */
router.post('/', (req, res, next) => {
  // 옵션 확인 ->  http://expressjs.com/en/4x/api.html#res.cookie
  const options = {
    expires: new Date(Date.now() + 8 * 3600000), // 만료 날짜(시간) 설정 : +8시간
    httpOnly: true, // 해당 쿠키는 웹에서만 접근할 수 있게 설정
  };
  res
    .status(201) //
    .cookie('yummy_cookie', 'choce', options)
    .cookie('tasty_cookie', 'strawberry', options)
    .redirect(301, '/cookies');
});

/* ### 쿠키 제거 
  쿠키 제거 방법
  - 쿠키는 브라우저가 가지고 있다.
    즉, 서버에서 쿠키를 제거한다고 브라우저가 가진 쿠키가 제거되는 것이 아니다.
  - 모든 쿠키는 만료시간이 있다.
    서버에서 특정 쿠키를 제거 하려면 요청 메세지에 담긴 
    특정 쿠키의 만료시간을 과거로( ex)1970 ) 돌리면 된다.

  쿠키 제거를 하는 순서
  1. res.clearCookie(${key}) 메서드를 호출한다.
    (이 코드를 호출하는 것으로 쿠키가 제거되지는 않는다.)
  2. 메서드가 호출되면 인자로 받은 쿠키의 만료 시간을 과거로 설정하고 응답 메시지에 추가한다.
    ( ${key}; Expires=Thu, 01 Jan 1970 00:00:00 GMT )
  3. 브라우저는 응답 받은 메시지를 통해 만료된 쿠키가 있는지 검사한다.
  4. 만료된 쿠키가 있다면 해당 쿠키를 저장소에서 제거한다.
  5. 그리고 다음 요청 메시지 부터는 해당 쿠키는 제거되어 요청된다.
*/
router.delete('/', (req, res, next) => {
  console.log('delete');
  // 모든 쿠키 제거 => 모든 쿠키 만료시간 과거로 설정
  Object.keys(req.cookies).forEach(key => {
    res.clearCookie(key);
  });
  res.sendStatus(201);
  // Q) 여기서 만약 get '/cookies'로 redirect하면 쿠키는 어떻게 될까?
  // A) 쿠키는 브라우저에 저장되있다. 때문에 redirect하면
  //    redirect를 처리하는 라우트에서는 아직 쿠키가 존재한 상태로 있게 된다.
});

export default router;
