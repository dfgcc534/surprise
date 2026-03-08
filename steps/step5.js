function initStep5() {
  var textEl = document.getElementById('step5-text');
  var catImg = document.getElementById('step5-cat');
  var mailImg = document.getElementById('step5-mail');
  var villainWrap = document.getElementById('step5-villain');
  var screen = document.getElementById('step-5');

  // 초기 상태 — 고양이가 편지를 들고 있음
  catImg.src = 'assets/me/Untitled.png';
  mailImg.style.display = '';
  mailImg.style.transform = 'translateX(-50%)';
  mailImg.style.opacity = '1';
  mailImg.className = 'step5-mail';
  villainWrap.style.display = 'none';
  textEl.textContent = '';

  // 1) 화면 흔들림 + 빨간 플래시
  screen.classList.add('shake');
  screen.classList.add('red-flash');
  setTimeout(function () {
    screen.classList.remove('shake');
    screen.classList.remove('red-flash');
  }, 600);

  // 2) 악당 슬라이드 인
  setTimeout(function () {
    villainWrap.style.display = 'block';
    typeText(textEl, '가윤이는 내 꺼야!!!', 50, function () {
      // 3) 편지가 고양이 손에서 악당 쪽으로 빨려감
      setTimeout(function () {
        mailImg.classList.add('mail-snatch');
        setTimeout(function () {
          mailImg.style.display = 'none';
          mailImg.classList.remove('mail-snatch');
          // 4) 고양이 울기
          catImg.src = 'assets/me/IMG_3052.PNG';
          typeText(textEl, '으아아...', 120, function () {
            // 5) 자동 전환
            setTimeout(function () { goToStep(6); }, 2500);
          });
        }, 800);
      }, 1000);
    });
  }, 800);
}

stepInits[5] = initStep5;
