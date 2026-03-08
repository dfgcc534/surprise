function initStep7() {
  var canvas = document.getElementById('run-canvas');
  var ctx = canvas.getContext('2d');
  var heartsEl = document.getElementById('run-hearts');
  var progressFill = document.getElementById('run-progress-fill');

  // ── 게임 설정 ──
  var GROUND_OFFSET = 96;
  var PLAYER_Y_OFFSET = 24;
  var CLEAR_DISTANCE = 3000;
  var BASE_SPEED = 11.25;
  var SPEED_INCREASE = 0.0012;
  var INVINCIBLE_MS = 1000;
  var GRAVITY = 0.96;
  var JUMP_FORCE = -20;

  // 플레이어 크기
  var P_W = 144;
  var P_H = 198;
  var P_SLIDE_W = 198;
  var P_SLIDE_H = 96;

  // 악당 크기
  var VILLAIN_W = 126;
  var VILLAIN_H = 168;

  // ── 스프라이트 로드 ──
  var sprites = {};
  var spriteList = {
    run1: 'assets/you/jumping/image copy 3.png',
    run2: 'assets/you/jumping/run2.png',
    jump1: 'assets/you/jumping/image.png',
    jump2: 'assets/you/jumping/image copy.png',
    jump3: 'assets/you/jumping/image copy 2.png',
    jump4: 'assets/you/jumping/image copy 4.png',
    slide1: 'assets/you/sliding/image.png',
    slide2: 'assets/you/sliding/image copy.png',
    slide3: 'assets/you/sliding/image copy 2.png',
    die1: 'assets/you/die/image.png',
    die2: 'assets/you/die/image copy.png',
    villain: 'assets/bad/제목 없음 (6).png'
  };

  // 지상 장애물 — 개별 크기 (×1.2)
  var groundObsDefs = [
    { src: 'assets/obstacle/ground/image.png',        w: 132, h: 84  },  // 0: 그루터기
    { src: 'assets/obstacle/ground/image copy.png',    w: 108, h: 78  },  // 1: 뱀
    { src: 'assets/obstacle/ground/image copy 2.png',  w: 96,  h: 179 },  // 2: 선인장
    { src: 'assets/obstacle/ground/image copy 3.png',  w: 132, h: 179 },  // 3: 나무
    { src: 'assets/obstacle/ground/image copy 4.png',  w: 90,  h: 132 },  // 4: 변기
    { src: 'assets/obstacle/ground/image copy 5.png',  w: 144, h: 90  },  // 5: 레이저고양이
    { src: 'assets/obstacle/ground/image copy 6.png',  w: 120, h: 54  },  // 6: 바나나껍질
    { src: 'assets/obstacle/ground/image copy 7.png',  w: 126, h: 114 },  // 7: 바위
    { src: 'assets/obstacle/ground/image copy 8.png',  w: 96,  h: 108 },  // 8: 버섯
    { src: 'assets/obstacle/ground/image copy 9.png',  w: 108, h: 102 },  // 9: 얼음
    { src: 'assets/obstacle/ground/IMG_3047 2.PNG',    w: 168, h: 174 }   // 10: 호날두(슬라이딩)
  ];

  // 공중 장애물 — 개별 크기 (×1.2)
  var skyObsDefs = [
    { src: 'assets/obstacle/sky/image.png',        w: 132, h: 108 },  // 0: UFO
    { src: 'assets/obstacle/sky/image copy.png',    w: 120, h: 78  },  // 1: 금붕어
    { src: 'assets/obstacle/sky/image copy 2.png',  w: 144, h: 72  },  // 2: 갈매기
    { src: 'assets/obstacle/sky/image copy 3.png',  w: 132, h: 66  },  // 3: 종이비행기
    { src: 'assets/obstacle/sky/image copy 4.png',  w: 192, h: 84  },  // 4: 여객기
    { src: 'assets/obstacle/sky/image copy 5.png',  w: 102, h: 132 },  // 5: 열기구
    { src: 'assets/obstacle/sky/image copy 6.png',  w: 120, h: 102 },  // 6: 나비떼
    { src: 'assets/obstacle/sky/image copy 7.png',  w: 120, h: 102 },  // 7: 벌떼
    { src: 'assets/obstacle/sky/image copy 8.png',  w: 96,  h: 126 }   // 8: 풍선
  ];

  // 음식 트랩 — 개별 크기 (×1.2)
  var foodObsDefs = [
    { src: 'assets/obstacle/ground/food/image.png',        w: 78, h: 72 },  // 0: 햄버거
    { src: 'assets/obstacle/ground/food/image copy.png',    w: 84, h: 78 },  // 1: 피자
    { src: 'assets/obstacle/ground/food/image copy 2.png',  w: 96, h: 66 },  // 2: 핫도그
    { src: 'assets/obstacle/ground/food/image copy 3.png',  w: 84, h: 60 }   // 3: 도넛
  ];

  var groundObs = [];
  var skyObs = [];
  var foodObs = [];

  function loadImg(src) {
    var img = new Image();
    img.src = src;
    return img;
  }

  for (var key in spriteList) sprites[key] = loadImg(spriteList[key]);
  groundObsDefs.forEach(function (d) { groundObs.push({ img: loadImg(d.src), w: d.w, h: d.h }); });
  skyObsDefs.forEach(function (d) { skyObs.push({ img: loadImg(d.src), w: d.w, h: d.h }); });
  foodObsDefs.forEach(function (d) { foodObs.push({ img: loadImg(d.src), w: d.w, h: d.h }); });

  // ── 고정 코스 ──
  var COURSE = [
    // Phase 1: 튜토리얼 (0~450)
    { dist: 100,  type: 'ground', idx: 6 },   // 바나나껍질
    { dist: 210,  type: 'ground', idx: 0 },   // 그루터기
    { dist: 330,  type: 'sky',    idx: 2 },   // 갈매기

    // Phase 2: 보통 (450~1340)
    { dist: 450,  type: 'ground', idx: 7 },   // 바위
    { dist: 540,  type: 'sky',    idx: 0 },   // UFO
    { dist: 640,  type: 'ground', idx: 4 },   // 변기
    { dist: 740,  type: 'sky',    idx: 4 },   // 여객기
    { dist: 830,  type: 'ground', idx: 8 },   // 버섯
    { dist: 920,  type: 'ground', idx: 9 },   // 얼음
    { dist: 1010, type: 'sky',    idx: 5 },   // 열기구
    { dist: 1090, type: 'ground', idx: 5 },   // 레이저고양이
    { dist: 1170, type: 'ground', idx: 1 },   // 뱀
    { dist: 1250, type: 'sky',    idx: 3 },   // 종이비행기

    // Phase 3: 큰 장애물 (1340~2020)
    { dist: 1340, type: 'ground', idx: 2 },   // 선인장
    { dist: 1430, type: 'sky',    idx: 7 },   // 벌떼
    { dist: 1510, type: 'ground', idx: 7 },   // 바위
    { dist: 1600, type: 'ground', idx: 3 },   // 나무
    { dist: 1690, type: 'sky',    idx: 1 },   // 금붕어
    { dist: 1770, type: 'food',   idx: 0 },   // 햄버거 트랩
    { dist: 1860, type: 'ground', idx: 4 },   // 변기
    { dist: 1940, type: 'sky',    idx: 6 },   // 나비떼

    // Phase 4: 하드 (2020~3000)
    { dist: 2020, type: 'ground', idx: 10 },  // 호날두
    { dist: 2100, type: 'sky',    idx: 8 },   // 풍선
    { dist: 2170, type: 'ground', idx: 8 },   // 버섯
    { dist: 2240, type: 'ground', idx: 10 },  // 호날두
    { dist: 2320, type: 'sky',    idx: 0 },   // UFO
    { dist: 2390, type: 'ground', idx: 0 },   // 그루터기
    { dist: 2450, type: 'sky',    idx: 4 },   // 여객기
    { dist: 2520, type: 'ground', idx: 2 },   // 선인장
    { dist: 2600, type: 'ground', idx: 9 },   // 얼음
    { dist: 2670, type: 'sky',    idx: 7 },   // 벌떼
    { dist: 2740, type: 'ground', idx: 3 },   // 나무
    { dist: 2820, type: 'ground', idx: 1 },   // 뱀
    { dist: 2900, type: 'sky',    idx: 2 },   // 갈매기
    { dist: 2970, type: 'ground', idx: 6 }    // 바나나껍질
  ];

  // ── 게임 상태 ──
  var lives, distance, speed, gameOver, clearing, foodTriggered;
  var player, obstacles, invincibleUntil, animFrame;
  var runFrames, jumpFrames, slideFrames;
  var courseIdx;
  var groundY;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    groundY = canvas.height - GROUND_OFFSET;
  }

  function reset() {
    resize();
    lives = 3;
    distance = 0;
    speed = BASE_SPEED;
    gameOver = false;
    clearing = false;
    foodTriggered = false;
    invincibleUntil = 0;
    obstacles = [];
    courseIdx = 0;

    runFrames = [sprites.run1, sprites.run2];
    jumpFrames = [sprites.jump1, sprites.jump2, sprites.jump3, sprites.jump4];
    slideFrames = [sprites.slide1, sprites.slide2, sprites.slide3];

    player = {
      x: 80,
      y: groundY - P_H + PLAYER_Y_OFFSET,
      w: P_W,
      h: P_H,
      vy: 0,
      grounded: true,
      sliding: false,
      state: 'run',
      frame: 0,
      frameTimer: 0
    };

    renderHearts();
    progressFill.style.width = '0%';
  }

  function renderHearts() {
    heartsEl.innerHTML = '';
    for (var i = 0; i < 3; i++) {
      var h = document.createElement('i');
      h.className = i < lives ? 'nes-icon is-small heart' : 'nes-icon is-small heart is-empty';
      heartsEl.appendChild(h);
    }
  }

  // ── 입력 ──
  function onKeyDown(e) {
    if (gameOver || foodTriggered) return;
    if (e.key === 'ArrowRight' && player.grounded && player.state !== 'die') {
      player.vy = JUMP_FORCE;
      player.grounded = false;
      player.state = 'jump';
      player.sliding = false;
      player.frame = 0;
      player.h = P_H;
      player.w = P_W;
    }
    if (e.key === 'ArrowLeft' && player.grounded && player.state !== 'die') {
      player.sliding = true;
      player.state = 'slide';
      player.frame = 0;
    }
  }

  function onKeyUp(e) {
    if (e.key === 'ArrowLeft' && player.state === 'slide') {
      player.sliding = false;
      player.state = 'run';
      player.w = P_W;
      player.h = P_H;
      player.y = groundY - P_H + PLAYER_Y_OFFSET;
    }
  }

  // ── 고정 코스 스폰 ──
  function spawnFromCourse() {
    while (courseIdx < COURSE.length && distance >= COURSE[courseIdx].dist) {
      var c = COURSE[courseIdx];
      var obs;
      if (c.type === 'ground') {
        var g = groundObs[c.idx];
        obs = { x: canvas.width + 20, y: groundY - g.h + 24, w: g.w, h: g.h, img: g.img, type: 'ground' };
      } else if (c.type === 'sky') {
        var s = skyObs[c.idx];
        obs = { x: canvas.width + 20, y: groundY - P_H + PLAYER_Y_OFFSET - 6, w: s.w, h: s.h, img: s.img, type: 'sky' };
      } else if (c.type === 'food') {
        var f = foodObs[c.idx];
        obs = { x: canvas.width + 20, y: groundY - f.h + 18, w: f.w, h: f.h, img: f.img, type: 'food' };
      }
      obstacles.push(obs);
      courseIdx++;
    }
  }

  // ── 충돌 판정 (히트박스 약간 축소) ──
  function collides(a, b) {
    var s = 18;
    return a.x + s < b.x + b.w - s &&
           a.x + a.w - s > b.x + s &&
           a.y + s < b.y + b.h - s &&
           a.y + a.h - s > b.y + s;
  }

  // ── 메인 루프 ──
  function update() {
    if (gameOver || foodTriggered) return;

    if (!clearing) {
      speed = BASE_SPEED + distance * SPEED_INCREASE;
      distance += speed * 0.1;
      progressFill.style.width = Math.min(100, (distance / CLEAR_DISTANCE) * 100) + '%';

      if (distance >= CLEAR_DISTANCE) {
        clearing = true;
        obstacles = [];
      }
      spawnFromCourse();
    }

    // 플레이어 물리
    if (!player.grounded) {
      player.vy += GRAVITY;
      player.y += player.vy;
      if (player.y >= groundY - P_H + PLAYER_Y_OFFSET) {
        player.y = groundY - P_H + PLAYER_Y_OFFSET;
        player.vy = 0;
        player.grounded = true;
        if (player.state === 'jump') player.state = 'run';
      }
    }

    // 슬라이딩 히트박스 전환
    if (player.sliding && player.grounded) {
      player.w = P_SLIDE_W;
      player.h = P_SLIDE_H;
      player.y = groundY - P_SLIDE_H + PLAYER_Y_OFFSET;
    } else if (player.grounded && player.state !== 'jump') {
      player.w = P_W;
      player.h = P_H;
      player.y = groundY - P_H + PLAYER_Y_OFFSET;
    }

    // 장애물 이동 & 충돌
    var now = Date.now();
    for (var i = obstacles.length - 1; i >= 0; i--) {
      var obs = obstacles[i];
      if (!clearing) obs.x -= speed;

      if (obs.x + obs.w < -20) { obstacles.splice(i, 1); continue; }

      if (collides(player, obs)) {
        if (obs.type === 'food') {
          foodTriggered = true;
          showFoodGameOver();
          return;
        }
        if (now < invincibleUntil) continue;
        lives--;
        renderHearts();
        invincibleUntil = now + INVINCIBLE_MS;
        obstacles.splice(i, 1);
        if (lives <= 0) {
          player.state = 'die';
          gameOver = true;
          setTimeout(function () {
            showGameOver([], function () { initStep7(); });
          }, 1000);
          return;
        }
      }
    }

    // 클리어 연출
    if (clearing) {
      player.x += 5;
      if (player.x > canvas.width - 200) {
        gameOver = true;
        setTimeout(function () { goToStep(8); }, 500);
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 바닥선
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(canvas.width, groundY);
    ctx.stroke();

    // 장애물
    for (var i = 0; i < obstacles.length; i++) {
      var obs = obstacles[i];
      ctx.drawImage(obs.img, obs.x, obs.y, obs.w, obs.h);
    }

    // 클리어 시 악당
    if (clearing) {
      ctx.drawImage(sprites.villain, canvas.width - 170, groundY - VILLAIN_H, VILLAIN_W, VILLAIN_H);
    }

    // 플레이어
    var now = Date.now();
    var blinking = now < invincibleUntil && Math.floor(now / 100) % 2 === 0;
    if (!blinking) {
      var sprite;
      player.frameTimer++;

      if (player.state === 'run') {
        var ri = Math.floor(player.frameTimer / 12) % runFrames.length;
        sprite = runFrames[ri];
      } else if (player.state === 'jump') {
        var ji = Math.floor(player.frameTimer / 6) % jumpFrames.length;
        sprite = jumpFrames[ji];
      } else if (player.state === 'slide') {
        var si = Math.floor(player.frameTimer / 8) % slideFrames.length;
        sprite = slideFrames[si];
      } else if (player.state === 'die') {
        sprite = sprites.die1;
      }

      if (sprite) {
        ctx.drawImage(sprite, player.x, player.y, player.w, player.h);
      }
    }
  }

  function showFoodGameOver() {
    cancelAnimationFrame(animFrame);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);

    var overlay = document.getElementById('gameover-overlay');
    var goText = document.getElementById('go-text');
    var goTitle = document.getElementById('go-title');
    overlay.style.display = 'flex';
    goText.textContent = '';
    goTitle.style.display = 'none';

    typeText(goText, '공주는 먹는 것에 정신이 팔려 그만 편지에 대해 잊어버리고 말았다...', 50, function () {
      setTimeout(function () {
        overlay.style.display = 'none';
        initStep7();
      }, 2500);
    });
  }

  function loop() {
    update();
    draw();
    if (!gameOver && !foodTriggered) {
      animFrame = requestAnimationFrame(loop);
    }
  }

  // ── 시작 ──
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  reset();
  animFrame = requestAnimationFrame(loop);
}

stepInits[7] = initStep7;
