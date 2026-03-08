# Step 7 — 런 게임

## 목표
가윤이가 악당에게 빼앗긴 편지를 되찾기 위해 장애물을 피하며 달리는 횡스크롤 런 게임.

## 게임 구조
- Canvas 기반 60fps 게임 루프
- 고정 코스 35개 장애물 — 랜덤 스폰 없음
- 3 라이프 시스템 (피격 시 1초 무적)
- 거리 3000 도달 시 클리어 → Step 8

## 조작
| 키 | 동작 |
|-----|------|
| `→` (ArrowRight) | 점프 (지면에서만) |
| `←` (ArrowLeft) 누르기 | 슬라이딩 |
| `←` 떼기 | 슬라이딩 해제 |

## 물리 상수 (×1.2 스케일)
| 상수 | 값 |
|------|----|
| `GRAVITY` | 0.96 |
| `JUMP_FORCE` | -20 |
| `BASE_SPEED` | 11.25 |
| `SPEED_INCREASE` | 0.0012 |
| `CLEAR_DISTANCE` | 3000 |
| `INVINCIBLE_MS` | 1000 |
| `GROUND_OFFSET` | 96 |
| `PLAYER_Y_OFFSET` | 24 |
| `HITBOX_SHRINK` | 18 |

## 점프 포물선
- 최대 높이: ~198px
- 체공: 41프레임 (0.68s)
- 안전 통과 높이: ~170px

## 플레이어 (×1.2)
| 상태 | 크기 (w×h) |
|------|-----------|
| 서있기/점프 | 144×198 |
| 슬라이딩 | 198×96 |

악당: 126×168

## 장애물 (전체 ×1.2)

### 지상
| idx | 에셋 | 정체 | w | h |
|-----|------|------|---|---|
| 0 | `ground/image.png` | 그루터기 | 132 | 84 |
| 1 | `ground/image copy.png` | 뱀 | 108 | 78 |
| 2 | `ground/image copy 2.png` | 선인장 | 96 | 192 |
| 3 | `ground/image copy 3.png` | 나무 | 132 | 192 |
| 4 | `ground/image copy 4.png` | 변기 | 90 | 132 |
| 5 | `ground/image copy 5.png` | 레이저고양이 | 144 | 90 |
| 6 | `ground/image copy 6.png` | 바나나껍질 | 120 | 54 |
| 7 | `ground/image copy 7.png` | 바위 | 126 | 114 |
| 8 | `ground/image copy 8.png` | 버섯 | 96 | 108 |
| 9 | `ground/image copy 9.png` | 얼음 | 108 | 102 |
| 10 | `ground/IMG_3047 2.PNG` | 호날두 | 168 | 174 |

### 공중
| idx | 에셋 | 정체 | w | h |
|-----|------|------|---|---|
| 0 | `sky/image.png` | UFO | 132 | 108 |
| 1 | `sky/image copy.png` | 금붕어 | 120 | 78 |
| 2 | `sky/image copy 2.png` | 갈매기 | 144 | 72 |
| 3 | `sky/image copy 3.png` | 종이비행기 | 132 | 66 |
| 4 | `sky/image copy 4.png` | 여객기 | 192 | 84 |
| 5 | `sky/image copy 5.png` | 열기구 | 102 | 132 |
| 6 | `sky/image copy 6.png` | 나비떼 | 120 | 102 |
| 7 | `sky/image copy 7.png` | 벌떼 | 120 | 102 |
| 8 | `sky/image copy 8.png` | 풍선 | 96 | 126 |

### 음식 (y좌표 +18 보정)
| idx | 에셋 | 정체 | w | h |
|-----|------|------|---|---|
| 0 | `food/image.png` | 햄버거 | 78 | 72 |
| 1 | `food/image copy.png` | 피자 | 84 | 78 |
| 2 | `food/image copy 2.png` | 핫도그 | 96 | 66 |
| 3 | `food/image copy 3.png` | 도넛 | 84 | 60 |

## 고정 코스 (35개)

### Phase 1: 튜토리얼 (0~450) — 3개
| dist | type | idx | 장애물 |
|------|------|-----|--------|
| 100 | ground | 6 | 바나나껍질 |
| 210 | ground | 0 | 그루터기 |
| 330 | sky | 2 | 갈매기 |

### Phase 2: 보통 (450~1340) — 10개
| dist | type | idx | 장애물 |
|------|------|-----|--------|
| 450 | ground | 7 | 바위 |
| 540 | sky | 0 | UFO |
| 640 | ground | 4 | 변기 |
| 740 | sky | 4 | 여객기 |
| 830 | ground | 8 | 버섯 |
| 920 | ground | 9 | 얼음 |
| 1010 | sky | 5 | 열기구 |
| 1090 | ground | 5 | 레이저고양이 |
| 1170 | ground | 1 | 뱀 |
| 1250 | sky | 3 | 종이비행기 |

### Phase 3: 큰 장애물 (1340~2020) — 8개
| dist | type | idx | 장애물 |
|------|------|-----|--------|
| 1340 | ground | 2 | 선인장 (여유 2px) |
| 1430 | sky | 7 | 벌떼 |
| 1510 | ground | 7 | 바위 |
| 1600 | ground | 3 | 나무 (여유 2px) |
| 1690 | sky | 1 | 금붕어 |
| 1770 | food | 0 | 햄버거 트랩 |
| 1860 | ground | 4 | 변기 |
| 1940 | sky | 6 | 나비떼 |

### Phase 4: 하드 (2020~3000) — 14개
| dist | type | idx | 장애물 |
|------|------|-----|--------|
| 2020 | ground | 10 | 호날두 |
| 2100 | sky | 8 | 풍선 |
| 2170 | ground | 8 | 버섯 |
| 2240 | ground | 10 | 호날두 |
| 2320 | sky | 0 | UFO |
| 2390 | ground | 0 | 그루터기 |
| 2450 | sky | 4 | 여객기 |
| 2520 | ground | 2 | 선인장 |
| 2600 | ground | 9 | 얼음 |
| 2670 | sky | 7 | 벌떼 |
| 2740 | ground | 3 | 나무 |
| 2820 | ground | 1 | 뱀 |
| 2900 | sky | 2 | 갈매기 |
| 2970 | ground | 6 | 바나나껍질 |

## 코스 통계
- 간격: 최소 60, 최대 120, 평균 84
- 타입: 지상 21, 공중 13, 음식 1

## 게임오버
| 조건 | 결과 |
|------|------|
| 라이프 0 | `showGameOver()` → 재시작 |
| 음식 충돌 | 전용 메시지 후 재시작 |
| dist ≥ 3000 | 클리어 → Step 8 |

## 파일
| 파일 | 역할 |
|------|------|
| `steps/step7.js` | 게임 로직 |
| `step_test.html` | 에셋 크기 확인 |
| `simulate.py` | 물리 검증 |

## 검증 (simulate.py)
- 장애물 통과: **PASS** (선인장/나무 여유 2px — 빡빡)
- 연속 경로: **PASS**
