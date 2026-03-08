"""Step 7 런게임 물리 시뮬레이션 — 충돌/경로 검증"""

# ── 게임 물리 상수 (×1.2 스케일) ──
GRAVITY = 0.96
JUMP_FORCE = -20
BASE_SPEED = 11.25
SPEED_INCREASE = 0.0012
P_W = 144
P_H = 198
P_SLIDE_W = 198
P_SLIDE_H = 96
PLAYER_Y_OFFSET = 24
HITBOX_SHRINK = 18
CLEAR_DISTANCE = 3000
GROUND_Y_OFFSET = 24  # 지상 장애물 y 보정

GROUND_OBS = {
    0:  (132, 84),   # 그루터기
    1:  (108, 78),   # 뱀
    2:  (96,  179),  # 선인장
    3:  (132, 179),  # 나무
    4:  (90,  132),  # 변기
    5:  (144, 90),   # 레이저고양이
    6:  (120, 54),   # 바나나껍질
    7:  (126, 114),  # 바위
    8:  (96,  108),  # 버섯
    9:  (108, 102),  # 얼음
    10: (168, 174),  # 호날두(슬라이딩)
}

SKY_OBS = {
    0: (132, 108),  1: (120, 78),   2: (144, 72),
    3: (132, 66),   4: (192, 84),   5: (102, 132),
    6: (120, 102),  7: (120, 102),  8: (96, 126),
}

FOOD_OBS = {
    0: (78, 72), 1: (84, 78), 2: (96, 66), 3: (84, 60),
}

COURSE = [
    {"dist": 100,  "type": "ground", "idx": 6},
    {"dist": 210,  "type": "ground", "idx": 0},
    {"dist": 330,  "type": "sky",    "idx": 2},
    {"dist": 450,  "type": "ground", "idx": 7},
    {"dist": 540,  "type": "sky",    "idx": 0},
    {"dist": 640,  "type": "ground", "idx": 4},
    {"dist": 740,  "type": "sky",    "idx": 4},
    {"dist": 830,  "type": "ground", "idx": 8},
    {"dist": 920,  "type": "ground", "idx": 9},
    {"dist": 1010, "type": "sky",    "idx": 5},
    {"dist": 1090, "type": "ground", "idx": 5},
    {"dist": 1170, "type": "ground", "idx": 1},
    {"dist": 1250, "type": "sky",    "idx": 3},
    {"dist": 1340, "type": "ground", "idx": 2},
    {"dist": 1430, "type": "sky",    "idx": 7},
    {"dist": 1510, "type": "ground", "idx": 7},
    {"dist": 1600, "type": "ground", "idx": 3},
    {"dist": 1690, "type": "sky",    "idx": 1},
    {"dist": 1770, "type": "food",   "idx": 0},
    {"dist": 1860, "type": "ground", "idx": 4},
    {"dist": 1940, "type": "sky",    "idx": 6},
    {"dist": 2020, "type": "ground", "idx": 10},
    {"dist": 2100, "type": "sky",    "idx": 8},
    {"dist": 2170, "type": "ground", "idx": 8},
    {"dist": 2240, "type": "ground", "idx": 10},
    {"dist": 2320, "type": "sky",    "idx": 0},
    {"dist": 2390, "type": "ground", "idx": 0},
    {"dist": 2450, "type": "sky",    "idx": 4},
    {"dist": 2520, "type": "ground", "idx": 2},
    {"dist": 2600, "type": "ground", "idx": 9},
    {"dist": 2670, "type": "sky",    "idx": 7},
    {"dist": 2740, "type": "ground", "idx": 3},
    {"dist": 2820, "type": "ground", "idx": 1},
    {"dist": 2900, "type": "sky",    "idx": 2},
    {"dist": 2970, "type": "ground", "idx": 6},
]


def simulate_jump():
    """단일 점프 포물선"""
    vy = JUMP_FORCE
    y = 0
    max_h = 0
    frames = 0
    trajectory = []
    while True:
        vy += GRAVITY
        y -= vy
        if y < 0:
            y = 0
        max_h = max(max_h, y)
        frames += 1
        trajectory.append(y)
        if y <= 0 and frames > 1:
            break
    return max_h, frames, trajectory


def get_safe_clear_height(max_jump_h):
    return max_jump_h - HITBOX_SHRINK - 10


def speed_at(dist):
    return BASE_SPEED + dist * SPEED_INCREASE


def check_obstacle_clearance():
    """각 장애물이 점프/슬라이딩으로 넘을 수 있는지"""
    max_h, frames, _ = simulate_jump()
    safe = get_safe_clear_height(max_h)

    print("=" * 60)
    print("1. 점프 포물선 분석")
    print("=" * 60)
    print(f"  단일 점프: 최대 높이 = {max_h:.1f}px, 체공 = {frames}f ({frames/60:.3f}s)")
    print(f"  안전 통과 높이: {safe:.1f}px")
    print()

    print("=" * 60)
    print("2. 지상 장애물 통과 가능 여부")
    print("=" * 60)

    all_pass = True
    for idx in sorted(GROUND_OBS):
        w, h = GROUND_OBS[idx]
        effective_h = h - GROUND_Y_OFFSET
        clearable = safe >= effective_h
        status = "PASS" if clearable else "FAIL"
        if not clearable: all_pass = False
        margin = safe - effective_h
        print(f"  idx {idx:2d}: h={h:3d} (실효 {effective_h:3d}px) vs {safe:.0f}px → [{status}] 여유:{margin:.0f}px")

    print()
    print("=" * 60)
    print("3. 공중 장애물 슬라이딩 통과")
    print("=" * 60)

    for idx in sorted(SKY_OBS):
        w, h = SKY_OBS[idx]
        slide_top = -P_SLIDE_H + PLAYER_Y_OFFSET + HITBOX_SHRINK
        sky_bottom = -P_H + PLAYER_Y_OFFSET - 6 + h - HITBOX_SHRINK
        clearable = slide_top > sky_bottom
        status = "PASS" if clearable else "FAIL"
        if not clearable: all_pass = False
        print(f"  idx {idx}: h={h:3d} slide_top={slide_top} sky_bot={sky_bottom} → [{status}]")

    return all_pass


def check_consecutive_obstacles():
    """연속 장애물 동시 회피 가능 여부"""
    print("\n" + "=" * 60)
    print("4. 연속 장애물 경로 검증")
    print("=" * 60)

    _, jump_frames, _ = simulate_jump()
    all_pass = True

    for i in range(1, len(COURSE)):
        prev = COURSE[i - 1]
        curr = COURSE[i]
        gap_dist = curr["dist"] - prev["dist"]
        avg_speed = speed_at((prev["dist"] + curr["dist"]) / 2)
        gap_frames = gap_dist / (avg_speed * 0.1)

        prev_act = get_action(prev)
        curr_act = get_action(curr)

        problem = False
        if prev_act == 'jump' and curr_act == 'jump' and gap_frames < jump_frames:
            prev_h = GROUND_OBS[prev["idx"]][1] - GROUND_Y_OFFSET
            curr_h = GROUND_OBS[curr["idx"]][1] - GROUND_Y_OFFSET
            max_needed = max(prev_h, curr_h)
            safe = get_safe_clear_height(simulate_jump()[0])
            if safe < max_needed:
                problem = True

        status = "FAIL" if problem else "PASS"
        if problem: all_pass = False

        name_map = {"ground": "지상", "sky": "공중", "food": "음식"}
        pn = f"{name_map[prev['type']]}#{prev['idx']}"
        cn = f"{name_map[curr['type']]}#{curr['idx']}"
        print(f"  {pn:>8s} → {cn:<8s}  gap={gap_dist:3.0f} ({gap_frames:4.0f}f) {prev_act}→{curr_act}  [{status}]")

    return all_pass


def get_action(obs):
    if obs["type"] in ("sky",):
        return "slide"
    return "jump"


def print_summary():
    print("\n" + "=" * 60)
    print("5. 코스 요약")
    print("=" * 60)
    print(f"  총 장애물: {len(COURSE)}개, 클리어 거리: {CLEAR_DISTANCE}")
    gaps = [COURSE[i]["dist"] - COURSE[i-1]["dist"] for i in range(1, len(COURSE))]
    print(f"  간격 — 최소: {min(gaps)}, 최대: {max(gaps)}, 평균: {sum(gaps)/len(gaps):.0f}")
    types = {}
    for c in COURSE:
        types[c["type"]] = types.get(c["type"], 0) + 1
    print(f"  타입 — " + ", ".join(f"{k}: {v}" for k, v in types.items()))


if __name__ == "__main__":
    print("Step 7 물리 시뮬레이션 (×1.2 스케일, 단일 점프)")
    print("=" * 60)
    print()

    r1 = check_obstacle_clearance()
    r2 = check_consecutive_obstacles()
    print_summary()

    print("\n" + "=" * 60)
    print("최종 결과")
    print("=" * 60)
    for name, passed in [("장애물 통과", r1), ("연속 경로", r2)]:
        print(f"  {name}: [{'PASS' if passed else 'FAIL'}]")

    print()
    if r1 and r2:
        print(">>> 모든 검증 통과! <<<")
    else:
        print(">>> 일부 검증 실패! <<<")
