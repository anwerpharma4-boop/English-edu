/* ===================== 🌍 عالم الطفل: ألوان · حيوانات · أيام وأشهر · مواقف من الحياة ===================== */
'use strict';
const QUIZ_BACK = {colours:'colours', animals:'animals', calendar:'calendar'};
const an = w => (/^[aeiou]/i.test(w) ? 'an ' : 'a ') + w;
const tabsHtml = (items, cur, act) => `<div class="tabs">${items.map(([k, n]) => `<button class="${k === cur ? 'on' : ''}" data-act="${act}" data-arg="${k}">${n}</button>`).join('')}</div>`;

/* =========================================================
   🏠 مشاهد جديدة: البيت والروتين اليومي (أمثلة واقعية)
   ========================================================= */
ACT_CATS.splice(1, 0, {id:'home', name:'في البيت والروتين اليومي', icon:'🏠'});
const dark = 'linear-gradient(#1d2547,#38406b)', light = 'linear-gradient(#fff8d6,#fffdf0)';
ACTIONS.push(
 {w:'Turn on the light.', ar:'شغّل الضوء', cat:'home', icon:'💡', ex:'It is dark. Turn on the light, please.', async run(S) {
   S.noCloud(); S.bg(dark); S.ground('#5a4a3a'); const k = S.add('🧒', {x:30, s:90}); const b = S.add('💡', {x:65, y:170, s:50, o:.3});
   await S.wait(700); S.add('👆', {x:45, y:120, s:40}); await S.wait(300); tone(1500, .05, 'square', 0, .06);
   S.bg(light); await S.mv(b, [{opacity:.3, t:'scale(1)'}, {opacity:1, t:'scale(1.4)'}, {opacity:1, t:'scale(1.1)'}], 500); S.swap(k, '😃'); }},
 {w:'Turn off the light.', ar:'أطفئ الضوء', cat:'home', icon:'🌙', ex:'Turn off the light and go to sleep.', async run(S) {
   S.noCloud(); S.bg(light); S.ground('#5a4a3a'); S.add('🛏️', {x:40, s:120, z:1}); const f = S.add('🥱', {x:33, y:80, s:46, z:2}); const b = S.add('💡', {x:70, y:170, s:50});
   await S.wait(800); tone(900, .05, 'square', 0, .06); S.bg(dark); await S.mv(b, [{opacity:1}, {opacity:.2}], 300); S.swap(f, '😴'); await S.pop('🌙', {x:85, y:170, s:44}); }},
 {w:'Open the door.', ar:'افتح الباب', cat:'home', icon:'🚪', ex:'Somebody is knocking. Open the door!', async run(S) {
   const d = S.add('🚪', {x:55, s:150, z:3}); const v = S.add('👵', {x:55, y:45, s:80, z:1, o:0});
   tone(300, .1, 'square', 0, .1); tone(300, .1, 'square', .25, .1); await S.wait(700);
   await S.all([S.mv(d, [{t:'perspective(500px) rotateY(0)'}, {t:'perspective(500px) rotateY(80deg)'}], 900), S.mv(v, [{opacity:0}, {opacity:1}], 900)]); await S.pop('👋', {x:72, y:120, s:40}); }},
 {w:'Close the door.', ar:'أغلق الباب', cat:'home', icon:'🚪', ex:'It is cold. Close the door, please.', async run(S) {
   S.add('❄️', {x:55, y:120, s:36, z:1}); const d = S.add('🚪', {x:55, s:150, z:3}); d._pre += ' perspective(500px) rotateY(80deg)'; d.style.transform = d._pre;
   await S.wait(700); d._pre = 'translateX(-50%)'; await S.mv(d, [{t:'perspective(500px) rotateY(80deg)'}, {t:'perspective(500px) rotateY(0)'}], 700); tone(150, .12, 'square', 0, .1); await S.pop('👍', {x:85, y:150, s:40}); }},
 {w:'Put on your shoes.', ar:'البس حذاءك', cat:'home', icon:'👟', ex:'Put on your shoes. We are going out.', async run(S) {
   S.add('🧍', {x:45, s:120}); const sh = S.add('👟', {x:88, y:40, s:44});
   await S.mv(sh, [{left:'88%', bottom:'40px'}, {left:'70%', bottom:'90px'}, {left:'50%', bottom:'36px'}], 1200); await S.pop('✅', {x:75, y:150, s:40}); }},
 {w:'Take off your coat.', ar:'اخلع معطفك', cat:'home', icon:'🧥', ex:'Take off your coat and hang it up.', async run(S) {
   S.add('🧍', {x:40, s:120, z:1}); const c = S.add('🧥', {x:40, y:62, s:78, z:2}); S.add('🪝', {x:85, y:150, s:40});
   await S.wait(600); await S.mv(c, [{left:'40%', bottom:'62px', t:'scale(1)'}, {left:'62%', bottom:'150px', t:'scale(.8)'}, {left:'85%', bottom:'105px', t:'scale(.7)'}], 1400); }},
 {w:'Get dressed.', ar:'البس ملابسك', cat:'home', icon:'👕', ex:'Wake up and get dressed for school.', async run(S) {
   const k = S.add('🧍', {x:50, s:120, z:1});
   for (const [e, y, x0] of [['👕', 85, 10], ['👖', 45, 90], ['🧢', 150, 10]]) { const c = S.add(e, {x:x0, y:y + 40, s:50, z:2}); await S.mv(c, [{left:x0 + '%'}, {left:'50%'}], 650); }
   await S.pop('✨', {x:75, y:170, s:36}); }},
 {w:'Pick up your toys.', ar:'اجمع ألعابك', cat:'home', icon:'🧸', ex:'Pick up your toys and put them in the box.', async run(S) {
   S.ground('#D7B98E'); const bx = S.add('🧺', {x:80, s:80, z:3}); const toys = [['🧸', 15], ['🚗', 32], ['🧩', 48], ['⚽', 62]].map(([e, x]) => S.add(e, {x, s:40, z:2}));
   for (const t of toys) await S.mv(t, [{left:t.style.left, bottom:'40px'}, {left:'72%', bottom:'150px'}, {left:'80%', bottom:'70px', opacity:0}], 600);
   await S.pop('⭐', {x:80, y:150, s:40}); }},
 {w:'Put it in the bin.', ar:'ضعها في سلة المهملات', cat:'home', icon:'🗑️', ex:'Don\'t drop rubbish. Put it in the bin.', async run(S) {
   S.add('🧒', {x:20, s:90}); S.add('🗑️', {x:78, s:80, z:3}); const r = S.add('🍌', {x:28, y:90, s:36, z:2});
   await S.mv(r, [{left:'28%', bottom:'90px', t:'rotate(0)'}, {left:'55%', bottom:'190px', t:'rotate(180deg)'}, {left:'78%', bottom:'80px', t:'rotate(360deg)', opacity:.3}], 1200); await S.pop('👍', {x:50, y:150, s:40}); }},
 {w:'Have breakfast.', ar:'تناول الفطور', cat:'home', icon:'🥣', ex:'Have breakfast before school.', async run(S) {
   S.add('☀️', {x:85, y:170, s:44}); const f = S.add('🙂', {x:35, y:70, s:90}); S.add('🥣', {x:62, y:42, s:56}); const sp = S.add('🥄', {x:62, y:90, s:36});
   for (let i = 0; i < 2; i++) { await S.mv(sp, [{left:'62%', bottom:'90px'}, {left:'44%', bottom:'105px'}], 450); await S.mv(sp, [{left:'44%', bottom:'105px'}, {left:'62%', bottom:'90px'}], 450); }
   S.swap(f, '😋'); }},
 {w:'Go to bed.', ar:'اذهب إلى السرير', cat:'home', icon:'🛏️', ex:'It is nine o\'clock. Go to bed.', async run(S) {
   S.noCloud(); S.bg('linear-gradient(#2d3561,#4b5394)'); S.add('🌙', {x:85, y:175, s:44}); S.add('🛏️', {x:65, s:130, z:1}); const k = S.add('🚶', {x:10, s:80, flip:true, z:2});
   await S.walk(k, 10, 55, 1500); S.swap(k, '😴'); await S.mv(k, [{left:'55%', bottom:'40px', t:'scale(1)'}, {left:'58%', bottom:'82px', t:'scale(.55)'}], 500); await S.pop('💤', {x:70, y:140, s:34}); }},
 {w:'Read a book.', ar:'اقرأ كتاباً', cat:'home', icon:'📖', ex:'I read a book every night.', async run(S) {
   S.add('🧒', {x:35, s:100}); const b = S.add('📖', {x:58, y:70, s:64, z:3});
   for (let i = 0; i < 2; i++) { await S.wait(500); await S.mv(b, [{t:'scaleX(1)'}, {t:'scaleX(-1)'}, {t:'scaleX(1)'}], 500); } await S.pop('💡', {x:35, y:170, s:40}); }},
 {w:'Write your name.', ar:'اكتب اسمك', cat:'home', icon:'✍️', ex:'Write your name on your paper.', async run(S) {
   S.add('📄', {x:50, y:40, s:150, z:1}); const t = S.add('', {x:50, y:110, s:34, z:2}); t.classList.add('en'); t.style.color = '#2d3047'; t.style.fontWeight = '700';
   const p = S.add('✏️', {x:38, y:120, s:46, z:3});
   for (const [i, ch] of [...'Sara'].entries()) { t.textContent += ch; await S.mv(p, [{left:(40 + i * 5) + '%'}, {left:(44 + i * 5) + '%'}], 300); } }},
 {w:'Draw a picture.', ar:'ارسم صورة', cat:'home', icon:'🎨', ex:'Let\'s draw a picture of a house.', async run(S) {
   S.add('🖼️', {x:50, y:40, s:150, z:1}); const p = S.add('🖍️', {x:30, y:100, s:44, z:3});
   for (const [e, x, y] of [['🏠', 44, 95], ['🌳', 58, 92], ['☀️', 60, 140]]) { await S.mv(p, [{left:p.style.left}, {left:(x + 5) + '%'}], 400); p.style.left = (x + 5) + '%'; await S.pop(e, {x, y, s:34, z:2}); } }},
 {w:'Wash the dishes.', ar:'اغسل الصحون', cat:'home', icon:'🍽️', ex:'Help Mum wash the dishes.', async run(S) {
   S.ground('#cfd8dc'); S.add('🚰', {x:50, y:130, s:50}); const d = S.add('🍽️', {x:50, y:50, s:80, z:2});
   const bubbles = [0, 1, 2].map(i => S.add('🫧', {x:42 + i * 8, y:90, s:26, o:0}));
   await S.all([S.mv(d, [{t:'rotate(0)'}, {t:'rotate(40deg)'}, {t:'rotate(-40deg)'}, {t:'rotate(40deg)'}, {t:'rotate(0)'}], 1500), ...bubbles.map((b, i) => S.mv(b, [{opacity:0}, {opacity:1, bottom:'170px'}], 1000, {delay:i * 200}))]);
   await S.pop('✨', {x:66, y:90, s:34}); }},
 {w:'Water the plants.', ar:'اسقِ النباتات', cat:'home', icon:'🌱', ex:'Plants need water to grow.', async run(S) {
   const pl = S.add('🌱', {x:55, s:50}); S.add('🧑‍🌾', {x:22, s:90});
   for (let i = 0; i < 3; i++) await S.all([50, 55, 60].map(x => { const d = S.add('💧', {x, y:150, s:22}); return S.mv(d, [{bottom:'150px', opacity:1}, {bottom:'60px', opacity:0}], 500); }));
   S.swap(pl, '🌻'); await S.mv(pl, [{t:'scale(1)'}, {t:'scale(2.2)'}], 700, {easing:'ease-out'}); }},
 {w:'Cook dinner.', ar:'اطبخ العشاء', cat:'home', icon:'🍳', ex:'Dad is cooking dinner.', async run(S) {
   S.add('🧑‍🍳', {x:25, s:100}); S.add('🔥', {x:62, y:40, s:44, z:1}); const pan = S.add('🍳', {x:62, y:70, s:70, z:2});
   await S.mv(pan, [{t:'translateY(0)'}, {t:'translateY(-14px)'}, {t:'translateY(0)'}, {t:'translateY(-14px)'}, {t:'translateY(0)'}], 1200); await S.pop('♨️', {x:62, y:150, s:40}); await S.pop('😋', {x:25, y:160, s:34}); }},
 {w:'Ride a bike.', ar:'اركب الدراجة', cat:'home', icon:'🚲', ex:'I ride my bike in the park.', async run(S) { const b = S.add('🚴', {x:0, s:80, flip:true}); S.add('🌳', {x:50, s:100, z:1}); await S.walk(b, 0, 100, 2300, {bob:2}); }},
 {w:'Kick the ball.', ar:'اركل الكرة', cat:'home', icon:'⚽', ex:'Kick the ball into the goal!', async run(S) {
   S.add('🥅', {x:85, s:100, z:1}); const k = S.add('🏃', {x:10, s:80, flip:true}); const b = S.add('⚽', {x:35, s:34, z:3});
   await S.walk(k, 10, 30, 600); await S.mv(b, [{left:'35%', bottom:'40px'}, {left:'60%', bottom:'130px'}, {left:'85%', bottom:'70px'}], 700, {easing:'ease-out'}); await S.pop('🎉', {x:60, y:170, s:44}); }},
 {w:'Hurry up!', ar:'أسرع!', cat:'home', icon:'⏰', ex:'Hurry up! The bus is coming.', async run(S) {
   S.add('🚌', {x:88, s:70}); const c = S.add('⏰', {x:30, y:160, s:44}); const k = S.add('🏃', {x:5, s:80, flip:true});
   await S.all([S.walk(k, 5, 72, 1200, {bob:10}), S.mv(c, [{t:'rotate(-20deg)'}, {t:'rotate(20deg)'}, {t:'rotate(-20deg)'}, {t:'rotate(20deg)'}, {t:'rotate(0)'}], 1200)]); }},
 {w:'Be careful!', ar:'انتبه! / كن حذراً', cat:'home', icon:'⚠️', ex:'Be careful! The floor is wet.', async run(S) {
   S.add('⚠️', {x:70, y:110, s:50}); S.add('💦', {x:62, y:38, s:44, z:1}); const k = S.add('🚶', {x:10, s:80, flip:true});
   await S.walk(k, 10, 45, 1300); S.swap(k, '🧍'); await S.mv(k, [{t:'rotate(0)'}, {t:'rotate(-10deg)'}, {t:'rotate(0)'}], 400); await S.pop('😮', {x:45, y:150, s:36}); }},
 {w:'Give me the ball, please.', ar:'أعطني الكرة من فضلك', cat:'home', icon:'🤲', ex:'Can you give me the ball, please?', async run(S) {
   S.add('🧒', {x:75, s:90}); S.add('🤲', {x:50, y:5, s:70, z:5}); const b = S.add('⚽', {x:68, y:90, s:40, z:3});
   await S.wait(600); await S.mv(b, [{left:'68%', bottom:'90px', t:'scale(1)'}, {left:'55%', bottom:'130px', t:'scale(1.6)'}, {left:'50%', bottom:'50px', t:'scale(2.2)'}], 1000); }},
 {w:'Share with your friend.', ar:'شارك صديقك', cat:'home', icon:'🍪', ex:'Share your biscuits with your friend.', async run(S) {
   S.add('👦', {x:18, s:80}); const g = S.add('👧', {x:82, s:80}); const c1 = S.add('🍪', {x:50, y:90, s:60}); await S.wait(700);
   const c2 = S.add('🍪', {x:50, y:90, s:60}); await S.all([S.mv(c1, [{left:'50%', t:'scale(1)'}, {left:'28%', t:'scale(.7)'}], 700), S.mv(c2, [{left:'50%', t:'scale(1)'}, {left:'72%', t:'scale(.7)'}], 700)]);
   S.swap(g, '😊'); await S.pop('❤️', {x:50, y:160, s:40}); }},
 {w:'Hug your mum.', ar:'عانق أمك', cat:'home', icon:'🤗', ex:'I love you, Mum! Give me a hug.', async run(S) {
   const k = S.add('🧒', {x:10, s:80}); S.add('👩', {x:65, s:110});
   await S.walk(k, 10, 50, 1200); S.swap(k, '🤗'); await S.pop('❤️', {x:58, y:170, s:44}); await S.pop('💖', {x:45, y:190, s:30}); }},
);
ACTIONS.forEach((a, i) => { a.i = i; a.key = a.w.toLowerCase().replace(/[^a-z ]/g, '').trim(); });
actCat = 'home';

/* =========================================================
   🎨 الألوان
   ========================================================= */
const COLOURS = [
 {n:'red', hex:'#E53935', ar:'أحمر', things:[['🍎','apple'],['🍓','strawberry'],['🚒','fire engine'],['🌹','rose'],['🍅','tomato']]},
 {n:'orange', hex:'#FB8C00', ar:'برتقالي', things:[['🍊','orange'],['🥕','carrot'],['🎃','pumpkin'],['🦊','fox'],['🏀','basketball']]},
 {n:'yellow', hex:'#FDD835', ar:'أصفر', things:[['🍌','banana'],['🌻','sunflower'],['🐥','chick'],['🍋','lemon'],['🧀','cheese']]},
 {n:'green', hex:'#43A047', ar:'أخضر', things:[['🐸','frog'],['🥦','broccoli'],['🌳','tree'],['🥒','cucumber'],['🦖','dinosaur']]},
 {n:'blue', hex:'#1E88E5', ar:'أزرق', things:[['🐳','whale'],['🫐','blueberries'],['💙','heart'],['🦋','butterfly'],['👖','jeans']]},
 {n:'purple', hex:'#8E24AA', ar:'بنفسجي', things:[['🍇','grapes'],['🍆','aubergine'],['☂️','umbrella'],['🔮','ball'],['💜','heart']]},
 {n:'pink', hex:'#F06292', ar:'وردي', things:[['🐷','pig'],['🌸','flower'],['🦩','flamingo'],['🍬','sweet'],['🎀','ribbon']]},
 {n:'brown', hex:'#795548', ar:'بني', things:[['🐻','bear'],['🍫','chocolate'],['🪵','wood'],['🥔','potato'],['🐴','horse']]},
 {n:'black', hex:'#212121', ar:'أسود', things:[['🐈‍⬛','cat'],['🎱','ball'],['🕷️','spider'],['🎩','hat'],['🖤','heart']]},
 {n:'white', hex:'#FFFFFF', ar:'أبيض', things:[['☁️','cloud'],['🥛','milk'],['⛄','snowman'],['🦢','swan'],['🥚','egg']]},
 {n:'grey', hex:'#9E9E9E', ar:'رمادي', things:[['🐘','elephant'],['🐭','mouse'],['🪨','rock'],['🐺','wolf'],['🌫️','fog']]},
];
const COL = Object.fromEntries(COLOURS.map(c => [c.n, c]));
const MIX = {'red+yellow':'orange', 'blue+yellow':'green', 'blue+red':'purple', 'red+white':'pink', 'black+white':'grey', 'green+red':'brown', 'blue+white':'blue', 'white+yellow':'yellow', 'black+red':'brown'};
const mixOf = (a, b) => a === b ? a : MIX[[a, b].sort().join('+')] || 'brown';
const blob = (c, size = 90) => `<span class="blob" style="width:${size}px;height:${size}px;background:${COL[c].hex}"></span>`;

let colTab = 'learn';
actions.colTab = t => { colTab = t; views.colours(); };
views.colours = () => {
  setTitle('🎨 الألوان');
  const tabs = tabsHtml([['learn', '🌈 تعلّم'], ['mix', '🧪 اخلط الألوان'], ['paint', '🖌️ لوّن الصورة'], ['find', '🔍 ابحث عن اللون']], colTab, 'colTab');
  if (colTab === 'learn') {
    render(`${tabs}<p class="sub">اضغط على اللون لتسمعه وترى أشياء حقيقية بهذا اللون</p>
     <div class="btnrow"><button class="btn pink" id="rainbow">🌈 أنشودة قوس قزح</button><button class="btn purple" data-go="quiz/colours">📝 اختبرني</button></div>
     <div class="grid">${COLOURS.map(c => `<button class="card colour-card" data-col="${c.n}" id="cc-${c.n}">${blob(c.n, 80)}<div class="label en">${c.n}</div>${settings.arabic ? `<div class="small">${c.ar}</div>` : ''}<div style="font-size:24px">${c.things.slice(0, 3).map(t => t[0]).join('')}</div></button>`).join('')}</div>
     <div id="colDetail"></div>`);
    main().querySelectorAll('[data-col]').forEach(b => b.onclick = () => {
      const c = COL[b.dataset.col]; mark('words', c.n);
      $('#colDetail').innerHTML = `<div class="lesson" style="margin-top:16px;border:6px solid ${c.hex}"><div class="word-big en" style="color:${c.n === 'white' ? '#999' : c.hex}">${c.n}</div>
        ${c.things.map(([e, w]) => { const s = `The ${w} is ${c.n}.`; return `<div class="phrase" data-act="say" data-arg="${esc(s)}" style="cursor:pointer"><div style="font-size:40px">${e}</div><div class="t"><div class="en" style="font-size:22px">The ${w} is <b style="color:${c.n === 'white' ? '#999' : c.hex}">${c.n}</b>.</div></div><button class="icon-btn">🔊</button></div>`; }).join('')}</div>`;
      speak(`${c.n}. The ${c.things[0][1]} is ${c.n}.`); $('#colDetail').scrollIntoView({behavior:'smooth', block:'start'});
    });
    $('#rainbow').onclick = () => { const rb = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink']; if (cleanup) cleanup();
      cleanup = speakSeq([...rb.map(n => ({say:n, rate:.9})), {say:'I can sing a rainbow!'}], i => { main().querySelectorAll('.colour-card').forEach(x => x.style.transform = ''); const el = $('#cc-' + rb[i]); if (el) el.style.transform = 'scale(1.12) rotate(-3deg)'; }, () => main().querySelectorAll('.colour-card').forEach(x => x.style.transform = ''), 150); };
  } else if (colTab === 'mix') colourMix(tabs);
  else if (colTab === 'paint') colourPaint(tabs);
  else colourFind(tabs);
};
function colourMix(tabs) {
  let pick = [];
  const base = ['red', 'yellow', 'blue', 'white', 'black'];
  render(`${tabs}<div class="lesson"><p class="title">🧪 مختبر الألوان</p><p class="sub">اختر لونين واخلطهما… ماذا سيحدث؟ 🤔</p>
    <div class="btnrow">${base.map(c => `<button class="paint-btn" data-c="${c}" style="background:${COL[c].hex}"><span class="en">${c}</span></button>`).join('')}</div>
    <div class="mixrow"><div id="m1" class="mixslot">?</div><div style="font-size:40px">+</div><div id="m2" class="mixslot">?</div><div style="font-size:40px">=</div><div id="m3" class="mixslot big">🥣</div></div>
    <div class="word-big en" id="mixTxt" style="font-size:30px;min-height:46px"></div>
    <div class="btnrow"><button class="btn ghost" id="mixReset">🔁 من جديد</button></div>
    <div class="note">🔬 جرّبوا في البيت بألوان الماء الحقيقية: <span class="en">red + yellow = orange</span> · <span class="en">blue + yellow = green</span> · <span class="en">red + blue = purple</span></div></div>`);
  const slot = (id, c) => { const el = $(id); el.textContent = ''; el.style.background = COL[c].hex; el.innerHTML = `<span class="en" style="color:${c === 'white' || c === 'yellow' ? '#333' : '#fff'};font-weight:700">${c}</span>`; };
  main().querySelectorAll('.paint-btn').forEach(b => b.onclick = async () => {
    if (pick.length >= 2) return; const c = b.dataset.c; pick.push(c); speak(c); slot(pick.length === 1 ? '#m1' : '#m2', c);
    if (pick.length === 2) {
      const r = mixOf(pick[0], pick[1]); const m3 = $('#m3');
      await m3.animate([{transform:'rotate(0)'}, {transform:'rotate(360deg) scale(.6)'}, {transform:'rotate(720deg) scale(1)'}], 900).finished;
      if (!m3.isConnected) return; slot('#m3', r); sfx('good'); confetti(30);
      const txt = pick[0] === pick[1] ? `${pick[0]} and ${pick[1]} make ${r}.` : `${pick[0]} and ${pick[1]} make ${r}!`;
      $('#mixTxt').innerHTML = `${pick[0]} + ${pick[1]} = <span style="color:${COL[r].hex === '#FFFFFF' ? '#999' : COL[r].hex}">${r}</span>`;
      speak(txt[0].toUpperCase() + txt.slice(1)); if (mark('words', 'mix_' + r)) addStars(1);
    }
  });
  $('#mixReset').onclick = () => colourMix(tabs);
}
// 🖌️ لوّن الصورة حسب التعليمات المسموعة (استماع + ألوان + أسماء أشياء)
const PAINT_PARTS = [
 ['sky', 'the sky', ['blue']], ['sun', 'the sun', ['yellow', 'orange']], ['grass', 'the grass', ['green']], ['house', 'the house', null], ['roof', 'the roof', null],
 ['door', 'the door', null], ['window', 'the window', ['blue', 'white', 'yellow']], ['trunk', 'the tree trunk', ['brown']], ['leaves', 'the leaves', ['green', 'orange', 'yellow']],
 ['flower', 'the flower', ['red', 'pink', 'purple', 'yellow']], ['cloud', 'the cloud', ['white', 'grey']], ['cat', 'the cat', ['black', 'orange', 'grey', 'white', 'brown']],
];
const PAINT_SVG = `<svg viewBox="0 0 400 300" class="paint-svg">
 <rect data-p="sky" x="0" y="0" width="400" height="220" fill="#fff" stroke="#333" stroke-width="2"/>
 <circle data-p="sun" cx="335" cy="55" r="32" fill="#fff" stroke="#333" stroke-width="3"/>
 <path data-p="cloud" d="M60 70 a22 22 0 0 1 40 -12 a26 26 0 0 1 48 8 a18 18 0 0 1 2 36 h-86 a18 18 0 0 1 -4 -32z" fill="#fff" stroke="#333" stroke-width="3"/>
 <rect data-p="grass" x="0" y="220" width="400" height="80" fill="#fff" stroke="#333" stroke-width="2"/>
 <rect data-p="house" x="150" y="140" width="130" height="110" fill="#fff" stroke="#333" stroke-width="3"/>
 <polygon data-p="roof" points="140,142 215,80 290,142" fill="#fff" stroke="#333" stroke-width="3"/>
 <rect data-p="door" x="200" y="190" width="34" height="60" fill="#fff" stroke="#333" stroke-width="3"/>
 <rect data-p="window" x="162" y="160" width="30" height="28" fill="#fff" stroke="#333" stroke-width="3"/>
 <rect data-p="trunk" x="60" y="170" width="22" height="80" fill="#fff" stroke="#333" stroke-width="3"/>
 <circle data-p="leaves" cx="71" cy="150" r="42" fill="#fff" stroke="#333" stroke-width="3"/>
 <line x1="330" y1="255" x2="330" y2="225" stroke="#333" stroke-width="3"/>
 <circle data-p="flower" cx="330" cy="215" r="14" fill="#fff" stroke="#333" stroke-width="3"/>
 <g data-p="cat"><ellipse data-p="cat" cx="110" cy="262" rx="20" ry="13" fill="#fff" stroke="#333" stroke-width="3"/><circle data-p="cat" cx="130" cy="247" r="11" fill="#fff" stroke="#333" stroke-width="3"/><polygon data-p="cat" points="122,240 125,228 130,238" fill="#fff" stroke="#333" stroke-width="2"/><polygon data-p="cat" points="132,238 137,228 139,241" fill="#fff" stroke="#333" stroke-width="2"/></g>
</svg>`;
function colourPaint(tabs) {
  const tasks = shuffle(PAINT_PARTS).slice(0, 8).map(([id, name, ok]) => ({id, name, c:rand(ok || ['red', 'blue', 'yellow', 'green', 'orange', 'purple', 'pink', 'brown'])}));
  let k = 0, brush = null, right = 0;
  render(`${tabs}<div class="lesson"><p class="sub">اسمع التعليمات 👂 ثم اختر اللون 🖌️ واضغط على الجزء الصحيح في الصورة</p>
   <div class="word-big en" id="ptask" style="font-size:clamp(22px,5vw,34px)"></div><button class="btn ghost" id="prep">🔊 أعد</button>
   <div class="paint-wrap">${PAINT_SVG}</div>
   <div class="btnrow">${['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white', 'grey'].map(c => `<button class="paint-btn small" data-c="${c}" style="background:${COL[c].hex}"><span class="en">${c}</span></button>`).join('')}</div>
   <p class="sub" id="pstat"></p></div>`);
  const show = () => {
    if (k >= tasks.length) { addStars(3); sfx('win'); confetti(); speak('Beautiful picture! Well done!'); $('#ptask').textContent = '🎉 Beautiful picture!'; $('#pstat').innerHTML = `<button class="btn green" data-act="colTab" data-arg="paint">🖼️ لوحة جديدة</button>`; return; }
    const t = tasks[k]; const txt = `Colour ${t.name} ${t.c}.`;
    $('#ptask').innerHTML = `Colour <u>${t.name}</u> <span style="color:${COL[t.c].hex === '#FFFFFF' ? '#999' : COL[t.c].hex}">${t.c}</span>.`;
    $('#pstat').textContent = `${k + 1} / ${tasks.length}`; speak(txt);
  };
  $('#prep').onclick = () => { const t = tasks[k]; if (t) speak(`Colour ${t.name} ${t.c}.`); };
  main().querySelectorAll('.paint-btn').forEach(b => b.onclick = () => { brush = b.dataset.c; main().querySelectorAll('.paint-btn').forEach(x => x.classList.remove('on')); b.classList.add('on'); speak(brush); });
  main().querySelector('.paint-svg').addEventListener('click', e => {
    const el = e.target.closest('[data-p]'); if (!el || k >= tasks.length) return;
    const part = el.dataset.p; const t = tasks[k];
    if (!brush) { toast('اختر لوناً أولاً 🖌️'); return; }
    if (part === t.id && brush === t.c) {
      main().querySelectorAll(`[data-p="${part}"]`).forEach(x => { if (x.tagName !== 'g') x.setAttribute('fill', COL[brush].hex); });
      sfx('good'); praise(); right++; k++; setTimeout(show, 1200);
    } else { sfx('bad'); toast(part !== t.id ? '👀 هذا ليس الجزء المطلوب — اسمع مرة أخرى' : `🎨 اللون المطلوب هو ${t.c}`); speak(`Colour ${t.name} ${t.c}.`); }
  });
  show();
}
function colourFind(tabs) {
  let round = 0, score = 0; const N = 10;
  const next = () => {
    if (round >= N) return finishQuiz('colfind', score, N, 'colours');
    round++; const target = rand(COLOURS.filter(c => c.n !== 'white'));
    const correct = sample(target.things, 2).map(t => [t[0], target.n]);
    const others = sample(COLOURS.filter(c => c !== target).flatMap(c => c.things.map(t => [t[0], c.n])), 7);
    const items = shuffle([...correct, ...others]);
    render(`${tabs}<div class="progressbar"><div style="width:${(round - 1) * 10}%"></div></div>
      <div class="q-head"><p class="title" style="font-size:24px">🔍 <span class="en">Find something <span style="color:${target.hex}">${target.n}</span>!</span></p><button class="btn ghost" data-act="say" data-arg="Find something ${target.n}!">🔊 أعد</button></div>
      <div class="find-grid">${items.map(([e, c]) => `<button class="card" data-c="${c}" style="font-size:52px;padding:8px">${e}</button>`).join('')}</div>`);
    speak(`Find something ${target.n}!`); let done = false;
    main().querySelectorAll('.find-grid .card').forEach(b => b.onclick = () => {
      if (done) return;
      if (b.dataset.c === target.n) { done = true; score++; b.classList.add('correct'); sfx('good'); speak(`Yes! It is ${target.n}!`); setTimeout(next, 1300); }
      else { b.classList.add('wrong'); sfx('bad'); speak(`No, that is ${b.dataset.c}.`); }
    });
  };
  next();
}
EXERCISES.push({id:'colours', icon:'🎨', name:'الألوان', en:'Colours'});
QUIZ.colours = () => {
  const t = rand(['listen', 'thing', 'mix', 'thing']);
  if (t === 'listen') { const c = rand(COLOURS); const opts = shuffle([c, ...sample(COLOURS.filter(x => x !== c), 3)]);
    return {prompt:`<button class="listen-big" data-act="say" data-arg="${c.n}">🔊</button><p class="sub">اسمع… أين اللون؟</p>`, say:c.n, options:opts.map(o => ({html:blob(o.n, 80), ok:o === c})), after:c.n}; }
  if (t === 'thing') { const c = rand(COLOURS); const [e, w] = rand(c.things); const opts = shuffle([c, ...sample(COLOURS.filter(x => x !== c), 3)]);
    return {prompt:`<div class="pic">${e}</div><p class="sub en" style="font-size:24px">What colour is the ${w}?</p>`, say:`What colour is the ${w}?`, options:opts.map(o => ({html:`${blob(o.n, 40)}<span class="label en">${o.n}</span>`, ok:o === c})), after:`The ${w} is ${c.n}.`}; }
  const pairs = Object.keys(MIX).filter(k => !['blue+white', 'white+yellow', 'black+red'].includes(k)); const [a, b] = rand(pairs).split('+'); const r = MIX[a + '+' + b];
  const opts = shuffle([r, ...sample(COLOURS.map(c => c.n).filter(n => n !== r && n !== a && n !== b), 2)]);
  return {prompt:`<div class="mixrow">${blob(a, 70)}<span style="font-size:36px">+</span>${blob(b, 70)}<span style="font-size:36px">= ?</span></div><p class="sub en" style="font-size:22px">${a} + ${b} = ?</p>`, options:opts.map(o => ({html:`${blob(o, 40)}<span class="label en">${o}</span>`, ok:o === r})), after:`${a} and ${b} make ${r}.`, cols:3};
};

/* =========================================================
   🐾 عالم الحيوان
   ========================================================= */
const HABITATS = {
 farm:{name:'المزرعة', icon:'🚜', live:'on a farm', bg:'linear-gradient(#a8e1ff,#e6f7ff)', ground:'#8EDB7E', deco:[['🏡', 88, 40, 60], ['🌾', 8, 40, 40]]},
 pets:{name:'في البيت', icon:'🏠', live:'in our home', bg:'linear-gradient(#ffe3ec,#fff6f9)', ground:'#D7B98E', deco:[['🛋️', 85, 40, 70], ['🖼️', 15, 160, 40]]},
 wild:{name:'البرية والغابة', icon:'🌴', live:'in the wild', bg:'linear-gradient(#ffd89b,#fff3d6)', ground:'#E2C27A', deco:[['🌴', 88, 40, 100], ['☀️', 12, 175, 44]]},
 sea:{name:'البحر', icon:'🌊', live:'in the sea', bg:'linear-gradient(#4fc3f7,#0277bd)', ground:'#F3D9A4', deco:[['🪸', 85, 30, 50], ['🐚', 15, 34, 28]]},
 garden:{name:'الحديقة', icon:'🌷', live:'in the garden', bg:'linear-gradient(#c8f7c5,#f0fff0)', ground:'#7CCF6C', deco:[['🌷', 10, 40, 40], ['🌼', 88, 40, 40]]},
 ice:{name:'الثلج', icon:'❄️', live:'in the snow and ice', bg:'linear-gradient(#d6f0ff,#ffffff)', ground:'#ffffff', deco:[['🏔️', 85, 40, 90], ['❄️', 15, 170, 34]]},
};
// [name, emoji, ar, habitat, sound, move, can, cannot, fact, factAr, liveOverride]
const ANIMALS = [
 ['cow','🐄','بقرة','farm','moo','walk',['walk'],['fly','climb'],'Cows give us milk.','البقرة تعطينا الحليب.'],
 ['sheep','🐑','خروف','farm','baa','walk',['walk'],['fly'],'Sheep give us wool for warm clothes.','الخروف يعطينا الصوف للملابس الدافئة.'],
 ['goat','🐐','ماعز','farm','maa','jump',['walk','jump','climb'],['fly'],'Goats are very good at climbing.','الماعز ماهر جداً في التسلق.'],
 ['pig','🐖','خنزير','farm','oink oink','walk',['walk'],['fly','climb'],'Pigs love to roll in the mud.','الخنازير تحب التمرغ في الطين.'],
 ['horse','🐎','حصان','farm','neigh','run',['walk','run','jump'],['fly','climb'],'You can ride a horse.','يمكنك ركوب الحصان.'],
 ['hen','🐔','دجاجة','farm','cluck cluck','walk',['walk'],['swim'],'Hens lay eggs.','الدجاجة تضع البيض.'],
 ['rooster','🐓','ديك','farm','cock-a-doodle-doo','walk',['walk'],['swim'],'The rooster wakes us up in the morning.','الديك يوقظنا في الصباح.'],
 ['duck','🦆','بطة','farm','quack quack','swim',['walk','swim','fly'],['climb'],'Ducks swim in the pond.','البط يسبح في البركة.'],
 ['dog','🐕','كلب','pets','woof woof','run',['walk','run','swim','jump'],['fly'],'Dogs are our best friends.','الكلاب أفضل أصدقائنا.'],
 ['cat','🐈','قطة','pets','meow','walk',['walk','run','jump','climb'],['fly'],'Cats sleep about fifteen hours a day!','القطط تنام حوالي 15 ساعة يومياً!'],
 ['rabbit','🐇','أرنب','pets',null,'jump',['jump','run'],['fly','climb'],'Rabbits have long ears.','للأرانب آذان طويلة.'],
 ['hamster','🐹','هامستر','pets','squeak','walk',['walk','run'],['fly'],'Hamsters keep food in their cheeks.','الهامستر يخزّن الطعام في خديه.'],
 ['parrot','🦜','ببغاء','pets','hello','fly',['fly','walk'],['swim'],'Some parrots can talk!','بعض الببغاوات تستطيع الكلام!'],
 ['turtle','🐢','سلحفاة','pets',null,'crawl',['walk','swim'],['fly','jump'],'Turtles carry their homes on their backs.','السلحفاة تحمل بيتها على ظهرها.'],
 ['lion','🦁','أسد','wild','roar','walk',['walk','run'],['fly'],'The lion is the king of the jungle.','الأسد ملك الغابة.'],
 ['tiger','🐅','نمر','wild','roar','run',['walk','run','swim'],['fly'],'Tigers have orange and black stripes.','للنمر خطوط برتقالية وسوداء.'],
 ['elephant','🐘','فيل','wild','toot','walk',['walk','swim'],['fly','jump','climb'],'Elephants drink water with their long trunks.','الفيل يشرب الماء بخرطومه الطويل.'],
 ['monkey','🐒','قرد','wild','ooh ooh aah aah','climb',['walk','climb','jump'],['fly'],'Monkeys love bananas.','القرود تحب الموز.','in the jungle'],
 ['giraffe','🦒','زرافة','wild',null,'walk',['walk','run'],['fly','climb'],'The giraffe has a very long neck.','للزرافة رقبة طويلة جداً.'],
 ['zebra','🦓','حمار وحشي','wild',null,'run',['walk','run'],['fly','climb'],'Zebras are black and white.','الحمار الوحشي أبيض وأسود.'],
 ['bear','🐻','دب','wild','grrr','walk',['walk','climb','swim'],['fly'],'Bears sleep all winter.','الدببة تنام طوال الشتاء.','in the forest'],
 ['kangaroo','🦘','كنغر','wild',null,'jump',['jump'],['fly','climb'],'Baby kangaroos live in their mum\'s pouch.','صغير الكنغر يعيش في جيب أمه.','in Australia'],
 ['crocodile','🐊','تمساح','wild','snap','crawl',['walk','swim'],['fly','climb'],'Crocodiles have very big teeth.','للتمساح أسنان كبيرة جداً.','in the river'],
 ['snake','🐍','أفعى','wild','hiss','slither',['swim','climb'],['walk','fly','jump'],'Snakes have no legs.','الأفعى ليس لها أرجل.'],
 ['camel','🐫','جمل','wild',null,'walk',['walk','run'],['fly','climb'],'Camels can walk for days in the desert.','الجمل يمشي أياماً في الصحراء.','in the desert'],
 ['gorilla','🦍','غوريلا','wild','ooh ooh','walk',['walk','climb'],['fly'],'Gorillas are very strong.','الغوريلا قوية جداً.','in the jungle'],
 ['fish','🐟','سمكة','sea',null,'swim',['swim'],['walk','fly','climb'],'Fish breathe under the water.','السمك يتنفس تحت الماء.'],
 ['whale','🐋','حوت','sea',null,'swim',['swim'],['walk','fly','climb'],'The blue whale is the biggest animal in the world.','الحوت الأزرق أكبر حيوان في العالم.'],
 ['dolphin','🐬','دلفين','sea','click click','swim',['swim','jump'],['walk','fly','climb'],'Dolphins are very clever.','الدلافين ذكية جداً.'],
 ['shark','🦈','قرش','sea',null,'swim',['swim'],['walk','fly','climb'],'Sharks have lots of sharp teeth.','للقرش أسنان حادة كثيرة.'],
 ['octopus','🐙','أخطبوط','sea',null,'swim',['swim'],['fly','jump'],'An octopus has eight arms.','للأخطبوط ثماني أذرع.'],
 ['crab','🦀','سلطعون','sea',null,'crawl',['walk','swim'],['fly'],'Crabs walk sideways!','السلطعون يمشي بشكل جانبي!'],
 ['bee','🐝','نحلة','garden','buzz','fly',['fly'],['swim'],'Bees make honey.','النحل يصنع العسل.'],
 ['butterfly','🦋','فراشة','garden',null,'fly',['fly'],['swim'],'A butterfly comes from a caterpillar.','الفراشة تخرج من اليرقة.'],
 ['ant','🐜','نملة','garden',null,'crawl',['walk','climb'],[],'Ants work together in big teams.','النمل يعمل معاً في فرق كبيرة.'],
 ['snail','🐌','حلزون','garden',null,'crawl',['climb'],['fly','jump','run'],'Snails are very slow.','الحلزون بطيء جداً.'],
 ['ladybird','🐞','دعسوقة','garden',null,'crawl',['walk','fly'],['swim'],'Ladybirds are red with black spots.','الدعسوقة حمراء بنقاط سوداء.'],
 ['spider','🕷️','عنكبوت','garden',null,'crawl',['walk','climb'],['fly'],'Spiders have eight legs.','للعنكبوت ثماني أرجل.'],
 ['bird','🐦','طائر','garden','tweet tweet','fly',['fly','walk'],[],'Birds build nests in the trees.','الطيور تبني أعشاشها في الأشجار.'],
 ['owl','🦉','بومة','garden','twit twoo','fly',['fly'],['swim'],'Owls sleep in the day and wake up at night.','البومة تنام في النهار وتستيقظ في الليل.','in the forest'],
 ['frog','🐸','ضفدع','garden','ribbit','jump',['jump','swim'],['fly'],'Frogs can jump very far.','الضفدع يقفز مسافات بعيدة.','in a pond'],
 ['penguin','🐧','بطريق','ice',null,'walk',['walk','swim'],['fly','climb'],'Penguins can swim, but they can\'t fly.','البطريق يسبح لكنه لا يطير.'],
 ['polar bear','🐻‍❄️','دب قطبي','ice','grrr','walk',['walk','swim'],['fly'],'Polar bears have thick white fur.','للدب القطبي فراء أبيض كثيف.'],
].map(([n, e, ar, h, sound, move, can, cannot, fact, factAr, live], i) => ({i, n, e, ar, h, sound, move, can, cannot, fact, factAr, live:live || HABITATS[h].live}));

function habitat(S, h) { const H = HABITATS[h]; S.bg(H.bg); S.ground(H.ground); if (h === 'sea' || h === 'pets') S.noCloud(); H.deco.forEach(([e, x, y, s]) => S.add(e, {x, y, s, z:1})); }
async function animalMove(S, a) {
  habitat(S, a.h); const big = ['elephant', 'whale', 'giraffe', 'camel', 'horse', 'polar bear', 'gorilla'].includes(a.n);
  const s = big ? 100 : ['ant', 'bee', 'ladybird', 'spider', 'snail', 'hamster'].includes(a.n) ? 44 : 72;
  const d = S.add(a.e, {x:12, y:a.move === 'swim' && a.h === 'sea' ? 90 : 40, s, z:3, flip:!['🦁', '🐹', '🐻', '🐸', '🦉', '🐙', '🦀', '🐞', '🕷️', '🐻‍❄️', '🐧'].includes(a.e)});
  if (a.move === 'fly') await S.mv(d, [{left:'12%', bottom:'40px'}, {left:'35%', bottom:'150px'}, {left:'55%', bottom:'110px'}, {left:'78%', bottom:'180px'}, {left:'60%', bottom:'130px'}], 2600);
  else if (a.move === 'jump') { for (let i = 0; i < 3; i++) await S.mv(d, [{left:(12 + i * 22) + '%', bottom:'40px'}, {left:(23 + i * 22) + '%', bottom:'140px'}, {left:(34 + i * 22) + '%', bottom:'40px'}], 650); }
  else if (a.move === 'swim') await S.walk(d, 12, 70, 2400, {y1:a.h === 'sea' ? 90 : 34, bob:10});
  else if (a.move === 'slither') { const fr = []; for (let i = 0; i <= 12; i++) fr.push({left:(12 + i * 5) + '%', t:`rotate(${i % 2 ? 12 : -12}deg)`}); await S.mv(d, fr, 2400, {easing:'linear'}); }
  else if (a.move === 'climb') { S.add('🌳', {x:62, s:170, z:2}); await S.walk(d, 12, 60, 1000); await S.walk(d, 60, 60, 1200, {y1:40, y2:150, bob:3}); }
  else if (a.move === 'crawl') await S.walk(d, 12, 45, 2400, {bob:2});
  else await S.walk(d, 12, 62, a.move === 'run' ? 1100 : 2200, {bob:a.move === 'run' ? 8 : 4});
  if (a.sound) { const b = S.say(a.sound + '!', {x:62, y:190, s:26}); await S.mv(b, [{t:'scale(0)'}, {t:'scale(1.2)'}, {t:'scale(1)'}], 400); }
}
const animalLines = a => [
  [`This is ${an(a.n)}.`, `هذا ${a.ar}.`],
  a.sound ? [`The ${a.n} says "${a.sound}".`, 'صوته'] : null,
  [`It lives ${a.live}.`, `يعيش في: ${HABITATS[a.h].name}`],
  [`It can ${a.can.join(' and ')}.`, 'ماذا يستطيع أن يفعل؟'],
  a.cannot.length ? [`It can't ${a.cannot[0]}.`, 'لا يستطيع'] : null,
  [a.fact, a.factAr],
].filter(Boolean);
let aniTab = 'farm';
actions.aniTab = t => { aniTab = t; views.animals(); };
views.animals = () => {
  setTitle('🐾 عالم الحيوان');
  const p = me();
  render(`<p class="sub">${ANIMALS.length} حيواناً — اضغط لترى أين يعيش، كيف يتحرك، وماذا يقول!</p>
   <div class="btnrow"><button class="btn pink" data-go="quiz/animals">🎮 لعبة الحيوانات</button><button class="btn purple" data-go="animalsound">🔊 من صاحب الصوت؟</button></div>
   ${tabsHtml(Object.entries(HABITATS).map(([k, h]) => [k, h.icon + ' ' + h.name]), aniTab, 'aniTab')}
   <div class="grid">${ANIMALS.filter(a => a.h === aniTab).map(a => `<button class="card ${p.words[a.n] ? 'letter-card done' : ''}" data-go="animal/${a.i}"><span class="emoji">${a.e}</span><div class="label en">${a.n}</div>${settings.arabic ? `<div class="small">${a.ar}</div>` : ''}</button>`).join('')}</div>`);
};
views.animal = (i) => {
  const a = ANIMALS[+i]; if (!a) return go('animals');
  setTitle(`${a.e} ⁨${a.n}⁩`);
  const list = ANIMALS.filter(x => x.h === a.h); const k = list.indexOf(a);
  const lines = animalLines(a);
  render(`<div class="lesson"><div id="stg"></div>
    <div class="word-big en" style="margin-top:10px">${a.e} ${a.n}</div>${settings.arabic ? `<div class="sub" style="font-size:20px">${a.ar}</div>` : ''}
    <div class="btnrow"><button class="btn green" id="aRe">🔁 شاهد</button><button class="btn purple" id="aAll">▶️ اسمع كل شيء</button><button class="btn pink" data-act="sayIt" data-arg="${a.n}">🎤 قلها</button></div>
    ${lines.map(([en, ar]) => `<div class="phrase" data-act="say" data-arg="${esc(en)}" style="cursor:pointer"><div class="t"><div class="en" style="font-size:22px">${esc(en)}</div>${settings.arabic ? `<div class="ar">${ar}</div>` : ''}</div><button class="icon-btn">🔊</button></div>`).join('')}
    ${a.sound ? `<div class="actionbox">🤸 <b>دورك!</b> قلّد صوت ${a.ar} وحركته: <b class="en">"${esc(a.sound)}!"</b></div>` : `<div class="actionbox">🤸 <b>دورك!</b> قلّد حركة ${a.ar} في الغرفة!</div>`}
    <div class="navrow"><button class="btn ghost" data-go="animal/${list[(k + list.length - 1) % list.length].i}">→ السابق</button><button class="btn ghost" data-go="animals">الكل</button><button class="btn ghost" data-go="animal/${list[(k + 1) % list.length].i}">التالي ←</button></div></div>`);
  const stg = $('#stg'); const A = {w:a.n, run:S => animalMove(S, a)};
  playAction(stg, A, {loop:true});
  $('#aRe').onclick = () => playAction(stg, A, {loop:true});
  $('#aAll').onclick = () => { if (cleanup) cleanup(); cleanup = speakSeq(lines.map(l => ({say:l[0]})), null, null, 350); };
  if (mark('words', a.n)) addStars(1);
};
views.animalsound = () => {
  setTitle('🔊 من صاحب الصوت؟');
  const pool = ANIMALS.filter(a => a.sound && a.sound !== 'hello'); const N = 10; let q = 0, score = 0;
  const next = () => {
    if (q >= N) return finishQuiz('anisound', score, N, 'animals');
    q++; const a = rand(pool); const opts = shuffle([a, ...sample(pool.filter(x => x.sound !== a.sound), 3)]);
    render(`<div class="progressbar"><div style="width:${(q - 1) * 10}%"></div></div><p class="sub">${q}/${N} · ✅ ${score}</p>
      <div class="q-head"><div class="speech-big en">"${esc(a.sound)}!"</div><button class="btn ghost" data-act="say" data-arg="${esc(a.sound)}! ${esc(a.sound)}!">🔊 اسمع</button><p class="sub en" style="font-size:22px">Who says "${esc(a.sound)}"?</p></div>
      <div class="options">${opts.map(o => `<button class="card" data-ok="${o === a}"><span class="emoji">${o.e}</span><span class="label en">${o.n}</span></button>`).join('')}</div>`);
    speak(`${a.sound}! ${a.sound}! Who says ${a.sound}?`); let done = false;
    main().querySelectorAll('[data-ok]').forEach(b => b.onclick = () => { if (done) return; done = true; const ok = b.dataset.ok === 'true';
      b.classList.add(ok ? 'correct' : 'wrong'); if (!ok) main().querySelector('[data-ok="true"]').classList.add('correct'); sfx(ok ? 'good' : 'bad'); if (ok) score++;
      speak(`The ${a.n} says ${a.sound}.`); setTimeout(next, 1800); });
  };
  next();
};
EXERCISES.push({id:'animals', icon:'🐾', name:'الحيوانات', en:'Animals'});
QUIZ.animals = () => {
  const t = rand(['live', 'can', 'can', 'name', 'sound']);
  if (t === 'live') { const a = rand(ANIMALS); const hs = shuffle([a.h, ...sample(Object.keys(HABITATS).filter(h => h !== a.h), 2)]);
    return {prompt:`<div class="pic">${a.e}</div><p class="sub en" style="font-size:24px">Where does the ${a.n} live?</p>`, say:`Where does the ${a.n} live?`,
      options:hs.map(h => ({html:`<span class="emoji">${HABITATS[h].icon}</span><span class="label">${HABITATS[h].name}</span>`, ok:h === a.h})), after:`The ${a.n} lives ${a.live}.`, cols:3}; }
  if (t === 'can') { const a = rand(ANIMALS.filter(x => x.cannot.length)); const yes = Math.random() < .5; const v = yes ? rand(a.can) : rand(a.cannot); const q = `Can ${an(a.n)} ${v}?`;
    return {prompt:`<div class="pic">${a.e}</div><p class="title en" style="font-size:30px">${q}</p>`, say:q,
      options:[{html:'<span class="emoji">✅</span><span class="label en">Yes, it can.</span>', ok:yes}, {html:'<span class="emoji">❌</span><span class="label en">No, it can\'t.</span>', ok:!yes}], after:yes ? `Yes, it can ${v}.` : `No, it can't ${v}.`}; }
  if (t === 'sound') { const pool = ANIMALS.filter(a => a.sound && a.sound !== 'hello'); const a = rand(pool); const opts = shuffle([a, ...sample(pool.filter(x => x.sound !== a.sound), 3)]);
    return {prompt:`<div class="speech-big en">"${esc(a.sound)}!"</div><p class="sub en">Who says this?</p>`, say:a.sound, options:opts.map(o => ({html:`<span class="emoji">${o.e}</span>`, ok:o === a})), after:`The ${a.n} says ${a.sound}.`}; }
  const a = rand(ANIMALS); const opts = shuffle([a, ...sample(ANIMALS.filter(x => x !== a), 3)]);
  return {prompt:`<button class="listen-big" data-act="say" data-arg="${a.n}">🔊</button><p class="sub">اسمع… أين الحيوان؟</p>`, say:a.n, options:opts.map(o => ({html:`<span class="emoji">${o.e}</span>`, ok:o === a})), after:`This is ${an(a.n)}.`};
};

/* =========================================================
   📅 الأيام والأشهر والفصول والتاريخ
   ========================================================= */
const DAYS = [
 ['Monday','الاثنين','#FF6B6B','On Monday, I go to school.','🎒'],['Tuesday','الثلاثاء','#FF9F43','On Tuesday, I play football.','⚽'],
 ['Wednesday','الأربعاء','#FECA57','On Wednesday, I go swimming.','🏊'],['Thursday','الخميس','#1DD1A1','On Thursday, I read a book.','📖'],
 ['Friday','الجمعة','#54A0FF','On Friday, we visit Grandma.','👵'],['Saturday','السبت','#8E6CFF','On Saturday, we go to the park.','🌳'],
 ['Sunday','الأحد','#F368E0','On Sunday, I help at home.','🧹'],
];
const MONTHS = [
 ['January','يناير · كانون الثاني','❄️','winter','It is cold in January.'],['February','فبراير · شباط','💝','winter','February is the shortest month.'],
 ['March','مارس · آذار','🌱','spring','Flowers start to grow in March.'],['April','أبريل · نيسان','🌷','spring','It rains a lot in April.'],
 ['May','مايو · أيار','🌸','spring','In May, the trees are green.'],['June','يونيو · حزيران','☀️','summer','Summer starts in June.'],
 ['July','يوليو · تموز','🏖️','summer','We go to the beach in July.'],['August','أغسطس · آب','🍉','summer','August is very hot.'],
 ['September','سبتمبر · أيلول','🎒','autumn','We go back to school in September.'],['October','أكتوبر · تشرين الأول','🍂','autumn','Leaves fall from the trees in October.'],
 ['November','نوفمبر · تشرين الثاني','🌧️','autumn','November is cold and rainy.'],['December','ديسمبر · كانون الأول','⛄','winter','December is the last month of the year.'],
];
const SEASONS = {winter:['الشتاء', '⛄', '#90CAF9'], spring:['الربيع', '🌷', '#A5D6A7'], summer:['الصيف', '☀️', '#FFE082'], autumn:['الخريف', '🍂', '#FFAB91']};
const ordinal = n => n + (n % 100 >= 11 && n % 100 <= 13 ? 'th' : ['th', 'st', 'nd', 'rd'][n % 10] || 'th');
const dayIdx = d => (d.getDay() + 6) % 7; // الاثنين = 0
const dateText = d => `${DAYS[dayIdx(d)][0]}, the ${ordinal(d.getDate())} of ${MONTHS[d.getMonth()][0]}`;
let calTab = 'days';
actions.calTab = t => { calTab = t; views.calendar(); };
views.calendar = () => {
  setTitle('📅 الأيام والأشهر');
  const tabs = tabsHtml([['days', '📆 أيام الأسبوع'], ['months', '🗓️ الأشهر'], ['seasons', '🌦️ الفصول'], ['today', '📍 تاريخ اليوم']], calTab, 'calTab');
  const now = new Date(); const ti = dayIdx(now); const p = me();
  if (calTab === 'days') {
    const y = (ti + 6) % 7, t = (ti + 1) % 7;
    render(`${tabs}<p class="sub">في الأسبوع 7 أيام — قطار الأيام يبدأ يوم الاثنين في بريطانيا 🚂</p>
     <div class="btnrow"><button class="btn pink" id="daySong">🎵 أنشودة الأيام</button><button class="btn purple" data-go="quiz/calendar">📝 اختبرني</button></div>
     <div class="train">${DAYS.map(([d, ar, c], i) => `<button class="wagon ${i === ti ? 'today' : ''}" id="dw${i}" style="background:${c}" data-act="say" data-arg="${d}"><span class="en">${d}</span>${settings.arabic ? `<small>${ar}</small>` : ''}${i === ti ? '<b class="tag">Today ⭐</b>' : ''}</button>`).join('<span class="link">🔗</span>')}<span class="engine">🚂</span></div>
     <div class="ytt">${[[y, 'Yesterday was', 'أمس كان', '⬅️'], [ti, 'Today is', 'اليوم هو', '⭐'], [t, 'Tomorrow is', 'غداً سيكون', '➡️']].map(([i, en, ar, e]) => `<button class="card" data-act="say" data-arg="${en} ${DAYS[i][0]}." style="background:${DAYS[i][2]}22"><div style="font-size:32px">${e}</div><div class="en" style="font-size:20px">${en}<br><b style="font-size:26px">${DAYS[i][0]}</b></div>${settings.arabic ? `<div class="small">${ar} ${DAYS[i][1]}</div>` : ''}</button>`).join('')}</div>
     <h2 class="title">🗓️ أسبوعي</h2>${DAYS.map(([d, ar, c, ex, e]) => `<div class="phrase" data-act="say" data-arg="${esc(ex)}" style="cursor:pointer;border-right:8px solid ${c}"><div style="font-size:36px">${e}</div><div class="t"><div class="en" style="font-size:21px">${esc(ex)}</div></div><button class="icon-btn">🔊</button></div>`).join('')}
     <div class="note">💡 <span class="en">Wednesday</span> تُكتب بحرف <b class="en">d</b> صامت: <b class="en">Wed-nes-day</b> — قلها كما تُكتب لتحفظ إملاءها!</div>`);
    $('#daySong').onclick = () => { if (cleanup) cleanup(); cleanup = speakSeq([...DAYS.map(d => ({say:d[0], rate:.95})), {say:'There are seven days in a week!'}], i => { main().querySelectorAll('.wagon').forEach(w => w.classList.remove('sing')); const w = $('#dw' + i); if (w) w.classList.add('sing'); }, () => main().querySelectorAll('.wagon').forEach(w => w.classList.remove('sing')), 120); };
  } else if (calTab === 'months') {
    const cm = now.getMonth();
    render(`${tabs}<p class="sub">في السنة 12 شهراً 🎉 · نحن الآن في <b class="en">${MONTHS[cm][0]}</b></p>
     <div class="btnrow"><button class="btn pink" id="monSong">🎵 أنشودة الأشهر</button><button class="btn purple" data-go="quiz/calendar">📝 اختبرني</button></div>
     <div class="grid" style="direction:ltr">${MONTHS.map(([m, ar, e, s], i) => `<button class="card month ${i === cm ? 'now' : ''}" id="mo${i}" style="background:${SEASONS[s][2]}" data-act="sayMonth" data-arg="${i}"><span class="badge" style="background:#fff">${i + 1}</span><span style="font-size:40px">${e}${p.bday === i ? '🎂' : ''}</span><div class="label en">${m}</div>${settings.arabic ? `<div class="small">${ar}</div>` : ''}</button>`).join('')}</div>
     <div class="lesson" style="margin-top:16px"><p class="title">🎂 <span class="en">When is your birthday?</span></p><p class="sub">متى عيد ميلادك؟ اختر الشهر</p>
     <div class="btnrow" style="direction:ltr">${MONTHS.map(([m], i) => `<button class="btn ${p.bday === i ? 'pink' : 'ghost'} en" style="font-size:16px;padding:8px 12px" data-act="setBday" data-arg="${i}">${m.slice(0, 3)}</button>`).join('')}</div>
     ${p.bday !== undefined ? `<div class="word-big en" style="font-size:28px" data-act="say" data-arg="My birthday is in ${MONTHS[p.bday][0]}.">🎂 My birthday is in ${MONTHS[p.bday][0]}. 🔊</div>` : ''}</div>`);
    $('#monSong').onclick = () => { if (cleanup) cleanup(); cleanup = speakSeq([...MONTHS.map(m => ({say:m[0], rate:.95})), {say:'Twelve months in a year!'}], i => { main().querySelectorAll('.month').forEach(w => w.style.transform = ''); const w = $('#mo' + i); if (w) { w.style.transform = 'scale(1.1) rotate(-3deg)'; w.scrollIntoView({block:'nearest', behavior:'smooth'}); } }, () => main().querySelectorAll('.month').forEach(w => w.style.transform = ''), 100); };
  } else if (calTab === 'seasons') {
    render(`${tabs}<p class="sub">في بريطانيا 4 فصول — شاهد كيف يتغير الطقس 🌦️</p>
     <div class="grid big" style="direction:ltr">${Object.entries(SEASONS).map(([k, [ar, e, c]]) => `<div class="card" style="background:${c}"><div class="stage mini season" data-s="${k}"></div><div class="label en" style="font-size:26px">${e} ${k}</div>${settings.arabic ? `<div class="small">${ar}</div>` : ''}
       <div class="small en">${MONTHS.filter(m => m[3] === k).map(m => m[0]).join(' · ')}</div><button class="btn ghost" style="margin-top:6px" data-act="say" data-arg="${seasonSentence(k)}">🔊 <span class="en" style="font-size:14px">${seasonSentence(k)}</span></button></div>`).join('')}</div>`);
    main().querySelectorAll('.season').forEach(el => playAction(el, {w:el.dataset.s, run:S => seasonScene(S, el.dataset.s)}, {loop:true, say:false}));
  } else {
    const y = now.getFullYear(), m = now.getMonth(); const first = new Date(y, m, 1); const daysIn = new Date(y, m + 1, 0).getDate(); const off = dayIdx(first);
    render(`${tabs}<div class="lesson"><p class="sub">📍 هكذا نقول التاريخ بالإنجليزية:</p>
     <div class="word-big en" style="font-size:clamp(24px,6vw,40px)" data-act="say" data-arg="Today is ${dateText(now)}, ${y}.">Today is ${dateText(now)}, ${y}. 🔊</div>
     <p class="sub">نستخدم الأعداد الترتيبية للتاريخ: <b class="en">1st (first), 2nd (second), 3rd (third), 4th (fourth)…</b> — اضغط على أي يوم لتسمعه</p>
     <div class="cal"><div class="cal-h en">${MONTHS[m][2]} ${MONTHS[m][0]} ${y}</div>${DAYS.map(d => `<div class="cal-d en">${d[0].slice(0, 3)}</div>`).join('')}${'<div></div>'.repeat(off)}${Array.from({length:daysIn}, (_, i) => `<button class="cal-c ${i + 1 === now.getDate() ? 'now' : ''}" data-act="sayDate" data-arg="${i + 1}">${i + 1}<small class="en">${ordinal(i + 1).slice(-2)}</small></button>`).join('')}</div>
     <div class="note">🗣️ اسأل طفلك كل صباح: <b class="en">"What day is it today?"</b> ودعه يجيب: <b class="en">"It's ${DAYS[ti][0]}."</b></div></div>`);
  }
};
const seasonSentence = k => ({winter:'In winter, it is cold and snowy.', spring:'In spring, flowers grow.', summer:'In summer, it is hot and sunny.', autumn:'In autumn, the leaves fall.'})[k];
async function seasonScene(S, k) {
  if (k === 'winter') { S.ground('#fff'); S.bg('linear-gradient(#b3d4ea,#eaf4fb)'); S.add('⛄', {x:50, s:90}); await S.all([10, 30, 70, 90, 50].map((x, i) => { const f = S.add('❄️', {x, y:240, s:28}); return S.mv(f, [{bottom:'240px'}, {bottom:'40px'}], 2000, {delay:i * 250}); })); }
  else if (k === 'spring') { const fl = [20, 40, 60, 80].map(x => S.add('🌱', {x, s:40})); await S.wait(400); for (const f of fl) { S.swap(f, rand(['🌷', '🌸', '🌼'])); await S.mv(f, [{t:'scale(.5)'}, {t:'scale(1.4)'}], 400); } S.add('🦋', {x:50, y:160, s:40}); }
  else if (k === 'summer') { S.ground('#F3D9A4'); S.noCloud(); const sun = S.add('☀️', {x:80, y:160, s:70}); S.add('🏖️', {x:35, s:90}); S.add('🍦', {x:65, s:44}); await S.mv(sun, [{t:'rotate(0)'}, {t:'rotate(360deg)'}], 2400); }
  else { S.bg('linear-gradient(#ffd6a5,#fff1e0)'); S.ground('#C8A165'); S.add('🌳', {x:50, s:150, z:1}); await S.all([35, 50, 65].map((x, i) => { const l = S.add(i % 2 ? '🍁' : '🍂', {x, y:160, s:30, z:2}); return S.mv(l, [{bottom:'160px', t:'rotate(0)'}, {bottom:'100px', left:(x + 8) + '%', t:'rotate(120deg)'}, {bottom:'40px', left:(x - 4) + '%', t:'rotate(260deg)'}], 2200, {delay:i * 400}); })); }
}
actions.sayMonth = i => { const m = MONTHS[+i]; speak(`${m[0]}. ${m[4]}`); };
actions.setBday = i => { const p = me(); p.bday = +i; save(); speak(`My birthday is in ${MONTHS[+i][0]}.`); views.calendar(); };
actions.sayDate = d => { const n = new Date(); speak(dateText(new Date(n.getFullYear(), n.getMonth(), +d)) + '.'); };
EXERCISES.push({id:'calendar', icon:'📅', name:'الأيام والأشهر', en:'Days & months'});
const SPELL_TRAPS = [['Wednesday', 'Wensday', 'Wednsday'], ['February', 'Febuary', 'Februray'], ['Thursday', 'Thirsday', 'Thursady'], ['Saturday', 'Saterday', 'Saturdy'], ['Tuesday', 'Tusday', 'Teusday'], ['September', 'Septembre', 'Setpember'], ['January', 'Janury', 'Januery'], ['August', 'Agust', 'Augest'], ['Friday', 'Fryday', 'Firday'], ['December', 'Desember', 'Decembar']];
QUIZ.calendar = () => {
  const t = rand(['next', 'before', 'nextm', 'season', 'spell', 'listen']); const opt3 = (ans, pool) => shuffle([ans, ...sample(pool.filter(x => x !== ans), 2)]);
  const dn = DAYS.map(d => d[0]), mn = MONTHS.map(m => m[0]);
  if (t === 'next') { const i = Math.floor(Math.random() * 7); const a = dn[(i + 2) % 7];
    return {prompt:`<div class="train">${[dn[i], dn[(i + 1) % 7]].map(d => `<span class="wagon en" style="background:${DAYS[dn.indexOf(d)][2]}">${d}</span>`).join('🔗')}🔗<span class="wagon">?</span></div><p class="sub">ما اليوم التالي؟</p>`, say:`${dn[i]}, ${dn[(i + 1) % 7]}, …`, options:opt3(a, dn).map(o => ({html:`<span class="label en">${o}</span>`, ok:o === a})), after:`${dn[i]}, ${dn[(i + 1) % 7]}, ${a}.`, cols:3}; }
  if (t === 'before') { const i = Math.floor(Math.random() * 7); const a = dn[(i + 6) % 7]; const q = `What day comes before ${dn[i]}?`;
    return {prompt:`<p class="title en" style="font-size:28px">${q}</p><p class="sub">ما اليوم الذي يأتي قبل ${DAYS[i][1]}؟</p>`, say:q, options:opt3(a, dn).map(o => ({html:`<span class="label en">${o}</span>`, ok:o === a})), after:`${a} comes before ${dn[i]}.`, cols:3}; }
  if (t === 'nextm') { const i = Math.floor(Math.random() * 12); const a = mn[(i + 1) % 12]; const q = `What month comes after ${mn[i]}?`;
    return {prompt:`<div class="pic" style="font-size:70px">${MONTHS[i][2]}</div><p class="title en" style="font-size:26px">${q}</p>`, say:q, options:opt3(a, mn).map(o => ({html:`<span class="label en">${o}</span>`, ok:o === a})), after:`${a} comes after ${mn[i]}.`, cols:3}; }
  if (t === 'season') { const m = rand(MONTHS); const q = `${m[0]} is in…`;
    return {prompt:`<p class="title en" style="font-size:30px">${m[2]} ${q}</p>`, say:q, options:Object.entries(SEASONS).map(([k, [ar, e]]) => ({html:`<span class="emoji">${e}</span><span class="label en">${k}</span>`, ok:k === m[3]})), after:`${m[0]} is in ${m[3]}.`}; }
  if (t === 'spell') { const [ok, ...bad] = rand(SPELL_TRAPS);
    return {prompt:`<button class="listen-big" data-act="say" data-arg="${ok}">🔊</button><p class="sub">أي كلمة مكتوبة بشكل صحيح؟ ✍️</p>`, say:ok, options:shuffle([ok, ...bad]).map(o => ({html:`<span class="label en" style="font-size:26px">${o}</span>`, ok:o === ok})), after:ok, cols:1}; }
  const all = Math.random() < .5 ? dn : mn; const a = rand(all);
  return {prompt:`<button class="listen-big" data-act="say" data-arg="${a}">🔊</button><p class="sub">اسمع واختر</p>`, say:a, options:shuffle([a, ...sample(all.filter(x => x !== a), 3)]).map(o => ({html:`<span class="label en">${o}</span>`, ok:o === a})), after:a};
};

/* =========================================================
   🎭 مواقف من الحياة الحقيقية (حوارات + تمثيل الأدوار)
   ========================================================= */
const SITUATIONS = [
 {t:'Meeting a new friend', ar:'التعرّف على صديق جديد', place:'🏫', a:['👦', 'Sam'], b:['👧', 'Lily'], lines:[
   ['a', "Hello! My name is Sam. What's your name?", 'مرحباً! اسمي سام. ما اسمك؟'], ['b', "Hi, Sam! I'm Lily.", 'أهلاً سام! أنا ليلي.'],
   ['a', 'How old are you, Lily?', 'كم عمرك يا ليلي؟'], ['b', "I'm seven. How old are you?", 'عمري سبع سنوات. وأنت؟'],
   ['a', "I'm seven too! Do you want to play?", 'وأنا أيضاً! هل تريدين أن تلعبي؟'], ['b', "Yes, please! Let's play!", 'نعم من فضلك! هيا نلعب!']]},
 {t:'At breakfast', ar:'على الفطور', place:'🍳', a:['👩', 'Mum'], b:['🧒', 'You'], lines:[
   ['a', 'Good morning! Are you hungry?', 'صباح الخير! هل أنت جائع؟'], ['b', 'Good morning, Mum. Yes, I am.', 'صباح الخير يا أمي. نعم.'],
   ['a', 'Would you like eggs or cereal?', 'هل تريد بيضاً أم حبوباً؟'], ['b', 'Eggs, please.', 'بيضاً من فضلك.'],
   ['a', 'Here you are. Would you like some juice?', 'تفضل. هل تريد عصيراً؟'], ['b', 'Yes, please. Thank you, Mum!', 'نعم من فضلك. شكراً يا أمي!']]},
 {t:'At the shop', ar:'في المتجر', place:'🏪', a:['🧑‍💼', 'Shopkeeper'], b:['🧒', 'You'], lines:[
   ['a', 'Hello! Can I help you?', 'مرحباً! هل أساعدك؟'], ['b', 'Can I have three apples, please?', 'أريد ثلاث تفاحات من فضلك.'],
   ['a', 'Here you are. Anything else?', 'تفضل. شيء آخر؟'], ['b', 'No, thank you. How much is it?', 'لا شكراً. كم الحساب؟'],
   ['a', "It's two pounds, please.", 'جنيهان من فضلك.'], ['b', 'Here you are. Goodbye!', 'تفضل. مع السلامة!']]},
 {t:'At the doctor', ar:'عند الطبيب', place:'🏥', a:['🧑‍⚕️', 'Doctor'], b:['🤒', 'You'], lines:[
   ['a', "Hello. What's the matter?", 'مرحباً. ما المشكلة؟'], ['b', 'I have a headache and I feel hot.', 'عندي صداع وأشعر بالحرارة.'],
   ['a', 'Open your mouth, please. Say "Ahh".', 'افتح فمك من فضلك. قل "آآه".'], ['b', 'Ahh.', 'آآه.'],
   ['a', 'You have a cold. Drink lots of water and rest.', 'عندك زكام. اشرب ماءً كثيراً وارتح.'], ['b', 'Thank you, doctor.', 'شكراً يا دكتور.']]},
 {t:'Where is my teddy?', ar:'أين دبدوبي؟', place:'🏠', a:['🧒', 'You'], b:['👩', 'Mum'], lines:[
   ['a', 'Mum, where is my teddy?', 'أمي، أين دبدوبي؟'], ['b', 'Is it under your bed?', 'هل هو تحت سريرك؟'],
   ['a', "No, it isn't.", 'لا، ليس هناك.'], ['b', 'Is it in the toy box?', 'هل هو في صندوق الألعاب؟'],
   ['a', 'Yes! Here it is! Thank you, Mum!', 'نعم! ها هو! شكراً يا أمي!'], ['b', "You're welcome, sweetie.", 'عفواً يا حبيبي.']]},
 {t:'At the park', ar:'في الحديقة', place:'🌳', a:['👦', 'Tom'], b:['👧', 'Amy'], lines:[
   ['a', "Let's go on the swings!", 'هيا نركب الأرجوحة!'], ['b', 'Okay! Can you push me, please?', 'حسناً! هل تدفعني من فضلك؟'],
   ['a', 'Yes! Hold on tight!', 'نعم! تمسّكي جيداً!'], ['b', 'Higher, please! Wheee!', 'أعلى من فضلك! ويييي!'],
   ['a', 'Can I have a turn now?', 'هل يأتي دوري الآن؟'], ['b', "Yes! It's your turn.", 'نعم! إنه دورك.']]},
 {t:'On the phone', ar:'على الهاتف', place:'📞', a:['👵', 'Grandma'], b:['🧒', 'You'], lines:[
   ['a', 'Hello?', 'ألو؟'], ['b', "Hi, Grandma! It's me!", 'أهلاً جدتي! هذا أنا!'],
   ['a', 'Hello, sweetie! How are you?', 'أهلاً يا حبيبي! كيف حالك؟'], ['b', "I'm fine, thank you. I miss you!", 'أنا بخير شكراً. اشتقت إليك!'],
   ['a', 'I miss you too! See you on Friday.', 'وأنا اشتقت إليك! أراك يوم الجمعة.'], ['b', 'Bye, Grandma! Love you!', 'مع السلامة جدتي! أحبك!']]},
 {t:'In the classroom', ar:'في الصف', place:'🏫', a:['🧑‍🏫', 'Teacher'], b:['🙋', 'You'], lines:[
   ['a', 'Good morning, everyone!', 'صباح الخير جميعاً!'], ['b', 'Good morning, Miss!', 'صباح الخير يا معلمتي!'],
   ['a', 'Please open your books.', 'افتحوا كتبكم من فضلكم.'], ['b', "Excuse me, Miss. I don't have a pencil.", 'لو سمحتِ يا معلمتي. ليس عندي قلم.'],
   ['a', 'Here you are.', 'تفضل.'], ['b', 'Thank you, Miss!', 'شكراً يا معلمتي!']]},
 {t:'Birthday party', ar:'حفلة عيد ميلاد', place:'🎂', a:['👧', 'Sara'], b:['👦', 'Ali'], lines:[
   ['b', 'Happy birthday, Sara! This is for you.', 'عيد ميلاد سعيد يا سارة! هذه لك.'], ['a', 'Wow! Thank you, Ali! Can I open it?', 'واو! شكراً يا علي! هل أفتحها؟'],
   ['b', 'Yes, of course!', 'نعم بالطبع!'], ['a', "It's a robot! I love it!", 'إنه روبوت! أحبه!'],
   ['b', "Let's eat the cake!", 'هيا نأكل الكعكة!'], ['a', 'Yummy! It is a chocolate cake!', 'لذيذ! إنها كعكة شوكولاتة!']]},
];
views.situations = () => {
  setTitle('🎭 مواقف من الحياة');
  render(`<p class="sub">حوارات قصيرة من الحياة اليومية — شاهد واسمع، ثم مثّل الدور بصوتك! 🎤</p>
   <div class="grid big">${SITUATIONS.map((s, i) => `<button class="card ${me().best['sit_' + i] ? 'letter-card done' : ''}" data-go="situation/${i}"><span class="emoji">${s.place}</span><div class="label en">${s.t}</div><div class="small">${s.ar}</div><div style="font-size:30px">${s.a[0]} 💬 ${s.b[0]}</div></button>`).join('')}</div>`);
};
views.situation = (i) => {
  const s = SITUATIONS[+i]; if (!s) return go('situations');
  setTitle(`🎭 ${s.ar}`);
  let role = null, k = 0, running = false, runId = 0;
  render(`<div class="lesson"><div class="dialog">
     <div class="place">${s.place}</div>
     <div class="who left" id="wa"><div class="bubble-d" id="ba"></div><div class="face">${s.a[0]}</div><div class="nm en">${s.a[1]}</div></div>
     <div class="who right" id="wb"><div class="bubble-d" id="bb"></div><div class="face">${s.b[0]}</div><div class="nm en">${s.b[1]}</div></div>
   </div>
   <div id="dctl" class="btnrow"></div>
   <div class="btnrow"><button class="btn green" id="dPlay">▶️ شاهد الحوار</button><button class="btn pink" id="dRoleA">🎭 كن ${s.a[0]} <span class="en">${s.a[1]}</span></button><button class="btn purple" id="dRoleB">🎭 كن ${s.b[0]} <span class="en">${s.b[1]}</span></button></div>
   <div id="script">${s.lines.map(([w, en, ar], j) => `<div class="phrase" id="ln${j}" data-act="sayLine" data-arg="${i}:${j}" style="cursor:pointer"><div style="font-size:30px">${s[w][0]}</div><div class="t"><div class="en" style="font-size:20px">${esc(en)}</div>${settings.arabic ? `<div class="ar">${ar}</div>` : ''}</div><button class="icon-btn">🔊</button></div>`).join('')}</div></div>`);
  const voiceOf = w => w === 'a' ? {pitch:1.25} : {pitch:.9, alt:true};
  const show = j => {
    const [w, en, ar] = s.lines[j];
    ['a', 'b'].forEach(x => { $('#b' + x).classList.remove('on'); $('#w' + x).classList.remove('talk'); });
    const b = $('#b' + w); b.innerHTML = `<span class="en">${esc(en)}</span>${settings.arabic ? `<small>${ar}</small>` : ''}`; b.classList.add('on'); $('#w' + w).classList.add('talk');
    main().querySelectorAll('#script .phrase').forEach(x => x.style.outline = ''); const ln = $('#ln' + j); ln.style.outline = '4px solid var(--yellow)';
  };
  const step = () => {
    if (!$('#dctl')) return;
    if (k >= s.lines.length) { running = false; $('#dctl').innerHTML = ''; ['a', 'b'].forEach(x => $('#w' + x).classList.remove('talk'));
      if (role) { const p = me(); if (!p.best['sit_' + i]) { p.best['sit_' + i] = 1; save(); } addStars(3); confetti(); sfx('win'); speak('Well done! Great acting!'); }
      return; }
    const [w, en] = s.lines[k]; show(k);
    if (role === w) {
      $('#dctl').innerHTML = `<p class="sub" style="width:100%">🎤 دورك! قل الجملة:</p><button class="btn pink" id="dMic" style="font-size:22px">🎤 تكلّم</button><button class="btn ghost" id="dHint">🔊 ساعدني</button><button class="btn ghost" id="dNext">⏭️ التالي</button>`;
      const my = runId; const go2 = () => { if (my !== runId) return; k++; setTimeout(step, 500); };
      $('#dHint').onclick = () => speak(en, {rate:.75});
      $('#dNext').onclick = go2;
      $('#dMic').onclick = () => {
        if (!SR) { toast('الميكروفون غير مدعوم — قلها بصوت عالٍ ثم اضغط التالي'); return; }
        const r = new SR(); r.lang = settings.accent; r.maxAlternatives = 3;
        r.onresult = e => { const heard = e.results[0][0].transcript.toLowerCase(); const target = en.toLowerCase().replace(/[^a-z ]/g, '');
          const tw = target.split(' ').filter(x => x.length > 2); const hit = tw.filter(x => heard.includes(x)).length;
          if (tw.length === 0 || hit / tw.length >= .5) { sfx('good'); praise(); go2(); } else { sfx('bad'); toast(`سمعت: "${heard}" — حاول مرة أخرى`); speak(en, {rate:.8}); } };
        r.onerror = () => toast('لم أسمع جيداً، حاول مرة أخرى'); r.start();
      };
    } else { $('#dctl').innerHTML = ''; const my = runId; speak(en, Object.assign(voiceOf(w), {onend:() => { if (my !== runId) return; k++; setTimeout(() => { if (my === runId) step(); }, 500); }})); }
  };
  const start = r => { runId++; speechSynthesis.cancel(); role = r; k = 0; running = true; step(); };
  $('#dPlay').onclick = () => start(null); $('#dRoleA').onclick = () => start('a'); $('#dRoleB').onclick = () => start('b');
  cleanup = () => { runId++; };
  show(0); ['a', 'b'].forEach(x => $('#w' + x).classList.remove('talk'));
};
actions.sayLine = arg => { const [i, j] = arg.split(':').map(Number); const [w, en] = SITUATIONS[i].lines[j]; speak(en, w === 'a' ? {pitch:1.25} : {pitch:.9, alt:true}); };
