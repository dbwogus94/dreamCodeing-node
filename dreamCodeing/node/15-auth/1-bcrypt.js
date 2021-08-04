const bcrypt = require('bcrypt');

// 입력받은 pw
const password = 'abcd1234';
// 비용(키 스트레칭 횟수)를 전달 -> 2^rounds
// 비용을 너무 올리게 되면 그 많큼 딜레이가 발생한다. 때문에 10에서 12를 권고하고 있다.
const saltRounds = 10;

// ## 테스트 1) bcrypt 해싱 과정
async function hashing(password, saltRounds) {
  let salt = await bcrypt.genSalt(saltRounds); // salt 생성: $2b$10$MxdT4oZXY8WiZ7q9c8ZHHO
  /* ### 생성 된 salt는 $를 기준으로 구분되어 의미를 가진다.
    1. 버전 : 2b
    2. 라운드 : 10
    3. 실제 22자의 salt : MxdT4oZXY8WiZ7q9c8ZHHO */
  console.log('테스트 1) salt', salt);

  // 같은 salt를 사용하기 때문에 hash의 결과는 동일하다.
  for (let i = 0; i < 5; i++) {
    let hash = await bcrypt.hash(password, salt); // pw와 salt를 사용하여 hash를 만든다.

    /* ### hash는 인자로 받은 salt의 정보를 사용하여 처리된다. 
      1. salt가 가진 버전 정보를 가지고 해시 알고리즘 종류를 선택 (= 2b)
      2. salt가 가진 라운드 정보를 통해 키 스트레칭 횟수를 정한다. (= 2^10)
      3. '실제 22자 salt'와 password를 더한 값을 최종적으로 헤싱한다.( = 'MxdT4oZXY8WiZ7q9c8ZHHOabcd1234')
      즉, hash결과는 ('MxdT4oZXY8WiZ7q9c8ZHHO' + 'abcd1234')를 2b버전의 헤시함수로 2^10번 돌린 결과이다.*/
    console.log('테스트 1) hash', hash);
  }
}
//hashing(password, saltRounds);

// ## 테스트2) 비동기로 genSalt없이 한번에 해싱 처리
// bcrypt.hash(password, saltRounds).then(hash => {
//   //console.log('테스트 2) 결과: ', hash);
// });

// ## 테스트 3) 같은 salt를 라운드만 다르게 처리하기
const a = bcrypt.hashSync(password, '$2b$10$MxdT4oZXY8WiZ7q9c8ZHHO');
console.log('테스트 3) a결과: ', a);
const b = bcrypt.hashSync(password, '$2b$11$MxdT4oZXY8WiZ7q9c8ZHHO');
console.log('테스트 3) b결과: ', b);
const c = bcrypt.hashSync(password, '$2b$12$MxdT4oZXY8WiZ7q9c8ZHHO');
console.log('테스트 3) c결과: ', c);

// ## 테스트4) 암호화된 값과 원본값이 같은지 비교
const hashed = bcrypt.hashSync(password, saltRounds); // hash(), hashSync
console.log(`테스트 4) 해싱: password: ${password}, hashed: ${hashed}`);

// 비교 값
const input = 'abcd1234';
// 비교 실행
const result = bcrypt.compareSync(input, hashed);
console.log(`테스트 4) 비교 결과: ${result}`);
