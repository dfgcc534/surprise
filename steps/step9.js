function initStep9() {
  var mailImg = document.getElementById('step9-mail');
  var clickLabel = document.getElementById('step9-click');
  var letterWrap = document.getElementById('step9-letter-wrap');
  var topArea = document.getElementById('step9-top');
  var paper = document.getElementById('step9-paper');
  var paperText = document.getElementById('step9-text');
  var finale = document.getElementById('step9-finale');

  paper.style.display = 'none';
  paper.classList.remove('fade-in');
  finale.style.display = 'none';
  topArea.style.display = '';
  letterWrap.style.display = '';
  letterWrap.style.opacity = '1';
  mailImg.src = 'assets/mail/image copy 3.png';
  clickLabel.style.display = 'inline';

  letterWrap.onclick = function () {
    letterWrap.onclick = null;
    clickLabel.style.display = 'none';

    // 봉투 열기
    mailImg.src = 'assets/mail/image.png';

    // 봉투 + 상단 영역 페이드아웃
    setTimeout(function () {
      topArea.classList.add('fade-out');

      setTimeout(function () {
        topArea.style.display = 'none';
        topArea.classList.remove('fade-out');

        // 편지지 페이드인
        paper.style.display = 'flex';
        paper.classList.add('fade-in');

        // 편지 내용
        var letterContent = '가윤이에게\n\n다음에는 꼭 더 멋지고 완벽한 서프라이즈 준비할게\n늘 사랑하고 생일 축하해!!!\n\n너를 사랑하는 남자친구가';
        typeText(paperText, letterContent, 80, function () {
          setTimeout(function () {
            finale.style.display = 'block';
            spawnConfetti(50);
          }, 1500);
        });
      }, 800);
    }, 1000);
  };
}

stepInits[9] = initStep9;
