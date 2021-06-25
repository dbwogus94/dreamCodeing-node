const fs = require('fs');
// 절대경로 리턴
const util = require('../10-file/util.js').joinName;  
// 압축에 사용하는 라이브러리
const zlib = require('zlib');  

/**
 * ### 기본 파이핑
 * 읽기 스트림과 쓰기 스트림을 연결해서 데이터 파이프관을 만든다.
 */
// 읽기 스트림
const readStream = fs.createReadStream(util(__dirname,'file.txt'));
// 쓰기 스트림
const writeStream = fs.createWriteStream(util(__dirname, 'file3.txt'));
// pipe() : pipe를 이용하여 읽기 스트림 쓰기 스트림 연결
const piping = readStream.pipe(writeStream);

// 쓰기가 완료 되면 호출
piping.on('finish', () => {
  console.log('done!!');
});

/** 
 * ### 압축을 사용한 파이핑
 * 읽기 스트림 + 압축 + 쓰기 스트림을 파이핑 한다.
 */
// 읽기 스트림
const readStream = fs.createReadStream(util(__dirname,'file.txt'));
// 압푹 스트림
const zlibStream = zlib.createGzip();
// 쓰기 스트림
const writeStream = fs.createWriteStream(util(__dirname, 'file4.zip'));

// 파이핑 : pipe를 이용하여 읽기 스트림 + 압축 스트림 + 쓰기 스트림 연결
const zlibPiping = readStream.pipe(zlibStream).pipe(writeStream);

// 쓰기가 완료 되면 호출
piping2.on('finish', () => {
  console.log('zlibPiping done!!');
});
