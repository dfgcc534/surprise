function initStep7() {
  var canvas = document.getElementById('run-canvas');
  var ctx = canvas.getContext('2d');
  var heartsEl = document.getElementById('run-hearts');
  var progressFill = document.getElementById('run-progress-fill');

  // ── 게임 설정 ──
  // 플레이어: 120x165 (서있기), 슬라이딩 시 165x80
  // 지상 장애물: 100x100, 점프로 넘음
  // 공중 장애물: 95x95, 슬라이딩으로 통과
  // 점프: 최대 높이 ~180px → 지상 장애물(100px) 넘을 수 있음
  // 슬라이딩: 히트박스 80px → 공중 장애물 아래로 통과

  var GROUND_OFFSET = 80;  // 캔버스 하단에서 지면까지
  var PLAYER_Y_OFFSET = 20; // 캐릭터 에셋 하단 빈 공간 보정
  var CLEAR_DISTANCE = 3000;
  var BASE_SPEED = 11.25;
  var SPEED_INCREASE = 0.0012;
  var INVINCIBLE_MS = 1000;
  var GRAVITY = 0.8;
  var JUMP_FORCE = -17;

  // 플레이어 크기
  var P_W = 120;
  var P_H = 165;
  var P_SLIDE_W = 165;
  var P_SLIDE_H = 80;

  // 장애물 크기
  var GROUND_OBS_W = 100;
  var GROUND_OBS_H = 100;
  var SKY_OBS_W = 95;
  var SKY_OBS_H = 95;
  var FOOD_W = 65;
  var FOOD_H = 65;
  var VILLAIN_W = 140;
  var VILLAIN_H = 140;

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

  var groundObs = [];
  var skyObsImages = [];
  var foodImages = [];

  var groundObsDefs = [
    { src: 'assets/obstacle/ground/image.png' },
    { src: 'assets/obstacle/ground/image copy.png' },
    { src: 'assets/obstacle/ground/image copy 2.png' },
    { src: 'assets/obstacle/ground/image copy 3.png' },
    { src: 'assets/obstacle/ground/image copy 4.png' },
    { src: 'assets/obstacle/ground/image copy 5.png' },
    { src: 'assets/obstacle/ground/image copy 6.png' },
    { src: 'assets/obstacle/ground/image copy 7.png' },
    { src: 'assets/obstacle/ground/image copy 8.png' },
    { src: 'assets/obstacle/ground/image copy 9.png' },
    { src: 'assets/obstacle/ground/IMG_3047 2.PNG' },
    { src: 'assets/obstacle/ground/IMG_3048 2.PNG' },
    { src: 'assets/obstacle/ground/IMG_3058 2.PNG' },
    { src: 'assets/obstacle/ground/IMG_3059 2.PNG' }
  ];
  var skyObsPaths = [
    'assets/obstacle/sky/image.png',
    'assets/obstacle/sky/image copy.png',
    'assets/obstacle/sky/image copy 2.png',
    'assets/obstacle/sky/image copy 3.png',
    'assets/obstacle/sky/image copy 4.png',
    'assets/obstacle/sky/image copy 5.png',
    'assets/obstacle/sky/image copy 6.png',
    'assets/obstacle/sky/image copy 7.png',
    'assets/obstacle/sky/image copy 8.png'
  ];
  var foodPaths = [
    'assets/obstacle/ground/food/image.png',
    'assets/obstacle/ground/food/image copy.png',
    'assets/obstacle/ground/food/image copy 2.png',
    'assets/obstacle/ground/food/image copy 3.png'
  ];

  function loadImg(src) {
    var img = new Image();
    img.src = src;
    return img;
  }

  for (var key in spriteList) sprites[key] = loadImg(spriteList[key]);
  groundObsDefs.forEach(function (d) { groundObs.push({ img: loadImg(d.src), w: d.w || GROUND_OBS_W, h: d.h || GROUND_OBS_H }); });
  skyObsPaths.forEach(function (p) { skyObsImages.push(loadImg(p)); });
  foodPaths.forEach(function (p) { foodImages.push(loadImg(p)); });

  // ── 게임 상태 ──
  var lives, distance, speed, gameOver, clearing, foodTriggered;
  var player, obstacles, invincibleUntil, animFrame;
  var runFrames, jumpFrames, slideFrames;
  var lastSpawn;
  var groundY; // 지면 Y 좌표 (플레이어 발 위치)

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
    lastSpawn = 0;

    runFrames = [sprites.run1, sprites.run2];
    jumpFrames = [sprites.jump1, sprites.jump2, sprites.jump3, sprites.jump4];
    slideFrames = [sprites.slide1, sprites.slide2, sprites.slide3];

    player = {
      x: 80,
      y: groundY - P_H + PLAYER_Y_OFFSET,  // 플레이어 top-left Y
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

  // ── 장애물 스폰 ──
  function spawnObstacle() {
    var now = Date.now();
    var minInterval = Math.max(800, 1800 - distance * 0.25);
    if (now - lastSpawn < minInterval) return;
    lastSpawn = now;

    var r = Math.random();
    var obs;

    if (r < 0.08 && distance > 600) {
      // 음식 트랩 — 지면 위에 배치
      var fimg = foodImages[Math.floor(Math.random() * foodImages.length)];
      obs = {
        x: canvas.width + 20,
        y: groundY - FOOD_H,
        w: FOOD_W, h: FOOD_H,
        img: fimg, type: 'food'
      };
    } else if (r < 0.45) {
      // 공중 장애물 — 슬라이딩으로 회피
      // y 위치: 서있는 플레이어 머리~가슴 높이 → 슬라이딩(80px)하면 아래로 통과
      var simg = skyObsImages[Math.floor(Math.random() * skyObsImages.length)];
      obs = {
        x: canvas.width + 20,
        y: groundY - P_H + PLAYER_Y_OFFSET - 5,  // 플레이어 서있을 때 머리 위치 근처
        w: SKY_OBS_W, h: SKY_OBS_H,
        img: simg, type: 'sky'
      };
    } else {
      // 지상 장애물 — 점프로 회피
      var g = groundObs[Math.floor(Math.random() * groundObs.length)];
      obs = {
        x: canvas.width + 20,
        y: groundY - g.h,
        w: g.w, h: g.h,
        img: g.img, type: 'ground'
      };
    }
    obstacles.push(obs);
  }

  // ── 충돌 판정 (히트박스 약간 축소) ──
  function collides(a, b) {
    var s = 15;
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
      spawnObstacle();
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
      if (player.x > canvas.width - 180) {
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
      ctx.drawImage(sprites.villain, canvas.width - 150, groundY - VILLAIN_H, VILLAIN_W, VILLAIN_H);
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
