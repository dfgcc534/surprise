var quizzes = [
  { q: '안세호는 이가윤을 사랑합니까?', answer: 'y' },
  { q: '이가윤은 안세호를 사랑합니까?', answer: 'y' },
  { q: '14cm 이상?', answer: 'y' }
];

function initStep3() {
  var textEl = document.getElementById('step3-text');
  var btns = document.getElementById('step3-btns');
  var btnY = document.getElementById('btn-y');
  var btnN = document.getElementById('btn-n');
  var idx = 0;

  function showQuiz() {
    btns.style.display = 'none';
    typeText(textEl, quizzes[idx].q, 50, function () {
      btns.style.display = 'flex';
    });
  }

  function onAnswer(choice) {
    btns.style.display = 'none';
    if (choice === quizzes[idx].answer) {
      idx++;
      if (idx >= quizzes.length) {
        typeText(textEl, '통과!', 60, function () {
          setTimeout(function () { goToStep(4); }, 1000);
        });
      } else {
        showQuiz();
      }
    } else {
      goToStep('3f');
    }
  }

  idx = 0;
  btnY.onclick = function () { onAnswer('y'); };
  btnN.onclick = function () { onAnswer('n'); };
  showQuiz();
}

stepInits[3] = initStep3;

/* Step 3-F: 퀴즈 실패 */
function initStep3F() {
  var textEl = document.getElementById('step3f-text');
  typeText(textEl, '...아니였나', 80, function () {
    setTimeout(function () {
      typeText(textEl, '어딜 속이려고!', 60, function () {
        setTimeout(function () {
          showGameOver([], function () {
            goToStep(1);
          });
        }, 1500);
      });
    }, 1000);
  });
}

stepInits['3f'] = initStep3F;
