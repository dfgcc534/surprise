function initStep1() {
  var textEl = document.getElementById('step1-text');
  var btns = document.getElementById('step1-btns');
  var btnYes = document.getElementById('btn-yes');
  var btnNo = document.getElementById('btn-no');

  btns.style.display = 'none';

  var lines = [
    { text: '저기...', delay: 1000 },
    { text: '배달... 왔는데요...', delay: 1000 },
    { text: '혹시... 이가윤 씨 맞으세요?', delay: 1200 },
    { text: '편지를 받으시겠습니까?' }
  ];

  playLines(textEl, lines, function () {
    btns.style.display = 'flex';
  });

  btnYes.onclick = function () { goToStep(2); };
  btnNo.onclick = function () {
    btns.style.display = 'none';
    typeText(textEl, '...받아주세요', 80, function () {
      btns.style.display = 'flex';
    });
  };
}

stepInits[1] = initStep1;
