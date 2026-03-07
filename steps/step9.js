function initStep9() {
  var mailImg = document.getElementById('step9-mail');
  var clickLabel = document.getElementById('step9-click');
  var letterWrap = document.getElementById('step9-letter-wrap');
  var paper = document.getElementById('step9-paper');
  var paperText = document.getElementById('step9-text');
  var finale = document.getElementById('step9-finale');

  paper.style.display = 'none';
  finale.style.display = 'none';
  mailImg.src = 'assets/mail/제목 없음 (17).png';
  clickLabel.style.display = 'inline';

  letterWrap.onclick = function () {
    letterWrap.onclick = null;
    clickLabel.style.display = 'none';

    // 봉투 열기
    mailImg.src = 'assets/mail/제목 없음 (14).png';

    setTimeout(function () {
      letterWrap.style.display = 'none';
      paper.style.display = 'flex';

      // 편지 내용 로드
      fetch('assets/letter.txt')
        .then(function (r) { return r.text(); })
        .then(function (text) {
          typeText(paperText, text || '편지 내용을 작성해주세요', 80, function () {
            setTimeout(function () {
              finale.style.display = 'block';
              spawnConfetti(50);
            }, 1500);
          });
        })
        .catch(function () {
          typeText(paperText, '편지 내용을 작성해주세요', 80, function () {
            setTimeout(function () {
              finale.style.display = 'block';
            }, 1500);
          });
        });
    }, 1000);
  };
}

stepInits[9] = initStep9;
