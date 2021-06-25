/**
 * ### events 커스텀 이벤트를 지원하는 모듈
 */
const EventEmitter = require('events'); 
const emitter = new EventEmitter();


/**
 * ### 이벤트 정의
 */
// ellie명의 이벤트 2개 정의
emitter.on('ellie', (args) => {           // API에 args는 any[]로 정의됨
  console.log('first callback - ', args);
});
emitter.on('ellie', (args) => {
  console.log('second callback - ', args);
});

/** 
 * ### 이벤트 실행
 * - 첫 인자 : 트리거할 이벤트 명
 * - 다음 인자: callback에 전달할 인자 -> args에 전달
 */
emitter.emit('ellie', {message : 1});
emitter.emit('ellie', {message : 2});
emitter.emit('ellie', {message : 3});

/**
 * ### 특정 이벤트 제거  
 * - 이벤트를 정의할 때 사용한 callback가 익명이면 안된다.
 */
const callback = (args) => { console.log('Third callback - ', args);}

// 'ellie'명 이벤트 추가
emitter.on('ellie', callback);

emitter.emit('ellie', {message : 1});

/* 'ellie'로 정의된 특정 이벤트 제거 -> callback를 통해 찾는다. */
emitter.removeListener('ellie', callback)
emitter.emit('ellie', {message : 2});

/* 'ellie' 정의된 이벤트 모두 제거 */ 
emitter.removeAllListeners('ellie');
emitter.emit('ellie', {message : 3});

