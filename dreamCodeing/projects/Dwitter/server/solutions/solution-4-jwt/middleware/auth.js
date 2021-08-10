import jwt, { decode } from 'jsonwebtoken';
import * as userRepository from '../data/auth.js';

// TODO: Make it secure!
const jwtSecretKey = 'Tmkiqod&nGrmn7MS#udJmOlZSv8aZ&K8';
const AUTH_ERROR = { message: 'Authentication Error' };

/* Authorization 헤더란?
   client에서 서버로 인증 정보를 보낼때 사용하는 정식 헤더이다.

   Bearer란?
   Authorization 헤더를 사용하여 인증정보를 요청할 때는 type이 필수로 들어가야한다.
   Bearer는 이때 사용되는 type중 하나이다.

   - Basic : base64로 인코딩된 자격 증명.
   - Bearer : 토큰으로된 인증정보에 사용
   - HOBA : 디지털 서명 기반 인증정보에 사용

   ex) 
   requset Headers = { 
     authorization: 'Bearer ${HEADER.PAYLODE.SIGNATURE}', 
     ... 
   }
 */

/**
 * Auth가 유효한지 확인하는 미들웨어
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns 401 { message }
 * - Authorization 헤더와 Bearer type가 들어있지 않을 때 401 응답
 * - 디코딩이 불가능할 때 401 응답
 * - 디코딩 결과로 나온 id와 일치하는 유저가 없을 때 401 응답
 */
export const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization'); // headers에서 Authoriztion가져온다
  // 1) Authorization 헤더와 Bearer(type) 확인
  if (!(authHeader && authHeader.startsWith('Bearer'))) {
    return res.status(401).json(AUTH_ERROR); // 401 인증 에러
  }

  // jwt 토큰만 가져오기
  const token = authHeader.split(' ')[1];

  // 2) 비밀키를 가지고 토큰을 디코딩(복호화)한다.
  jwt.verify(token, jwtSecretKey, async (err, decoded) => {
    // 디코딩을 할 수 없는 경우 -> 401
    if (err) {
      return res.status(401).json(AUTH_ERROR);
    }
    // id와 일치하는 user가 없는 경우 -> 401
    const user = await userRepository.findById(decoded.id);
    // decoded에는 디코딩된 payload가 담긴다.
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }

    // 3) 유효한 토큰이라면?
    // 다음 미들웨어에서 사용할 수 있도록 req객체에 userId를 추가한다.
    req.userId = user.id; // req.customData
    req.token = token;

    // 4) 다음 미들웨어 호출
    next();
  });
};
