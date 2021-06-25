/**
 * EventEmitter를 상속한 Logger 클래스를 export한다.
 */
const Logger = require('./logger.js').Logger;
// Logger을 인스턴스화 한다.
const emitter = new Logger();

// EventEmitter를 상속한 클래스의 인스턴스에서 이벤트 정의
emitter.on('log', (event) => {
  console.log(event);
});


/**
 * EventEmitter를 상속한 클래스의 인스턴스에서 이벤트 사용한다.
 * - Logger클래스의 log메서드에 emit('log')이 정의되어 있다.
 */ 
emitter.log(() => {
  console.log('...... doing something!');
});

/*
  ### 정리:
  이벤트 정의 : 'log'명을 가진 이벤트는 main.js에서 정의함.
  이벤트 사용 : logger.js의 Logger클래스의 log메서드에서 사용한다.

  어떻게 연결되었을까?
  EventEmitter는 인스턴스마다 이벤트 정의와 사용이 연결된다.
  Logger 클래스는 EventEmitter을 상속하였다.
  main.js에서 Logger을 인스턴스화 했다.
  
  결국 main.js에서 EventEmitter를 인스턴스화 해서 사용한 것이다. 
  그렇기 때문에 이벤트 정의와 사용이 연결된 것이다.

*/