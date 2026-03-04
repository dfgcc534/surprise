import { goToStep } from '../utils.js';

const INITIAL_TEXT = '편지를 받으시겠습니까?';
const NO_TEXT = '...눌러줘';

function typeText(el, text, speed = 80) {
  el.textContent = '';
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

export function initStep1() {
  const textEl = document.getElementById('step1-text');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');

  typeText(textEl, INITIAL_TEXT);

  btnYes.addEventListener('click', () => {
    goToStep(2);
  });

  btnNo.addEventListener('click', () => {
    typeText(textEl, NO_TEXT);
  });
}
