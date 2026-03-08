function initStep8() {
  var textEl = document.getElementById('step8-text');
  var btns = document.getElementById('step8-btns');

  btns.style.display = 'none';
  textEl.textContent = '';

  // confetti
  spawnConfetti(40);

  typeText(textEl, 'SIUUUUUU', 90, function () {
    btns.style.display = 'flex';
  });

  document.getElementById('btn-open').onclick = function () {
    goToStep(9);
  };
}

stepInits[8] = initStep8;
