function initStep2() {
  var textEl = document.getElementById('step2-text');
  var btns = document.getElementById('step2-btns');
  var catImg = document.getElementById('step2-cat');

  btns.style.display = 'none';
  catImg.src = 'assets/me/stop_cat.png';

  var lines = [
    { text: '잠깐만요!', delay: 1200 },
    { text: '수령 확인이 필요합니다', delay: 1200 },
    {
      text: '몇 가지 질문에 답해주시겠어요?',
      onStart: function () {
        catImg.src = 'assets/me/IMG_3053.PNG';
      }
    }
  ];

  playLines(textEl, lines, function () {
    btns.style.display = 'flex';
  });

  document.getElementById('btn-quiz').onclick = function () {
    goToStep(3);
  };

  document.getElementById('btn-refuse').onclick = function () {
    document.getElementById('step2-normal').style.display = 'none';
    showGameOver([
      '고양이는 잠시 멈추더니 눈물을 한 방울 흘렸습니다.',
      '그 눈물이 땅에 닿는 순간, 반경 5m 이내의 모든 생명체가 귀여움 과부하로 즉사했습니다.',
      '당신도 그 안에 있었습니다.'
    ], function () {
      document.getElementById('step2-normal').style.display = '';
      goToStep(1);
    });
  };
}

stepInits[2] = initStep2;
