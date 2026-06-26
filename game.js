const emojiCSV = `emoji,name
🐼,熊貓
🍕,薄餅
🍟,薯條
🌭,熱狗
🍣,壽司
🍜,拉麵
🍉,西瓜
🍎,蘋果
🍄,蘑菇
🍅,蕃茄
🐭,老鼠
🐰,兔子
🐬,海豚
🦆,鴨子
🐓,公雞
🦃,火雞
🦋,蝴蝶
🐌,蝸牛
🐜,螞蟻
🐞,瓢蟲
🕷️,蜘蛛
👁️,眼睛
👄,嘴巴
👅,舌頭
🦷,牙齒
🍰,蛋糕
🍇,葡萄
🍌,香蕉
🍓,草莓
🌽,粟米
🌶️,辣椒
🌰,栗子
✈️,飛機
🚀,火箭
🎁,禮物
🧥,衣服
👖,褲子
👟,鞋子
⚽,足球
🏀,籃球
🐒,猴子
🐸,青蛙
🦓,斑馬
🪼,水母
🐧,企鵝
🐤,小雞
🦇,蝙蝠
🐛,毛蟲
🪰,蒼蠅
🪱,蚯蚓
🐝,蜜蜂
🎈,氣球
🧧,利是
👓,眼鏡
🧢,帽子
💍,戒指
💎,鑽石
🥎,網球
🏐,排球
⛸️,溜冰
🎣,釣魚
🤿,潛水
🥇,冠軍
🥈,亞軍
🥉,季軍
🎲,骰子
🧩,拼圖
🀄,麻雀
💊,藥丸
📱,電話
📺,電視
✂️,剪刀
⏲️,時鐘
⏰,鬧鐘
🥚,雞蛋
🍞,麵包
🥗,沙律
🍪,曲奇
🥥,椰子
🍊,橙子
🍋,檸檬
🫐,藍梅
🍆,茄子
🚲,單車
🧻,廁紙
🪥,牙刷
🌝,月亮
🌞,太陽
🌈,彩虹
🌂,雨傘
⛄,雪人`;

const characterCSV = `character,hp,atk,stand-image,walk-image,walk-sound,jump-image,jump-sound,attack-image,attack-sound,attack-projectile
瑪利歐,0,1,mario_stand.png,mario_walk.png,walk.mp3,mario_jump.png,jump.mp3,mario_attack.png,fireball.mp3,fireball.png
路易吉,0,1,luigi_stand.png,luigi_walk.png,walk.mp3,luigi_jump.png,jump.mp3,luigi_attack.png,fireball.mp3,fireball.png
慢慢龜,3,1,koopa_stand.png,koopa_walk.png,walk.mp3,koopa_attack.png,jump.mp3,koopa_attack.png,shell.mp3,redshell.png
飛行龜,4,1,paratroopa_stand.png,paratroopa_walk.png,walk.mp3,paratroopa_attack.png,jump.mp3,paratroopa_attack.png,shell.mp3,greenshell.png
炮彈刺客,5,1,bulletbill_stand.png,bulletbill_walk.png,walk.mp3,bulletbill_attack.png,jump.mp3,bulletbill_attack.png,bulletbill.mp3,bulletbill.png
庫巴七人眾,8,1,koopaling_stand.png,koopaling_walk.png,walk.mp3,koopaling_attack.png,jump.mp3,koopaling_attack.png,fireball.mp3,purple_fireball.png
庫巴,10,2,bowser_stand.png,bowser_walk.png,walk.mp3,bowser_attack.png,jump.mp3,bowser_attack.png,big_fireball.mp3,big_fireball.png`;

const stageMap = {1:'stage1.png',2:'stage2.png',3:'stage3.png',4:'stage4.png',5:'stage5.png'};
const stageChoices = {1:3,2:3,3:4,4:4,5:5};
const turnSeconds = 20;
const audioBase = 'assets/';
const enemyOrder = ['慢慢龜', '飛行龜', '炮彈刺客', '庫巴七人眾', '庫巴'];
const confettiColors = ['#ff4d6d', '#ffd93d', '#6bcBef', '#8aff80', '#c77dff', '#ff8fab'];
const fireworkColors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#ffffff'];

const state = {
  emojis: [],
  characters: [],
  playerName: '瑪利歐',
  playerHpMax: 10,
  playerHp: 10,
  enemyName: '慢慢龜',
  enemyHpMax: 3,
  enemyHp: 3,
  stage: 1,
  turn: 'player',
  currentQuestion: null,
  timer: null,
  secondsLeft: turnSeconds,
  canChoose: false,
  busy: false,
  audioEnabled: true,
  ended: false,
  fireworkTimer: null,
  currentRunWon: false
};

const els = {};

function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const parts = line.split(',');
    const obj = {};
    headers.forEach((h, i) => obj[h] = parts[i]);
    return obj;
  });
}
function byId(id) { return document.getElementById(id); }
function qs(sel) { return document.querySelector(sel); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) { return arr.map(v => [Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(x => x[1]); }
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
function getChar(name) { return state.characters.find(c => c.character === name); }
function imgUrl(name) { return `assets/${name}`; }
function soundUrl(name) { return `${audioBase}${name}`; }

function preloadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}
function preloadAudio(src) {
  return new Promise(resolve => {
    const a = new Audio();
    a.preload = 'auto';
    a.src = src;
    a.addEventListener('canplaythrough', () => resolve(true), { once: true });
    a.addEventListener('error', () => resolve(false), { once: true });
    a.load();
    setTimeout(() => resolve(false), 2500);
  });
}
async function preloadAssets() {
  const imageNames = new Set([
    'stage1.png','stage3.png','stage4.png','stage5.png',
    ...state.characters.flatMap(c => [c['stand-image'], c['walk-image'], c['jump-image'], c['attack-image'], c['attack-projectile']].filter(Boolean))
  ]);
  const audioNames = new Set([
    ...state.characters.flatMap(c => [c['walk-sound'], c['jump-sound'], c['attack-sound']].filter(Boolean)),
    'correct.mp3','wrong.mp3','win.mp3','lose.mp3'
  ]);
  await Promise.all([
    ...[...imageNames].map(n => preloadImage(imgUrl(n))),
    ...[...audioNames].map(n => preloadAudio(soundUrl(n)))
  ]);
}

function stopTimer() {
  if (state.timer) clearInterval(state.timer);
  state.timer = null;
}
function stopWinEffects() {
  if (state.fireworkTimer) clearInterval(state.fireworkTimer);
  state.fireworkTimer = null;
  if (els.fireworksLayer) els.fireworksLayer.innerHTML = '';
  if (els.confettiLayer) els.confettiLayer.innerHTML = '';
  if (els.playerSprite) els.playerSprite.classList.remove('win-jump-loop', 'walk-center');
}
function resetBattleVisuals() {
  stopWinEffects();
  if (els.enemySprite) {
    els.enemySprite.style.display = 'block';
    els.enemySprite.style.visibility = 'visible';
    els.enemySprite.style.opacity = '1';
    els.enemySprite.style.transform = '';
    els.enemySprite.classList.remove('fade-out');
  }
  if (els.playerSprite) {
    els.playerSprite.style.display = 'block';
    els.playerSprite.style.visibility = 'visible';
    els.playerSprite.style.opacity = '1';
    els.playerSprite.style.transform = '';
    els.playerSprite.classList.remove('win-jump-loop', 'walk-across', 'walk-center');
    els.playerSprite.style.left = window.innerWidth <= 900 ? '12px' : '24px';
  }
  if (els.projectile) els.projectile.style.display = 'none';
}
function setBg(stage) {
  els.battleBg.style.backgroundImage = `url('${imgUrl(stageMap[stage] || 'stage1.png')}')`;
}
function setSprite(el, img) {
  el.style.backgroundImage = `url('${imgUrl(img)}')`;
}
function setProjectile(img) {
  els.projectile.src = imgUrl(img || 'fireball.png');
}
function setHpDisplay(el, current, max) {
  el.innerHTML = Array.from({ length: max }, (_, i) => `<span>${i < current ? '❤️' : '🩶'}</span>`).join('');
}
function updateHp() {
  setHpDisplay(els.playerHp, state.playerHp, state.playerHpMax);
  setHpDisplay(els.enemyHp, state.enemyHp, state.enemyHpMax);
}
function updateStageInfo() {
  els.stageInfo.textContent = `第 ${state.stage} 關 / ${stageChoices[state.stage]} 個答案`;
}
function setScreen(screen) {
  els.homeScreen.classList.toggle('active', screen === 'home');
  els.gameScreen.classList.toggle('active', screen === 'game');
}
function banner(text, ms = 900) {
  if (!els.banner) return;
  els.banner.textContent = text;
  els.banner.style.display = 'block';
  els.banner.style.opacity = '1';
  els.banner.classList.add('show');
  clearTimeout(banner.t);
  banner.t = setTimeout(() => {
    if (els.banner) {
      els.banner.style.opacity = '0';
      els.banner.classList.remove('show');
    }
  }, ms);
}
function currentPlayer() { return state.playerName; }
function currentEnemy() { return state.enemyName; }
function playAudio(name) {
  if (!state.audioEnabled || !name) return;
  const a = new Audio(soundUrl(name));
  a.volume = 0.85;
  a.play().catch(() => {});
}
function applyStandings() {
  const p = getChar(currentPlayer());
  const e = getChar(currentEnemy());
  if (p) setSprite(els.playerSprite, p['stand-image']);
  if (e) setSprite(els.enemySprite, e['stand-image']);
  els.enemySprite.style.display = 'block';
  els.enemySprite.style.visibility = 'visible';
  els.enemySprite.style.opacity = '1';
}
function buildQuestion(count) {
  const correct = rand(state.emojis);
  const wrong = shuffle(state.emojis.filter(x => x.name !== correct.name).map(x => x.name)).slice(0, count - 1);
  return { emoji: correct.emoji, answer: correct.name, options: shuffle([correct.name, ...wrong]) };
}
function renderQuestion(q) {
  state.currentQuestion = q;
  els.questionText.textContent = `${q.emoji} `;
  els.options.innerHTML = '';
  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt;
    btn.disabled = !state.canChoose || state.busy;
    btn.addEventListener('click', () => chooseAnswer(opt));
    els.options.appendChild(btn);
  });
}
function refreshOptionState() {
  els.options.querySelectorAll('button').forEach(btn => {
    btn.disabled = !state.canChoose || state.busy || state.ended;
  });
}
function startTurnCountdown() {
  stopTimer();
  state.secondsLeft = turnSeconds;
  els.timer.textContent = `剩餘時間：${state.secondsLeft} 秒`;
  state.timer = setInterval(() => {
    state.secondsLeft -= 1;
    els.timer.textContent = `剩餘時間：${state.secondsLeft} 秒`;
    if (state.secondsLeft <= 0) {
      stopTimer();
      timeoutChoice();
    }
  }, 1000);
}
function setTurnLabel(text) { els.turnLabel.textContent = text; }
function resetSpriteSide(el) {
  el.style.transition = 'none';
  el.style.transform = '';
  el.offsetHeight;
  el.style.transition = '';
}
async function flashHit(el) {
  el.classList.add('hit-flash');
  await sleep(800);
  el.classList.remove('hit-flash');
}
function launchConfetti() {
  if (!els.confettiLayer) return;
  for (let i = 0; i < 26; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.top = `${-20 - Math.random() * 80}px`;
    piece.style.background = rand(confettiColors);
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    piece.style.animationDuration = `${2.2 + Math.random() * 1.2}s`;
    els.confettiLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 3200);
  }
}
function spawnFirework() {
  if (!els.fireworksLayer) return;
  const fw = document.createElement('div');
  fw.className = 'firework';
  fw.style.left = `${12 + Math.random() * 76}%`;
  fw.style.top = `${12 + Math.random() * 48}%`;
  fw.style.color = rand(fireworkColors);
  els.fireworksLayer.appendChild(fw);
  setTimeout(() => fw.remove(), 1300);
}
async function animateProjectile(attackerSide, projectileImg, hitTargetEl, hit = false, dodge = null) {
  const p = els.projectile;
  setProjectile(projectileImg);
  p.style.display = 'block';
  p.classList.remove('projectile-fly-left', 'projectile-fly-right');
  if (attackerSide === 'player') {
    p.style.left = '210px';
    p.style.right = 'auto';
    p.style.bottom = '20px';
    p.style.top = 'auto';
    p.style.transform = 'translate(0, 0)';
    requestAnimationFrame(() => p.classList.add('projectile-fly-right'));
  } else {
    p.style.right = '210px';
    p.style.left = 'auto';
    p.style.bottom = '20px';
    p.style.top = 'auto';
    p.style.transform = 'translate(0, 0)';
    requestAnimationFrame(() => p.classList.add('projectile-fly-left'));
  }
  await sleep(650);
  p.style.display = 'none';
  p.classList.remove('projectile-fly-left', 'projectile-fly-right');
  if (hit) await flashHit(hitTargetEl);
  if (dodge) await dodge();
}
function playTurnSound(side, kind) {
  const ch = getChar(side === 'player' ? currentPlayer() : currentEnemy());
  if (!ch) return;
  if (kind === 'walk') playAudio(ch['walk-sound']);
  if (kind === 'jump') playAudio(ch['jump-sound']);
  if (kind === 'attack') playAudio(ch['attack-sound']);
}
async function setPlayerPose(pose) {
  const ch = getChar(currentPlayer());
  if (!ch) return;
  if (pose === 'stand') setSprite(els.playerSprite, ch['stand-image']);
  if (pose === 'walk') setSprite(els.playerSprite, ch['walk-image'] || ch['stand-image']);
  if (pose === 'jump') setSprite(els.playerSprite, ch['jump-image'] || ch['stand-image']);
  if (pose === 'attack') setSprite(els.playerSprite, ch['attack-image'] || ch['stand-image']);
}
async function setEnemyPose(pose) {
  const ch = getChar(currentEnemy());
  if (!ch) return;
  if (pose === 'stand') setSprite(els.enemySprite, ch['stand-image']);
  if (pose === 'walk') setSprite(els.enemySprite, ch['walk-image'] || ch['stand-image']);
  if (pose === 'jump') setSprite(els.enemySprite, ch['jump-image'] || ch['stand-image']);
  if (pose === 'attack') setSprite(els.enemySprite, ch['attack-image'] || ch['stand-image']);
}
async function playerJumpUp() {
  const p = els.playerSprite;
  p.style.transition = 'transform 0.25s ease';
  p.style.transform = 'translateY(-200px)';
  await sleep(350);
  p.style.transform = 'translateY(0)';
  await sleep(250);
}
async function enemyJumpUp() {
  const e = els.enemySprite;
  e.style.transition = 'transform 0.25s ease';
  e.style.transform = 'translateY(-200px)';
  await sleep(350);
  e.style.transform = 'translateY(0)';
  await sleep(250);
}
async function playerAttack(success) {
  playTurnSound('player', 'attack');
  await setPlayerPose('attack');
  await animateProjectile(
    'player',
    getChar(currentPlayer())['attack-projectile'],
    els.enemySprite,
    success,
    success ? null : async () => {
      playTurnSound('enemy', 'jump');
      await setEnemyPose('jump');
      await enemyJumpUp();
      await setEnemyPose('stand');
    }
  );
  await setPlayerPose('stand');
}
async function enemyAttack(success) {
  playTurnSound('enemy', 'attack');
  await setEnemyPose('attack');
  await animateProjectile(
    'enemy',
    getChar(currentEnemy())['attack-projectile'],
    els.playerSprite,
    success,
    success ? null : async () => {
      playTurnSound('player', 'jump');
      await setPlayerPose('jump');
      await playerJumpUp();
      await setPlayerPose('stand');
    }
  );
  await setEnemyPose('stand');
}

async function chooseAnswer(opt) {
  if (!state.canChoose || state.busy || state.ended) return;
  state.canChoose = false;
  refreshOptionState();
  stopTimer();
  const isCorrect = opt === state.currentQuestion.answer;
  state.busy = true;

  if (isCorrect) {
    launchConfetti();
    playAudio('correct.mp3');
  } else {
    playAudio('wrong.mp3');
  }

  if (state.turn === 'player') {
    if (isCorrect) {
      banner('答對！命中敵人！');
      await playerAttack(true);
      state.enemyHp = clamp(state.enemyHp - 1, 0, state.enemyHpMax);
      updateHp();
      if (state.enemyHp <= 0) return clearEnemy();
      await sleep(700);
      await enemyTurn();
    } else {
      banner('答錯！敵人跳起閃避！');
      await playerAttack(false);
      await sleep(700);
      await enemyTurn();
    }
  } else {
    if (isCorrect) {
      banner('答對！成功閃避！');
      await enemyAttack(false);
      await sleep(700);
      await playerTurn();
    } else {
      banner('答錯！玩家被擊中！');
      await enemyAttack(true);
      state.playerHp = clamp(state.playerHp - 1, 0, state.playerHpMax);
      updateHp();
      if (state.playerHp <= 0) return gameOver();
      await sleep(700);
      await playerTurn();
    }
  }
  state.busy = false;
}

async function timeoutChoice() {
  if (state.busy || state.ended) return;
  state.busy = true;
  state.canChoose = false;
  refreshOptionState();
  playAudio('wrong.mp3');
  if (state.turn === 'player') {
    banner('超時！敵人跳起閃避！');
    await playerAttack(false);
    await sleep(700);
    await enemyTurn();
  } else {
    banner('超時！玩家被擊中！');
    await enemyAttack(true);
    state.playerHp = clamp(state.playerHp - 1, 0, state.playerHpMax);
    updateHp();
    if (state.playerHp <= 0) return gameOver();
    await sleep(700);
    await playerTurn();
  }
  state.busy = false;
}
function askQuestion() {
  const count = stageChoices[state.stage];
  renderQuestion(buildQuestion(count));
  state.canChoose = true;
  state.busy = false;
  refreshOptionState();
  startTurnCountdown();
}
async function playerTurn() {
  if (state.ended) return;
  state.turn = 'player';
  setTurnLabel('玩家回合：選出正確中文名字');
  askQuestion();
}
async function enemyTurn() {
  if (state.ended) return;
  state.turn = 'enemy';
  setTurnLabel('敵人回合：選出正確中文名字');
  askQuestion();
}

async function clearEnemy() {
  stopTimer();
  state.canChoose = false;
  refreshOptionState();
  banner('敵人倒下！');
  els.enemySprite.classList.add('fade-out');
  await sleep(1200);
  els.enemySprite.classList.remove('fade-out');
  els.enemySprite.style.display = 'none';
  els.enemySprite.style.opacity = '1';
  els.enemySprite.style.visibility = 'hidden';
  await playerWalkForward();

  state.stage += 1;
  if (state.stage > 5) return winGame();

  state.enemyName = enemyOrder[state.stage - 1];
  state.enemyHpMax = parseInt(getChar(state.enemyName).hp, 10);
  state.enemyHp = state.enemyHpMax;
  setBg(state.stage);
  applyStandings();
  updateHp();
  updateStageInfo();
  await sleep(300);
  await playerTurn();
}

async function playerWalkForward() {
  playTurnSound('player', 'walk');
  els.playerSprite.classList.add('walk-across');
  await setPlayerPose('walk');
  await sleep(1800);
  els.playerSprite.classList.remove('walk-across');
  els.playerSprite.style.left = window.innerWidth <= 900 ? '12px' : '24px';
  await setPlayerPose('stand');
  resetSpriteSide(els.playerSprite);
}

async function walkToCenterAndCelebrate() {
  playTurnSound('player', 'walk');
  els.playerSprite.classList.add('walk-center');
  await setPlayerPose('walk');
  await sleep(1800);
  //els.playerSprite.classList.remove('walk-center');
  await setPlayerPose('jump');
  els.playerSprite.classList.add('win-jump-loop');
}

function gameOver() {
  stopTimer();
  state.ended = true;
  state.canChoose = false;
  state.busy = false;
  refreshOptionState();
  setTurnLabel('遊戲結束');
  els.questionText.textContent = '玩家 HP 已歸零';
  els.timer.textContent = '';
  els.options.innerHTML = '';
  playAudio('lose.mp3');
  banner('Game Over', 1500);
  els.giveUpBtn.textContent = '重玩';
}

async function winGame() {
  stopTimer();
  state.ended = true;
  state.currentRunWon = true;
  state.canChoose = false;
  state.busy = false;
  refreshOptionState();
  setTurnLabel('恭喜通關🎉');
  els.questionText.textContent = '你已完成所有關卡！';
  els.timer.textContent = '';
  els.options.innerHTML = '';
  els.giveUpBtn.textContent = '重玩';
  playAudio('win.mp3');
  await walkToCenterAndCelebrate();
  spawnFirework();
  state.fireworkTimer = setInterval(spawnFirework, 650);
  banner('Congratulations!', 2000);
}

function prepareNewGameState() {
  state.playerName = qs('input[name="character"]:checked').value;
  state.playerHpMax = parseInt(qs('input[name="hpMode"]:checked').value, 10);
  state.playerHp = state.playerHpMax;
  state.stage = 1;
  state.enemyName = enemyOrder[0];
  state.enemyHpMax = parseInt(getChar(state.enemyName).hp, 10);
  state.enemyHp = state.enemyHpMax;
  state.turn = 'player';
  state.currentQuestion = null;
  state.canChoose = false;
  state.busy = false;
  state.ended = false;
  state.currentRunWon = false;
}

async function startGame() {
  stopTimer();
  prepareNewGameState();
  resetBattleVisuals();
  setScreen('game');
  setBg(1);
  applyStandings();
  updateHp();
  updateStageInfo();
  setTurnLabel('準備開始');
  els.questionText.textContent = '遊戲載入中...';
  els.timer.textContent = '';
  els.options.innerHTML = '';
  els.giveUpBtn.textContent = '放棄';
  await sleep(200);
  await playerTurn();
}

function backToHome() {
  stopTimer();
  stopWinEffects();
  state.canChoose = false;
  state.busy = false;
  state.ended = false;
  refreshOptionState();
  resetBattleVisuals();
  setScreen('home');
  els.questionText.textContent = '準備開始';
  els.timer.textContent = '';
  els.options.innerHTML = '';
  els.giveUpBtn.textContent = '放棄';
}

function bind() {
  els.startBtn.addEventListener('click', startGame);
  if (els.giveUpBtn) {
    els.giveUpBtn.addEventListener('click', () => {
      if (state.ended) {
        startGame();
        return;
      }
      const ok = confirm('你確定要放棄嗎？');
      if (ok) backToHome();
    });
  }
  window.addEventListener('resize', () => {
    setBg(state.stage);
    if (!state.ended) els.playerSprite.style.left = window.innerWidth <= 900 ? '12px' : '24px';
  });
}

function cacheEls() {
  els.homeScreen = byId('homeScreen');
  els.gameScreen = byId('gameScreen');
  els.startBtn = byId('startBtn');
  els.playerSprite = byId('playerSprite');
  els.enemySprite = byId('enemySprite');
  els.battleBg = byId('battleBackground');
  els.projectile = byId('projectile');
  els.playerHp = byId('playerHp');
  els.enemyHp = byId('enemyHp');
  els.stageInfo = byId('stageInfo');
  els.turnLabel = byId('turnLabel');
  els.questionText = byId('questionText');
  els.timer = byId('timerText');
  els.options = byId('optionsGrid');
  els.banner = byId('resultBanner');
  els.giveUpBtn = byId('giveUpBtn');
  els.battlefield = byId('battlefield');
  els.confettiLayer = byId('confettiLayer');
  els.fireworksLayer = byId('fireworksLayer');
}

async function init() {
  cacheEls();
  state.emojis = parseCSV(emojiCSV);
  state.characters = parseCSV(characterCSV);
  bind();
  setScreen('home');
  prepareNewGameState();
  setBg(1);
  resetBattleVisuals();
  applyStandings();
  updateHp();
  updateStageInfo();
  els.questionText.textContent = '準備開始';
  await preloadAssets();
}

init();