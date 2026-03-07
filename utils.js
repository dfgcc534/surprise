/* ── 전역 상태 ── */
var state = { currentStep: 1 };
var stepInits = {};

/* ── 화면 전환 ── */
function goToStep(n) {
  var current = document.querySelector('.screen.active');
  if (current) current.classList.remove('active');
  var next = document.getElementById('step-' + n);
  if (next) next.classList.add('active');
  state.currentStep = n;
  if (stepInits[n]) stepInits[n]();
}

/* ── 타이핑 효과 ── */
function typeText(el, text, speed, cb) {
  speed = speed || 60;
  el.textContent = '';
  var i = 0;
  var timer = setInterval(function () {
    el.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(timer);
      if (cb) cb();
    }
  }, speed);
  return timer;
}

/* ── 대사 시퀀스 재생 ── */
// lines: [{text, delay, onStart}]  delay = 타이핑 완료 후 대기 ms
function playLines(el, lines, onAllDone) {
  var idx = 0;
  function next() {
    if (idx >= lines.length) { if (onAllDone) onAllDone(); return; }
    var line = lines[idx];
    if (line.onStart) line.onStart();
    typeText(el, line.text, line.speed || 60, function () {
      idx++;
      setTimeout(next, line.delay || 1200);
    });
  }
  next();
}

/* ── 게임오버 오버레이 ── */
function showGameOver(lines, onDone) {
  var overlay = document.getElementById('gameover-overlay');
  var goText = document.getElementById('go-text');
  var goTitle = document.getElementById('go-title');
  overlay.style.display = 'flex';
  goText.textContent = '';
  goTitle.style.display = 'none';

  var idx = 0;
  function typeLine(text, cb) {
    goText.textContent = '';
    typeText(goText, text, 50, cb);
  }

  function next() {
    if (idx >= lines.length) {
      setTimeout(function () {
        goText.textContent = '';
        goTitle.style.display = 'block';
        setTimeout(function () {
          goTitle.style.display = 'none';
          overlay.style.display = 'none';
          if (onDone) onDone();
        }, 3000);
      }, 1500);
      return;
    }
    typeLine(lines[idx], function () { idx++; setTimeout(next, 1000); });
  }
  next();
}

/* ── confetti 생성 ── */
function spawnConfetti(count) {
  count = count || 30;
  var symbols = ['❤', '⭐', '✨', '🎂', '🎉'];
  for (var i = 0; i < count; i++) {
    var el = document.createElement('span');
    el.className = 'confetti';
    el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (2 + Math.random() * 2) + 's';
    el.style.animationDelay = (Math.random() * 2) + 's';
    document.body.appendChild(el);
    (function (e) {
      setTimeout(function () { e.remove(); }, 6000);
    })(el);
  }
}
