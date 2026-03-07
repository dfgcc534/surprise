function initStep6() {
  var textEl = document.getElementById('step6-text');
  var btns = document.getElementById('step6-btns');
  var youWrap = document.getElementById('step6-you-wrap');
  var youImg = document.getElementById('step6-you');

  btns.style.display = 'none';
  youWrap.style.display = 'none';
  textEl.textContent = '';

  // 가윤이 슬라이드 인
  setTimeout(function () {
    youWrap.style.display = 'block';
    youWrap.style.animation = 'slideInLeft 0.6s ease forwards';
    youImg.src = 'assets/you/image.png';

    var lines = [
      {
        text: '울지 마...',
        delay: 1200
      },
      {
        text: '내가 꼭 찾아줄게!',
        onStart: function () {
          youImg.src = 'assets/you/image copy 2.png';
        }
      }
    ];

    playLines(textEl, lines, function () {
      btns.style.display = 'flex';
    });
  }, 800);

  document.getElementById('btn-go').onclick = function () {
    goToStep(7);
  };
}

stepInits[6] = initStep6;
