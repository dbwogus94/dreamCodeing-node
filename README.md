# dreamCodeing-node 강의, 스터디 저장소

## 소개
- node + express 강의 코드와 강의를 진행하면서 스터디한 코드를 저장하는 저장소입니다.
- 기본적인 nodejs, express 사용법과 실습 프로젝트를 통한 express 서버를 다루는 방법을 정리합니다.

## 정리한 내용
1. node.js 내장 모듈과 express 사용법 정리
  - 경로: dreamDodeing/node
2. node.js 내장 모듈을 활용한 이미지 정리 스크립트
  - 경로: dreamDodeing/projects/util
3. express를 사용한 Twitter 클론코딩
  - 경로: dreamDodeing/projects/Dwitter

## 기술 스택
- <code>node.js</code> + <code>express</code>
- <code>mysql</code> + <code>Sequelize</code> 
- <code>mongo</code>
- <code>Socket</code>

## 브랜치 구분
1. origin/master - Dwitter 프로젝트 DB 파일 시스템을 사용
2. origin/myDB_SQL - Dwitter 프로젝트 DB mysql2 모듈을 사용
3. origin/myDB_Sequelize - Dwitter 프로젝트 DB mysql + Sequelize를 사용
4. origin/myDB_mongoDB - Dwitter 프로젝트 DB mongoDB를 사용


## Dwitter에서 사용하는 REST API
### auth
- <code>POST</code> /auth/signup
  - 회원가입
- <code>POST</code> /auth/login
  - 로그인 + jwt 발급
- <code>GET</code> /auth/me
  - jwt 토큰 만료 확인
- <code>GET</code> /auth/logout
  - 로그아웃

### tweets
- <code>GET</code> /tweets
  - 전체 트윗 요청
- <code>GET</code> /tweets?username=:username
  - 특정 유저의 모든 트윗 요청
- <code>GET</code> /tweets/:id
  - 특정 트윗 요청
- <code>POST</code> /tweets
  - 트윗 생성
- <code>PUT</code> /tweets/:id
  - 특정 트윗 수정
- <code>DELETE</code> /tweets/:id
  - 특정 트윗 삭제
