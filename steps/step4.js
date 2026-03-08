function initStep4() {
  var textEl = document.getElementById('step4-text');
  var catImg = document.getElementById('step4-cat');
  var mailArea = document.getElementById('step4-mail-area');

  catImg.src = 'assets/me/stand_cat.png';
  mailArea.style.display = 'none';

  var lines = [
    { text: '확인되었습니다...', delay: 1200 },
    { text: '오래 기다리셨죠...', delay: 1200 },
    { text: '소중하게 보관했어요..', delay: 1500 }
  ];

  playLines(textEl, lines, function () {
    catImg.src = 'assets/me/Untitled.png';
    typeText(textEl, '여기요...', 100, function () {
      mailArea.style.display = 'flex';
      textEl.textContent = '';
    });
  });

  mailArea.onclick = function () {
    goToStep(5);
  };
}

stepInits[4] = initStep4;
