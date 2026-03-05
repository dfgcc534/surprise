// 이 파일은 참조용. 실제 실행은 index.html 인라인 스크립트에서 동작합니다.
// index.html과 동일한 로직을 유지하세요.

import { goToStep } from '../utils.js';

const LINES = [
  '잠깐!',
  '네가 내 여친이 맞는지 확인해야겠어!',
  '내 여친이라면 이정도 퀴즈는 쉽게 풀수 있을 거야',
];

export function initStep2() {
  const textEl = document.getElementById('step2-text');
  const btns   = document.getElementById('step2-btns');
  let timers   = [];

  function clearTimers() {
    timers.forEach(t => { clearInterval(t); clearTimeout(t); });
    timers = [];
  }

  function typeLine(text, onDone) {
    textEl.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      textEl.textContent += text[i];
      i++;
      if (i >= text.length) { clearInterval(t); if (onDone) onDone(); }
    }, 80);
    timers.push(t);
  }

  clearTimers();
  btns.style.display = 'none';

  typeLine(LINES[0], () => {
    const t1 = setTimeout(() => {
      typeLine(LINES[1], () => {
        const t2 = setTimeout(() => {
          typeLine(LINES[2], () => {
            btns.style.display = 'flex';
          });
        }, 1500);
        timers.push(t2);
      });
    }, 1500);
    timers.push(t1);
  });

  document.getElementById('btn-quiz').onclick   = () => goToStep(3);
  document.getElementById('btn-refuse').onclick = () => goToStep(3);
}
