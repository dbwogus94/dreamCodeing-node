/**
 * ### buffer
 * - Fixed-size chuck of memory : 고정된 크기의 메모리 덩어리
 * - array of integers  : 숫자 배열의 형태 
 * - byte of data : 데이터의 바이트 그 자체를 가리킨다.
 * 
 * 버퍼는 문자열이 될 수도, 숫자가 될 수도 있다. 
 * 데이터를 로우 형태로 메모리에 있는 데이터 형태로 
 * 바이트 단위로 처리할 수 있게 해준다.
 */
const buf = Buffer.from('Hi');  

// node가 API를 찾아주지 않을때 fs를 import 하면 된다.
const fs = require('fs');

// 버퍼배열
console.log(buf);               // >>> <Buffer 48 69> : 유니코드로 출력
// 배열 길이
console.log(buf.length);        // >>> 2

// 배열의 원소에 접근하여 출력하면 아스키 코드로 출력된다.
console.log(buf[0]);            // >>> 72
console.log(buf[1]);            // >>> 105

/* toString() : 버퍼를 문자열로 변환 */
console.log(buf.toString());          // >>> Hi

// toString()의 API를 확인하면 첫 번째 인자로 인코딩을 받는다.
console.log(buf.toString('utf8'));    // 디폴트 utf-8


/* create : 버퍼를 생성하여 사용할 수 있다. */
/* alloc() : 
  사용하지 않는 메모리를 초기화 하여 버퍼로 만든다. */
const buf2 = Buffer.alloc(2);   // 크기가 2인 버퍼 생성
buf2[0] = 72;
buf2[1] = 105;
console.log(buf2);
console.log(buf2.toString());

/* allocUnsafe() : 
  사용하지 않는 메모리를 초기화 하지 않고 버퍼로 만든다. 
  - 초기화 하지 않기 때문에 조금 더 빠르다.*/
const buf3 = Buffer.allocUnsafe(2);
console.log(buf3);

/* copy : 버퍼를 다른 버퍼에 복사 */
buf2.copy(buf3);
console.log(buf3.toString());

/* concat : 여러 버퍼를 하나로 모을 수 있다. */
const newBuf = Buffer.concat([buf, buf2, buf3]);
console.log(newBuf.toString());

/* 추가 : buffer 배열을 join으로 합치면 자동으로 toString()가 된다. */
console.log([buf, buf2, buf3].join(''));