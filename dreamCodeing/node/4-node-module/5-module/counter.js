let count = 0;

/* export 방법 1) 하나씩 내보내기 */
// export 명령어를 통해 export할 함수를 지정한다.
export function increase() {
  count++;
}

export function getCount() {
  return count;
}
