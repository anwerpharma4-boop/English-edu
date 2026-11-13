/* ===================== English Stars — تطبيق تعليم الإنجليزية للأطفال ===================== */
'use strict';
const $ = s => document.querySelector(s);
const main = () => $('#main');
const rand = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const sample = (a, n) => shuffle(a).slice(0, n);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- التخزين (بأمان) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};
let settings = Object.assign({accent:'en-GB', rate:0.85, arabic:true, sfx:true}, store.get('ee_settings', {}));
let profiles = store.get('ee_profiles', []);
let currentId = store.get('ee_current', null);
const me = () => profiles.find(p => p.id === currentId);
const save = () => { store.set('ee_profiles', profiles); store.set('ee_current', currentId); store.set('ee_settings', settings); };

/* ---------- كل الكلمات ---------- */
const ALL_WORDS = TOPICS.flatMap(t => t.words.map(([w, pic, ar]) => ({w, pic, ar, topic:t.id})));
const SIMPLE_WORDS = (() => { const seen = new Set(); return ALL_WORDS.filter(x => /^[a-z]+$/.test(x.w) && !seen.has(x.w) && seen.add(x.w) && !/^\d+$/.test(x.pic)); })();
const LETTER_NAMES_GB = {a:'ay',b:'bee',c:'see',d:'dee',e:'ee',f:'eff',g:'jee',h:'aitch',i:'eye',j:'jay',k:'kay',l:'ell',m:'em',n:'en',o:'oh',p:'pee',q:'cue',r:'ar',s:'ess',t:'tee',u:'you',v:'vee',w:'double you',x:'ex',y:'why',z:'zed'};
const letterName = l => (l === 'z' && settings.accent === 'en-US') ? 'zee' : LETTER_NAMES_GB[l];

/* ---------- النطق (متوافق مع آيفون/آيباد/أندرويد) ---------- */
let voices = [];
const synth = window.speechSynthesis;
const loadVoices = () => { voices = (synth && synth.getVoices()) || []; };
if (synth) {
  loadVoices(); synth.onvoiceschanged = loadVoices;
  // بعض أجهزة أندرويد لا ترسل حدث تحميل الأصوات — نعيد المحاولة
  let tries = 0; const poll = setInterval(() => { loadVoices(); if (voices.length || ++tries > 20) clearInterval(poll); }, 250);
}
const englishVoices = () => voices.filter(v => /^en/i.test((v.lang || '').replace('_', '-')));
function pickVoice() {
  const lang = settings.accent;
  const list = voices.filter(v => v.lang && v.lang.replace('_', '-').startsWith(lang));
  const pref = list.find(v => /natural|enhanced|premium|google|libby|sonia|serena|samantha|kate|martha/i.test(v.name));
  return pref || list[0] || englishVoices()[0] || null;
}
function altVoice() { const main = pickVoice(); const list = englishVoices().filter(v => v !== main && v.lang.replace('_', '-').startsWith(settings.accent)); return list.find(v => /male|daniel|arthur|george|fred|alex|oliver/i.test(v.name)) || list[0] || main; }

// فتح الصوت: المتصفحات لا تسمح بالصوت قبل أول لمسة من المستخدم
let audioUnlocked = false;
function unlockAudio() {
  try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume();
    const b = actx.createBuffer(1, 1, 22050), src = actx.createBufferSource(); src.buffer = b; src.connect(actx.destination); src.start(0); } catch (e) {}
  if (synth && !audioUnlocked) { try { const u = new SpeechSynthesisUtterance(' '); u.volume = 0; synth.speak(u); } catch (e) {} }
  audioUnlocked = true;
}
['pointerdown', 'touchend', 'keydown'].forEach(ev => document.addEventListener(ev, unlockAudio, {capture:true, passive:true}));

let speakToken = 0; const _keep = [];
function speak(text, {rate, pitch, alt, onend, onboundary} = {}) {
  if (!synth) { toast('النطق غير مدعوم هنا — افتح التطبيق في Safari أو Chrome'); onend && setTimeout(onend, 300); return; }
  text = String(text).replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}\u{20E3}]/gu, '').replace(/\*\*/g, '').replace(/→/g, ', ').replace(/\s+/g, ' ').trim();
  if (!text) { onend && setTimeout(onend, 50); return; }
  const my = ++speakToken;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = settings.accent; u.rate = rate || settings.rate; u.pitch = pitch || 1.1; u.volume = 1;
  const v = alt ? altVoice() : pickVoice(); if (v) { u.voice = v; u.lang = v.lang; }
  // نضمن استدعاء onend مرة واحدة حتى لو علِق محرك الصوت
  let finished = false; let guard;
  const finish = () => { if (finished) return; finished = true; clearTimeout(guard); if (onend && my === speakToken) onend(); };
  u.onend = finish; u.onerror = e => { if (e && e.error === 'not-allowed') showSoundGate(); finish(); };
  if (onboundary) u.onboundary = onboundary;
  _keep.push(u); if (_keep.length > 5) _keep.shift(); // منع حذف الجملة من الذاكرة قبل نطقها (خلل في Chrome)
  const go = () => {
    if (my !== speakToken) return;
    try { synth.resume(); synth.speak(u); } catch (e) { finish(); return; }
    guard = setTimeout(finish, 2500 + text.length * 140 / (u.rate || 1));
  };
  if (synth.speaking || synth.pending) { synth.cancel(); setTimeout(go, 90); } // الإلغاء ثم النطق فوراً يُسكت الصوت في بعض المتصفحات
  else go();
}
// شاشة "اضغط للبدء" — تمنح المتصفح اللمسة الأولى اللازمة لتشغيل الصوت
function showSoundGate() {
  if (document.querySelector('.sound-gate')) return;
  const o = document.createElement('div'); o.className = 'overlay sound-gate';
  o.innerHTML = `<button class="modal" style="border:none;cursor:pointer"><div class="emoji">🔊</div><h2>اضغط هنا لنبدأ!</h2><p class="en" style="font-size:22px">Tap to start</p></button>`;
  o.onclick = () => { unlockAudio(); o.remove(); speak("Hello! Let's learn English!"); };
  document.body.appendChild(o);
}
// نطق سلسلة متتابعة مع دالة لكل خطوة (للتهجئة والأناشيد)
function speakSeq(items, each, done, gap = 250) {
  let i = 0; let stopped = false;
  const next = () => {
    if (stopped) return;
    if (i >= items.length) { done && done(); return; }
    const it = items[i]; each && each(i, it);
    speak(it.say, {rate: it.rate, onend: () => setTimeout(next, gap)});
    i++;
  };
  next();
  return () => { stopped = true; speakToken++; if (synth) synth.cancel(); };
}

/* ---------- التعرف على الصوت (قل الكلمة) ---------- */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function listen(expected, cb) {
  if (!SR) { toast('الميكروفون غير مدعوم هنا — جرّب متصفح Chrome'); return; }
  const r = new SR(); r.lang = settings.accent; r.interimResults = false; r.maxAlternatives = 5;
  toast('🎤 أنا أسمعك… قل الكلمة');
  const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  const target = norm(expected);
  r.onresult = e => {
    const alts = Array.from(e.results[0]).map(a => norm(a.transcript));
    const ok = alts.some(a => a === target || a.includes(target) || (target.length > 6 && similarity(a, target) > .75) || (target.length <= 6 && similarity(a, target) > .66));
    cb(ok, alts[0]);
  };
  r.onerror = () => toast('لم أسمع جيداً، حاول مرة أخرى 🙂');
  r.start();
}
function similarity(a, b) { // Levenshtein
  const m = a.length, n = b.length; if (!m || !n) return 0;
  const d = Array.from({length:m + 1}, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i-1][j] + 1, d[i][j-1] + 1, d[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
  return 1 - d[m][n] / Math.max(m, n);
}
function sayIt(word, el) {
  listen(word, (ok, heard) => {
    if (ok) { sfx('good'); praise(); addStars(1); confetti(40); }
    else { sfx('bad'); toast(`سمعت: "${heard}" — حاول مرة أخرى 💪`); speak(word); }
  });
}

/* ---------- المؤثرات الصوتية ---------- */
let actx;
function tone(freq, dur, type = 'sine', when = 0, vol = .18) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq; o.connect(g); g.connect(actx.destination);
    const t = actx.currentTime + when; g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
    o.start(t); o.stop(t + dur);
  } catch (e) {}
}
function sfx(kind) {
  if (!settings.sfx) return;
  if (kind === 'good') { tone(660, .15, 'triangle'); tone(880, .15, 'triangle', .12); tone(1320, .25, 'triangle', .24); }
  else if (kind === 'bad') { tone(220, .25, 'sawtooth', 0, .08); tone(180, .3, 'sawtooth', .15, .08); }
  else if (kind === 'pop') { tone(900, .08, 'square', 0, .1); tone(500, .1, 'square', .05, .08); }
  else if (kind === 'tap') tone(700, .06, 'sine', 0, .1);
  else if (kind === 'win') [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone(f, .2, 'triangle', i * .13));
}
const PRAISE = ['Well done!', 'Brilliant!', 'Super star!', 'Amazing!', 'Great job!', 'Fantastic!', 'You did it!', 'Excellent!'];
const praise = () => speak(rand(PRAISE));

/* ---------- الاحتفال ---------- */
function confetti(n = 120) {
  const c = $('#confetti'); const ctx = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const cols = ['#FF6B9D','#FECA57','#1DD1A1','#54A0FF','#8E6CFF','#FF9F43'];
  const ps = Array.from({length:n}, () => ({x:Math.random()*c.width, y:-20-Math.random()*c.height*.5, vx:(Math.random()-.5)*4, vy:2+Math.random()*4, s:6+Math.random()*8, r:Math.random()*6, c:rand(cols)}));
  let f = 0;
  (function loop() {
    ctx.clearRect(0, 0, c.width, c.height);
    ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.r += .1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s/2, -p.s/4, p.s, p.s/2); ctx.restore(); });
    if (++f < 160) requestAnimationFrame(loop); else ctx.clearRect(0, 0, c.width, c.height);
  })();
}
function toast(msg) {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}
function modal(html, onClose) {
  const o = document.createElement('div'); o.className = 'overlay';
  o.innerHTML = `<div class="modal">${html}<div class="btnrow"><button class="btn green" data-close>رائع! 👍</button></div></div>`;
  o.querySelector('[data-close]').onclick = () => { o.remove(); onClose && onClose(); };
  document.body.appendChild(o);
}

/* ---------- النجوم والملصقات ---------- */
function addStars(n) {
  const p = me(); if (!p) return;
  const before = Math.floor(p.stars / 10);
  p.stars += n; save(); updateTopbar();
  const after = Math.floor(p.stars / 10);
  if (after > before) {
    const st = STICKERS[(after - 1) % STICKERS.length];
    if (!p.stickers.includes(st)) p.stickers.push(st); save();
    setTimeout(() => { sfx('win'); confetti(); modal(`<div class="emoji">${st}</div><h2>ملصق جديد!</h2><p>جمعت ${p.stars} نجمة ⭐</p>`); speak('You got a new sticker!'); }, 600);
  }
}
const mark = (key, id) => { const p = me(); if (!p) return false; p[key] = p[key] || {}; const isNew = !p[key][id]; p[key][id] = true; save(); if (key === 'words' && typeof srsAdd === 'function') srsAdd('w:' + id); return isNew; };

/* ---------- الواجهة العامة ---------- */
function setTitle(t, showBack = true) {
  $('#title').textContent = t;
  $('#backBtn').style.visibility = showBack ? 'visible' : 'hidden';
}
function updateTopbar() {
  const p = me();
  $('#starCount').textContent = p ? p.stars : 0;
  $('#avatarBtn').textContent = p ? p.avatar : '👤';
}
let cleanup = null;
function render(html) { main().innerHTML = html; window.scrollTo(0, 0); }
function go(hash) { if (location.hash.slice(1) === hash) route(); else location.hash = hash; }

const MASCOT_TIPS = ['اضغط على أي صورة لتسمع الكلمة 🔊', 'قلّد الحركة مع كل صوت، هكذا تتذكره أسرع 🤸', 'كل 10 نجوم = ملصق جديد 🎁', 'قل الكلمة بصوت عالٍ بالضغط على 🎤', 'تدرّب 15 دقيقة كل يوم أفضل من ساعة مرة واحدة ⏰', 'اكتب الحرف بإصبعك في الهواء قبل أن تكتبه 👆'];
function mascotTalk(msg) {
  document.querySelectorAll('.bubble').forEach(b => b.remove());
  const b = document.createElement('div'); b.className = 'bubble'; b.textContent = msg || rand(MASCOT_TIPS);
  document.body.appendChild(b); setTimeout(() => b.remove(), 4500);
}

/* ===================== الشاشات ===================== */
const views = {};

/* ---- الملفات الشخصية ---- */
views.profiles = () => {
  setTitle('من سيتعلم اليوم؟', profiles.length > 0 && !!me());
  render(`<p class="title">👋 أهلاً! اختر بطلنا</p>
   <div class="profiles">${profiles.map(p => `<button class="card profile" data-act="pickProfile" data-arg="${p.id}"><span class="emoji">${p.avatar}</span><div class="label">${esc(p.name)}</div><div class="small">⭐ ${p.stars}</div></button>`).join('')}
   <button class="card profile" data-act="newProfile"><span class="emoji">➕</span><div class="label">طفل جديد</div></button></div>`);
};
views.newprofile = () => {
  setTitle('طفل جديد', profiles.length > 0);
  let av = AVATARS[0];
  render(`<div class="lesson"><p class="title">ما اسمك؟ 😊</p><input class="txt" id="pname" placeholder="اكتب الاسم" maxlength="16">
   <p class="title">اختر صورتك</p><div class="av-pick">${AVATARS.map((a, i) => `<button class="${i ? '' : 'on'}" data-av="${a}">${a}</button>`).join('')}</div>
   <div class="btnrow"><button class="btn green" id="createP">ابدأ المغامرة 🚀</button></div></div>`);
  main().querySelectorAll('[data-av]').forEach(b => b.onclick = () => { main().querySelectorAll('[data-av]').forEach(x => x.classList.remove('on')); b.classList.add('on'); av = b.dataset.av; sfx('tap'); });
  $('#createP').onclick = () => {
    const name = $('#pname').value.trim() || 'بطل';
    const p = {id:'p' + Date.now(), name, avatar:av, stars:0, stickers:[], letters:{}, traced:{}, words:{}, best:{}};
    profiles.push(p); currentId = p.id; save(); updateTopbar(); go('home');
    speak(`Hello ${/^[a-z ]+$/i.test(name) ? name : 'friend'}! Let's learn English!`);
  };
};

/* ---- الرئيسية ---- */
views.home = () => {
  const p = me();
  setTitle('English Stars ⭐', false);
  const pal = ['#FF6B9D','#FF9F43','#EE5A24','#10AC84','#8E6CFF','#1DD1A1','#0ABDE3','#54A0FF','#F368E0','#5F27CD','#FF6B6B','#00B894','#E17055','#009432','#0652DD','#6C5CE7'];
  const lettersDone = Object.keys(p.letters || {}).length;
  const today = new Date().toDateString(), yest = new Date(Date.now() - 864e5).toDateString();
  if (p.lastDay !== today) { p.streak = p.lastDay === yest ? (p.streak || 0) + 1 : 1; p.lastDay = today; save(); }
  const due = typeof srsDue === 'function' ? srsDue().length : 0;
  render(`<p class="title">مرحباً ${esc(p.name)} ${p.avatar} <span class="pill" style="display:inline-flex;font-size:16px;vertical-align:middle">🔥 ${p.streak} ${p.streak > 1 ? 'أيام متتالية' : 'يوم'}</span></p>
   <div class="hero">
     <button class="card level hero-main" style="background:linear-gradient(135deg,#FF6B9D,#FF9F43)" data-go="act"><span class="emoji">🎬</span><span class="label">كلمات تتحرك</span><span class="small">شاهد <span class="en">"Go!"</span> و <span class="en">"Come here!"</span> وافهم بدون ترجمة</span></button>
     <button class="card level" style="background:linear-gradient(135deg,#8E6CFF,#54A0FF)" data-go="review"><span class="emoji">🧠</span><span class="label">مراجعة اليوم</span><span class="small">${due ? `${due} كلمة تنتظرك` : 'ثبّت ما تعلمته'}</span>${due ? `<span class="badge" style="background:#FF6B6B;color:#fff;font-size:16px">${due}</span>` : ''}</button>
     <button class="card level" style="background:linear-gradient(135deg,#1DD1A1,#10AC84)" data-go="games"><span class="emoji">🎮</span><span class="label">العب وتعلّم</span><span class="small">${GAMES.length} ألعاب للحفظ والنطق والكتابة</span></button>
   </div>
   <p class="sub">رحلتك من الصفر إلى الإتقان — ابدأ من رقم 1 وتقدّم خطوة خطوة</p>
   <div class="progressbar" title="الحروف"><div style="width:${lettersDone / 26 * 100}%"></div></div>
   <p class="sub">تعلمت ${lettersDone} من 26 حرفاً · ⭐ ${p.stars} نجمة · 🎁 ${p.stickers.length} ملصق</p>
   <div class="grid big">${LEVELS.map((l, i) => `<button class="card level" style="background:${pal[i]}" data-go="${l.view}">
      <span class="num">${l.n}</span><span class="emoji">${l.icon}</span><span class="label">${l.title}</span><span class="small en">${l.en} · ${l.year}</span></button>`).join('')}
   </div>
   <div class="btnrow" style="margin-top:24px"><button class="btn yellow" data-go="stickers">🎁 دفتر الملصقات</button><button class="btn ghost" data-go="settings">⚙️ الإعدادات</button><button class="btn ghost" data-go="parents">👨‍👩‍👧 دليل الأهل</button></div>`);
};

/* ---- 1. الحروف ---- */
let lettersOrder = 'phonics';
views.letters = () => {
  setTitle('الحروف وأصواتها 🔤');
  const p = me();
  const list = lettersOrder === 'abc' ? LETTERS.slice().sort((a, b) => a.l.localeCompare(b.l)) : LETTERS;
  render(`<p class="sub">رتّبنا الحروف كما في المدارس البريطانية: نبدأ بـ <b class="en">s a t p i n</b> لأننا نستطيع بها تكوين كلمات بسرعة!</p>
   <div class="tabs"><button class="${lettersOrder === 'phonics' ? 'on' : ''}" data-act="lettersOrder" data-arg="phonics">ترتيب الصوتيات 🇬🇧</button><button class="${lettersOrder === 'abc' ? 'on' : ''}" data-act="lettersOrder" data-arg="abc">ترتيب ABC</button></div>
   <div class="btnrow"><button class="btn pink" id="abcSong">🎵 أنشودة الحروف</button></div>
   <div class="grid">${list.map(L => `<button class="card letter-card ${p.letters[L.l] ? 'done' : ''}" data-go="letter/${LETTERS.indexOf(L)}" id="lc-${L.l}">
     <div class="big en">${L.l.toUpperCase()}${L.l}</div><div style="font-size:36px">${L.pic}</div><div class="small en">${L.word}</div></button>`).join('')}</div>`);
  $('#abcSong').onclick = () => {
    const abc = 'abcdefghijklmnopqrstuvwxyz'.split('');
    if (cleanup) cleanup();
    cleanup = speakSeq(abc.map(l => ({say:letterName(l), rate:1})), (i, it) => {
      document.querySelectorAll('.letter-card').forEach(c => c.style.transform = '');
      const el = $('#lc-' + abc[i]); if (el) { el.style.transform = 'scale(1.15) rotate(-4deg)'; el.scrollIntoView({block:'nearest', behavior:'smooth'}); }
    }, () => { document.querySelectorAll('.letter-card').forEach(c => c.style.transform = ''); speak('Now I know my A B C!'); }, 80);
  };
};
views.letter = (i) => {
  i = +i; const L = LETTERS[i]; if (!L) return go('letters');
  setTitle(`الحرف ${L.l.toUpperCase()}`);
  const w = L.word; const idx = w.indexOf(L.l);
  const wordHtml = idx >= 0 ? `${w.slice(0, idx)}<span class="hl">${L.l}</span>${w.slice(idx + 1)}` : w;
  const ex = SIMPLE_WORDS.filter(x => x.w[0] === L.l && x.w !== w).slice(0, 4);
  render(`<div class="lesson">
    <div class="huge en"><span>${L.l.toUpperCase()}</span><span>${L.l}</span></div>
    <div class="btnrow">
      <button class="btn purple" data-act="say" data-arg="${letterName(L.l)}">🅰️ اسم الحرف</button>
      <button class="btn pink" id="sndBtn">🔉 صوت الحرف</button>
      <button class="btn green" id="allBtn">▶️ اسمع الكل</button>
    </div>
    <div class="pic">${L.pic}</div>
    <div class="word-big en" data-act="say" data-arg="${w}" style="cursor:pointer">${wordHtml}</div>
    ${settings.arabic ? `<div class="small">${L.ar}</div>` : ''}
    <div class="actionbox">🤸 <b>حركة الحرف:</b> ${L.action}</div>
    <div class="btnrow"><button class="btn orange" data-act="sayIt" data-arg="${w}">🎤 قلها أنت</button><button class="btn yellow" data-go="trace/${L.l}">✍️ اكتب الحرف</button></div>
    ${ex.length ? `<p class="sub">كلمات أخرى تبدأ بـ <b class="en">${L.l}</b>:</p><div class="btnrow">${ex.map(x => `<button class="btn ghost en" data-act="say" data-arg="${x.w}">${x.pic} ${x.w}</button>`).join('')}</div>` : ''}
    <div class="navrow"><button class="btn ghost" data-go="letter/${(i + LETTERS.length - 1) % LETTERS.length}">→ السابق</button><button class="btn ghost" data-go="letters">كل الحروف</button><button class="btn ghost" data-go="letter/${(i + 1) % LETTERS.length}">التالي ←</button></div>
  </div>`);
  const learn = () => { if (mark('letters', L.l)) { addStars(1); toast('⭐ تعلمت حرفاً جديداً!'); } };
  $('#sndBtn').onclick = () => { speak(L.sound, {rate:.7}); learn(); };
  $('#allBtn').onclick = () => { if (cleanup) cleanup(); cleanup = speakSeq([{say:letterName(L.l)}, {say:L.sound, rate:.7}, {say:L.sound, rate:.7}, {say:w}], null, learn, 350); };
  setTimeout(() => speak(`${letterName(L.l)}. ${w}`), 300);
};

/* ---- 2. الكتابة (التتبع) ---- */
views.trace = (target) => {
  setTitle('تعلّم الكتابة ✍️');
  if (!target) {
    const p = me();
    render(`<p class="sub">اختر حرفاً واكتبه بإصبعك فوق الخطوط — ابدأ من الأعلى دائماً ⬇️</p>
     <div class="tabs"><button class="on" data-tab="lower">حروف صغيرة a</button><button data-tab="upper">حروف كبيرة A</button><button data-tab="words">كلمات</button></div>
     <div class="grid" id="tgrid"></div>`);
    const fill = tab => {
      let items = tab === 'words' ? SIMPLE_WORDS.filter(x => x.w.length <= 5).slice(0, 60).map(x => [x.w, x.pic]) : 'abcdefghijklmnopqrstuvwxyz'.split('').map(l => [tab === 'upper' ? l.toUpperCase() : l, (LETTERS.find(x => x.l === l) || {}).pic]);
      $('#tgrid').innerHTML = items.map(([t, pic]) => `<button class="card letter-card ${p.traced[t] ? 'done' : ''}" data-go="trace/${encodeURIComponent(t)}"><div class="big en" style="font-size:${t.length > 1 ? 30 : 54}px">${t}</div><div style="font-size:28px">${pic || ''}</div></button>`).join('');
    };
    fill('lower');
    main().querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { main().querySelectorAll('[data-tab]').forEach(x => x.classList.remove('on')); b.classList.add('on'); fill(b.dataset.tab); });
    return;
  }
  target = decodeURIComponent(target);
  const info = SIMPLE_WORDS.find(x => x.w === target) || LETTERS.find(x => x.l === target.toLowerCase()) || {};
  render(`<div class="q-head"><span style="font-size:48px">${info.pic || '✏️'}</span> <button class="btn purple en" data-act="say" data-arg="${target.length === 1 ? letterName(target.toLowerCase()) : target}">🔊 ${esc(target)}</button></div>
    <div class="tracer-wrap"><canvas id="tc" width="1000" height="560"></canvas></div>
    <div class="colors">${['#8E6CFF','#FF6B9D','#1DD1A1','#54A0FF','#FF9F43','rainbow'].map((c, i) => `<button data-col="${c}" class="${i ? '' : 'on'}" style="background:${c === 'rainbow' ? 'conic-gradient(red,orange,yellow,green,blue,violet,red)' : c}"></button>`).join('')}</div>
    <div class="stars" id="tstars"></div>
    <div class="btnrow"><button class="btn red" id="tclear">🧽 امسح</button><button class="btn green" id="tcheck">✅ انتهيت</button><button class="btn ghost" data-go="trace">🔤 حرف آخر</button></div>
    <div class="note">💡 للأهل: اطلب من طفلك أن يكتب الحرف في الهواء بإصبعه أولاً، ثم على الشاشة، ثم على ورقة بالقلم. الكتابة بالحركة الكبيرة ثم الصغيرة تثبّت شكل الحرف.</div>`);
  makeTracer($('#tc'), target);
};
function makeTracer(canvas, text) {
  const ctx = canvas.getContext('2d'); const W = canvas.width, H = canvas.height;
  const user = document.createElement('canvas'); user.width = W; user.height = H; const uctx = user.getContext('2d');
  const guide = document.createElement('canvas'); guide.width = W; guide.height = H; const gctx = guide.getContext('2d');
  const base = H * .7, xh = H * .25; // خطوط الكتابة
  let color = '#8E6CFF', hue = 0, strokes = [], drawing = false, last = null;
  const fontSize = () => { let s = 380; gctx.font = `700 ${s}px Andika`; while (gctx.measureText(text).width > W * .9 && s > 60) { s -= 10; gctx.font = `700 ${s}px Andika`; } return s; };
  let fs = 380;
  function drawGuideMask() {
    gctx.clearRect(0, 0, W, H); gctx.font = `700 ${fs}px Andika`; gctx.textAlign = 'center'; gctx.textBaseline = 'alphabetic';
    gctx.fillStyle = '#000'; gctx.fillText(text, W / 2, base);
  }
  function paint() {
    ctx.clearRect(0, 0, W, H); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
    // خطوط الكراسة البريطانية (4 خطوط)
    [[base - fs * .72, '#FFB3C7'], [base - fs * .5 + 8, '#B8E0FF'], [base, '#FF6B9D'], [base + fs * .22, '#B8E0FF']].forEach(([y, c], k) => {
      ctx.strokeStyle = c; ctx.lineWidth = k === 2 ? 5 : 3; ctx.setLineDash(k === 1 ? [16, 12] : []); ctx.beginPath(); ctx.moveTo(20, y); ctx.lineTo(W - 20, y); ctx.stroke();
    });
    ctx.setLineDash([]);
    ctx.font = `700 ${fs}px Andika`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#EEEAFB'; ctx.fillText(text, W / 2, base);
    ctx.setLineDash([10, 10]); ctx.lineWidth = 4; ctx.strokeStyle = '#B9AEE8'; ctx.strokeText(text, W / 2, base); ctx.setLineDash([]);
    ctx.drawImage(user, 0, 0);
  }
  const init = () => { fs = fontSize(); drawGuideMask(); paint(); };
  (document.fonts && document.fonts.load ? document.fonts.load('700 380px Andika').catch(() => {}) : Promise.resolve()).then(init);
  init();
  const pos = e => { const r = canvas.getBoundingClientRect(); return {x:(e.clientX - r.left) * W / r.width, y:(e.clientY - r.top) * H / r.height}; };
  const lw = () => Math.max(18, fs * .085);
  canvas.addEventListener('pointerdown', e => { drawing = true; last = pos(e); canvas.setPointerCapture(e.pointerId); dot(last); });
  canvas.addEventListener('pointermove', e => { if (!drawing) return; const p = pos(e); line(last, p); last = p; });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(ev => canvas.addEventListener(ev, () => drawing = false));
  function stroke() { if (color === 'rainbow') { hue = (hue + 4) % 360; return `hsl(${hue},90%,58%)`; } return color; }
  function dot(p) { uctx.fillStyle = stroke(); uctx.beginPath(); uctx.arc(p.x, p.y, lw() / 2, 0, 7); uctx.fill(); paint(); }
  function line(a, b) { uctx.strokeStyle = stroke(); uctx.lineWidth = lw(); uctx.lineCap = 'round'; uctx.beginPath(); uctx.moveTo(a.x, a.y); uctx.lineTo(b.x, b.y); uctx.stroke(); paint(); }
  document.querySelectorAll('[data-col]').forEach(b => b.onclick = () => { document.querySelectorAll('[data-col]').forEach(x => x.classList.remove('on')); b.classList.add('on'); color = b.dataset.col; });
  $('#tclear').onclick = () => { uctx.clearRect(0, 0, W, H); paint(); $('#tstars').textContent = ''; };
  $('#tcheck').onclick = () => {
    const g = gctx.getImageData(0, 0, W, H).data, u = uctx.getImageData(0, 0, W, H).data;
    // قناع مُوسّع للحرف للتسامح مع اهتزاز اليد
    const dil = document.createElement('canvas'); dil.width = W; dil.height = H; const dctx = dil.getContext('2d');
    dctx.font = `700 ${fs}px Andika`; dctx.textAlign = 'center'; dctx.lineJoin = 'round'; dctx.lineWidth = lw() * 1.6; dctx.strokeStyle = '#000';
    dctx.fillText(text, W / 2, base); dctx.strokeText(text, W / 2, base);
    const d = dctx.getImageData(0, 0, W, H).data;
    let gTot = 0, gHit = 0, uTot = 0, uIn = 0;
    for (let y = 0; y < H; y += 4) for (let x = 0; x < W; x += 4) {
      const k = (y * W + x) * 4 + 3;
      if (g[k] > 100) { gTot++; if (u[k] > 50) gHit++; }
      if (u[k] > 50) { uTot++; if (d[k] > 50) uIn++; }
    }
    if (uTot < 20) { toast('اكتب الحرف أولاً بإصبعك ☝️'); return; }
    const cov = gHit / gTot, acc = uIn / uTot, score = cov * .65 + acc * .35;
    const st = score > .72 ? 3 : score > .55 ? 2 : score > .35 ? 1 : 0;
    $('#tstars').textContent = st ? '⭐'.repeat(st) : '💪';
    if (st >= 2) { sfx('good'); confetti(60); praise(); if (mark('traced', text)) addStars(st); }
    else if (st === 1) { sfx('tap'); speak('Good try! Try again.'); toast('محاولة جيدة! حاول أن تغطي الحرف كله'); }
    else { sfx('bad'); toast('اتبع شكل الحرف المنقّط 🙂'); }
  };
}

/* ---- 3. الأصوات المركبة ---- */
views.digraphs = () => {
  setTitle('الأصوات المركّبة 🔊');
  render(`<p class="sub">حرفان (أو ثلاثة) يصنعون صوتاً واحداً! مثل <b class="en">sh</b> في <b class="en">ship</b></p>
   <div class="grid">${DIGRAPHS.map((D, i) => `<button class="card letter-card ${me().letters['dg_' + D.g] ? 'done' : ''}" data-go="digraph/${i}"><div class="big en" style="color:var(--purple)">${D.g}</div><div style="font-size:36px">${D.pic}</div><div class="small en">${D.words[0]}</div></button>`).join('')}</div>`);
};
views.digraph = (i) => {
  i = +i; const D = DIGRAPHS[i]; if (!D) return go('digraphs');
  setTitle(`الصوت ${D.g}`);
  const hl = w => w.replace(D.g, `<span class="hl">${D.g}</span>`);
  render(`<div class="lesson"><div class="huge en"><span>${D.g}</span></div>
   <div class="btnrow"><button class="btn pink" data-act="snd" data-arg="${D.sound}">🔉 اسمع الصوت</button></div>
   <div class="pic">${D.pic}</div>
   <div class="actionbox">🤸 <b>الحركة:</b> ${D.action}</div>
   <div class="btnrow">${D.words.map(w => `<button class="btn ghost word-big en" style="font-size:34px" data-act="sayDigraph" data-arg="${w}">${hl(w)}</button>`).join('')}</div>
   <p class="sub">اضغط على الكلمة: نقسّمها لأصوات ثم نركّبها (Sound it out → Blend it!)</p>
   <div class="btnrow">${D.words.map(w => `<button class="btn orange" data-act="sayIt" data-arg="${w}">🎤 ${w}</button>`).join('')}</div>
   <div class="navrow"><button class="btn ghost" data-go="digraph/${(i + DIGRAPHS.length - 1) % DIGRAPHS.length}">→ السابق</button><button class="btn ghost" data-go="digraphs">الكل</button><button class="btn ghost" data-go="digraph/${(i + 1) % DIGRAPHS.length}">التالي ←</button></div></div>`);
  if (mark('letters', 'dg_' + D.g)) addStars(1);
  setTimeout(() => speak(D.words[0]), 300);
};

/* ---- 4. المواضيع والكلمات ---- */
views.topics = () => {
  setTitle('الكلمات والصور 🖼️');
  const p = me();
  render(`<p class="sub">${ALL_WORDS.length} كلمة مع صورها — اضغط لتسمع</p>
   <div class="grid">${TOPICS.map(t => { const done = t.words.filter(w => p.words[w[0]]).length; return `<button class="card" style="background:${t.color};color:#fff" data-go="topic/${t.id}"><span class="emoji">${t.icon}</span><div class="label">${t.name}</div><div class="small" style="color:#fffc">${done}/${t.words.length}</div></button>`; }).join('')}</div>`);
};
views.topic = (id) => {
  const t = TOPICS.find(x => x.id === id); if (!t) return go('topics');
  setTitle(`${t.icon} ${t.name}`);
  const p = me();
  render(`<div class="btnrow"><button class="btn green" data-go="flash/${id}/0">🃏 بطاقات تعليمية</button><button class="btn pink" data-go="quiz/listen/${id}">📝 اختبرني</button><button class="btn purple" data-go="game/memory/${id}">🧠 لعبة الذاكرة</button>${id === 'actions' ? '<button class="btn orange" data-go="game/simon">🤸 Simon Says</button>' : ''}</div>
   <div class="grid">${t.words.map(([w, pic, ar], i) => `<button class="card ${p.words[w] ? 'letter-card done' : ''}" data-act="sayWord" data-arg="${w}"><span class="emoji">${pic}</span><div class="label en">${w}</div>${settings.arabic ? `<div class="small">${ar}</div>` : ''}</button>`).join('')}</div>`);
};
views.flash = (id, i) => {
  const t = TOPICS.find(x => x.id === id); if (!t) return go('topics'); i = +i;
  const [w, pic, ar] = t.words[i];
  setTitle(`${t.name} ${i + 1}/${t.words.length}`);
  render(`<div class="lesson"><div class="pic" style="font-size:clamp(110px,28vw,180px)">${pic}</div>
   <div class="slots" id="spell">${w.split('').map(c => `<span class="w en" style="font-size:clamp(40px,10vw,70px);font-weight:700">${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div>
   ${settings.arabic ? `<div class="sub">${ar}</div>` : ''}
   <div class="btnrow"><button class="btn purple" data-act="sayWord" data-arg="${w}">🔊 اسمع</button><button class="btn pink" id="spellBtn">🔡 تهجئة</button><button class="btn orange" data-act="sayIt" data-arg="${w}">🎤 قلها</button>${/^[a-z]+$/.test(w) && w.length <= 6 ? `<button class="btn yellow" data-go="trace/${w}">✍️ اكتبها</button>` : ''}</div>
   <div class="navrow"><button class="btn ghost" data-go="flash/${id}/${(i + t.words.length - 1) % t.words.length}">→ السابق</button><button class="btn ghost" data-go="topic/${id}">الكل</button><button class="btn ghost" data-go="flash/${id}/${(i + 1) % t.words.length}">التالي ←</button></div></div>`);
  $('#spellBtn').onclick = () => {
    const spans = [...document.querySelectorAll('#spell .w')]; const chars = w.split('');
    if (cleanup) cleanup();
    cleanup = speakSeq([...chars.filter(c => c !== ' ').map(c => ({say:letterName(c), rate:1})), {say:w}], k => { spans.forEach(s => s.classList.remove('on')); let n = -1, idx = -1; chars.forEach((c, j) => { if (c !== ' ') { n++; if (n === k) idx = j; } }); if (idx >= 0) spans[idx].classList.add('on'); }, () => spans.forEach(s => s.classList.remove('on')), 120);
  };
  if (mark('words', w)) addStars(0);
  setTimeout(() => speak(w), 250);
};

/* ---- 5. الكلمات الصعبة ---- */
views.tricky = () => {
  setTitle('الكلمات الصعبة ⭐');
  const words = [...new Set(TRICKY)];
  render(`<p class="sub">هذه كلمات لا تُقرأ بالتهجئة العادية — نحفظها بالنظر! (Tricky Words)</p>
   <div class="btnrow"><button class="btn pink" data-go="quiz/tricky">📝 اختبرني</button><button class="btn purple" data-go="game/memorytricky">🧠 لعبة الذاكرة</button></div>
   <div class="grid">${words.map(w => `<button class="card" data-act="sayWord" data-arg="${w}"><div class="label en" style="font-size:34px">${w}</div></button>`).join('')}</div>`);
};

/* ---- 6. التمارين ---- */
const EXERCISES = [
  {id:'listen', icon:'👂', name:'اسمع واختر الصورة', en:'Listen & choose'},
  {id:'picword', icon:'🖼️', name:'انظر واختر الكلمة', en:'Read & choose'},
  {id:'first', icon:'🔤', name:'ما أول صوت؟', en:'First sound'},
  {id:'missing', icon:'❓', name:'الحرف الناقص', en:'Missing letter'},
  {id:'spell', icon:'🧩', name:'رتّب الحروف', en:'Spell the word'},
  {id:'case', icon:'🔠', name:'الكبير والصغير', en:'Big & small letters'},
  {id:'sentence', icon:'🧱', name:'رتّب الجملة', en:'Build a sentence'},
  {id:'tricky', icon:'⭐', name:'الكلمات الصعبة', en:'Tricky words'},
  {id:'speak', icon:'🎤', name:'تكلّم!', en:'Say it'},
];
let level = store.get('ee_level', 'easy');
views.exercises = () => {
  setTitle('التمارين 📝');
  render(`<div class="tabs">${[['easy', 'سهل 🐣'], ['mid', 'متوسط 🐥'], ['hard', 'متقدم 🦅']].map(([k, n]) => `<button class="${level === k ? 'on' : ''}" data-act="setLevel" data-arg="${k}">${n}</button>`).join('')}</div>
   <div class="grid">${EXERCISES.map(e => `<button class="card" data-go="quiz/${e.id}"><span class="emoji">${e.icon}</span><div class="label">${e.name}</div><div class="small en">${e.en}</div>${me().best[e.id] ? `<span class="badge">${me().best[e.id]}/10</span>` : ''}</button>`).join('')}</div>`);
};
const poolFor = topic => {
  let pool = topic ? SIMPLE_WORDS.filter(x => x.topic === topic) : SIMPLE_WORDS;
  if (!topic) pool = pool.filter(x => level === 'easy' ? x.w.length <= 4 : level === 'mid' ? x.w.length <= 6 : true);
  return pool.length >= 4 ? pool : SIMPLE_WORDS;
};
function choices(correct, pool, n, key = 'w') {
  const others = shuffle(pool.filter(x => x[key] !== correct[key] && x.pic !== correct.pic));
  const out = [correct]; for (const o of others) { if (out.length >= n) break; if (!out.some(x => x[key] === o[key])) out.push(o); }
  return shuffle(out);
}
const QUIZ = {
  listen(topic) { const pool = poolFor(topic); const c = rand(pool); const opts = choices(c, pool, 4);
    return {prompt:`<button class="listen-big" data-act="sayWord" data-arg="${c.w}">🔊</button><p class="sub">اسمع… أين الصورة؟</p>`, say:c.w,
      options:opts.map(o => ({html:`<span class="emoji">${o.pic}</span>`, ok:o === c})), after:c.w}; },
  picword(topic) { const pool = poolFor(topic); const c = rand(pool); const opts = choices(c, pool, 4);
    return {prompt:`<div class="pic">${c.pic}</div><p class="sub">ما اسم هذه الصورة؟</p>`,
      options:opts.map(o => ({html:`<span class="label en" style="font-size:28px">${o.w}</span>`, ok:o === c})), after:c.w}; },
  first() { const pool = poolFor(); const c = rand(pool); const letters = shuffle([c.w[0], ...sample('abcdefghijklmnoprstuwy'.split('').filter(l => l !== c.w[0]), 2)]);
    return {prompt:`<div class="pic">${c.pic}</div><p class="sub">بأي صوت تبدأ <button class="btn ghost en" data-act="sayWord" data-arg="${c.w}">🔊 ${c.w.replace(/./g, (ch, i) => i ? '_' : '?')}</button></p>`, say:c.w,
      options:letters.map(l => ({html:`<span class="huge en" style="font-size:64px">${l}</span>`, ok:l === c.w[0]})), after:c.w, cols:3}; },
  missing() { const pool = poolFor().filter(x => x.w.length >= 3); const c = rand(pool); const k = Math.floor(Math.random() * c.w.length); const ans = c.w[k];
    const vowels = 'aeiou'; const dist = sample((vowels.includes(ans) ? vowels : 'bcdfghlmnprst').split('').filter(l => l !== ans), 2);
    return {prompt:`<div class="pic">${c.pic}</div><div class="slots">${c.w.split('').map((ch, i) => `<span class="slot ${i === k ? '' : 'filled'}">${i === k ? '?' : ch}</span>`).join('')}</div>`, say:c.w,
      options:shuffle([ans, ...dist]).map(l => ({html:`<span class="huge en" style="font-size:60px">${l}</span>`, ok:l === ans})), after:c.w, cols:3}; },
  case() { const L = rand(LETTERS); const up = Math.random() < .5; const shown = up ? L.l.toUpperCase() : L.l;
    const opts = shuffle([L.l, ...sample('abdeghmnqrty'.split('').filter(l => l !== L.l), 3)]);
    return {prompt:`<div class="huge en">${shown}</div><p class="sub">${up ? 'أين الحرف الصغير؟' : 'أين الحرف الكبير؟'}</p>`, say:letterName(L.l),
      options:opts.map(l => ({html:`<span class="huge en" style="font-size:64px">${up ? l : l.toUpperCase()}</span>`, ok:l === L.l})), after:letterName(L.l)}; },
  tricky() { const words = [...new Set(TRICKY)]; const c = rand(words); const opts = shuffle([c, ...sample(words.filter(w => w !== c), 3)]);
    return {prompt:`<button class="listen-big" data-act="sayWord" data-arg="${c}">🔊</button><p class="sub">اسمع… أين الكلمة؟</p>`, say:c,
      options:opts.map(o => ({html:`<span class="label en" style="font-size:34px">${o}</span>`, ok:o === c})), after:c}; },
  spell: 'custom', sentence: 'custom', speak: 'custom',
};
views.quiz = (type, topic) => {
  const unit = UNIT_BY_ID[type]; const mixYear = /^mix_\d$/.test(type) ? +type.slice(4) : 0;
  let deck = null;
  if (unit) deck = shuffle(unit.items.map(it => ({it, unit})));
  if (mixYear) deck = shuffle(UNITS.filter(u => u.year === mixYear && u.items).flatMap(u => u.items.map(it => ({it, unit:u}))));
  const ex = unit ? {icon:unit.icon, name:unit.title} : mixYear ? {icon:'🏆', name:`اختبار Year ${mixYear} الشامل`} : (EXERCISES.find(e => e.id === type) || {name:'اختبار', icon:'📝'});
  setTitle(`${ex.icon} ${ex.name}`);
  const back = unit ? `unit/${unit.id}` : mixYear ? `year/${mixYear}` : (typeof QUIZ_BACK !== 'undefined' && QUIZ_BACK[type]) || 'exercises';
  const N = mixYear ? 15 : 10; let q = 0, score = 0;
  const next = () => {
    if (q >= N) return finishQuiz(type, score, N, back);
    q++;
    const head = `<div class="progressbar"><div style="width:${(q - 1) / N * 100}%"></div></div><p class="sub">سؤال ${q} من ${N} · ✅ ${score}</p>`;
    let Q;
    const done = ok => { if (ok) score++; setTimeout(next, ok ? 1300 : (Q && Q.reveal ? 2600 : 1600)); };
    if (type === 'spell') return spellQ(head, topic, done);
    if (type === 'sentence') return sentenceQ(head, done);
    if (type === 'speak') return speakQ(head, topic, done);
    Q = deck ? unitQuestion(deck[(q - 1) % deck.length]) : (QUIZ[type] || QUIZ.listen)(topic);
    render(`${head}${unit || mixYear ? `<p class="sub">${deck[(q - 1) % deck.length].unit.icon} ${deck[(q - 1) % deck.length].unit.en}</p>` : ''}<div class="q-head">${Q.prompt}</div><div class="options" style="${Q.cols === 3 ? 'grid-template-columns:repeat(3,1fr)' : Q.cols === 1 ? 'grid-template-columns:1fr;max-width:640px' : ''}">${Q.options.map((o, i) => `<button class="card" data-i="${i}" style="${Q.cols === 1 ? 'min-height:70px' : ''}">${o.html}</button>`).join('')}</div><div id="qreveal"></div>`);
    if (Q.say) setTimeout(() => speak(Q.say), 300);
    let answered = false;
    main().querySelectorAll('.options .card').forEach(b => b.onclick = () => {
      if (answered) return; const o = Q.options[+b.dataset.i];
      if (Q.reveal) setTimeout(() => { const r = $('#qreveal'); if (r) r.innerHTML = Q.reveal; }, 50);
      if (o.ok) { answered = true; b.classList.add('correct'); sfx('good'); speak(Q.after); done(true); }
      else { b.classList.add('wrong'); sfx('bad'); answered = true; main().querySelectorAll('.options .card').forEach((x, j) => { if (Q.options[j].ok) x.classList.add('correct'); }); speak(Q.after); done(false); }
    });
  };
  next();
};
function spellQ(head, topic, done) {
  const pool = poolFor(topic).filter(x => x.w.length <= (level === 'hard' ? 8 : level === 'mid' ? 6 : 4));
  const c = rand(pool.length ? pool : SIMPLE_WORDS.filter(x => x.w.length <= 4));
  const letters = c.w.split(''); let filled = []; let mistakes = 0;
  render(`${head}<div class="q-head"><div class="pic">${c.pic}</div><button class="btn ghost" data-act="sayWord" data-arg="${c.w}">🔊 اسمع</button></div>
    <div class="slots">${letters.map((_, i) => `<span class="slot" id="s${i}"></span>`).join('')}</div>
    <div class="tiles">${shuffle(letters.map((l, i) => ({l, i}))).map(t => `<button class="tile en" data-l="${t.l}">${t.l}</button>`).join('')}</div>
    <div class="btnrow"><button class="btn ghost" id="undo">↩️ تراجع</button></div>`);
  setTimeout(() => speak(c.w), 300);
  main().querySelectorAll('.tile').forEach(b => b.onclick = () => {
    const pos = filled.length;
    if (b.dataset.l === letters[pos]) {
      filled.push(b); b.disabled = true; const s = $('#s' + pos); s.textContent = b.dataset.l; s.classList.add('filled'); speak(letterName(b.dataset.l), {rate:1.1});
      if (filled.length === letters.length) { sfx('good'); setTimeout(() => speak(c.w), 500); done(mistakes < 2); }
    } else { mistakes++; sfx('bad'); b.animate([{transform:'translateX(-6px)'}, {transform:'translateX(6px)'}, {transform:'none'}], {duration:300}); }
  });
  $('#undo').onclick = () => { const b = filled.pop(); if (!b) return; b.disabled = false; const s = $('#s' + filled.length); s.textContent = ''; s.classList.remove('filled'); };
}
function sentenceQ(head, done) {
  const s = rand(SENTENCES); const words = s.replace('.', '').split(' '); let built = [];
  render(`${head}<div class="q-head"><button class="listen-big" data-act="say" data-arg="${s}">🔊</button><p class="sub">رتّب الكلمات لتصنع الجملة</p></div>
   <div class="slots" id="built" style="min-height:70px;background:#fff;border-radius:20px;padding:10px"></div>
   <div class="tiles">${shuffle(words.map((w, i) => ({w, i}))).map(t => `<button class="tile word en" data-w="${t.w}">${t.w}</button>`).join('')}</div>
   <div class="btnrow"><button class="btn ghost" id="reset">↩️ من جديد</button></div>`);
  setTimeout(() => speak(s), 300);
  let mistakes = 0;
  const btns = [...main().querySelectorAll('.tile')];
  btns.forEach(b => b.onclick = () => {
    if (b.dataset.w === words[built.length]) {
      built.push(b.dataset.w); b.disabled = true; sfx('tap');
      $('#built').innerHTML = built.map(w => `<span class="tile word en" style="background:var(--green);box-shadow:none">${w}</span>`).join('') + (built.length === words.length ? '<span class="tile word">.</span>' : '');
      if (built.length === words.length) { sfx('good'); speak(s); done(mistakes < 2); }
    } else { mistakes++; sfx('bad'); b.animate([{transform:'translateX(-6px)'}, {transform:'translateX(6px)'}, {transform:'none'}], {duration:300}); }
  });
  $('#reset').onclick = () => { built = []; btns.forEach(b => b.disabled = false); $('#built').innerHTML = ''; };
}
function speakQ(head, topic, done) {
  if (!SR) { render(`<div class="lesson"><div class="emoji" style="font-size:80px">🎤</div><p>التعرف على الصوت يعمل في متصفح Chrome على أندرويد والكمبيوتر، و Safari على الآيفون/الآيباد.</p><button class="btn" data-go="exercises">رجوع</button></div>`); return; }
  const c = rand(poolFor(topic));
  render(`${head}<div class="lesson"><div class="pic">${c.pic}</div><div class="word-big en">${c.w}</div>
   <div class="btnrow"><button class="btn purple" data-act="sayWord" data-arg="${c.w}">🔊 اسمع أولاً</button><button class="btn pink" id="mic" style="font-size:26px">🎤 دورك!</button><button class="btn ghost" id="skip">تخطَّ ⏭️</button></div><div class="stars" id="res"></div></div>`);
  setTimeout(() => speak(c.w), 300);
  let tries = 0;
  $('#mic').onclick = () => listen(c.w, (ok, heard) => {
    tries++;
    if (ok) { $('#res').textContent = '⭐⭐⭐'; sfx('good'); praise(); done(true); }
    else { $('#res').textContent = `🤔 "${heard}"`; sfx('bad'); if (tries >= 3) done(false); else speak(c.w); }
  });
  $('#skip').onclick = () => done(false);
}
function finishQuiz(type, score, N, back = 'exercises') {
  const p = me(); p.best[type] = Math.max(p.best[type] || 0, score); save();
  const pct = score / N; const st = pct >= .9 ? 3 : pct >= .7 ? 2 : pct >= .4 ? 1 : 0;
  render(`<div class="lesson"><div class="emoji" style="font-size:100px">${st === 3 ? '🏆' : st === 2 ? '🥈' : st ? '👍' : '💪'}</div>
   <p class="title">${score} من ${N}</p><div class="stars">${'⭐'.repeat(st)}</div>
   <p class="sub">${st === 3 ? 'ممتاز! أنت نجم!' : st === 2 ? 'رائع جداً! استمر' : st ? 'جيد! تدرّب أكثر لتحصل على نجوم أكثر' : 'لا بأس! المحاولة طريق النجاح'}</p>
   <div class="btnrow"><button class="btn green" data-act="reload">🔁 مرة أخرى</button><button class="btn ghost" data-go="${back}">${back === 'exercises' ? 'تمارين أخرى' : 'رجوع للدرس'}</button></div></div>`);
  if (st) { sfx('win'); confetti(); addStars(st); speak(st === 3 ? 'Fantastic! You are a super star!' : 'Well done!'); }
}

/* ---- 7. الألعاب ---- */
const GAMES = [
  {id:'act:guess', icon:'🕵️', name:'شاهد وخمّن', en:'Watch the scene, guess the word', skill:'👀 الفهم'},
  {id:'act:boss', icon:'🎤', name:'أنت المدير!', en:'Say it — the character does it', skill:'🗣️ النطق'},
  {id:'monster', icon:'👾', name:'أطعم الوحش', en:'Spell the word to feed him', skill:'✍️ الكتابة'},
  {id:'act:scene', icon:'👂', name:'اسمع واختر المشهد', en:'Listen & pick the scene', skill:'👂 الاستماع'},
  {id:'balloons', icon:'🎈', name:'فرقع البالون', en:'Pop the letter you hear'},
  {id:'memory', icon:'🧠', name:'لعبة الذاكرة', en:'Match picture & word', skill:'🧠 الحفظ'},
  {id:'simon', icon:'🤸', name:'Simon Says', en:'Listen & move!', skill:'🤸 الحركة'},
  {id:'race', icon:'⏱️', name:'سباق الكلمات', en:'60-second race'},
  {id:'memorytricky', icon:'⭐', name:'ذاكرة الكلمات الصعبة', en:'Tricky words match'},
];
views.games = () => {
  setTitle('الألعاب 🎮');
  render(`<p class="sub">كل لعبة تقوّي مهارة: 👀 الفهم · 🗣️ النطق · ✍️ الكتابة · 🧠 الحفظ</p><div class="grid big">${GAMES.map((g, i) => `<button class="card level" style="background:${['#FF6B9D','#FF9F43','#8E6CFF','#1DD1A1','#54A0FF','#EE5A24','#10AC84','#F368E0','#0ABDE3'][i % 9]}" data-go="${g.id.startsWith('act:') ? 'actgame/' + g.id.slice(4) : g.id === 'monster' ? 'monster' : 'game/' + g.id}"><span class="emoji">${g.icon}</span><span class="label">${g.name}</span><span class="small en">${g.en}</span>${g.skill ? `<span class="small" style="background:#fff3;border-radius:99px;padding:0 10px">${g.skill}</span>` : ''}${me().best['g_' + g.id] ? `<span class="badge" style="color:#2d3047">🏅 ${me().best['g_' + g.id]}</span>` : ''}</button>`).join('')}</div>`);
};
views.game = (id, arg) => ({balloons:gameBalloons, memory:gameMemory, memorytricky:() => gameMemory(null, true), simon:gameSimon, race:gameRace}[id] || (() => go('games')))(arg);

function gameBalloons() {
  setTitle('🎈 فرقع البالون');
  const pool = LETTERS.slice(0, Math.max(6, Math.min(26, Object.keys(me().letters).length + 4)));
  let target, score = 0, round = 0, alive = true, balloons = [];
  render(`<p class="sub">اسمع الحرف وفرقع البالون الصحيح! <button class="btn ghost" id="again">🔊 أعد</button> · ✅ <b id="bs">0</b>/10</p><div class="sky" id="sky"><div class="cloud" style="top:20px">☁️</div><div class="cloud" style="top:120px;animation-delay:-12s">☁️</div></div>`);
  const sky = $('#sky'); const cols = ['#FF6B9D','#FECA57','#1DD1A1','#54A0FF','#8E6CFF','#FF9F43'];
  const newTarget = () => { target = rand(pool); speak(`Find ${letterName(target.l)}. ${target.sound}`); };
  $('#again').onclick = () => speak(`${letterName(target.l)}`);
  const spawn = () => {
    if (!alive) return;
    const L = Math.random() < .4 ? target : rand(pool);
    const b = document.createElement('div'); b.className = 'balloon en'; b.textContent = Math.random() < .5 ? L.l : L.l.toUpperCase();
    b.style.background = `radial-gradient(circle at 30% 30%,#fff8,${rand(cols)} 40%)`; b.style.left = (5 + Math.random() * 80) + '%';
    const obj = {el:b, y:-140, v:.9 + Math.random() * .9 + round * .05, l:L.l}; balloons.push(obj); sky.appendChild(b);
    b.onpointerdown = () => {
      if (b.classList.contains('popped')) return;
      if (obj.l === target.l) { b.classList.add('popped'); sfx('pop'); score++; round++; $('#bs').textContent = score; setTimeout(() => b.remove(), 300); balloons = balloons.filter(x => x !== obj);
        if (score >= 10) { alive = false; confetti(); sfx('win'); addStars(3); setBest('balloons', 10); modal('<div class="emoji">🎈🏆</div><h2>فزت!</h2><p>فرقعت 10 بالونات صحيحة</p>', () => go('games')); speak('You win!'); }
        else { sfx('good'); setTimeout(newTarget, 500); } }
      else { sfx('bad'); b.animate([{transform:'rotate(-15deg)'}, {transform:'rotate(15deg)'}, {transform:'none'}], {duration:300}); speak(letterName(obj.l)); }
    };
  };
  newTarget();
  let t = 0; const H = () => sky.clientHeight;
  (function loop() {
    if (!alive || !document.body.contains(sky)) { alive = false; return; }
    if (++t % 70 === 0) spawn();
    balloons.forEach(o => { o.y += o.v; o.el.style.bottom = o.y + 'px'; if (o.y > H() + 20) { o.el.remove(); o.dead = true; } });
    balloons = balloons.filter(o => !o.dead);
    requestAnimationFrame(loop);
  })();
  spawn();
  cleanup = () => { alive = false; };
}
function setBest(id, v) { const p = me(); if ((p.best['g_' + id] || 0) < v) { p.best['g_' + id] = v; save(); } }

function gameMemory(topic, tricky) {
  setTitle(tricky ? '⭐ ذاكرة الكلمات الصعبة' : '🧠 لعبة الذاكرة');
  let pairs;
  if (tricky) { const w = sample([...new Set(TRICKY)], 6); pairs = w.map(x => [x, x.toUpperCase() === x ? x : x]); }
  else { const pool = topic ? SIMPLE_WORDS.filter(x => x.topic === topic) : SIMPLE_WORDS.filter(x => x.w.length <= 6); pairs = sample(pool.length >= 6 ? pool : SIMPLE_WORDS, 6).map(x => [x.w, x.pic]); }
  const cards = shuffle(pairs.flatMap(([w, pic], i) => [{k:i, face:w, en:true, w}, {k:i, face:tricky ? `<span style="font-size:.8em">🔊</span>` : pic, w}]));
  let open = [], matched = 0, moves = 0, lock = false;
  render(`<p class="sub">اقلب بطاقتين: ${tricky ? 'كلمة مع صوتها 🔊' : 'صورة مع كلمتها'} · المحاولات: <b id="mv">0</b></p>
   <div class="memory">${cards.map((c, i) => `<button class="mcard" data-i="${i}"><div class="in"><div class="f">⭐</div><div class="b ${c.en ? 'en' : ''}">${c.face}</div></div></button>`).join('')}</div>`);
  main().querySelectorAll('.mcard').forEach(b => b.onclick = () => {
    const c = cards[+b.dataset.i];
    if (lock || b.classList.contains('flip')) return;
    b.classList.add('flip'); speak(c.w); open.push([b, c]);
    if (open.length === 2) {
      moves++; $('#mv').textContent = moves; lock = true;
      const [[b1, c1], [b2, c2]] = open;
      if (c1.k === c2.k) { setTimeout(() => { b1.classList.add('matched'); b2.classList.add('matched'); sfx('good'); open = []; lock = false; matched++;
        if (matched === pairs.length) { confetti(); sfx('win'); const st = moves <= 9 ? 3 : moves <= 14 ? 2 : 1; addStars(st); setBest(tricky ? 'memorytricky' : 'memory', st); modal(`<div class="emoji">🧠🏆</div><h2>أحسنت!</h2><p>أنهيتها في ${moves} محاولة</p><div class="stars">${'⭐'.repeat(st)}</div>`, () => views.game(tricky ? 'memorytricky' : 'memory', topic)); praise(); } }, 500); }
      else setTimeout(() => { b1.classList.remove('flip'); b2.classList.remove('flip'); open = []; lock = false; }, 1100);
    }
  });
}

// Simon Says — الاستجابة الجسدية الكاملة (TPR): الطفل يسمع ويتحرك
const SIMON = [
  ['Jump!', '🤸', 'اقفز'], ['Clap your hands!', '👏', 'صفّق'], ['Touch your nose!', '👃', 'المس أنفك'], ['Touch your head!', '🙆', 'المس رأسك'],
  ['Stand up!', '🧍', 'قف'], ['Sit down!', '🪑', 'اجلس'], ['Turn around!', '🔄', 'استدر'], ['Wave your hand!', '👋', 'لوّح بيدك'],
  ['Stamp your feet!', '🦶', 'اضرب الأرض بقدميك'], ['Touch your ears!', '👂', 'المس أذنيك'], ['Open your mouth!', '😮', 'افتح فمك'], ['Close your eyes!', '😌', 'أغمض عينيك'],
  ['Hop on one leg!', '🦩', 'اقفز على رجل واحدة'], ['Swim like a fish!', '🏊', 'اسبح كالسمكة'], ['Fly like a bird!', '🕊️', 'طر كالعصفور'], ['Shake your body!', '💃', 'هزّ جسمك'],
  ['Touch your toes!', '🦶', 'المس أصابع قدميك'], ['Smile!', '😁', 'ابتسم'], ['Point to the door!', '🚪', 'أشر إلى الباب'], ['Raise your hands!', '🙌', 'ارفع يديك'],
];
function gameSimon() {
  setTitle('🤸 Simon Says');
  let n = 0, cur;
  render(`<div class="lesson"><p class="sub">اسمع الأمر وقم بالحركة! إذا قال <b class="en">"Simon says"</b> افعلها، وإذا لم يقلها… لا تتحرك! 😄</p>
   <div class="pic" id="se" style="font-size:130px">🤸</div><div class="word-big en" id="st">Ready?</div><div class="sub" id="sa"></div>
   <div class="btnrow"><button class="btn green" id="snext" style="font-size:24px">▶️ أمر جديد</button><button class="btn ghost" id="srep">🔊 أعد</button></div>
   <p class="sub">الأوامر: <b id="sn">0</b></p></div>`);
  const nextCmd = () => {
    cur = rand(SIMON); const simon = Math.random() < .75; n++;
    $('#se').textContent = cur[1]; $('#st').textContent = (simon ? 'Simon says: ' : '') + cur[0];
    $('#sa').textContent = settings.arabic ? (simon ? 'سايمون يقول: ' : '⚠️ لم يقل سايمون! ') + cur[2] : '';
    $('#sn').textContent = n; speak((simon ? 'Simon says, ' : '') + cur[0]);
    if (n % 5 === 0) addStars(1);
  };
  $('#snext').onclick = nextCmd; $('#srep').onclick = () => speak($('#st').textContent);
}

function gameRace() {
  setTitle('⏱️ سباق الكلمات');
  let score = 0, time = 60, timer;
  const q = () => {
    const pool = SIMPLE_WORDS.filter(x => x.w.length <= 6); const c = rand(pool); const opts = choices(c, pool, 4);
    $('#rq').innerHTML = `<div class="pic" style="animation:none">${c.pic}</div>`;
    $('#ro').innerHTML = opts.map(o => `<button class="card" data-w="${o.w}"><span class="label en" style="font-size:26px">${o.w}</span></button>`).join('');
    $('#ro').querySelectorAll('.card').forEach(b => b.onclick = () => {
      if (b.dataset.w === c.w) { score++; $('#rs').textContent = score; sfx('good'); b.classList.add('correct'); speak(c.w, {rate:1.1}); setTimeout(q, 350); }
      else { sfx('bad'); b.classList.add('wrong'); time = Math.max(0, time - 3); }
    });
  };
  render(`<p class="sub">اختر الكلمة الصحيحة بأسرع ما يمكن! ⏱️ <b id="rt">60</b> ثانية · ✅ <b id="rs">0</b></p>
   <div class="progressbar"><div id="rbar" style="width:100%;background:linear-gradient(90deg,var(--red),var(--yellow))"></div></div>
   <div class="q-head" id="rq"></div><div class="options" id="ro"></div>`);
  q();
  timer = setInterval(() => {
    if (!$('#rt')) return clearInterval(timer);
    time--; $('#rt').textContent = time; $('#rbar').style.width = (time / 60 * 100) + '%';
    if (time <= 0) { clearInterval(timer); const st = score >= 20 ? 3 : score >= 12 ? 2 : score >= 5 ? 1 : 0; if (st) { addStars(st); confetti(); sfx('win'); } setBest('race', score);
      modal(`<div class="emoji">⏱️</div><h2>انتهى الوقت!</h2><p>أجبت ${score} إجابة صحيحة</p><div class="stars">${'⭐'.repeat(st)}</div>`, () => go('games')); }
  }, 1000);
  cleanup = () => clearInterval(timer);
}

/* ---- 8. الجمل والمحادثة ---- */
let phraseTab = 0;
views.phrases = () => {
  setTitle('الجمل والمحادثة 💬');
  const cat = PHRASES[phraseTab];
  render(`<p class="sub">اسمع 🔊 ثم كرّر بصوتك 🎤 — الكلام بصوت عالٍ يثبّت اللغة</p>
   <div class="tabs">${PHRASES.map((c, i) => `<button class="${i === phraseTab ? 'on' : ''}" data-act="phraseTab" data-arg="${i}">${c.cat}</button>`).join('')}</div>
   ${cat.items.map(([en, ar]) => `<div class="phrase"><button class="icon-btn" data-act="say" data-arg="${esc(en)}">🔊</button><div class="t"><div class="en">${esc(en)}</div>${settings.arabic ? `<div class="ar">${ar}</div>` : ''}</div><button class="icon-btn mic" data-act="sayIt" data-arg="${esc(en)}">🎤</button></div>`).join('')}
   <div class="btnrow"><button class="btn green" data-go="quiz/sentence">🧱 تمرين ترتيب الجمل</button></div>`);
};

/* ---- 9. القصص ---- */
views.stories = (i) => {
  if (i === undefined) {
    setTitle('القصص والقراءة 📚');
    render(`<p class="sub">قصص قصيرة بكلمات سهلة — اضغط على أي كلمة لتسمعها</p><div class="grid big">${STORIES.map((s, k) => `<button class="card" data-go="stories/${k}"><span class="emoji">${s.pic}</span><div class="label en">${s.title}</div><div class="small">Year 1</div></button>`).join('')}</div>
     <h2 class="title">📚 قصص مع أسئلة فهم</h2><div class="grid big">${READING.map((s, k) => `<button class="card" data-go="read/${k}"><span class="emoji">${s.pic}</span><div class="label en">${s.title}</div><div class="small">Year ${s.year} · ${s.qs.length} أسئلة</div></button>`).join('')}</div>`);
    return;
  }
  const S = STORIES[+i]; if (!S) return go('stories');
  renderStory(S, 'story_' + i, `<button class="btn ghost" data-go="stories">كل القصص</button><button class="btn ghost" data-go="stories/${(+i + 1) % STORIES.length}">القصة التالية ←</button>`);
};
views.read = (i) => {
  const S = READING[+i]; if (!S) return go('stories');
  renderStory(S, 'read_' + i, `<button class="btn ghost" data-go="year/${S.year}">رجوع لـ Year ${S.year}</button>`);
};
function renderStory(S, key, nav) {
  setTitle(`📖 ${S.title}`);
  render(`<div class="btnrow"><button class="btn green" id="readAll">▶️ اقرأ لي القصة</button></div>
    ${S.lines.map(([en, ar, e], k) => `<div class="story-line" data-line="${k}"><div class="e">${e}</div><div class="t"><div class="en">${en.split(' ').map(w => `<span class="w" data-word="${esc(w.replace(/[^A-Za-z']/g, ''))}">${esc(w)}</span>`).join(' ')}</div>${settings.arabic ? `<div class="ar">${ar}</div>` : ''}</div><button class="icon-btn mic" data-act="sayIt" data-arg="${esc(en)}">🎤</button></div>`).join('')}
    ${S.qs ? `<h2 class="title">🧠 أسئلة الفهم <span class="en">(Comprehension)</span></h2><div id="cq">${S.qs.map(([q, opts], k) => { const order = shuffle(opts.map((o, j) => j)); return `<div class="lesson" style="margin:12px 0;text-align:left" data-q="${k}"><div class="en" style="font-size:22px;font-weight:700"><button class="icon-btn" data-act="say" data-arg="${esc(q)}" style="width:38px;height:38px;font-size:16px">🔊</button> ${k + 1}. ${esc(q)}</div><div class="btnrow" style="justify-content:flex-start">${order.map(j => `<button class="btn ghost en" data-opt="${j}">${esc(opts[j])}</button>`).join('')}</div></div>`; }).join('')}</div>` : ''}
    <div class="navrow">${nav}</div>`);
  const readLine = (k, then) => {
    const el = main().querySelector(`[data-line="${k}"]`); if (!el) return;
    const ws = [...el.querySelectorAll('.w')]; let wi = 0, gotBoundary = false; ws.forEach(w => w.classList.remove('on'));
    el.scrollIntoView({block:'center', behavior:'smooth'});
    // تظليل الكلمة أثناء النطق
    const fallback = setInterval(() => { if (gotBoundary) return clearInterval(fallback); ws.forEach(w => w.classList.remove('on')); if (ws[wi]) ws[wi++].classList.add('on'); }, 420 / settings.rate);
    speak(S.lines[k][0], {onboundary:e => { if (e.name && e.name !== 'word') return; gotBoundary = true; ws.forEach(w => w.classList.remove('on')); if (ws[wi]) ws[wi++].classList.add('on'); },
      onend:() => { clearInterval(fallback); setTimeout(() => { ws.forEach(w => w.classList.remove('on')); then && then(); }, 300); }});
  };
  main().querySelectorAll('.w').forEach(w => w.onclick = ev => { ev.stopPropagation(); w.classList.add('on'); speak(w.dataset.word); setTimeout(() => w.classList.remove('on'), 900); });
  main().querySelectorAll('.story-line').forEach(l => l.onclick = () => readLine(+l.dataset.line));
  $('#readAll').onclick = () => { let k = 0; const nx = () => { if (k < S.lines.length) readLine(k++, nx); else { if (mark('words', key)) addStars(2); praise(); } }; nx(); };
  if (S.qs) {
    let answered = 0, right = 0;
    main().querySelectorAll('[data-q]').forEach(box => {
      const qi = +box.dataset.q; let done = false;
      box.querySelectorAll('[data-opt]').forEach(b => b.onclick = () => {
        if (done) return; done = true; answered++;
        const ok = +b.dataset.opt === S.qs[qi][2];
        if (ok) { right++; b.style.background = 'var(--green)'; b.style.color = '#fff'; sfx('good'); }
        else { b.style.background = 'var(--red)'; b.style.color = '#fff'; sfx('bad'); box.querySelector(`[data-opt="${S.qs[qi][2]}"]`).style.background = '#B8F5DF'; }
        speak(S.qs[qi][1][S.qs[qi][2]]);
        if (answered === S.qs.length) setTimeout(() => {
          const st = right === S.qs.length ? 3 : right >= S.qs.length - 1 ? 2 : right >= S.qs.length / 2 ? 1 : 0;
          const p = me(); p.best[key] = Math.max(p.best[key] || 0, right); save();
          if (st) { addStars(st); confetti(); sfx('win'); }
          modal(`<div class="emoji">${st === 3 ? '🏆' : '📖'}</div><h2>${right} من ${S.qs.length}</h2><div class="stars">${'⭐'.repeat(st)}</div><p>${st === 3 ? 'فهمت القصة تماماً!' : 'اقرأ القصة مرة أخرى وحاول من جديد'}</p>`);
        }, 900);
      });
    });
  }
}

/* ---- 10. الفيديوهات ---- */
views.videos = () => {
  setTitle('فيديوهات تعليمية 📺');
  const yt = q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  const items = [
    ['🇺🇸', 'قناة American English', 'American English for kids', 'ابحث عن القناة التي ذكرتها واختر دروس الأطفال'],
    ['🔤', 'أنشودة الحروف (بريطاني)', 'alphabet song British zed for kids', 'تنتهي بـ zed كما في بريطانيا'],
    ['🔊', 'أناشيد الصوتيات s a t p i n', 'phonics song satpin phase 2', 'نفس ترتيب الحروف في التطبيق'],
    ['🗣️', 'الأصوات المركبة sh ch th', 'phase 3 phonics digraphs song', ''],
    ['⭐', 'أنشودة الكلمات الصعبة', 'tricky words song phase 2 3', ''],
    ['🔢', 'أنشودة الأرقام', 'numbers song 1 to 20 kids', ''],
    ['🎨', 'أنشودة الألوان', 'colours song for kids', ''],
    ['🤸', 'أناشيد بالحركة', 'action songs for kids english', 'غنِّ وتحرّك مع الطفل'],
    ['📖', 'قصص مصوّرة للقراءة', 'read aloud picture books for kids', ''],
  ];
  render(`<div class="note">📌 للأهل: هذه الأزرار تفتح بحث يوتيوب في نافذة جديدة. يُفضّل أن تشاهدوا مع الطفل وتختاروا الفيديو معه، وفعّلوا <b>YouTube Kids</b> للأمان. ⏰ يُنصح بـ 15–20 دقيقة يومياً.</div>
   <div class="grid big">${items.map(([e, n, q, d]) => `<a class="card video-card" href="${yt(q)}" target="_blank" rel="noopener"><span class="emoji">${e}</span><div class="label">${n}</div><div class="small">${d || '▶️ يوتيوب'}</div></a>`).join('')}</div>
   <div class="note">🇬🇧/🇺🇸 التطبيق يعتمد النطق البريطاني افتراضياً (مثل المنهج)، ويمكن تحويله للأمريكي من ⚙️ الإعدادات ليتوافق مع فيديوهات القناة الأمريكية.</div>`);
};

/* ---- 11/12. Year 2 و Year 3 ---- */
const UNIT_BY_ID = Object.fromEntries(UNITS.map(u => [u.id, u]));
const hl = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<span class="hl">$1</span>');
views.year = (n) => {
  n = +n; const p = me();
  setTitle(`Year ${n} ${n === 2 ? '📗' : '📘'}`);
  const units = UNITS.filter(u => u.year === n);
  const done = units.filter(u => (p.best[u.id] || p.best['spell_' + u.id] || 0) >= 7).length;
  render(`<p class="title">${n === 2 ? 'المستوى الثاني — Year 2' : 'المستوى الثالث — Year 3'}</p>
   <p class="sub">${n === 2 ? 'قواعد الكتابة الأولى: الجمع، اللواحق، الماضي والحاضر، علامات الترقيم، وأنواع الكلمات والجمل' : 'نحو الطلاقة: البادئات، المضارع التام، الكلام المباشر، الأفعال الشاذة، والقراءة والفهم'}</p>
   <div class="progressbar"><div style="width:${done / units.length * 100}%"></div></div><p class="sub">أتقنت ${done} من ${units.length} دروس (7/10 أو أكثر)</p>
   <div class="grid">${units.map((u, k) => { const b = u.spelling ? p.best['spell_' + u.id] : p.best[u.id]; return `<button class="card ${b >= 7 ? 'letter-card done' : ''}" data-go="unit/${u.id}"><span class="badge" style="background:#fff;border:2px solid var(--purple)">${k + 1}</span><span class="emoji" style="font-size:44px">${u.icon}</span><div class="label" style="font-size:17px">${u.title}</div><div class="small en">${u.en}</div>${b ? `<div class="small">🏅 ${b}/10</div>` : ''}</button>`; }).join('')}</div>
   <h2 class="title">📚 القراءة والفهم</h2>
   <div class="grid big">${READING.map((s, k) => s.year === n ? `<button class="card" data-go="read/${k}"><span class="emoji">${s.pic}</span><div class="label en">${s.title}</div>${p.best['read_' + k] !== undefined ? `<div class="small">🏅 ${p.best['read_' + k]}/${s.qs.length}</div>` : ''}</button>` : '').join('')}</div>
   <div class="btnrow" style="margin-top:20px"><button class="btn purple" data-go="quiz/mix_${n}" style="font-size:22px">🏆 اختبار Year ${n} الشامل (15 سؤال)</button></div>
   ${p.best['mix_' + n] ? `<p class="sub">أفضل نتيجة: ${p.best['mix_' + n]}/15</p>` : ''}`);
};
views.unit = (id) => {
  const u = UNIT_BY_ID[id]; if (!u) return go('home');
  setTitle(`${u.icon} ${u.title}`);
  const list = UNITS.filter(x => x.year === u.year); const k = list.indexOf(u);
  render(`<div class="lesson" style="text-align:right">
    <div class="pic" style="font-size:80px">${u.icon}</div>
    <h2 style="text-align:center;margin:4px 0">${u.title} <span class="en small">· ${u.en}</span></h2>
    <div class="actionbox" style="max-width:none;text-align:right;line-height:1.9">📘 <b>القاعدة:</b><br>${u.rule}</div>
    ${u.ex ? `<p class="sub">👇 اضغط على كل مثال لتسمعه</p>${u.ex.map(([en, ar, e]) => `<div class="phrase" data-act="say" data-arg="${esc(en)}" style="cursor:pointer"><div style="font-size:38px">${e}</div><div class="t"><div class="en" style="font-size:24px">${hl(en)}</div>${settings.arabic ? `<div class="ar">${ar}</div>` : ''}</div><button class="icon-btn">🔊</button></div>`).join('')}` : ''}
    ${u.spelling ? `<p class="sub">👇 اضغط على الكلمة لتسمعها وتسمع تهجئتها</p><div class="btnrow">${u.words.map(w => `<button class="btn ghost en" style="font-size:22px" data-act="spellWord" data-arg="${w}">${w}</button>`).join('')}</div>` : ''}
    <div class="btnrow" style="margin-top:20px">${u.spelling ? `<button class="btn green" data-go="spelltest/${u.id}" style="font-size:24px">🐝 اختبار الإملاء</button>` : `<button class="btn green" data-go="quiz/${u.id}" style="font-size:24px">📝 تمرّن الآن (10 أسئلة)</button>`}</div>
    <div class="navrow"><button class="btn ghost" ${k > 0 ? `data-go="unit/${list[k - 1].id}"` : 'disabled style="opacity:.3"'}>→ الدرس السابق</button><button class="btn ghost" data-go="year/${u.year}">كل الدروس</button><button class="btn ghost" ${k < list.length - 1 ? `data-go="unit/${list[k + 1].id}"` : 'disabled style="opacity:.3"'}>الدرس التالي ←</button></div></div>`);
};
function unitQuestion({it, unit}) {
  const why = it.why ? `<div class="note">💡 ${esc(it.why)}</div>` : '';
  if (it.t === 'b') {
    const opts = shuffle([it.a, ...it.d]);
    const filled = esc(it.s).replace('___', `<span class="hl">${esc(it.a)}</span>`);
    return {prompt:`<div class="lesson"><div class="en" style="font-size:clamp(24px,5.5vw,38px);font-weight:700;line-height:1.5">${esc(it.s).replace('___', '<span class="slot" style="display:inline-flex;width:auto;min-width:90px;height:52px;vertical-align:middle;font-size:28px">?</span>')}</div><button class="btn ghost" data-act="say" data-arg="${esc(it.s.replace('___', '...').replace(/\([^)]*\)/g, ''))}">🔊 اسمع</button></div><p class="sub">اختر الكلمة الصحيحة للفراغ</p>`,
      options:opts.map(o => ({html:`<span class="label en" style="font-size:28px">${esc(o)}</span>`, ok:o === it.a})), cols:opts.length === 2 ? 0 : 3,
      after:it.s.replace('___', it.a).replace(/\([^)]*\)/g, ''), reveal:`<div class="lesson" style="margin-top:12px"><div class="en" style="font-size:24px">✅ ${filled}</div>${why}</div>`};
  }
  if (it.t === 'c') {
    const opts = shuffle([it.a, ...it.d]);
    return {prompt:`<div class="pic" style="font-size:70px">✍️</div><p class="title" style="font-size:22px">أيّ جملة مكتوبة بشكل صحيح؟</p>`,
      options:opts.map(o => ({html:`<span class="en" style="font-size:clamp(18px,4.5vw,26px);font-weight:700">${esc(o)}</span>`, ok:o === it.a})), cols:1,
      after:it.a, reveal:why ? `<div class="lesson" style="margin-top:12px">${why}</div>` : ''};
  }
  // تصنيف
  const cats = unit.cats; const isSentence = it.w.includes(' ');
  return {prompt:`<div class="lesson"><div class="word-big en" style="font-size:clamp(28px,7vw,52px)">${esc(it.w)}</div><button class="btn ghost" data-act="say" data-arg="${esc(it.w)}">🔊 اسمع</button></div><p class="sub">${isSentence ? 'ما نوع هذه الجملة؟' : 'ما نوع هذه الكلمة؟'}</p>`,
    say:it.w, options:Object.keys(cats).map(c => ({html:`<span class="label">${cats[c]}</span><span class="small en">${c}</span>`, ok:c === it.a})), after:it.w,
    reveal:`<div class="lesson" style="margin-top:12px"><span class="en">${esc(it.w)}</span> = <b>${cats[it.a]}</b>${why}</div>`};
}
views.spelltest = (id) => {
  const u = UNIT_BY_ID[id]; if (!u || !u.spelling) return go('home');
  setTitle(`🐝 Spelling Bee — Year ${u.year}`);
  const words = sample(u.words, 10); let q = 0, score = 0;
  const next = () => {
    if (q >= words.length) return finishQuiz('spell_' + id, score, words.length, `unit/${id}`);
    const w = words[q++]; let tries = 0;
    render(`<div class="progressbar"><div style="width:${(q - 1) * 10}%"></div></div><p class="sub">كلمة ${q} من ${words.length} · ✅ ${score}</p>
     <div class="lesson"><button class="listen-big" id="hearW">🔊</button><p class="sub">اسمع الكلمة واكتبها بالإنجليزية</p>
     <input class="txt en" id="ans" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="type here…" style="font-size:30px;direction:ltr">
     <div id="hint" class="slots"></div>
     <div class="btnrow"><button class="btn green" id="chk">✅ تحقق</button><button class="btn ghost" id="slow">🐢 ببطء</button><button class="btn ghost" id="skipW">تخطَّ ⏭️</button></div></div>`);
    const say = r => speak(w, {rate:r});
    setTimeout(() => say(), 300);
    $('#hearW').onclick = () => say(); $('#slow').onclick = () => say(.5);
    const inp = $('#ans'); setTimeout(() => inp.focus(), 100);
    const showWord = () => { $('#hint').innerHTML = w.split('').map(c => `<span class="slot filled">${c}</span>`).join(''); };
    const check = () => {
      const a = inp.value.trim().toLowerCase(); if (!a) return;
      if (a === w.toLowerCase()) { score += tries ? 0 : 1; sfx('good'); praise(); inp.style.borderColor = 'var(--green)'; showWord(); setTimeout(next, 1400); return; }
      tries++; sfx('bad'); inp.animate([{transform:'translateX(-8px)'}, {transform:'translateX(8px)'}, {transform:'none'}], {duration:300});
      if (tries === 1) { $('#hint').innerHTML = w.split('').map((c, i) => `<span class="slot ${i === 0 ? 'filled' : ''}">${i === 0 ? c : ''}</span>`).join(''); toast(`الكلمة فيها ${w.length} حروف — تبدأ بـ ${w[0]}`); say(.6); }
      else { showWord(); toast('هذه هي الكلمة الصحيحة — انظر إليها جيداً 👀'); cleanup = speakSeq([{say:w}, ...w.toLowerCase().split('').map(c => ({say:letterName(c), rate:1}))], null, null, 80); setTimeout(next, 4200); }
    };
    $('#chk').onclick = check; inp.onkeydown = e => { if (e.key === 'Enter') check(); };
    $('#skipW').onclick = () => { showWord(); say(); setTimeout(next, 1800); };
  };
  next();
};

/* ---- الملصقات ---- */
views.stickers = () => {
  setTitle('دفتر الملصقات 🎁');
  const p = me();
  render(`<p class="title">⭐ ${p.stars} نجمة</p><p class="sub">كل 10 نجوم = ملصق جديد! باقي ${10 - p.stars % 10} نجوم للملصق التالي</p>
   <div class="progressbar"><div style="width:${p.stars % 10 * 10}%"></div></div>
   <div class="sticker-book">${STICKERS.map(s => `<div class="${p.stickers.includes(s) ? '' : 'locked'}">${s}</div>`).join('')}</div>`);
};

/* ---- الإعدادات ---- */
views.settings = () => {
  setTitle('الإعدادات ⚙️');
  render(`<div class="setting"><span>🗣️ اللهجة</span><select id="acc"><option value="en-GB">🇬🇧 بريطانية</option><option value="en-US">🇺🇸 أمريكية</option></select></div>
   <div class="setting"><span>🐢 سرعة النطق</span><input type="range" id="rate" min="0.5" max="1.2" step="0.05" value="${settings.rate}"><button class="btn ghost en" data-act="say" data-arg="Hello! I love English.">🔊 تجربة</button></div>
   <div class="setting"><span>🇸🇦 إظهار الترجمة العربية</span><input type="checkbox" id="ar" ${settings.arabic ? 'checked' : ''} style="width:28px;height:28px"></div>
   <div class="setting"><span>🔔 المؤثرات الصوتية</span><input type="checkbox" id="sf" ${settings.sfx ? 'checked' : ''} style="width:28px;height:28px"></div>
   <div class="setting"><span>👤 تغيير الطفل</span><button class="btn purple" data-go="profiles">الملفات</button></div>
   <div class="setting"><span>🗑️ حذف ملف ${esc(me().name)}</span><button class="btn red" id="del">حذف</button></div>
   <div class="lesson" style="margin-top:14px"><h2>🔊 فحص الصوت</h2>
     <div class="btnrow"><button class="btn green" id="sndTest" style="font-size:22px">🔊 اختبر الصوت</button><button class="btn ghost" id="sfxTest">🔔 اختبر المؤثرات</button></div>
     <p id="sndInfo" class="sub"></p>
     <div class="note" style="text-align:right">إذا لم تسمع شيئاً:<br>
      1️⃣ ارفع صوت الجهاز، وفي الآيفون/الآيباد <b>أطفئ الوضع الصامت</b> 🔕<br>
      2️⃣ افتح الرابط في <b>Safari</b> أو <b>Chrome</b> مباشرة، وليس من داخل واتساب أو تيليجرام أو فيسبوك (متصفحاتها الداخلية تمنع النطق)<br>
      3️⃣ <b>آيفون/آيباد:</b> الإعدادات ← تسهيل الاستخدام ← المحتوى المنطوق ← الأصوات ← English ← نزّل صوتاً (مثل Daniel أو Serena)<br>
      4️⃣ <b>أندرويد:</b> الإعدادات ← الإدارة العامة (أو النظام) ← اللغة ← تحويل النص إلى كلام ← محرك Google ← ⚙️ ← تثبيت بيانات الصوت ← English (United Kingdom)<br>
      5️⃣ أغلق التطبيق تماماً وافتحه من جديد</div></div>`);
  const info = () => { loadVoices(); const en = englishVoices(); const v = pickVoice();
    $('#sndInfo').innerHTML = !synth ? '❌ هذا المتصفح لا يدعم النطق — افتح الرابط في Safari أو Chrome' : en.length ? `✅ يوجد ${en.length} صوت إنجليزي · المستخدم الآن: <b class="en">${esc(v ? v.name : '')}</b>` : '⚠️ لم أجد صوتاً إنجليزياً في الجهاز — اتبع الخطوة 3 أو 4 بالأسفل'; };
  info(); setTimeout(info, 1500);
  $('#sndTest').onclick = () => { unlockAudio(); speak('Hello! I can speak English. One, two, three!', {onend:() => toast('هل سمعت الصوت؟ 🙂')}); };
  $('#sfxTest').onclick = () => { unlockAudio(); sfx('win'); };
  $('#acc').value = settings.accent;
  $('#acc').onchange = e => { settings.accent = e.target.value; save(); speak('Hello!'); };
  $('#rate').oninput = e => { settings.rate = +e.target.value; save(); };
  $('#ar').onchange = e => { settings.arabic = e.target.checked; save(); };
  $('#sf').onchange = e => { settings.sfx = e.target.checked; save(); };
  $('#del').onclick = () => { if (confirm('متأكد؟ سيتم حذف كل التقدّم')) { profiles = profiles.filter(p => p.id !== currentId); currentId = profiles[0] ? profiles[0].id : null; save(); updateTopbar(); go(currentId ? 'home' : 'profiles'); } };
};

/* ---- دليل الأهل ---- */
views.parents = () => {
  setTitle('دليل الأهل 👨‍👩‍👧');
  const p = me();
  render(`<div class="lesson" style="text-align:right">
   <h2>📊 تقدّم ${esc(p.name)}</h2>
   <p>🔤 الحروف: ${LETTERS.filter(L => p.letters[L.l]).length}/26 · 🔊 الأصوات المركبة: ${DIGRAPHS.filter(D => p.letters['dg_' + D.g]).length}/${DIGRAPHS.length} · ✍️ كتابة: ${Object.keys(p.traced).length} · 🖼️ كلمات: ${Object.keys(p.words).filter(k => !k.startsWith('story_')).length}/${ALL_WORDS.length} · ⭐ ${p.stars}</p>
   <p>📗 Year 2: ${UNITS.filter(u => u.year === 2 && (p.best[u.id] || p.best['spell_' + u.id] || 0) >= 7).length}/${UNITS.filter(u => u.year === 2).length} دروس · 📘 Year 3: ${UNITS.filter(u => u.year === 3 && (p.best[u.id] || p.best['spell_' + u.id] || 0) >= 7).length}/${UNITS.filter(u => u.year === 3).length} دروس</p>
   <h2>🧭 خطة مقترحة (15–20 دقيقة يومياً)</h2>
   <ol>
    <li><b>كل يوم (5 دقائق):</b> 🧠 «مراجعة اليوم» — تعيد الكلمات قبل أن تُنسى بالضبط (نظام الصناديق: بعد 1، 2، 4، 7، 14، 30 يوماً).</li>
    <li><b>كل يوم (5 دقائق):</b> 🎬 «كلمات تتحرك» — 3 كلمات جديدة: شاهد المشهد ← قلها ← قم بالحركة بنفسك. ثم العبوا «أنت المدير» معاً.</li>
    <li><b>الأسبوع 1–6:</b> 4 حروف أسبوعياً بترتيب الصوتيات (s a t p ثم i n m d…) + كتابتها + حركاتها.</li>
    <li><b>بعد أول 6 حروف:</b> ابدأ بتركيب كلمات صغيرة (sat, pat, tip, pin) — هذا جوهر المنهج البريطاني: <i>Blending</i>.</li>
    <li><b>الشهر 2–3:</b> الأصوات المركبة (sh, ch, th, ee, oo…) + 5 كلمات صعبة أسبوعياً.</li>
    <li><b>الشهر 3 وما بعده:</b> موضوع كلمات كل أسبوع (حيوانات، ألوان…) + لعبة + تمارين.</li>
    <li><b>الشهر 4+:</b> الجمل والمحادثة والقصص — اقرؤوا قصة معاً كل يوم.</li>
    <li><b>Year 2:</b> درس واحد في الأسبوع (القاعدة ← الأمثلة ← التمرين) + 10 كلمات إملاء أسبوعياً + قصة مع أسئلة فهم. اختبار شامل كل شهر.</li>
    <li><b>Year 3:</b> نفس النظام، مع كتابة 3–5 جمل يومياً على ورقة باستخدام قاعدة الأسبوع.</li>
   </ol>
   <h2>💡 لماذا هذه الطريقة؟</h2>
   <ul>
    <li><b>متعدد الحواس:</b> يرى الصورة 👀 + يسمع 👂 + يقول 🗣️ + يتحرك 🤸 + يكتب ✍️ = ذاكرة أقوى.</li>
    <li><b>Synthetic Phonics:</b> الطفل يتعلم <u>صوت</u> الحرف قبل اسمه، فيقرأ كلمات جديدة وحده.</li>
    <li><b>الاستجابة الجسدية (TPR):</b> لعبة Simon Says وحركات الحروف تربط الكلمة بالحركة.</li>
    <li><b>التكرار المتباعد:</b> ارجعوا للحروف القديمة في الألعاب كل يوم.</li>
    <li><b>التشجيع:</b> النجوم والملصقات تبني الحماس — امدحوا المحاولة، لا النتيجة فقط.</li>
   </ul>
   <div class="note">📝 تمرين خارج الشاشة: اطبعوا الحرف أو ارسموه على الرمل/الملح/عجينة الصلصال، وابحثوا في البيت عن أشياء تبدأ بنفس الصوت.</div></div>`);
};

/* ===================== التوجيه والأحداث ===================== */
function route() {
  if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
  if (synth) { speakToken++; synth.cancel(); }
  document.querySelectorAll('.overlay').forEach(o => o.remove());
  let [name, ...args] = (location.hash.slice(1) || 'home').split('/');
  if (!me() && name !== 'newprofile') name = profiles.length ? 'profiles' : 'newprofile';
  (views[name] || views.home)(...args);
  updateTopbar();
}
const actions = {
  say: a => speak(a),
  snd: a => speak(a, {rate:.7}),
  sayWord: a => { speak(a); sfx('tap'); if (mark('words', a)) addStars(0); },
  sayDigraph: w => { if (cleanup) cleanup(); cleanup = speakSeq([{say:w, rate:.5}, {say:w}], null, null, 300); },
  sayIt: (a, el) => sayIt(a, el),
  pickProfile: id => { currentId = id; save(); go('home'); },
  newProfile: () => go('newprofile'),
  lettersOrder: a => { lettersOrder = a; views.letters(); },
  setLevel: a => { level = a; store.set('ee_level', a); views.exercises(); },
  phraseTab: a => { phraseTab = +a; views.phrases(); },
  reload: () => route(),
  spellWord: w => { if (cleanup) cleanup(); cleanup = speakSeq([{say:w}, ...w.toLowerCase().split('').map(c => ({say:letterName(c), rate:1})), {say:w}], null, null, 90); },
};
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) { sfx('tap'); go(g.dataset.go); return; }
  const a = e.target.closest('[data-act]'); if (a && actions[a.dataset.act]) actions[a.dataset.act](a.dataset.arg, a);
});
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  $('#backBtn').onclick = () => { const h = location.hash.slice(1); if (!h || h === 'home') return; history.length > 1 ? history.back() : go('home'); };
  $('#avatarBtn').onclick = () => go('profiles');
  $('#starPill').onclick = () => go('stickers');
  $('#mascot').onclick = () => { mascotTalk(); speak(rand(["Let's learn!", "You can do it!", "Hello, friend!", "Keep going!"])); };
  route();
  if (synth) showSoundGate();
  setTimeout(() => mascotTalk('أهلاً! أنا البومة أولي 🦉 اضغط عليّ لنصيحة!'), 1200);
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
});
