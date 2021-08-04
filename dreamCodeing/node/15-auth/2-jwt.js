const jwt = require('jsonwebtoken');

// 서버에서 jwt에 사용할 임의 비밀키
// (고유한 값일 수록 좋다. https://www.lastpass.com/password-generator)
// 32길이의 비밀키를 권고한다.
const secret = 'Tmkiqod&nGrmn7MS#udJmOlZSv8aZ&K8';

/* ### 토큰 생성 
  jwt.sing(payload, secretOrPrivateKey, options?);
  - payload: string | Buffer | object, // jwt에 전달할 정보
  - secretOrPrivateKey: Secret,  // 비밀키 
  - options?: SignOptions        // jwt 옵션 : 알고리즘, id, 만료시간 등 설정
 */
const token = jwt.sign(
  {
    // payload가 너무 크면 네트워크 비용 또한 커진다. 필수 값 저장
    id: 'userId',
    isAdmin: true,
  },
  secret,
  { expiresIn: 2 } // 만료시간 설정 : 2초
);

console.log(token);

function verifyToken(token, secret, msg) {
  /* ### 토큰 확인 
    jwt.verify(token, secretOrPublicKey, callback?)
    - token: string,
    - secretOrPublicKey: Secret | GetPublicKeyOrSecret, // jwt를 디코딩할 비밀키
    - callback?: VerifyCallback, 

    VerifyCallback<T = JwtPayload> = (
      err: VerifyErrors | null,     // 에러가 있으면 : VerifyErrors
      decoded: T | undefined,       // 에러없이 디코딩 되면 : JwtPayload
    ) => void;
  */
  return jwt.verify(token, secret, (error, decode) => {
    console.info(msg);
    if (error) {
      console.error(error);
      // 에러가 발생하는 경우
      // 1. 만료된 토큰인 경우 : TokenExpiredError: jwt expired
      // 2. 토큰이 위조(변경)된 경우 : JsonWebTokenError: invalid signature
    }
    if (decode) {
      console.log(decode);
    }
  });
}

// ### 유효한 토큰) 정상적인 결과 출력
verifyToken(token, secret, '[테스트] -> 유효한 토큰 전달 =====================================================');

// ### 위조된 토큰) 에러 발생
const forgery =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InVzZXJJZCI' +
  'sImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2Mjc4NDA2NjUsImV4cCI6MTY' +
  'yNzg0MDY2N30.kK5BjgqFRg798avlI9B4Ke7rcqC97Ejm5RuGt3KxUKQ';
verifyToken(forgery, secret, '\n\n[테스트] -> 위조된 토큰 전달 =====================================================');

// ### 만료된 토큰) 에러 발생
setTimeout(() => {
  verifyToken(token, secret, '\n\n[테스트] -> 만료된 토큰 전달 =====================================================');
}, 3000);
