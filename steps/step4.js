function initStep4() {
  var textEl = document.getElementById('step4-text');
  var catImg = document.getElementById('step4-cat');
  var catMail = document.getElementById('step4-mail');
  var letterWrap = document.getElementById('step4-letter');

  catImg.src = 'assets/me/stand_cat.png';
  catMail.style.display = 'none';
  letterWrap.style.display = 'none';

  var lines = [
    { text: '확인되었습니다...', delay: 1200 },
    { text: '오래 기다리셨죠...', delay: 1200 },
    { text: '소중히 전달해 드리라고 했어요', delay: 1500 }
  ];

  playLines(textEl, lines, function () {
    catImg.src = 'assets/me/Untitled.png';
    catMail.style.display = 'block';
    typeText(textEl, '여기요...', 100, function () {
      setTimeout(function () {
        catMail.style.display = 'none';
        letterWrap.style.display = 'flex';
        textEl.textContent = '';
      }, 1200);
    });
  });

  letterWrap.onclick = function () {
    goToStep(5);
  };
}

stepInits[4] = initStep4;
