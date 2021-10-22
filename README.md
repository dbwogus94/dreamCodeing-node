# dreamCodeing-node 강의 코드와 Twitter 클론코딩 소스
node + express 강의를 진행하면서 스터디한 코드 저장소 

## 기본적인 node + express 코드
- 경로: dreamDodeing/node

## 프로젝트 코드
- 경로: dreamCodeing-node/dreamCodeing/projects

### 1) ./projects/util
파일 정리 스크립트: node 내장 모듈을 사용하여 작성

### 2) ../Dwitter/server
- ./solutions: Twitter 클론 코딩 강의 코드 - 서버
- ./src: 강의를 보기전 전후로 직접 작성한 코드 
  - 리모트 브랜치를 DB에 따라서 분류
  ```
    1. origin/master - DB로 파일 시스템을 사용
    2. origin/myDB_SQL -  DB로 mysql을 사용
    3. origin/myDB_Sequelize - DB로 Sequelize를 사용
    4. origin/myDB_mongoDB - DB로 mongoDB를 사용
  ``` 


### 3) ../Dwitter/client
- Twitter 클론 코딩 강의 코드 - 클라이언트
- 기본적인 뼈대는 강의에서 제공 Service만 직접 작성
