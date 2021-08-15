import jwt from 'jsonwebtoken';
import * as userService from '../services/userService.js';
import * as tweetService from '../services/tweetService.js';

const AUTH_ERROR = { message: 'Authentication Error' };
/**
 * ### Authentication(인증)
 * 요청 헤더에 jwt 토큰이 유효한지 검사하는 미들웨어
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 * 401 {message}
 * - Authorization 헤더와 Bearer type가 들어있지 않을 때 401 응답
 * - jwt 디코딩이 불가능할 때 401 응답
 * - jwt 디코딩 결과로 나온 id와 일치하는 유저가 없을 때 401 응답
 */
export const isAuth = async (req, res, next) => {
  // 1. 요청에 토큰이 포함된 인증헤더가 있는지 확인
  // 인증헤더 = { "Authorization": "bearer ${jwt}" }
  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader.startsWith('Bearer'))) {
    return res.status(401).json(AUTH_ERROR);
  }
  // 2. jwt가 있다면 유효한지 확인
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    // 유효하지 않다면?
    if (err) {
      return res.status(401).json(AUTH_ERROR);
    }
    // 3. jwt가 유효하다면 payload의 데이터가 유효한지 확인
    const userId = decoded.id; // decoded === payload
    const user = await userService.findById(userId);
    if (!user) {
      return res.status(401).json(AUTH_ERROR);
    }
    // 4. 모두 이상이 없으면 다음 미들웨어에 전달할 값 설정
    req.id = userId;
    req.username = user.username;
    req.token = token;

    // 다음 미들웨어 호출
    next();
  });
};

/**
 * ### Authorization(인가)
 * tweet 작성자 권한이 있는지 확인
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @returns
 * - 404 {message} : 해당 자원이 없음 404응답.
 * - 403 {message} : 작성자가 아니기 때문에 403 응답
 */
export const isWriter = async (req, res, next) => {
  // 요청받은 tweet의 id를 통해 userId를 확인
  const tweetId = req.params.id;
  const tweet = await tweetService.getTweetById(tweetId);
  // 자원이 없다면?
  if (!tweet) {
    return res.status(404).json({ message: `Tweet id(${req.params.id}) not found` });
  }
  // 작성자와 인증된 사용자가 다르다면?
  if (tweet.userId !== req.id) {
    return res.status(403).json({ message: `id(${req.params.id})의 작성자가 아닙니다.` });
  }
  next();
};
