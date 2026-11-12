/* ===== منهج Year 2 و Year 3 — حسب المنهج الوطني البريطاني (English National Curriculum) ===== */
// أنواع الأسئلة:
// B = أكمل الفراغ ___   |   C = اختر الجملة الصحيحة   |   K = صنّف الكلمة/الجملة
const B = (s, a, d, why) => ({t:'b', s, a, d, why});
const C = (a, d, why) => ({t:'c', a, d, why});
const K = (w, a, why) => ({t:'k', w, a, why});

const WORD_CLASSES = {noun:'اسم 🏷️', verb:'فعل 🏃', adjective:'صفة 🎨', adverb:'ظرف/حال ⚡'};
const SENTENCE_TYPES = {statement:'خبرية .', question:'سؤال ?', command:'أمر 👉', exclamation:'تعجّب !'};

const UNITS = [
/* ======================= YEAR 2 ======================= */
{id:'y2_plural', year:2, icon:'🐱🐱', title:'الجمع s و es', en:'Plurals',
 rule:`للجمع نضيف <b class="en">s</b> لأغلب الكلمات. إذا انتهت الكلمة بـ <b class="en">s, x, z, sh, ch</b> نضيف <b class="en">es</b> (لأننا نسمع مقطعاً جديداً). وإذا انتهت بحرف ساكن + <b class="en">y</b> نحذف y ونضيف <b class="en">ies</b>.`,
 ex:[['one cat → two cat**s**','قطة ← قطتان','🐱'],['one box → two box**es**','صندوق ← صندوقان','📦'],['one dish → two dish**es**','صحن ← صحنان','🍽️'],['one baby → two bab**ies**','رضيع ← رضيعان','👶'],['one fox → three fox**es**','ثعلب ← ثلاثة ثعالب','🦊']],
 items:[B('I have two ___. 🐱','cats',['cat','cates']),B('There are three ___ on the table. 📦','boxes',['boxs','box']),B('We washed the ___. 🍽️','dishes',['dishs','dish']),B('The two ___ are sleeping. 👶','babies',['babys','babyes']),B('I can see five ___. 🦊','foxes',['foxs','fox']),
  B('My mum bought some ___. 🍎','apples',['applees','apple']),B('The ___ are in the sky. ⭐','stars',['star','stares']),B('I ate two ___ for lunch. 🥪','sandwiches',['sandwichs','sandwich']),B('The ___ are playing. 👧','girls',['girles','girl']),B('There are lots of ___ in the shop. 🧸','toys',['toies','toy'],'y بعد حرف علة (o) تبقى كما هي: toy → toys'),
  B('We have two ___. 🚌','buses',['buss','bus']),B('I like ___. 🍒','cherries',['cherrys','cherry'])]},

{id:'y2_suffix_ing_ed', year:2, icon:'🏃', title:'إضافة ing و ed', en:'Suffixes -ing, -ed',
 rule:`<b class="en">-ing</b> يعني أن الحدث يحدث الآن، و<b class="en">-ed</b> يعني أنه حدث في الماضي.<br>⚠️ قواعد ذهبية:<br>1️⃣ الكلمة القصيرة (ساكن-علة-ساكن) نضاعف آخر حرف: <b class="en">hop → hopping, hopped</b><br>2️⃣ الكلمة المنتهية بـ e نحذف e: <b class="en">make → making</b><br>3️⃣ ساكن + y نحوّلها لـ i مع ed: <b class="en">cry → cried</b> (لكن <b class="en">crying</b>)`,
 ex:[['jump → jump**ing** → jump**ed**','يقفز','🤸'],['hop → hop**ping** → hop**ped**','يحجل','🐸'],['smile → smil**ing** → smil**ed**','يبتسم','😊'],['cry → cry**ing** → cr**ied**','يبكي','😢'],['run → run**ning**','يركض','🏃']],
 items:[B('The frog is ___ . 🐸','hopping',['hoping','hopeing']),B('Yesterday I ___ to the park. 🚶','walked',['walkd','walkt']),B('She is ___ at me. 😊','smiling',['smileing','smilling']),B('The baby ___ all night. 😢','cried',['cryed','cryd']),B('Tom is ___ fast. 🏃','running',['runing','runeing']),
  B('We ___ a cake last week. 🍰','baked',['bakeed','bakked']),B('The dog is ___ the ball. 🐶','chasing',['chaseing','chassing']),B('I ___ my hands. 👏','clapped',['claped','clapt']),B('He is ___ in the pool. 🏊','swimming',['swiming','swimeing']),B('She ___ the door. 🚪','opened',['openned','opend']),
  B('They are ___ a song. 🎤','singing',['singging','singeing']),B('The ball ___ down the hill. ⚽','rolled',['roled','rold'])]},

{id:'y2_compare', year:2, icon:'🐘', title:'المقارنة er و est', en:'Comparatives & Superlatives',
 rule:`نستخدم <b class="en">-er</b> للمقارنة بين شيئين، و<b class="en">-est</b> للأكثر بين الجميع.<br><b class="en">big → bigger → biggest</b> (نضاعف g)<br><b class="en">happy → happier → happiest</b> (y تصبح i)<br><b class="en">nice → nicer → nicest</b> (نضيف r أو st فقط)`,
 ex:[['The mouse is **small**. 🐭','الفأر صغير','🐭'],['The cat is small**er**. 🐱','القطة أصغر','🐱'],['The elephant is the bigg**est**. 🐘','الفيل الأكبر','🐘'],['I am happ**ier** today.','أنا أسعد اليوم','😄'],['This is the nic**est** cake.','هذه ألذّ كعكة','🍰']],
 items:[B('A horse is ___ than a dog. 🐴','bigger',['biger','biggest']),B('The giraffe is the ___ animal. 🦒','tallest',['taller','tallist']),B('My bag is ___ than your bag. 🎒','heavier',['heavyer','heaviest']),B('Today is ___ than yesterday. ☀️','hotter',['hoter','hottest']),B('This is the ___ day ever! 😄','happiest',['happyest','happier']),
  B('A cheetah is ___ than a cat. 🐆','faster',['fastter','fastest']),B('Sam is the ___ boy in the class. 📏','shortest',['shorter','shortist']),B('Ice is ___ than water. 🧊','colder',['coldest','coldder']),B('This is the ___ cake. 🍰','nicest',['niceest','nicer']),B('My sister is ___ than me. 👧','younger',['youngest','yunger']),
  B('The snail is ___ than the rabbit. 🐌','slower',['slowest','slowwer']),B('That is the ___ joke! 😂','funniest',['funnyest','funnier'])]},

{id:'y2_suffix_ful', year:2, icon:'🧩', title:'اللواحق ful · less · ness · ment · ly', en:'Suffixes',
 rule:`اللاحقة تغيّر معنى الكلمة أو نوعها:<br><b class="en">-ful</b> = مليء بـ (care → care<b>ful</b>)<br><b class="en">-less</b> = بدون (care → care<b>less</b>)<br><b class="en">-ness</b> تصنع اسماً (sad → sad<b>ness</b>)<br><b class="en">-ment</b> تصنع اسماً (enjoy → enjoy<b>ment</b>)<br><b class="en">-ly</b> تصف كيف (slow → slow<b>ly</b>)`,
 ex:[['help**ful**','مُساعِد (مليء بالمساعدة)','🤝'],['help**less**','عاجز (بدون مساعدة)','😟'],['kind**ness**','لُطف','💖'],['pay**ment**','دفع','💳'],['quick**ly**','بسرعة','⚡']],
 items:[B('Be ___ when you cross the road. 🚸','careful',['careless','carely']),B('Thank you, you are very ___ ! 🤝','helpful',['helpless','helpness']),B('The tortoise walked ___ . 🐢','slowly',['slowful','slowness']),B('Her ___ made me smile. 💖','kindness',['kindful','kindment']),B('The broken toy was ___ . 🧸','useless',['useful','usely']),
  B('We sang ___ . 😄','happily',['happyly','happiness']),B('I felt great ___ when I won. 🏆','excitement',['exciteness','excitely']),B('He was ___ for the lovely gift. 🎁','thankful',['thankless','thankness']),B('The flowers are ___ . 🌸','beautiful',['beautyful','beautiless'],'y تصبح i: beauty → beautiful'),B('He ran ___ to the bus. 🚌','quickly',['quickful','quickness']),
  B('I could not sleep because of the ___ . 🌑','darkness',['darkful','darkment']),B('A ___ child is never bored. 🎨','playful',['playless','playly'])]},

{id:'y2_contractions', year:2, icon:"✂️", title:'الاختصارات (الفاصلة العليا)', en:'Contractions',
 rule:`نختصر كلمتين إلى كلمة واحدة ونضع الفاصلة العليا <b class="en">'</b> مكان الحروف المحذوفة:<br><b class="en">do not → don't</b> (حذفنا o)<br><b class="en">I am → I'm</b> (حذفنا a)`,
 ex:[["do not → **don't**",'لا','🙅'],["can not → **can't**",'لا يستطيع','🚫'],["I am → **I'm**",'أنا','🙋'],["it is → **it's**",'إنه','👉'],["we will → **we'll**",'سوف','🔮'],["did not → **didn't**",'لم','❌']],
 items:[B("I ___ like snakes. (do not) 🐍","don't",["dont'","do'nt"]),B("___ my birthday today! (It is) 🎂","It's",["Its'","Its"]),B("She ___ swim yet. (can not) 🏊","can't",["cant'","ca'nt"]),B("___ seven years old. (I am) 🙋","I'm",["Im'","I'am"]),B("___ go to the park later. (We will) 🌳","We'll",["Well","We'ill"]),
  B("He ___ eat his lunch. (did not) 🍽️","didn't",["did'nt","didnt'"]),B("___ my best friend. (She is) 👭","She's",["Shes'","Sh'is"]),B("___ late! (You are) ⏰","You're",["Your","Youre'"]),B("I ___ find my shoe. (could not) 👟","couldn't",["could'nt","couldnt"]),B("___ a cat on the roof. (There is) 🐱","There's",["Theres","Theirs"]),
  B("They ___ coming. (are not) 🚫","aren't",["arent","are'nt"]),B("___ got a new bike. (I have) 🚲","I've",["Ive","I'hve"])]},

{id:'y2_homophones', year:2, icon:'👂', title:'كلمات متشابهة النطق', en:'Homophones',
 rule:`بعض الكلمات تُنطق بنفس الطريقة لكن تُكتب بشكل مختلف ومعناها مختلف! نعرفها من معنى الجملة.`,
 ex:[['I can **see** the **sea**.','أرى البحر','🌊'],['A **bee** can **be** busy.','النحلة مشغولة','🐝'],['I have **two** cats **too**. I go **to** school.','اثنان / أيضاً / إلى','2️⃣'],['**There** is **their** dog.','هناك / الخاص بهم','🐶'],['I **hear** you. Come **here**.','أسمع / هنا','👂'],['The wind **blew**. The sky is **blue**.','هبّت / أزرق','💨']],
 items:[B('We swam in the ___ . 🌊','sea',['see']),B('Can you ___ the bird? 👀','see',['sea']),B('I have ___ eyes. 👀','two',['to','too']),B('I want to come ___ ! 🙋','too',['to','two']),B('We went ___ the shop. 🏪','to',['two','too']),
  B('The children ate ___ lunch. 🍱','their',['there']),B('Put the box over ___ . 👉','there',['their']),B('I can ___ the music. 🎵','hear',['here']),B('Come ___ , please! 🙌','here',['hear']),B('The sky is ___ . 🌤️','blue',['blew']),
  B('A ___ makes honey. 🍯','bee',['be']),B('The ___ fought the dragon. 🛡️','knight',['night']),B('I ___ the race! 🏆','won',['one']),B('Look at the ___ ! 🌹','flower',['flour'])]},

{id:'y2_word_classes', year:2, icon:'🏷️', title:'أنواع الكلمات', en:'Nouns, Verbs, Adjectives, Adverbs', cats:WORD_CLASSES,
 rule:`🏷️ <b class="en">Noun</b> (اسم): شخص أو مكان أو شيء — <b class="en">dog, school, Sara</b><br>🏃 <b class="en">Verb</b> (فعل): حدث أو حركة — <b class="en">run, eat, is</b><br>🎨 <b class="en">Adjective</b> (صفة): تصف الاسم — <b class="en">big, red, happy</b><br>⚡ <b class="en">Adverb</b> (ظرف): يصف كيف حدث الفعل، وغالباً ينتهي بـ ly — <b class="en">slowly, loudly</b>`,
 ex:[['The **big** dog ran **quickly**.','الكلب الكبير ركض بسرعة','🐕'],['big = adjective 🎨','صفة','🎨'],['dog = noun 🏷️','اسم','🏷️'],['ran = verb 🏃','فعل','🏃'],['quickly = adverb ⚡','ظرف','⚡']],
 items:[K('dog','noun'),K('jump','verb'),K('happy','adjective'),K('slowly','adverb'),K('school','noun'),K('eat','verb'),K('red','adjective'),K('loudly','adverb'),K('teacher','noun'),K('swim','verb'),K('tall','adjective'),K('carefully','adverb'),K('apple','noun'),K('sing','verb'),K('soft','adjective'),K('quietly','adverb')]},

{id:'y2_sentence_types', year:2, icon:'❗', title:'أنواع الجمل', en:'Sentence types', cats:SENTENCE_TYPES,
 rule:`📢 <b class="en">Statement</b> جملة خبرية تخبرنا بشيء وتنتهي بـ <b>.</b><br>❓ <b class="en">Question</b> سؤال ينتهي بـ <b>?</b><br>👉 <b class="en">Command</b> أمر يطلب فعل شيء<br>😲 <b class="en">Exclamation</b> تعجّب يبدأ بـ <b class="en">What</b> أو <b class="en">How</b> وينتهي بـ <b>!</b>`,
 ex:[['The cat is black**.**','خبرية','📢'],['Where is the cat**?**','سؤال','❓'],['Feed the cat.','أمر','👉'],['What a cute cat that is**!**','تعجّب','😲']],
 items:[K('The sun is hot.','statement'),K('Where is my hat?','question'),K('Close the door.','command'),K('What a big cake that is!','exclamation'),K('I like ice cream.','statement'),K('Can you swim?','question'),K('Sit down, please.','command'),K('How tall you are!','exclamation'),K('Do you have a pet?','question'),K('Wash your hands.','command'),K('My dog is brown.','statement'),K('What a lovely day it is!','exclamation')]},

{id:'y2_punctuation', year:2, icon:'✏️', title:'علامات الترقيم والحروف الكبيرة', en:'Punctuation & Capitals',
 rule:`✅ نبدأ كل جملة بحرف كبير، ونكتب الأسماء والأيام والمدن وكلمة <b class="en">I</b> بحرف كبير.<br>✅ ننهي الجملة بـ <b>.</b> أو <b>?</b> أو <b>!</b><br>✅ في القائمة نضع فاصلة بين الأشياء وقبل الأخير <b class="en">and</b>: <b class="en">apples, pears and grapes</b><br>✅ للملكية نضيف <b class="en">'s</b>: <b class="en">the dog's bone</b> (عظمة الكلب)`,
 ex:[['**M**y name is **S**ara**.**','اسمي سارة','🙋'],['On **M**onday **I** went to **L**ondon**.**','يوم الاثنين ذهبت إلى لندن','🇬🇧'],['I like red**,** blue and green**.**','فاصلة في القائمة','🎨'],["the dog**'s** bone",'عظمة الكلب','🦴']],
 items:[C('My name is Ali.',['my name is ali.','My name is ali']),C('On Friday I went to the park.',['on friday i went to the park.','On friday I went to the park']),C('Where do you live?',['Where do you live.','where do you live?']),C('I like cats, dogs and fish.',['I like cats dogs and fish.','I like, cats, dogs, and, fish.']),C("This is Sam's bike.",['This is Sams bike.',"This is Sams' bike."]),
  C('We live in London.',['We live in london.','we live in London.']),B('Can you help me___','?',['.','!']),B('What a beautiful day it is___','!',['?',',']),B('I went to bed early___','.',['?',',']),C("The cat's tail is long.",['The cats tail is long.',"The cat's tail is long"]),
  C('Tom and I are friends.',['Tom and i are friends.','tom and I are friends.']),C('I need eggs, milk and bread.',['I need eggs milk and bread.','I need, eggs milk, and bread.'])]},

{id:'y2_conjunctions', year:2, icon:'🔗', title:'أدوات الربط', en:'Conjunctions',
 rule:`أدوات الربط تصل جملتين معاً:<br><b class="en">and</b> (و) · <b class="en">but</b> (لكن) · <b class="en">or</b> (أو) · <b class="en">because</b> (لأن) · <b class="en">when</b> (عندما) · <b class="en">if</b> (إذا) · <b class="en">that</b> (أنّ)`,
 ex:[['I like tea **and** cake.','أحب الشاي والكعك','🍰'],['I am tired **but** happy.','متعب لكن سعيد','🥱'],['Do you want milk **or** juice?','حليب أم عصير؟','🥛'],["I'm wet **because** it rained.",'مبلل لأنها أمطرت','🌧️'],['I smile **when** I see my mum.','أبتسم عندما أرى أمي','😊'],['You can play **if** you finish.','تلعب إذا أنهيت','🎮']],
 items:[B('I wore a coat ___ it was cold. 🧥','because',['but','or']),B('Do you want an apple ___ a banana? 🍎','or',['because','but']),B('I like cats ___ I like dogs. 🐱','and',['or','if']),B('I wanted to play ___ it was raining. 🌧️','but',['and','or']),B('You can have a sweet ___ you eat your dinner. 🍬','if',['but','or']),
  B('I was happy ___ I saw my friend. 😊','when',['or','but']),B('She was sad ___ she lost her toy. 😢','because',['or','and']),B('I think ___ you are kind. 💖','that',['or','but']),B('We can walk ___ we can take the bus. 🚌','or',['because','when']),B('The dog barked ___ the postman came. 📬','when',['or','but']),
  B('I am small ___ I am strong. 💪','but',['or','if']),B('We ate pizza ___ watched a film. 🍕','and',['or','because'])]},

{id:'y2_tense', year:2, icon:'⏰', title:'الماضي والحاضر', en:'Past & Present tense',
 rule:`⏰ الحاضر: <b class="en">I play</b> · ويحدث الآن: <b class="en">I am playing</b><br>⏪ الماضي: <b class="en">I played</b> · وكان يحدث: <b class="en">I was playing</b><br>⚠️ أفعال شاذة لا تأخذ ed: <b class="en">go → went, see → saw, eat → ate, run → ran, come → came, have → had</b>`,
 ex:[['Today I **play**. Yesterday I **played**.','ألعب / لعبت','⚽'],['Now I **am reading**.','أقرأ الآن','📖'],['Yesterday I **was reading**.','كنت أقرأ','📚'],['I **go** → I **went**','أذهب / ذهبت','🚶'],['I **eat** → I **ate**','آكل / أكلت','🍽️']],
 items:[B('Yesterday I ___ to the zoo. 🦁','went',['goed','go']),B('Last night we ___ pizza. 🍕','ate',['eated','eat']),B('Look! The baby ___ sleeping. 👶','is',['was','were']),B('Yesterday I ___ a rainbow. 🌈','saw',['seed','see']),B('Last week we ___ football. ⚽','played',['play','playing']),
  B('Right now, I ___ reading a book. 📖','am',['was','is']),B('When the phone rang, Mum ___ cooking. 📞','was',['is','am']),B('He ___ to school yesterday. 🏃','ran',['runned','run']),B('My friend ___ to my house last Sunday. 🏠','came',['comed','come']),B('We ___ a party last Friday. 🎉','had',['haved','have']),
  B('They ___ swimming at the moment. 🏊','are',['were','was']),B('She ___ her teeth every day. 🪥','brushes',['brushed','brushing'])]},

{id:'y2_spelling', year:2, icon:'🐝', title:'كلمات الإملاء Year 2', en:'Common exception words', spelling:true,
 rule:`هذه الكلمات مقرّرة على Year 2 في المنهج البريطاني، وكثير منها لا يُكتب كما يُسمع. اسمعها، انظر إليها، غطِّها، اكتبها، ثم تحقق! <b class="en">(Look, Say, Cover, Write, Check)</b>`,
 words:['door','floor','poor','because','find','kind','mind','behind','child','children','wild','climb','most','only','both','old','cold','gold','hold','told','every','everybody','even','great','break','pretty','beautiful','after','fast','last','past','father','class','grass','pass','plant','path','bath','hour','move','prove','improve','sure','sugar','eye','could','should','would','who','whole','any','many','clothes','busy','people','water','again','half','money','parents']},

/* ======================= YEAR 3 ======================= */
{id:'y3_prefix', year:3, icon:'🔄', title:'البادئات un · dis · mis · re · pre', en:'Prefixes',
 rule:`البادئة تُضاف في أول الكلمة فتغيّر معناها:<br><b class="en">un-</b> / <b class="en">dis-</b> / <b class="en">in-</b> = عكس (un<b>happy</b>, dis<b>agree</b>)<br><b class="en">mis-</b> = بشكل خاطئ (mis<b>spell</b>)<br><b class="en">re-</b> = مرة أخرى (re<b>do</b>)<br><b class="en">pre-</b> = قبل (pre<b>view</b>)<br><b class="en">im-</b> قبل الكلمات التي تبدأ بـ m أو p (im<b>possible</b>)`,
 ex:[['**un**happy','غير سعيد','😟'],['**dis**appear','يختفي','🫥'],['**mis**behave','يسيء التصرف','😈'],['**re**play','يعيد اللعب','🔁'],['**im**possible','مستحيل','🚫'],['**pre**school','ما قبل المدرسة','🧸']],
 items:[B('I am not happy. I am ___ . 😟','unhappy',['dishappy','mishappy']),B('The magician made the rabbit ___ . 🎩','disappear',['unappear','misappear']),B('Please ___ the game. 🔁','replay',['unplay','preplay']),B('It is ___ to fly like a bird. 🕊️','impossible',['unpossible','inpossible']),B('Do not ___ in class! 😈','misbehave',['unbehave','rebehave']),
  B('I ___ with you. That is not right. 🙅','disagree',['unagree','misagree']),B('Please ___ your shoes. 👟','untie',['distie','mistie']),B('I ___ the word. It was wrong. ✏️','misspelled',['unspelled','disspelled']),B('I ___ the door with my key. 🔑','unlocked',['dislocked','prelocked']),B('We ___ the cake before the party. 🍰','prepared',['unpared','dispared']),
  B('My room is ___ ! 🧸','untidy',['distidy','mistidy']),B('I need to ___ my homework. ✏️','redo',['undo','predo']),B('Don\'t be ___ — wait your turn. ⏳','impatient',['unpatient','dispatient']),B('The dog ___ me. 🐶','disobeyed',['unobeyed','misobeyed'])]},

{id:'y3_a_an', year:3, icon:'🍎', title:'a أم an؟', en:'a or an',
 rule:`نستخدم <b class="en">an</b> قبل الكلمة التي تبدأ بصوت حرف علة (a, e, i, o, u): <b class="en">an apple, an egg</b><br>ونستخدم <b class="en">a</b> قبل الكلمة التي تبدأ بصوت ساكن: <b class="en">a cat, a ball</b><br>⚠️ العبرة بالصوت لا بالحرف: <b class="en">an hour</b> (h صامتة) · <b class="en">a unicorn</b> (تُنطق يو)`,
 ex:[['**an** apple','تفاحة','🍎'],['**an** elephant','فيل','🐘'],['**a** banana','موزة','🍌'],['**an** hour','ساعة (h صامتة)','⏰'],['**a** unicorn','وحيد القرن (يو)','🦄'],['**an** umbrella','مظلة','☂️']],
 items:[B('I ate ___ apple. 🍎','an',['a']),B('There is ___ cat on the wall. 🐱','a',['an']),B('I saw ___ elephant. 🐘','an',['a']),B('We waited for ___ hour. ⏰','an',['a']),B('She has ___ umbrella. ☂️','an',['a']),
  B('I want ___ unicorn! 🦄','a',['an']),B('He is ___ astronaut. 🚀','an',['a']),B('It is ___ big house. 🏠','a',['an']),B('I found ___ egg. 🥚','an',['a']),B('That is ___ owl. 🦉','an',['a']),
  B('My dad drives ___ old car. 🚗','an',['a']),B('I go to ___ school near my house. 🏫','a',['an']),B('It was ___ honest mistake. 🙂','an',['a'],'h صامتة في honest')]},

{id:'y3_suffix', year:3, icon:'➕', title:'اللواحق ly · ous · ation', en:'More suffixes',
 rule:`<b class="en">-ly</b> يحوّل الصفة إلى ظرف: <b class="en">sad → sadly</b> · <b class="en">happy → happily</b> · <b class="en">gentle → gently</b> · <b class="en">basic → basically</b><br><b class="en">-ous</b> = مليء بـ: <b class="en">danger → dangerous, fame → famous</b><br><b class="en">-ation</b> تصنع اسماً من فعل: <b class="en">inform → information</b>`,
 ex:[['sad → sad**ly**','بحزن','😢'],['happy → happ**ily**','بسعادة','😄'],['gentle → gent**ly**','بلطف','🤲'],['danger → danger**ous**','خطير','⚠️'],['fame → fam**ous**','مشهور','🌟'],['inform → inform**ation**','معلومات','ℹ️']],
 items:[B('The lion is ___ . 🦁','dangerous',['dangerly','dangeration']),B('She stroked the kitten ___ . 🐱','gently',['gentlely','gentlly']),B('They played ___ together. 😄','happily',['happyly','happly']),B('He is a ___ footballer. ⚽','famous',['fameous','famly']),B('The train ___ is on the board. ℹ️','information',['informous','informly']),
  B('The boy smiled ___ . 😢','sadly',['sadous','sadation']),B('The cat ___ jumped onto the wall. 🐱','suddenly',['suddenous','suddenation']),B('Please ___ shut the door. 🚪','quietly',['quietous','quiettly']),B('We had a big ___ for her birthday. 🎉','celebration',['celebrous','celebrately']),B('The mountain was ___ ! ⛰️','enormous',['enormly','enormation']),
  B('She ___ finished first. 🏁','finally',['finaly','finalous']),B('That was a ___ day! ☀️','glorious',['gloryous','gloriously'])]},

{id:'y3_perfect', year:3, icon:'✅', title:'المضارع التام have/has', en:'Present perfect',
 rule:`نستخدم <b class="en">have / has</b> + الفعل الثالث للحديث عن شيء حدث ونتيجته الآن:<br><b class="en">I have finished my homework.</b> (أنهيت واجبي — وهو منتهٍ الآن)<br><b class="en">I / you / we / they → have</b> · <b class="en">he / she / it → has</b><br>⚠️ أفعال شاذة: <b class="en">eat → eaten, go → gone, see → seen, write → written</b>`,
 ex:[['I **have finished** my lunch.','أنهيت غدائي','🍽️'],['She **has gone** to school.','ذهبت إلى المدرسة','🏫'],['We **have seen** that film.','شاهدنا هذا الفيلم','🎬'],['He **has written** a letter.','كتب رسالة','✉️']],
 items:[B('I ___ finished my homework. ✏️','have',['has','am']),B('She ___ eaten all the cake! 🍰','has',['have','is']),B('We have ___ that film before. 🎬','seen',['saw','see']),B('My dad has ___ to work. 🚗','gone',['went','go']),B('They ___ visited London. 🇬🇧','have',['has','is']),
  B('He has ___ a letter to Grandma. ✉️','written',['wrote','writed']),B('The cat ___ caught a mouse. 🐭','has',['have','are']),B('I have ___ my shoes. 👟','lost',['losed','lose']),B('Have you ___ your breakfast? 🥣','eaten',['ate','eated']),B('It ___ stopped raining. 🌤️','has',['have','had been']),
  B('We have ___ a new house. 🏠','bought',['buyed','buy']),B('You have ___ so tall! 📏','grown',['growed','grew'])]},

{id:'y3_conjunctions', year:3, icon:'⏳', title:'أدوات الزمن والسبب', en:'Time & cause conjunctions',
 rule:`نستخدمها لنقول <b>متى</b> أو <b>لماذا</b> حدث الشيء:<br><b class="en">before</b> (قبل) · <b class="en">after</b> (بعد) · <b class="en">while</b> (بينما) · <b class="en">until</b> (حتى) · <b class="en">so</b> (لذلك) · <b class="en">although</b> (مع أنّ) · <b class="en">since</b> (منذ/بما أن)`,
 ex:[['Wash your hands **before** you eat.','قبل أن تأكل','🧼'],['We played **after** school.','بعد المدرسة','⚽'],['I read **while** Mum cooked.','بينما','📖'],['It was cold, **so** I wore a hat.','لذلك','🧢'],['**Although** it rained, we had fun.','مع أنها أمطرت','🌧️'],['Wait here **until** I come back.','حتى أعود','⏳']],
 items:[B('Brush your teeth ___ you go to bed. 🪥','before',['after','although']),B('We had ice cream ___ dinner. 🍦','after',['before','until']),B('I listened to music ___ I painted. 🎨','while',['so','until']),B('It was raining, ___ I took my umbrella. ☂️','so',['although','before']),B('___ he was tired, he finished the race. 🏁','Although',['So','Until']),
  B('Stay inside ___ the rain stops. 🌧️','until',['so','while']),B('I was hungry, ___ I made a sandwich. 🥪','so',['although','until']),B('The phone rang ___ I was in the bath. 🛁','while',['so','until']),B('Put on your coat ___ you go outside. 🧥','before',['after','although']),B('___ it was sunny, it was cold. ❄️','Although',['So','Before']),
  B('I have lived here ___ I was a baby. 👶','since',['so','while']),B('We went home ___ the film finished. 🎬','after',['before','although'])]},

{id:'y3_speech', year:3, icon:'💬', title:'علامات التنصيص (الكلام المباشر)', en:'Inverted commas',
 rule:`عندما نكتب كلام شخص ما نضعه بين علامتي تنصيص <b class="en">" "</b><br>✅ نبدأ الكلام بحرف كبير<br>✅ علامة الترقيم (, ? !) تكون <b>داخل</b> علامات التنصيص<br>مثال: <b class="en">"Can I play?" asked Tom.</b>`,
 ex:[['**"**Hello!**"** said Sara.','قالت سارة: مرحباً!','👋'],['**"**Where is my bag?**"** asked Ali.','سأل علي: أين حقيبتي؟','🎒'],['Mum said, **"**Time for bed.**"**','قالت أمي: حان وقت النوم','🛏️']],
 items:[C('"I like cake," said Sam.',['"I like cake" said Sam,','I like cake, "said Sam."']),C('"Where are you?" asked Mum.',['"Where are you"? asked Mum.','Where are you? "asked Mum."']),C('"Look out!" shouted Dad.',['"Look out"! shouted Dad.','"look out!" shouted Dad.']),C('Sara said, "My cat is black."',['Sara said, "my cat is black."','Sara said "My cat is black".']),C('"Can I help?" asked the girl.',['"Can I help"? asked the girl.','"can I help?" asked the girl.']),
  C('"It is hot today," said Grandma.',['"It is hot today" said Grandma.','It is hot today, said "Grandma."']),C('The teacher said, "Open your books."',['The teacher said, Open your books.','The teacher said, "open your books."']),C('"Hooray!" cried the children.',['"Hooray"! cried the children.','Hooray! "cried the children."']),C('"What time is it?" asked Ben.',['"What time is it"? asked Ben.','"What time is it." asked Ben?']),C('Tom whispered, "I have a secret."',['Tom whispered, "i have a secret."','Tom whispered "I have a secret".'])]},

{id:'y3_irregular', year:3, icon:'🔀', title:'الأفعال الشاذة في الماضي', en:'Irregular past tense',
 rule:`هذه الأفعال لا تأخذ <b class="en">-ed</b> في الماضي، بل تتغيّر! احفظها بالتكرار والغناء 🎵`,
 ex:[['bring → **brought**','أحضر','🎁'],['think → **thought**','فكّر','💭'],['catch → **caught**','أمسك','⚾'],['teach → **taught**','علّم','🧑‍🏫'],['buy → **bought**','اشترى','🛍️'],['write → **wrote**','كتب','✍️'],['swim → **swam**','سبح','🏊'],['fly → **flew**','طار','🕊️']],
 items:[B('I ___ a present for my friend. (bring) 🎁','brought',['bringed','brang']),B('She ___ the ball. (catch) ⚾','caught',['catched','caughted']),B('Mum ___ me to ride a bike. (teach) 🚲','taught',['teached','tought']),B('We ___ some sweets. (buy) 🍬','bought',['buyed','brought']),B('I ___ it was a good idea. (think) 💭','thought',['thinked','thinkt']),
  B('The bird ___ away. (fly) 🕊️','flew',['flied','flown']),B('He ___ a story. (write) ✍️','wrote',['writed','written']),B('We ___ in the sea. (swim) 🏊','swam',['swimmed','swum']),B('I ___ my keys. (find) 🔑','found',['finded','fond']),B('They ___ a song. (sing) 🎤','sang',['singed','sung']),
  B('The glass ___ . (break) 🥛','broke',['breaked','broken']),B('I ___ a funny dream. (have) 💤','had',['haved','has']),B('She ___ the bus to school. (take) 🚌','took',['taked','taken']),B('We ___ down on the grass. (sit) 🌱','sat',['sitted','sitten'])]},

{id:'y3_homophones', year:3, icon:'🎧', title:'كلمات متشابهة (مستوى 2)', en:'Homophones 2',
 rule:`مزيد من الكلمات التي تُنطق بنفس الطريقة وتُكتب بشكل مختلف — المعنى هو المفتاح 🔑`,
 ex:[['**break** a glass / **brake** on a bike','يكسر / فرامل','🚲'],['**meet** a friend / eat **meat**','يقابل / لحم','🥩'],['**great** / cheese **grater**','رائع / مبشرة','🧀'],['the **weather** / **whether** or not','الطقس / سواء','🌦️'],['the lion\'s **mane** / the **main** road','عُرف الأسد / الرئيسي','🦁'],['a **piece** of cake / **peace**','قطعة / سلام','🍰']],
 items:[B('Press the ___ to stop the bike. 🚲','brake',['break']),B('Be careful not to ___ the glass. 🥛','break',['brake']),B('I will ___ you at the park. 🤝','meet',['meat']),B('The lion has a big ___ . 🦁','mane',['main']),B('The ___ is sunny today. ☀️','weather',['whether']),
  B('Can I have a ___ of cake? 🍰','piece',['peace']),B('We had a ___ time! 🎉','great',['grate']),B('I ___ my bike to school. 🚲','rode',['road']),B('Cross the ___ carefully. 🛣️','road',['rode']),B('I ___ a pirate ship! 🏴‍☠️','saw',['sore']),
  B('I can see the ___ of the mountain. ⛰️','peak',['peek']),B('Don\'t ___ at your present! 🙈','peek',['peak']),B('I ___ the answer! 💡','knew',['new']),B('I have a ___ bike. 🚲','new',['knew'])]},

{id:'y3_pronouns', year:3, icon:'👥', title:'الضمائر', en:'Pronouns',
 rule:`الضمير يحلّ محلّ الاسم حتى لا نكرّره:<br><b class="en">I, you, he, she, it, we, they</b> (فاعل)<br><b class="en">me, you, him, her, it, us, them</b> (مفعول)<br><b class="en">my, your, his, her, its, our, their</b> (ملكية)`,
 ex:[['Sara is kind. **She** helps **me**.','هي تساعدني','👧'],['Tom has a dog. **His** dog is big.','كلبه كبير','🐶'],['The children play. **They** are happy.','هم سعداء','👫'],['I gave the book to **them**.','أعطيتهم الكتاب','📕']],
 items:[B('Ali is my friend. ___ is funny. 👦','He',['She','They']),B('Mum made a cake for ___ . 🍰','us',['we','our']),B('The cats are hungry. Feed ___ ! 🐱','them',['they','their']),B('Sara lost ___ pencil. ✏️','her',['his','she']),B('Tom and I are friends. ___ play together. 👬','We',['Us','Our']),
  B('The dog wagged ___ tail. 🐶','its',['it','his']),B('This is Sam. I like ___ . 🙂','him',['he','his']),B('The children took ___ bags. 🎒','their',['there','them']),B('Can you help ___ , please? 🙋','me',['I','my']),B('My sister and ___ went shopping. 🛍️','I',['me','my']),
  B('Is this ___ coat? 👉','your',['you','you\'re']),B('The girls said ___ were tired. 🥱','they',['them','their'])]},

{id:'y3_spelling', year:3, icon:'🏅', title:'كلمات الإملاء Year 3/4', en:'Statutory spelling words', spelling:true,
 rule:`قائمة الكلمات المقرّرة على Year 3 و Year 4 في المنهج البريطاني. تدرّب على 10 كلمات كل أسبوع. 💡 قسّم الكلمة الطويلة لمقاطع: <b class="en">Feb-ru-ar-y</b>، <b class="en">diff-i-cult</b>`,
 words:['accident','actually','address','answer','appear','believe','breath','build','busy','calendar','caught','centre','century','certain','circle','complete','consider','continue','decide','describe','different','difficult','disappear','early','earth','eight','enough','exercise','experience','famous','favourite','February','forward','fruit','grammar','group','guard','guide','heard','heart','height','history','imagine','important','increase','island','knowledge','learn','library','minute','natural','naughty','notice','often','opposite','ordinary','perhaps','popular','possible','potatoes','probably','promise','quarter','question','remember','sentence','separate','special','straight','strange','strength','surprise','therefore','though','thought','through','various','weight','woman','women']},
];

// قصص للقراءة والفهم — Year 2 و Year 3
const READING = [
 {year:2, title:'The Lost Kite', pic:'🪁', lines:[
   ['It was a windy day, so Lily took her red kite to the park.','كان يوماً عاصفاً، فأخذت ليلي طائرتها الورقية الحمراء إلى الحديقة.','🌬️🪁'],
   ['The kite flew high above the trees.','طارت الطائرة الورقية عالياً فوق الأشجار.','🌳'],
   ['Suddenly, the string snapped and the kite flew away!','فجأة انقطع الخيط وطارت الطائرة بعيداً!','😱'],
   ['Lily was sad, but her brother Max had an idea.','حزنت ليلي، لكن أخاها ماكس خطرت له فكرة.','💡'],
   ['They followed the kite until they found it in an old oak tree.','تبعا الطائرة حتى وجداها في شجرة بلوط قديمة.','🌳'],
   ['Max climbed carefully and brought the kite down.','تسلّق ماكس بحذر وأنزل الطائرة.','🧗'],
   ['"Thank you!" said Lily, and she gave him a big hug.','قالت ليلي: "شكراً!" وعانقته بقوة.','🤗']],
  qs:[['What colour was the kite?',['red','blue','green'],0],['Why did the kite fly away?',['The string snapped.','Lily let it go.','A bird took it.'],0],['Where did they find the kite?',['in a tree','in a pond','on a roof'],0],['How did Max climb?',['carefully','quickly','sadly'],0],['How did Lily feel at the end?',['happy and thankful','angry','scared'],0]]},
 {year:2, title:'Tom\'s Busy Week', pic:'📅', lines:[
   ['On Monday, Tom went swimming with his class.','يوم الاثنين ذهب توم للسباحة مع صفه.','🏊'],
   ['On Tuesday, he painted a picture of a dragon.','يوم الثلاثاء رسم صورة تنين.','🐉'],
   ['On Wednesday, it rained, so he read a book inside.','يوم الأربعاء أمطرت، فقرأ كتاباً في الداخل.','📖🌧️'],
   ['On Thursday, he helped his grandad in the garden.','يوم الخميس ساعد جدّه في الحديقة.','👴🌻'],
   ['On Friday, he was very tired, but he was happy!','يوم الجمعة كان متعباً جداً، لكنه كان سعيداً!','😴😊']],
  qs:[['What did Tom do on Monday?',['He went swimming.','He read a book.','He painted.'],0],['What did Tom paint?',['a dragon','a dog','a tree'],0],['Why did Tom read inside on Wednesday?',['because it rained','because he was ill','because it was hot'],0],['Who did Tom help on Thursday?',['his grandad','his teacher','his sister'],0]]},
 {year:3, title:'The Brave Little Boat', pic:'⛵', lines:[
   ['In a busy harbour, there was a little wooden boat called Pip.','في ميناء مزدحم كان هناك قارب خشبي صغير اسمه پيپ.','⛵'],
   ['The big ships laughed at Pip because he was so small.','كانت السفن الكبيرة تضحك على پيپ لأنه صغير جداً.','🚢😂'],
   ['One stormy night, a fisherman\'s boat became stuck between some rocks.','في ليلة عاصفة علق قارب صياد بين بعض الصخور.','⛈️🪨'],
   ['The big ships were too large to sail between the rocks.','كانت السفن الكبيرة أضخم من أن تبحر بين الصخور.','🚫'],
   ['Although Pip was frightened, he bravely sailed through the waves.','مع أن پيپ كان خائفاً، أبحر بشجاعة عبر الأمواج.','🌊'],
   ['He reached the fisherman and pulled his boat to safety.','وصل إلى الصياد وسحب قاربه إلى بر الأمان.','🛟'],
   ['After that night, nobody ever laughed at Pip again.','بعد تلك الليلة لم يضحك أحد على پيپ أبداً.','🏅']],
  qs:[['What was Pip made of?',['wood','metal','plastic'],0],['Why did the big ships laugh at Pip?',['because he was small','because he was slow','because he was old'],0],['Why couldn\'t the big ships help?',['They were too large to fit between the rocks.','They were asleep.','They did not want to.'],0],['Which word shows how Pip sailed?',['bravely','slowly','sadly'],0],['What is the lesson of the story?',['Small people can do big things.','Big ships are always best.','Never go out at night.'],0]]},
 {year:3, title:'Amazing Bees', pic:'🐝', lines:[
   ['Bees are small insects, but they are very important.','النحل حشرات صغيرة لكنها مهمة جداً.','🐝'],
   ['They fly from flower to flower to collect nectar.','تطير من زهرة إلى زهرة لتجمع الرحيق.','🌸'],
   ['While they do this, they carry pollen, which helps plants to grow fruit.','وأثناء ذلك تنقل حبوب اللقاح التي تساعد النباتات على إنتاج الثمار.','🍎'],
   ['Bees live together in a hive. A hive can have thousands of bees!','يعيش النحل معاً في خلية. قد تضم الخلية آلاف النحلات!','🏠'],
   ['Each hive has one queen bee, who lays all the eggs.','لكل خلية ملكة واحدة تضع كل البيض.','👑'],
   ['Bees make honey to eat during the cold winter.','يصنع النحل العسل ليأكله في الشتاء البارد.','🍯❄️']],
  qs:[['What do bees collect from flowers?',['nectar','water','leaves'],0],['How do bees help plants?',['They carry pollen.','They water them.','They eat the bugs.'],0],['Where do bees live?',['in a hive','in a nest','in a cave'],0],['Who lays the eggs?',['the queen bee','all the bees','the farmer'],0],['Why do bees make honey?',['to eat in winter','to sell it','to build the hive'],0]]},
];
