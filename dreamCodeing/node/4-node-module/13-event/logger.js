 const EventEmitter = require('events');
 //const emitter = new EventEmitter();

 /**
  * EventEmitter는 인스턴스마다 정의된 이벤트를 사용한다.
  * 즉, 이벤트가 정의된 인스턴스와, 사용하는 인스턴스가 같아야 한다.
  * 
  * 그렇기 때문에 이벤트를 모듈화 하려면 EventEmitter를 상속한 클래스를 만들고,
  * 모듈을 사용하는 곳에서 상속한 클래스를 인스턴스화 해서 사용해야한다.
  */
 class Logger extends EventEmitter {
   log(callback){
    this.emit('log', 'started...');
    callback();
    this.emit('log', 'ended!');
   }  
 }

 module.exports.Logger = Logger;
 