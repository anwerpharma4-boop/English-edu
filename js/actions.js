/* ===================== 🎬 مسرح الكلمات المتحركة + ألعاب الحفظ والنطق والكتابة ===================== */
'use strict';
const wait = ms => new Promise(r => setTimeout(r, ms));

/* ---------- محرك المشاهد ---------- */
function makeStage(el) {
  const token = (el._tok = (el._tok || 0) + 1);
  el.classList.add('stage');
  el.innerHTML = '<div class="inner"><div class="sun-bg">☁️</div><div class="ground"></div></div>';
  const inner = el.firstChild;
  const alive = () => el._tok === token && document.body.contains(el);
  const S = {
    alive,
    add(e, {x = 50, y = 40, s = 70, z = 2, flip = false, o = 1} = {}) {
      const d = document.createElement('div'); d.className = 'actor'; d.textContent = e;
      Object.assign(d.style, {left:x + '%', bottom:y + 'px', fontSize:s + 'px', zIndex:z, opacity:o});
      d._pre = 'translateX(-50%)' + (flip ? ' scaleX(-1)' : ''); d.style.transform = d._pre;
      if (alive()) inner.appendChild(d); return d;
    },
    async mv(d, frames, dur = 1000, o = {}) {
      if (!alive()) throw 'stop';
      const fs = frames.map(f => { const g = Object.assign({}, f); g.transform = d._pre + ' ' + (f.t || ''); delete g.t; return g; });
      await d.animate(fs, Object.assign({duration:dur, fill:'forwards', easing:'ease-in-out'}, o)).finished.catch(() => {});
      if (!alive()) throw 'stop';
    },
    // مشي مع اهتزاز خطوات
    async walk(d, x1, x2, dur, {y1 = 40, y2 = y1, s1 = 1, s2 = s1, bob = 6, o1 = 1, o2 = 1} = {}) {
      const n = Math.max(4, Math.round(dur / 160)); const fr = [];
      for (let i = 0; i <= n; i++) { const k = i / n; fr.push({left:(x1 + (x2 - x1) * k) + '%', bottom:(y1 + (y2 - y1) * k) + 'px', opacity:o1 + (o2 - o1) * k, t:`translateY(${i % 2 ? -bob : 0}px) scale(${s1 + (s2 - s1) * k})`}); }
      return S.mv(d, fr, dur, {easing:'linear'});
    },
    async pop(e, opt) { const d = S.add(e, opt); await S.mv(d, [{t:'scale(0)'}, {t:'scale(1.3)'}, {t:'scale(1)'}], 400); return d; },
    wait: async ms => { await wait(ms); if (!alive()) throw 'stop'; },
    swap: (d, e) => { d.textContent = e; },
    bg: c => { inner.style.background = c; },
    ground: c => { const g = inner.querySelector('.ground'); if (c === null) g.style.display = 'none'; else { g.style.background = c; g.style.borderTopColor = c; } },
    noCloud: () => { inner.querySelector('.sun-bg').style.display = 'none'; },
    say(txt, {x = 50, y = 150, s = 24} = {}) { const d = S.add(txt, {x, y, s, z:9}); d.classList.add('speech'); return d; },
    all: ps => Promise.all(ps),
  };
  return S;
}
async function playAction(el, A, {loop = false, say = true} = {}) {
  let first = true;
  do {
    const S = makeStage(el);
    try {
      if (say && first) speak(A.w);
      await A.run(S); await S.wait(1000);
    } catch (e) { if (e !== 'stop') console.error(e); return; }
    first = false;
  } while (loop && el.isConnected);
}

/* ---------- الكلمات المتحركة ---------- */
const ACT_CATS = [
  {id:'cmd', name:'أوامر نسمعها كل يوم', icon:'🗣️'},
  {id:'move', name:'أفعال الحركة', icon:'🏃'},
  {id:'daily', name:'أفعال يومية', icon:'🍎'},
  {id:'place', name:'أين هو؟', icon:'📦'},
  {id:'opp', name:'الأضداد', icon:'↔️'},
];
const ACTIONS = [
 /* ---- أوامر ---- */
 {w:'Come here!', ar:'تعالَ إلى هنا', cat:'cmd', icon:'👋', ex:'Come here, please!', async run(S) {
   const m = S.add('📍', {x:25, y:38, s:44, z:1}); const h = S.add('👋', {x:8, y:120, s:60});
   const d = S.add('🚶', {x:85, y:95, s:34});
   await S.all([S.walk(d, 85, 30, 2600, {y1:95, y2:40, s1:1, s2:2.4}), S.mv(h, [{t:'rotate(-25deg)'}, {t:'rotate(25deg)'}, {t:'rotate(-25deg)'}, {t:'rotate(25deg)'}, {t:'rotate(0)'}], 2600)]);
   S.swap(d, '🧍'); await S.mv(m, [{t:'scale(1)'}, {t:'scale(1.5)'}, {t:'scale(1)'}], 500); }},
 {w:'Go!', ar:'اذهب', cat:'cmd', icon:'🚶', ex:'Go to school.', async run(S) {
   S.add('🏫', {x:90, y:95, s:40, z:0}); const a = S.add('👉', {x:20, y:140, s:54});
   const d = S.add('🚶', {x:30, y:40, s:80, flip:true});
   await S.mv(a, [{t:'translateX(0)'}, {t:'translateX(20px)'}, {t:'translateX(0)'}], 500);
   await S.walk(d, 30, 88, 2600, {y1:40, y2:95, s1:1, s2:.35, o2:.2}); }},
 {w:'Stop!', ar:'توقّف', cat:'cmd', icon:'🛑', ex:'Stop! The light is red.', async run(S) {
   S.add('🛑', {x:75, y:40, s:80}); const d = S.add('🏃', {x:5, s:80, flip:true});
   await S.walk(d, 5, 55, 1200, {bob:8}); S.swap(d, '🧍');
   await S.mv(d, [{t:'rotate(0)'}, {t:'rotate(-8deg)'}, {t:'rotate(0)'}], 300); }},
 {w:'Wait!', ar:'انتظر', cat:'cmd', icon:'⏳', ex:'Wait for me!', async run(S) {
   S.add('🧍', {x:40, s:90}); const t = S.add('⏳', {x:65, y:120, s:60});
   for (let i = 0; i < 2; i++) await S.mv(t, [{t:'rotate(0)'}, {t:'rotate(180deg)'}], 900); }},
 {w:'Sit down.', ar:'اجلس', cat:'cmd', icon:'🪑', ex:'Sit down, please.', async run(S) {
   S.add('🪑', {x:55, s:90, z:1}); const d = S.add('🧍', {x:30, s:90, z:2});
   await S.walk(d, 30, 55, 900); await S.mv(d, [{bottom:'40px', left:'55%', t:'scaleY(1)'}, {bottom:'62px', left:'55%', t:'scaleY(.7)'}], 600);
   S.swap(d, '🧘'); await S.mv(d, [{bottom:'62px', left:'55%', t:'scale(.8)'}, {bottom:'62px', left:'55%', t:'scale(.8)'}], 200); }},
 {w:'Stand up.', ar:'قِف', cat:'cmd', icon:'🧍', ex:'Stand up, please.', async run(S) {
   S.add('🪑', {x:55, s:90, z:1}); const d = S.add('🧘', {x:55, y:62, s:72, z:2}); const ar = S.add('⬆️', {x:80, y:100, s:44, o:0});
   await S.wait(500); S.swap(d, '🧍');
   await S.all([S.mv(d, [{bottom:'62px', t:'scale(.8)'}, {bottom:'40px', t:'scale(1.25)'}], 700), S.mv(ar, [{opacity:0, bottom:'80px'}, {opacity:1, bottom:'150px'}], 700)]); }},
 {w:'Turn around.', ar:'استدر', cat:'cmd', icon:'🔄', ex:'Turn around and look!', async run(S) {
   S.add('🔄', {x:50, y:165, s:50}); const d = S.add('🧍', {x:50, s:100});
   await S.mv(d, [{t:'rotateY(0)'}, {t:'rotateY(360deg)'}], 1400); }},
 {w:'Look!', ar:'انظر', cat:'cmd', icon:'👀', ex:'Look at the bird!', async run(S) {
   const e = S.add('👀', {x:30, y:80, s:90}); const b = S.add('🐦', {x:85, y:150, s:50, o:0});
   await S.mv(e, [{left:'30%'}, {left:'40%'}, {left:'30%'}], 700);
   await S.all([S.mv(e, [{left:'30%'}, {left:'55%'}], 600), S.mv(b, [{opacity:0}, {opacity:1}], 600)]);
   await S.mv(b, [{t:'translateY(0)'}, {t:'translateY(-10px)'}, {t:'translateY(0)'}], 500); }},
 {w:'Listen!', ar:'استمع', cat:'cmd', icon:'👂', ex:'Listen to the music.', async run(S) {
   S.add('👂', {x:30, y:70, s:110});
   for (let i = 0; i < 3; i++) { const n = S.add(i % 2 ? '🎶' : '🎵', {x:90, y:120, s:44}); await S.mv(n, [{left:'90%', opacity:1}, {left:'40%', opacity:.1}], 800); n.remove(); } }},
 {w:'Be quiet!', ar:'اهدأ / اسكت', cat:'cmd', icon:'🤫', ex:'Be quiet, the baby is sleeping.', async run(S) {
   const f = S.add('🗣️', {x:40, s:100}); const n = S.add('🔊', {x:70, y:120, s:60});
   await S.mv(n, [{t:'scale(1)'}, {t:'scale(1.3)'}, {t:'scale(1)'}], 500); S.swap(f, '🤫'); S.swap(n, '🔇');
   await S.mv(n, [{t:'scale(1.3)'}, {t:'scale(1)'}], 400); }},
 {w:'Wake up!', ar:'استيقظ', cat:'cmd', icon:'⏰', ex:'Wake up! It is morning.', async run(S) {
   S.add('🛏️', {x:50, s:140, z:1}); const f = S.add('😴', {x:42, y:88, s:50, z:2}); const c = S.add('⏰', {x:82, y:110, s:56});
   await S.mv(c, [{t:'rotate(0)'}, {t:'rotate(-20deg)'}, {t:'rotate(20deg)'}, {t:'rotate(-20deg)'}, {t:'rotate(20deg)'}, {t:'rotate(0)'}], 1000);
   S.swap(f, '😃'); await S.mv(f, [{bottom:'88px'}, {bottom:'140px'}, {bottom:'88px'}], 600); S.add('☀️', {x:15, y:170, s:50}); }},
 {w:'Wash your hands.', ar:'اغسل يديك', cat:'cmd', icon:'🧼', ex:'Wash your hands before you eat.', async run(S) {
   const h = S.add('🙌', {x:50, y:60, s:100}); S.add('🧼', {x:25, y:50, s:50});
   const bubbles = [0, 1, 2, 3].map(i => S.add('🫧', {x:40 + i * 7, y:90, s:30, o:0}));
   await S.all([S.mv(h, [{t:'translateX(-10px)'}, {t:'translateX(10px)'}, {t:'translateX(-10px)'}, {t:'translateX(10px)'}, {t:'translateX(0)'}], 1600),
     ...bubbles.map((b, i) => S.mv(b, [{opacity:0, bottom:'90px'}, {opacity:1, bottom:'200px'}], 1200, {delay:i * 150}))]); }},
 {w:'Brush your teeth.', ar:'نظّف أسنانك', cat:'cmd', icon:'🪥', ex:'Brush your teeth every night.', async run(S) {
   S.add('😁', {x:45, y:50, s:120}); const b = S.add('🪥', {x:60, y:80, s:50, z:3});
   await S.mv(b, [{left:'52%'}, {left:'62%'}, {left:'52%'}, {left:'62%'}, {left:'52%'}, {left:'62%'}], 1500); S.add('✨', {x:30, y:150, s:40}); }},
 {w:'Open the book.', ar:'افتح الكتاب', cat:'cmd', icon:'📖', ex:'Open your book, please.', async run(S) {
   const b = S.add('📕', {x:50, y:50, s:110}); await S.wait(500);
   await S.mv(b, [{t:'scaleX(1)'}, {t:'scaleX(.1)'}], 300); S.swap(b, '📖'); await S.mv(b, [{t:'scaleX(.1)'}, {t:'scaleX(1.15)'}], 300); S.add('✨', {x:75, y:150, s:40}); }},
 {w:'Close the book.', ar:'أغلق الكتاب', cat:'cmd', icon:'📕', ex:'Close your book.', async run(S) {
   const b = S.add('📖', {x:50, y:50, s:110}); await S.wait(500);
   await S.mv(b, [{t:'scaleX(1)'}, {t:'scaleX(.1)'}], 300); S.swap(b, '📕'); await S.mv(b, [{t:'scaleX(.1)'}, {t:'scaleX(1)'}], 300); }},

 /* ---- الحركة ---- */
 {w:'walk', ar:'يمشي', cat:'move', icon:'🚶', ex:'I walk to school.', async run(S) { const d = S.add('🚶', {x:8, s:80, flip:true}); await S.walk(d, 8, 92, 3200, {bob:4}); }},
 {w:'run', ar:'يركض', cat:'move', icon:'🏃', ex:'I can run fast.', async run(S) { const d = S.add('🏃', {x:5, s:80, flip:true}); const t = S.add('💨', {x:0, y:50, s:40}); await S.all([S.walk(d, 5, 95, 1300, {bob:10}), S.mv(t, [{left:'-5%'}, {left:'85%'}], 1300, {easing:'linear'})]); }},
 {w:'jump', ar:'يقفز', cat:'move', icon:'🤸', ex:'The frog can jump.', async run(S) {
   const d = S.add('🧒', {x:50, s:90});
   for (let i = 0; i < 2; i++) await S.mv(d, [{bottom:'40px', t:'scaleY(1)'}, {bottom:'40px', t:'scaleY(.8)', offset:.15}, {bottom:'170px', t:'scaleY(1.1)', offset:.5}, {bottom:'40px', t:'scaleY(1)'}], 800); }},
 {w:'climb', ar:'يتسلق', cat:'move', icon:'🧗', ex:'Monkeys climb trees.', async run(S) { S.add('🪜', {x:50, s:170, z:1}); const d = S.add('🧗', {x:50, s:60, z:2}); await S.walk(d, 50, 50, 2200, {y1:40, y2:170, bob:3}); }},
 {w:'fall', ar:'يسقط', cat:'move', icon:'💫', ex:'Be careful! Don\'t fall.', async run(S) {
   S.add('🍌', {x:42, y:40, s:36, z:1}); const d = S.add('🚶', {x:15, s:90, flip:true}); await S.walk(d, 15, 42, 1000);
   await S.mv(d, [{t:'rotate(0)'}, {t:'rotate(-90deg)', bottom:'30px'}], 400, {easing:'ease-in'}); await S.pop('💫', {x:42, y:110, s:44}); }},
 {w:'swim', ar:'يسبح', cat:'move', icon:'🏊', ex:'Fish swim in the sea.', async run(S) {
   const d = S.add('🏊', {x:5, y:20, s:70, flip:true, z:1}); [5, 25, 45, 65, 85].forEach(x => S.add('🌊', {x, y:0, s:60, z:2}));
   await S.walk(d, 5, 95, 3000, {y1:30, bob:8}); }},
 {w:'fly', ar:'يطير', cat:'move', icon:'🕊️', ex:'Birds fly in the sky.', async run(S) {
   const d = S.add('🕊️', {x:10, y:40, s:60, flip:true});
   await S.mv(d, [{left:'10%', bottom:'40px'}, {left:'30%', bottom:'130px'}, {left:'50%', bottom:'100px'}, {left:'70%', bottom:'180px'}, {left:'95%', bottom:'200px'}], 2600); }},
 {w:'dance', ar:'يرقص', cat:'move', icon:'💃', ex:'We dance at the party.', async run(S) {
   const d = S.add('💃', {x:50, s:100}); S.add('🎵', {x:22, y:150, s:40}); S.add('🎶', {x:78, y:160, s:40});
   await S.mv(d, [{t:'rotate(0)'}, {t:'rotate(-15deg) translateY(-15px)'}, {t:'rotate(15deg)'}, {t:'rotate(-15deg) translateY(-15px)'}, {t:'rotate(15deg)'}, {t:'rotate(0)'}], 1800); }},
 {w:'push', ar:'يدفع', cat:'move', icon:'📦', ex:'Push the door.', async run(S) {
   const b = S.add('📦', {x:40, s:90}); const d = S.add('🚶', {x:24, s:90, flip:true}); S.add('➡️', {x:80, y:160, s:40});
   await S.mv(d, [{t:'rotate(0)'}, {t:'rotate(15deg)'}], 300); await S.all([S.mv(b, [{left:'40%'}, {left:'80%'}], 1800), S.mv(d, [{left:'24%', t:'rotate(15deg)'}, {left:'64%', t:'rotate(15deg)'}], 1800)]); }},
 {w:'pull', ar:'يسحب', cat:'move', icon:'🛒', ex:'Pull the rope.', async run(S) {
   const b = S.add('🛒', {x:25, s:90}); const d = S.add('🚶', {x:50, s:90, flip:true}); S.add('⬅️', {x:20, y:160, s:40});
   await S.mv(d, [{t:'rotate(0)'}, {t:'rotate(-15deg)'}], 300); await S.all([S.mv(b, [{left:'25%'}, {left:'60%'}], 1800), S.mv(d, [{left:'50%', t:'rotate(-15deg)'}, {left:'85%', t:'rotate(-15deg)'}], 1800)]); }},
 {w:'throw', ar:'يرمي', cat:'move', icon:'⚽', ex:'Throw the ball to me.', async run(S) {
   S.add('🧍', {x:15, s:90}); const b = S.add('⚽', {x:24, y:90, s:40});
   await S.mv(b, [{left:'24%', bottom:'90px'}, {left:'55%', bottom:'200px'}, {left:'90%', bottom:'40px'}], 1300, {easing:'ease-out'}); }},
 {w:'catch', ar:'يمسك / يلتقط', cat:'move', icon:'🧤', ex:'Catch the ball!', async run(S) {
   S.add('🧍', {x:20, s:90}); S.add('🧤', {x:30, y:95, s:48, z:3}); const b = S.add('⚽', {x:95, y:60, s:40});
   await S.mv(b, [{left:'95%', bottom:'60px'}, {left:'60%', bottom:'200px'}, {left:'30%', bottom:'100px'}], 1300, {easing:'ease-in'}); await S.pop('✨', {x:40, y:140, s:40}); }},

 /* ---- يومية ---- */
 {w:'eat', ar:'يأكل', cat:'daily', icon:'🍎', ex:'I eat an apple.', async run(S) {
   const f = S.add('😋', {x:38, y:60, s:100}); const a = S.add('🍎', {x:65, y:80, s:55});
   for (const sc of [.75, .5, .25]) { await S.mv(a, [{left:'65%'}, {left:'50%'}], 350); await S.mv(a, [{left:'50%', t:`scale(${sc + .25})`}, {left:'65%', t:`scale(${sc})`}], 350); }
   a.remove(); S.swap(f, '😊'); await S.pop('😋', {x:70, y:150, s:30}); }},
 {w:'drink', ar:'يشرب', cat:'daily', icon:'🥛', ex:'I drink milk.', async run(S) {
   const f = S.add('🙂', {x:38, y:60, s:100}); const c = S.add('🥛', {x:68, y:70, s:60});
   await S.mv(c, [{left:'68%', t:'rotate(0)'}, {left:'52%', t:'rotate(-60deg)'}], 700); await S.wait(800);
   await S.mv(c, [{left:'52%', t:'rotate(-60deg)'}, {left:'68%', t:'rotate(0)'}], 500); S.swap(f, '😊'); }},
 {w:'sleep', ar:'ينام', cat:'daily', icon:'😴', ex:'I sleep at night.', async run(S) {
   S.add('🛏️', {x:50, s:140, z:1}); S.add('😴', {x:42, y:88, s:50, z:2}); S.add('🌙', {x:85, y:170, s:50});
   for (let i = 0; i < 3; i++) { const z = S.add('💤', {x:55, y:120, s:36}); await S.mv(z, [{bottom:'120px', left:'55%', opacity:1}, {bottom:'200px', left:'65%', opacity:0}], 900); z.remove(); } }},
 {w:'cry', ar:'يبكي', cat:'daily', icon:'😢', ex:'The baby cries.', async run(S) {
   S.add('😭', {x:50, y:70, s:110});
   for (let i = 0; i < 3; i++) await S.all([42, 58].map(x => { const t = S.add('💧', {x, y:110, s:26}); return S.mv(t, [{bottom:'110px', opacity:1}, {bottom:'40px', opacity:0}], 700); })); }},
 {w:'laugh', ar:'يضحك', cat:'daily', icon:'😂', ex:'The joke makes me laugh.', async run(S) {
   const f = S.add('😂', {x:50, y:60, s:120}); S.add('😆', {x:20, y:150, s:40}); S.add('🤣', {x:80, y:150, s:40});
   await S.mv(f, [{t:'rotate(0)'}, {t:'rotate(-12deg)'}, {t:'rotate(12deg)'}, {t:'rotate(-12deg)'}, {t:'rotate(12deg)'}, {t:'rotate(0)'}], 1300); }},
 {w:'wave', ar:'يلوّح', cat:'daily', icon:'👋', ex:'Wave goodbye!', async run(S) {
   S.add('🧍', {x:40, s:100}); const h = S.add('👋', {x:58, y:120, s:60});
   await S.mv(h, [{t:'rotate(-25deg)'}, {t:'rotate(25deg)'}, {t:'rotate(-25deg)'}, {t:'rotate(25deg)'}, {t:'rotate(-25deg)'}, {t:'rotate(0)'}], 1600); }},
 {w:'clap', ar:'يصفّق', cat:'daily', icon:'👏', ex:'Clap your hands!', async run(S) {
   const h = S.add('👏', {x:50, y:60, s:110});
   for (let i = 0; i < 4; i++) { tone(1200, .05, 'square', 0, .05); await S.mv(h, [{t:'scale(1)'}, {t:'scale(.75)'}, {t:'scale(1)'}], 350); } S.add('✨', {x:75, y:160, s:40}); }},
 {w:'give', ar:'يُعطي', cat:'daily', icon:'🎁', ex:'Give the gift to Sara.', async run(S) {
   S.add('🧑', {x:18, y:40, s:90}); const g = S.add('👧', {x:82, y:40, s:90}); const p = S.add('🎁', {x:30, y:80, s:46});
   await S.mv(p, [{left:'30%'}, {left:'70%'}], 1300); S.swap(g, '🥰'); await S.pop('❤️', {x:82, y:150, s:36}); }},
 {w:'take', ar:'يأخذ', cat:'daily', icon:'🤲', ex:'Take a cake, please.', async run(S) {
   S.add('🧑', {x:18, y:40, s:90}); S.add('🍰', {x:82, y:40, s:60, o:.0}); const p = S.add('🍰', {x:75, y:60, s:50});
   S.add('🍽️', {x:75, y:40, s:60, z:1}); await S.wait(400); await S.mv(p, [{left:'75%'}, {left:'32%'}], 1300); await S.pop('😋', {x:18, y:150, s:36}); }},

 /* ---- المكان ---- */
 {w:'in', ar:'في / داخل', cat:'place', icon:'📦', ex:'The cat is in the box.', async run(S) {
   S.add('📦', {x:55, s:110, z:3}); const c = S.add('🐈', {x:15, s:60, z:2, flip:true});
   await S.walk(c, 15, 42, 900); await S.mv(c, [{left:'42%', bottom:'40px'}, {left:'50%', bottom:'170px'}, {left:'55%', bottom:'70px'}], 700); S.add('⬇️', {x:80, y:120, s:40}); }},
 {w:'on', ar:'على / فوق', cat:'place', icon:'⬆️', ex:'The cat is on the box.', async run(S) {
   S.add('📦', {x:55, s:110, z:2}); const c = S.add('🐈', {x:15, s:60, z:3, flip:true});
   await S.walk(c, 15, 42, 900); await S.mv(c, [{left:'42%', bottom:'40px'}, {left:'50%', bottom:'190px'}, {left:'55%', bottom:'140px'}], 700); }},
 {w:'under', ar:'تحت', cat:'place', icon:'⬇️', ex:'The cat is under the umbrella.', async run(S) {
   S.add('☂️', {x:55, y:85, s:150, z:1}); const c = S.add('🐈', {x:10, s:56, z:3, flip:true}); await S.walk(c, 10, 57, 1500); S.add('🌧️', {x:20, y:180, s:40}); }},
 {w:'behind', ar:'خلف / وراء', cat:'place', icon:'🌳', ex:'The cat is behind the tree.', async run(S) {
   S.add('🌳', {x:55, s:170, z:3}); const c = S.add('🐈', {x:10, s:60, z:1, flip:true}); await S.walk(c, 10, 55, 1400);
   await S.wait(500); await S.mv(c, [{left:'55%'}, {left:'66%'}, {left:'55%'}], 900); }},
 {w:'next to', ar:'بجانب', cat:'place', icon:'🐶', ex:'The dog is next to the cat.', async run(S) {
   S.add('🐈', {x:42, s:70}); const d = S.add('🐕', {x:95, s:70}); await S.walk(d, 95, 62, 1400); await S.pop('❤️', {x:52, y:130, s:34}); }},
 {w:'up', ar:'أعلى / فوق', cat:'place', icon:'🎈', ex:'The balloon goes up.', async run(S) {
   S.add('⬆️', {x:80, y:120, s:50}); const b = S.add('🎈', {x:45, y:40, s:70}); await S.mv(b, [{bottom:'40px', t:'rotate(0)'}, {bottom:'120px', t:'rotate(8deg)'}, {bottom:'200px', t:'rotate(-8deg)'}], 2200); }},
 {w:'down', ar:'أسفل / تحت', cat:'place', icon:'🍎', ex:'The apple falls down.', async run(S) {
   S.add('🌳', {x:45, s:180, z:1}); S.add('⬇️', {x:80, y:120, s:50}); const a = S.add('🍎', {x:52, y:150, s:36, z:2});
   await S.wait(500); await S.mv(a, [{bottom:'150px'}, {bottom:'40px', offset:.7}, {bottom:'60px', offset:.85}, {bottom:'40px'}], 1200, {easing:'ease-in'}); }},

 /* ---- الأضداد ---- */
 {w:'big', ar:'كبير', cat:'opp', icon:'🐘', ex:'The elephant is big.', async run(S) {
   const e = S.add('🐘', {x:35, s:60}); S.add('🐭', {x:75, s:30}); await S.mv(e, [{t:'scale(1)'}, {t:'scale(2.2)'}], 1200, {easing:'ease-out'});
   await S.pop('👆', {x:35, y:20, s:40, z:5}); }},
 {w:'small', ar:'صغير', cat:'opp', icon:'🐭', ex:'The mouse is small.', async run(S) {
   S.add('🐘', {x:30, s:130}); const m = S.add('🐭', {x:75, s:60}); await S.mv(m, [{t:'scale(1)'}, {t:'scale(.45)'}], 1200);
   const p = S.add('👇', {x:75, y:90, s:40}); await S.mv(p, [{bottom:'90px'}, {bottom:'75px'}, {bottom:'90px'}], 600); }},
 {w:'fast', ar:'سريع', cat:'opp', icon:'🐆', ex:'The cheetah is fast.', async run(S) { const d = S.add('🐆', {x:0, s:80, flip:true}); await S.walk(d, 0, 100, 800, {bob:4}); S.add('💨', {x:50, y:50, s:50}); }},
 {w:'slow', ar:'بطيء', cat:'opp', icon:'🐌', ex:'The snail is slow.', async run(S) { const d = S.add('🐌', {x:10, s:70, flip:true}); await S.walk(d, 10, 40, 3500, {bob:1}); }},
 {w:'hot', ar:'حار', cat:'opp', icon:'🥵', ex:'The sun is hot.', async run(S) {
   const s = S.add('☀️', {x:80, y:150, s:80}); S.add('🥵', {x:38, y:50, s:110});
   await S.all([S.mv(s, [{t:'rotate(0) scale(1)'}, {t:'rotate(90deg) scale(1.2)'}, {t:'rotate(180deg) scale(1)'}], 1600), (async () => { for (let i = 0; i < 3; i++) { const d = S.add('💦', {x:52, y:120, s:28}); await S.mv(d, [{bottom:'120px', opacity:1}, {bottom:'50px', opacity:0}], 500); } })()]); }},
 {w:'cold', ar:'بارد', cat:'opp', icon:'🥶', ex:'Ice is cold.', async run(S) {
   const f = S.add('🥶', {x:45, y:50, s:110}); const flakes = [15, 35, 65, 85].map((x, i) => S.add('❄️', {x, y:230, s:30}));
   await S.all([S.mv(f, [{t:'translateX(0)'}, {t:'translateX(-6px)'}, {t:'translateX(6px)'}, {t:'translateX(-6px)'}, {t:'translateX(6px)'}, {t:'translateX(-6px)'}, {t:'translateX(0)'}], 1500),
     ...flakes.map((d, i) => S.mv(d, [{bottom:'230px'}, {bottom:'40px'}], 1800, {delay:i * 200}))]); }},
 {w:'happy', ar:'سعيد', cat:'opp', icon:'😄', ex:'I am happy today!', async run(S) {
   const f = S.add('😐', {x:50, y:60, s:120}); await S.wait(600); S.swap(f, '😄');
   await S.mv(f, [{bottom:'60px'}, {bottom:'110px'}, {bottom:'60px'}, {bottom:'90px'}, {bottom:'60px'}], 900); S.add('✨', {x:25, y:160, s:40}); S.add('🎉', {x:78, y:160, s:40}); }},
 {w:'sad', ar:'حزين', cat:'opp', icon:'😞', ex:'He is sad.', async run(S) {
   const f = S.add('🙂', {x:50, y:60, s:120}); S.add('🌧️', {x:50, y:180, s:50}); await S.wait(600); S.swap(f, '😞');
   await S.mv(f, [{bottom:'60px', t:'rotate(0)'}, {bottom:'45px', t:'rotate(-6deg)'}], 900); }},
];
ACTIONS.forEach((a, i) => { a.i = i; a.key = a.w.toLowerCase().replace(/[^a-z ]/g, '').trim(); });

/* ---------- 🧠 المراجعة المتباعدة (Spaced Repetition) ---------- */
const SRS_DAYS = [0, 1, 2, 4, 7, 14, 30];
const DAY = 864e5;
function srsAdd(key) {
  const p = me(); if (!p) return; p.srs = p.srs || {};
  if (key.startsWith('w:') && !SIMPLE_WORDS.find(x => x.w === key.slice(2))) return;
  if (!p.srs[key]) { p.srs[key] = {box:0, due:Date.now()}; save(); }
}
function srsDue() { const p = me(); if (!p || !p.srs) return []; const now = Date.now(); return Object.keys(p.srs).filter(k => p.srs[k].due <= now); }
function srsResult(key, ok) {
  const p = me(); const c = p.srs[key]; if (!c) return;
  c.box = ok ? Math.min(c.box + 1, SRS_DAYS.length - 1) : 0;
  c.due = Date.now() + (ok ? SRS_DAYS[c.box] * DAY : 0); save();
}

/* ---------- 🎬 الشاشات ---------- */
let actCat = 'cmd';
views.act = () => {
  setTitle('🎬 كلمات تتحرك');
  const p = me(); p.srs = p.srs || {};
  render(`<p class="sub">شاهد الشخصية تتحرك فتفهم معنى الكلمة بدون ترجمة! 👀 ثم قلها 🗣️ ثم قم بالحركة بنفسك 🤸</p>
   <div class="btnrow"><button class="btn pink" data-go="actgame/guess">🕵️ شاهد وخمّن</button><button class="btn purple" data-go="actgame/scene">👂 اسمع واختر المشهد</button><button class="btn orange" data-go="actgame/boss">🎤 أنت المدير!</button></div>
   <div class="tabs">${ACT_CATS.map(c => `<button class="${c.id === actCat ? 'on' : ''}" data-act="actCat" data-arg="${c.id}">${c.icon} ${c.name}</button>`).join('')}</div>
   <div class="grid">${ACTIONS.filter(a => a.cat === actCat).map(a => `<button class="card ${p.srs['a:' + a.key] ? 'letter-card done' : ''}" data-go="actword/${a.i}"><span class="emoji">${a.icon}</span><div class="label en">${esc(a.w)}</div>${settings.arabic ? `<div class="small">${a.ar}</div>` : ''}</button>`).join('')}</div>`);
};
actions.actCat = c => { actCat = c; views.act(); };
views.actword = (i) => {
  const A = ACTIONS[+i]; if (!A) return go('act');
  setTitle(`🎬 \u2068${A.w}\u2069`);
  const list = ACTIONS.filter(a => a.cat === A.cat); const k = list.indexOf(A);
  render(`<div class="lesson">
    <div id="stg"></div>
    <div class="word-big en" style="margin-top:10px">${esc(A.w)}</div>
    ${settings.arabic ? `<div class="sub" id="arMean" style="font-size:20px">${A.ar}</div>` : ''}
    <div class="en sub" style="font-size:20px">📝 ${esc(A.ex)} <button class="btn ghost" data-act="say" data-arg="${esc(A.ex)}" style="padding:4px 10px">🔊</button></div>
    <div class="btnrow"><button class="btn green" id="replay">🔁 شاهد مرة أخرى</button><button class="btn purple" data-act="say" data-arg="${esc(A.w)}">🔊 اسمع</button><button class="btn pink" id="sayA">🎤 قلها أنت</button></div>
    <div class="actionbox">🤸 <b>دورك!</b> قف وقل <b class="en">"${esc(A.w)}"</b> بصوت عالٍ وقم بنفس الحركة. الكلمة التي نتحرك بها لا ننساها!</div>
    <div class="navrow"><button class="btn ghost" data-go="actword/${list[(k + list.length - 1) % list.length].i}">→ السابق</button><button class="btn ghost" data-go="act">الكل</button><button class="btn ghost" data-go="actword/${list[(k + 1) % list.length].i}">التالي ←</button></div></div>`);
  const stg = $('#stg'); playAction(stg, A, {loop:true});
  $('#replay').onclick = () => playAction(stg, A, {loop:true});
  $('#sayA').onclick = () => listen(A.key, (ok, heard) => {
    if (ok) { sfx('good'); praise(); confetti(40); addStars(1); playAction(stg, A, {loop:true, say:false}); }
    else { sfx('bad'); toast(`سمعت: "${heard}" — حاول مرة أخرى 💪`); speak(A.w); }
  });
  if (!me().srs || !me().srs['a:' + A.key]) { srsAdd('a:' + A.key); addStars(1); }
};

/* ---- ألعاب المسرح ---- */
views.actgame = (type) => {
  if (type === 'boss') return bossGame();
  const N = 10; let q = 0, score = 0;
  setTitle(type === 'guess' ? '🕵️ شاهد وخمّن' : '👂 اسمع واختر المشهد');
  const next = () => {
    if (q >= N) return finishQuiz('act_' + type, score, N, 'act');
    q++;
    const A = rand(ACTIONS); const opts = shuffle([A, ...sample(ACTIONS.filter(x => x !== A && x.cat === A.cat), 1), ...sample(ACTIONS.filter(x => x !== A && x.cat !== A.cat), 1)]);
    const head = `<div class="progressbar"><div style="width:${(q - 1) / N * 100}%"></div></div><p class="sub">سؤال ${q} من ${N} · ✅ ${score}</p>`;
    const done = (ok, el) => {
      if (ok) { score++; sfx('good'); el.classList.add('correct'); srsAdd('a:' + A.key); srsResult('a:' + A.key, true); }
      else { sfx('bad'); el.classList.add('wrong'); main().querySelector(`[data-k="${A.i}"]`).classList.add('correct'); }
      speak(A.w); setTimeout(next, 1700);
    };
    if (type === 'guess') {
      render(`${head}<div id="stg"></div><p class="sub">ماذا يحدث في المشهد؟ 🤔</p><div class="options" style="grid-template-columns:1fr">${opts.map(o => `<button class="card" data-k="${o.i}" style="min-height:70px;flex-direction:row;gap:12px"><span class="label en" style="font-size:28px">${esc(o.w)}</span></button>`).join('')}</div>`);
      playAction($('#stg'), A, {loop:true, say:false});
    } else {
      render(`${head}<div class="q-head"><button class="listen-big" data-act="say" data-arg="${esc(A.w)}">🔊</button><p class="sub">اسمع… أي مشهد يطابق الكلمة؟</p></div><div class="scenes">${opts.map(o => `<button class="card scene-pick" data-k="${o.i}" style="padding:6px"><div class="stage mini"></div></button>`).join('')}</div>`);
      main().querySelectorAll('.scene-pick').forEach(b => playAction(b.querySelector('.stage'), ACTIONS[+b.dataset.k], {loop:true, say:false}));
      setTimeout(() => speak(A.w), 300);
    }
    let answered = false;
    main().querySelectorAll('[data-k]').forEach(b => b.onclick = () => { if (answered) return; answered = true; done(+b.dataset.k === A.i, b); });
  };
  next();
};
// 🎤 أنت المدير: الطفل يعطي الأمر بصوته والشخصية تنفّذ — تدريب على النطق الصحيح
function bossGame() {
  setTitle('🎤 أنت المدير!');
  let count = 0;
  render(`<div class="lesson"><p class="sub">قل أمراً بالإنجليزية والشخصية ستنفّذه! جرّب: <b class="en">"jump"</b>، <b class="en">"Come here"</b>، <b class="en">"Sit down"</b></p>
   <div id="stg"></div><div class="word-big en" id="said" style="min-height:60px">🎤</div>
   <div class="btnrow"><button class="listen-big" id="bossMic" style="width:110px;height:110px;font-size:52px">🎤</button></div>
   <p class="sub">أوامر نفّذتها بصوتك: <b id="bc">0</b> ⭐</p>
   <p class="sub">${SR ? 'أو اضغط على كلمة لتسمعها أولاً ثم قلها:' : '⚠️ الميكروفون غير مدعوم في هذا المتصفح — اضغط على الكلمات:'}</p>
   <div class="btnrow">${ACTIONS.map(a => `<button class="btn ghost en" style="font-size:16px;padding:6px 12px" data-boss="${a.i}">${a.icon} ${esc(a.w)}</button>`).join('')}</div></div>`);
  const stg = $('#stg'); makeStage(stg).add('🧍', {x:50, s:90});
  const perform = (A, byVoice) => { $('#said').textContent = A.w; playAction(stg, A, {say:!byVoice}); if (byVoice) { count++; $('#bc').textContent = count; sfx('good'); speak('Yes! ' + A.w); if (count % 3 === 0) { addStars(1); confetti(30); } } };
  main().querySelectorAll('[data-boss]').forEach(b => b.onclick = () => { const A = ACTIONS[+b.dataset.boss]; if (SR) { speak(A.w); $('#said').textContent = A.w; } else perform(A, false); });
  $('#bossMic').onclick = () => {
    if (!SR) return toast('الميكروفون غير مدعوم هنا — جرّب Chrome');
    const r = new SR(); r.lang = settings.accent; r.maxAlternatives = 5; $('#said').textContent = '👂 …';
    r.onresult = e => {
      const alts = Array.from(e.results[0]).map(a => a.transcript.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim());
      let best = null;
      for (const t of alts) for (const A of ACTIONS) { if ((' ' + t + ' ').includes(' ' + A.key + ' ') && (!best || A.key.length > best.key.length)) best = A; if (best) break; }
      if (!best) for (const t of alts) for (const A of ACTIONS) if (similarity(t, A.key) > .7) { best = A; break; }
      if (best) perform(best, true); else { $('#said').textContent = `"${alts[0] || '?'}" 🤔`; sfx('bad'); toast('لم أفهم الأمر — جرّب كلمة من القائمة'); }
    };
    r.onerror = () => { $('#said').textContent = '🎤'; toast('لم أسمع جيداً، حاول مرة أخرى'); };
    r.start();
  };
}

/* ---- 👾 أطعم الوحش: لعبة كتابة وتهجئة ---- */
views.monster = () => {
  setTitle('👾 أطعم الوحش');
  const pool = SIMPLE_WORDS.filter(x => x.w.length <= (level === 'hard' ? 7 : level === 'mid' ? 5 : 4));
  let n = 0, size = 90, fed = 0; const N = 8;
  const next = () => {
    if (n >= N) { addStars(3); sfx('win'); confetti(); setBest('monster', N); modal(`<div class="emoji">👾💖</div><h2>شبع الوحش!</h2><p>كتبت ${N} كلمات صحيحة</p>`, () => go('games')); speak('Yummy! Thank you!'); return; }
    n++; const c = rand(pool); const letters = c.w.split(''); let pos = 0, mistakes = 0;
    render(`<p class="sub">الوحش جائع! 😋 أطعمه حروف الكلمة بالترتيب الصحيح · ${n}/${N}</p>
      <div style="text-align:center"><div id="mon" style="font-size:${size}px;display:inline-block;transition:font-size .4s">👾</div></div>
      <div class="q-head"><span class="pic" style="font-size:80px">${c.pic}</span><br><button class="btn ghost" data-act="sayWord" data-arg="${c.w}">🔊 اسمع</button></div>
      <div class="slots">${letters.map((_, i) => `<span class="slot" id="ms${i}"></span>`).join('')}</div>
      <div class="tiles">${shuffle(letters.concat(sample('abcdefghilmnoprstu'.split('').filter(l => !letters.includes(l)), level === 'easy' ? 1 : 3))).map(l => `<button class="tile en" data-l="${l}">${l}</button>`).join('')}</div>`);
    setTimeout(() => speak(c.w), 300);
    const mon = $('#mon');
    main().querySelectorAll('.tile').forEach(b => b.onclick = async () => {
      if (b.disabled) return;
      if (b.dataset.l === letters[pos]) {
        b.disabled = true; const i = pos++; speak(letterName(b.dataset.l), {rate:1.1});
        const r1 = b.getBoundingClientRect(), r2 = mon.getBoundingClientRect();
        await b.animate([{transform:'translate(0,0) scale(1)'}, {transform:`translate(${r2.left + r2.width / 2 - r1.left - r1.width / 2}px,${r2.top + r2.height / 2 - r1.top - r1.height / 2}px) scale(.2)`}], {duration:450, easing:'ease-in', fill:'forwards'}).finished;
        b.style.visibility = 'hidden'; mon.textContent = '😋'; sfx('pop');
        mon.animate([{transform:'scale(1)'}, {transform:'scale(1.25)'}, {transform:'scale(1)'}], 300); setTimeout(() => { if (mon.isConnected) mon.textContent = '👾'; }, 350);
        const s = $('#ms' + i); s.textContent = b.dataset.l; s.classList.add('filled');
        if (pos === letters.length) { fed++; size = Math.min(size + 12, 170); sfx('good'); praise(); srsAdd('w:' + c.w); if (mistakes === 0) srsResult('w:' + c.w, true); setTimeout(next, 1400); }
      } else { mistakes++; sfx('bad'); mon.textContent = '🤢'; mon.animate([{transform:'rotate(-10deg)'}, {transform:'rotate(10deg)'}, {transform:'none'}], 300); setTimeout(() => { if (mon.isConnected) mon.textContent = '👾'; }, 600); if (mistakes === 2) toast(`💡 الحرف التالي هو "${letters[pos]}"`); }
    });
  };
  next();
};

/* ---- 🧠 مراجعة اليوم ---- */
views.review = () => {
  setTitle('🧠 مراجعة اليوم');
  const p = me(); p.srs = p.srs || {};
  let queue = shuffle(srsDue()).slice(0, 12); let extra = false;
  if (!queue.length) {
    const all = Object.keys(p.srs);
    if (!all.length) { render(`<div class="lesson"><div class="emoji" style="font-size:90px">🌱</div><p class="title">لا توجد كلمات بعد!</p><p class="sub">تعلّم كلمات من «🎬 كلمات تتحرك» أو «🖼️ الكلمات والصور» وستظهر هنا للمراجعة في الوقت المناسب حتى لا تُنسى.</p><div class="btnrow"><button class="btn pink" data-go="act">🎬 ابدأ</button></div></div>`); return; }
    queue = all.sort((a, b) => p.srs[a].box - p.srs[b].box).slice(0, 8); extra = true;
  }
  const total = queue.length; let doneN = 0, right = 0; const retried = new Set();
  const next = () => {
    if (!queue.length) { const st = right >= total ? 3 : right >= total * .7 ? 2 : 1; addStars(st); sfx('win'); confetti();
      const mastered = Object.values(p.srs).filter(c => c.box >= 4).length;
      render(`<div class="lesson"><div class="emoji" style="font-size:90px">🧠✨</div><p class="title">أنهيت مراجعة اليوم!</p><div class="stars">${'⭐'.repeat(st)}</div><p class="sub">كلمات ثابتة في ذاكرتك: <b>${mastered}</b> من ${Object.keys(p.srs).length} 💪</p><p class="sub">ارجع غداً — الكلمات تعود في الوقت المناسب قبل أن تُنسى (بعد 1، 2، 4، 7، 14، 30 يوماً)</p><div class="btnrow"><button class="btn green" data-go="home">🏠 الرئيسية</button><button class="btn purple" data-go="games">🎮 العب</button></div></div>`);
      p.lastReview = new Date().toDateString(); save(); return; }
    const key = queue.shift();
    const head = `<div class="progressbar"><div style="width:${doneN / total * 100}%"></div></div><p class="sub">${extra ? 'تمرين إضافي 💪' : 'مراجعة'} · ${doneN + 1}/${total} · الصندوق ${'🟩'.repeat(p.srs[key].box + 1)}</p>`;
    const finish = ok => { if (!retried.has(key)) { srsResult(key, ok); if (ok) right++; } if (!ok && !retried.has(key)) { retried.add(key); queue.push(key); } else doneN++; setTimeout(next, ok ? 1200 : 1800); };
    const isAct = key.startsWith('a:'); const A = isAct && ACTIONS.find(a => a.key === key.slice(2)); const W = !isAct && SIMPLE_WORDS.find(x => x.w === key.slice(2));
    if (!A && !W) { delete p.srs[key]; save(); return next(); }
    const modes = ['pick', 'pick', 'spell']; if (SR) modes.push('say');
    let mode = rand(modes); if (isAct && mode === 'spell' && A.key.includes(' ')) mode = 'pick';
    const word = isAct ? A.key : W.w;
    if (mode === 'pick') {
      if (isAct) {
        const opts = shuffle([A, ...sample(ACTIONS.filter(x => x !== A), 2)]);
        render(`${head}<div id="stg"></div><p class="sub">ماذا يحدث؟</p><div class="options" style="grid-template-columns:1fr">${opts.map(o => `<button class="card" data-ok="${o === A}" style="min-height:64px"><span class="label en" style="font-size:26px">${esc(o.w)}</span></button>`).join('')}</div>`);
        playAction($('#stg'), A, {loop:true, say:false});
      } else {
        const opts = choices(W, SIMPLE_WORDS, 4);
        render(`${head}<div class="q-head"><button class="listen-big" data-act="sayWord" data-arg="${W.w}">🔊</button><p class="sub">اسمع… أين الصورة؟</p></div><div class="options">${opts.map(o => `<button class="card" data-ok="${o === W}"><span class="emoji">${o.pic}</span></button>`).join('')}</div>`);
        setTimeout(() => speak(W.w), 300);
      }
      let a = false; main().querySelectorAll('[data-ok]').forEach(b => b.onclick = () => { if (a) return; a = true; const ok = b.dataset.ok === 'true'; b.classList.add(ok ? 'correct' : 'wrong'); if (!ok) main().querySelector('[data-ok="true"]').classList.add('correct'); sfx(ok ? 'good' : 'bad'); speak(isAct ? A.w : W.w); finish(ok); });
    } else if (mode === 'say') {
      render(`${head}<div class="lesson">${isAct ? '<div id="stg"></div>' : `<div class="pic">${W.pic}</div>`}<div class="word-big en">${esc(isAct ? A.w : W.w)}</div><div class="btnrow"><button class="btn purple" data-act="say" data-arg="${esc(word)}">🔊 اسمع</button><button class="btn pink" id="mic" style="font-size:24px">🎤 قلها</button><button class="btn ghost" id="skip">تخطَّ</button></div><div class="stars" id="res"></div></div>`);
      if (isAct) playAction($('#stg'), A, {loop:true, say:false});
      let tries = 0;
      $('#mic').onclick = () => listen(word, (ok, heard) => { tries++; if (ok) { $('#res').textContent = '⭐⭐⭐'; sfx('good'); praise(); finish(true); } else { $('#res').textContent = `🤔 "${heard}"`; sfx('bad'); speak(word); if (tries >= 3) finish(false); } });
      $('#skip').onclick = () => finish(false);
    } else {
      const letters = word.split(''); let pos = 0, miss = 0;
      render(`${head}<div class="q-head">${isAct ? '<div id="stg"></div>' : `<div class="pic">${W.pic}</div>`}<button class="btn ghost" data-act="say" data-arg="${word}">🔊 اسمع</button><p class="sub">اكتب الكلمة ✍️</p></div><div class="slots">${letters.map((_, i) => `<span class="slot" id="rs${i}"></span>`).join('')}</div><div class="tiles">${shuffle(letters).map(l => `<button class="tile en" data-l="${l}">${l}</button>`).join('')}</div>`);
      if (isAct) playAction($('#stg'), A, {loop:true, say:false});
      setTimeout(() => speak(word), 300);
      main().querySelectorAll('.tile').forEach(b => b.onclick = () => {
        if (b.dataset.l === letters[pos]) { b.disabled = true; const s = $('#rs' + pos++); s.textContent = b.dataset.l; s.classList.add('filled'); sfx('tap'); if (pos === letters.length) { sfx('good'); speak(word); finish(miss < 2); } }
        else { miss++; sfx('bad'); b.animate([{transform:'translateX(-6px)'}, {transform:'translateX(6px)'}, {transform:'none'}], 300); }
      });
    }
  };
  next();
};
