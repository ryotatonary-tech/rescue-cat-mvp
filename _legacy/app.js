// ====== 設定（MVP） ======
const STORAGE_KEY = "rescue_cat_mvp_v1";
const TICK_MINUTES = 5;

// tick（5分ごと）
const TICK = {
  hunger: +4,
  dirty: +3,
  stressBase: +2,
  stressDirtyBonusThreshold: 60,
  stressDirtyBonus: +1,
};

// 行動効果
const ACTIONS = {
  feed:  { hunger: -20, stress: -3, dirty: +0, trust: +1, label:"🍚 ごはん" },
  play:  { hunger: +6,  stress: -18, dirty: +0, trust: +2, label:"🧶 遊ぶ" },
  clean: { hunger: +0,  stress: -5,  dirty: -25, trust: +0, label:"🧼 掃除" },
  rest:  { hunger: +4,  stress: -12, dirty: +0, trust: +1, label:"💤 休む" },
};

// 信頼イベント（到達時に1回だけログに出す）
const TRUST_EVENTS = [
  { at: 5,  text: "ちらっ…（目が合った気がする）" },
  { at: 10, text: "2歩だけ近づいてきた" },
  { at: 15, text: "おもちゃを見てる" },
  { at: 20, text: "小さく「にゃ」って言った" },
  { at: 25, text: "ごはんのあとに座って待ってる" },
  { at: 30, text: "目の前で寝た" },
  { at: 40, text: "ゴロゴロ音が聞こえる" },
  { at: 50, text: "手にすりすりしてきた" },
  { at: 60, text: "ちょっとだけ抱っこOK" },
  { at: 75, text: "膝に乗ってきた（優勝）" },
];

function clamp(n, min=0, max=100){ return Math.max(min, Math.min(max, n)); }
function nowMs(){ return Date.now(); }
function fmt2(n){ return String(n).padStart(2,"0"); }

function defaultState(){
  return {
    cat: { name: "ミケ" },
    stats: { hunger: 30, stress: 20, dirty: 15, trust: 0 },
    lastTickAt: nowMs(),
    unlocked: { trustEvents: [] },
    logs: [
      makeLog("保護猫がやってきた。まずは距離感を大事にしよう。")
    ],
    homeNotice: null   // ← 追加
  };
}


function makeLog(text){
  const d = new Date();
  const stamp = `${fmt2(d.getMonth()+1)}/${fmt2(d.getDate())} ${fmt2(d.getHours())}:${fmt2(d.getMinutes())}`;
  return { text, stamp };
}

function load(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const data = JSON.parse(raw);
    // 簡易バリデーション
    if(!data?.stats || !data?.cat) return defaultState();
    return data;
  }catch{
    return defaultState();
  }
}

function save(state){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

let state = load();

// ====== UI 要素 ======
const screens = {
  home: document.getElementById("screenHome"),
  care: document.getElementById("screenCare"),
  log:  document.getElementById("screenLog"),
};
const tabs = Array.from(document.querySelectorAll(".tab"));

const catNameEl = document.getElementById("catName");
const catFaceEl = document.getElementById("catFace");
const tickTimerEl = document.getElementById("tickTimer");

const barHunger = document.getElementById("barHunger");
const barStress = document.getElementById("barStress");
const barDirty  = document.getElementById("barDirty");
const barTrust  = document.getElementById("barTrust");

const txtHunger = document.getElementById("txtHunger");
const txtStress = document.getElementById("txtStress");
const txtDirty  = document.getElementById("txtDirty");
const txtTrust  = document.getElementById("txtTrust");

const warningsEl = document.getElementById("warnings");
const lastResultEl = document.getElementById("lastResult");
const logListEl = document.getElementById("logList");

// ====== タブ切替 ======
function showTab(key){
  Object.values(screens).forEach(s => s.classList.remove("is-active"));
  tabs.forEach(t => t.classList.remove("is-active"));

  screens[key].classList.add("is-active");
  tabs.find(t => t.dataset.tab === key)?.classList.add("is-active");
}

tabs.forEach(t => {
  t.addEventListener("click", () => showTab(t.dataset.tab));
});

// ====== コア：tick処理 ======
function applyTickIfNeeded(){
  const intervalMs = TICK_MINUTES * 60 * 1000;
  const elapsed = nowMs() - state.lastTickAt;

  if(elapsed < intervalMs) return;

  const ticks = Math.floor(elapsed / intervalMs);
  for(let i=0;i<ticks;i++){
    // 空腹・汚れ
    state.stats.hunger = clamp(state.stats.hunger + TICK.hunger);
    state.stats.dirty  = clamp(state.stats.dirty  + TICK.dirty);

    // ストレス
    let stressInc = TICK.stressBase;
    if(state.stats.dirty >= TICK.stressDirtyBonusThreshold) stressInc += TICK.stressDirtyBonus;
    state.stats.stress = clamp(state.stats.stress + stressInc);
  }

  state.lastTickAt += ticks * intervalMs;

  // 放置でも変化が見えるよう、tick後に軽ログ（多すぎ防止でたまに）
  if(ticks >= 2){
    pushLog(`時間がたった。様子を見てみよう（+${ticks}tick）`);
  }

  unlockTrustEvents();
  save(state);
}

// 次tickまでの表示
function updateTickTimer(){
  const intervalMs = TICK_MINUTES * 60 * 1000;
  const elapsed = nowMs() - state.lastTickAt;
  const remain = clamp(intervalMs - elapsed, 0, intervalMs);
  const mm = Math.floor(remain / 60000);
  const ss = Math.floor((remain % 60000) / 1000);
  tickTimerEl.textContent = `次の変化まで：あと ${fmt2(mm)}:${fmt2(ss)}`;
}

// ====== 行動 ======
function doAction(key){
    state.homeNotice = null;

  applyTickIfNeeded();

  const a = ACTIONS[key];
  if(!a) return;

  // trustが低い間は「遊ぶ」が少し効きにくい
  let trustGain = a.trust;
  if(key === "play" && state.stats.trust < 15) trustGain = 1;

  // 反映
  state.stats.hunger = clamp(state.stats.hunger + a.hunger);
  state.stats.stress = clamp(state.stats.stress + a.stress);
  state.stats.dirty  = clamp(state.stats.dirty  + a.dirty);
  state.stats.trust  = clamp(state.stats.trust  + trustGain);

  // 結果メッセージ（ゆるかわ）
  const msg = makeActionMessage(key, trustGain);
  lastResultEl.textContent = msg;
  pushLog(`${a.label}：${msg}`);

  

  unlockTrustEvents();
  save(state);
  render();
}

function makeActionMessage(key, trustGain){
  const s = state.stats;
  switch(key){
    case "feed":
      return (s.hunger < 30) ? "おなか満足…💤" : "もぐもぐ…おいしい！";
    case "play":
      return (trustGain === 1) ? "ちょっとだけ興味ある…" : "たのしい！またやろ！";
    case "clean":
      return (s.dirty < 20) ? "ここ、きれい。いいね。" : "すっきり！呼吸しやすい！";
    case "rest":
      return (s.stress < 30) ? "落ち着いた…" : "ふぅ…ちょっと安心。";
    default:
      return "…";
  }
}

// ====== イベント解放 ======
function unlockTrustEvents(){
  const unlocked = new Set(state.unlocked?.trustEvents || []);
  for(const ev of TRUST_EVENTS){
    if(state.stats.trust >= ev.at && !unlocked.has(ev.at)){
      unlocked.add(ev.at);
      pushLog(`💗 信頼イベント：${ev.text}`);
state.homeNotice = `💗 ${ev.text}`;

    }
  }
  state.unlocked.trustEvents = Array.from(unlocked).sort((a,b)=>a-b);
}

// ====== ログ ======
function pushLog(text){
  state.logs.unshift(makeLog(text));
  // ログが増えすぎないよう制限
  if(state.logs.length > 60) state.logs.length = 60;
}

// ====== レンダリング ======
function render(){
  applyTickIfNeeded();

  catNameEl.textContent = state.cat.name;

  // バー（hunger/stress/dirty は「悪いほど大きい」→赤）
  setBar(barHunger, state.stats.hunger, false);
  setBar(barStress, state.stats.stress, false);
  setBar(barDirty,  state.stats.dirty,  false);
  // trustは「良いほど大きい」→水色
  setBar(barTrust,  state.stats.trust,  true);

  txtHunger.textContent = state.stats.hunger;
  txtStress.textContent = state.stats.stress;
  txtDirty.textContent  = state.stats.dirty;
  txtTrust.textContent  = state.stats.trust;

  // 警告（ゲームオーバー無し）
  warningsEl.innerHTML = "";
  const warns = [];
  if(state.stats.hunger >= 90) warns.push("おなかぺこぺこ…🍚");
  if(state.stats.stress >= 90) warns.push("ちょっと距離ほしい…💭");
  if(state.stats.dirty  >= 90) warns.push("ここ、きもちわるい…🧼");
  warns.forEach(w => {
    const div = document.createElement("div");
    div.className = "warn";
    div.textContent = w;
    warningsEl.appendChild(div);
  });

  // ログ
  logListEl.innerHTML = "";
  state.logs.forEach(item => {
    const d = document.createElement("div");
    d.className = "log-item";
    d.innerHTML = `<div>${escapeHtml(item.text)}</div><div class="log-time">${item.stamp}</div>`;
    logListEl.appendChild(d);
  });

  updateTickTimer();

  // HOME 通知表示
const noticeEl = document.getElementById("homeNotice");
if(noticeEl){
  if(state.homeNotice){
    noticeEl.textContent = state.homeNotice;
    noticeEl.hidden = false;
  }else{
    noticeEl.hidden = true;
  }
}

}

function setBar(el, value, isGood){
  const v = clamp(value, 0, 100);
  el.style.width = `${v}%`;
  if(isGood){
    el.classList.add("bar-good");
  }else{
    el.classList.remove("bar-good");
  }
}

function escapeHtml(s){
  return String(s)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function updateCatFace(){
  const img = document.getElementById("catPhoto");
  const { hunger, stress, dirty, trust } = state.stats;

  if(stress >= 85 || hunger >= 85 || dirty >= 85){
    img.src = "./sad-cat.png";
  }else if(trust >= 75){
    img.src = "./happy-cat.png";
  }else{
    img.src = "./normal-cat.png";
  }
}


// ====== イベント：ボタン類 ======
document.querySelectorAll(".action").forEach(btn => {
  btn.addEventListener("click", () => doAction(btn.dataset.action));
});

document.getElementById("btnRename").addEventListener("click", () => {
  const name = prompt("猫の名前を入力してね（例：ミケ）", state.cat.name);
  if(name === null) return;
  const trimmed = name.trim().slice(0, 12);
  if(!trimmed) return;
  state.cat.name = trimmed;
  pushLog(`名前が「${trimmed}」になった。`);
  save(state);
  render();
});

document.getElementById("btnReset").addEventListener("click", () => {
  const ok = confirm("はじめからにしますか？（今のデータは消えます）");
  if(!ok) return;
  state = defaultState();
  save(state);
  lastResultEl.textContent = "なにをする？";
  render();
});

document.getElementById("btnClearLog").addEventListener("click", () => {
  const ok = confirm("ログを消しますか？（状態は消えません）");
  if(!ok) return;
  state.logs = [makeLog("ログを消した。お世話は続く。")];
  save(state);
  render();
});

// 起動
render();
updateCatFace();
setInterval(() => {
  render();
}, 1000);
