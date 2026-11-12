/* ===== بيانات المنهج — مبنية على تسلسل الصوتيات البريطاني (Letters and Sounds) ===== */

// الحروف بترتيب تعليم الصوتيات البريطاني (Phase 2 ثم Phase 3)
// sound: تقريب لنطق الصوت (وليس اسم الحرف) لمحرك النطق
// action: حركة جسدية يقوم بها الطفل مع الصوت (تعلّم حركي)
const LETTERS = [
  {l:'s', sound:'sss', word:'sun', pic:'☀️', ar:'شمس', action:'حرّك يدك متعرجة مثل الأفعى وقل: سسسس 🐍', phase:2},
  {l:'a', sound:'a', word:'apple', pic:'🍎', ar:'تفاحة', action:'اقضم تفاحة وهمية وقل: آ آ 🍎', phase:2},
  {l:'t', sound:'t', word:'tiger', pic:'🐯', ar:'نمر', action:'حرّك رأسك يمين ويسار كأنك تشاهد التنس: ت ت ت', phase:2},
  {l:'p', sound:'p', word:'pig', pic:'🐷', ar:'خنزير', action:'انفخ على إصبعك كأنك تطفئ شمعة: پ پ پ 🕯️', phase:2},
  {l:'i', sound:'i', word:'insect', pic:'🐞', ar:'حشرة', action:'حرّك أصابعك على ذراعك كحشرة صغيرة: إ إ إ', phase:2},
  {l:'n', sound:'nnn', word:'nest', pic:'🪺', ar:'عش', action:'افرد ذراعيك كطائرة تطير: نننن ✈️', phase:2},
  {l:'m', sound:'mmm', word:'monkey', pic:'🐒', ar:'قرد', action:'افرك بطنك كأن الأكل لذيذ: ممممم 😋', phase:2},
  {l:'d', sound:'d', word:'dog', pic:'🐶', ar:'كلب', action:'اضرب بيديك على طبل وهمي: د د د 🥁', phase:2},
  {l:'g', sound:'g', word:'goat', pic:'🐐', ar:'ماعز', action:'حرّك يدك دوائر كماء يخرج من المغسلة: گ گ گ', phase:2},
  {l:'o', sound:'o', word:'octopus', pic:'🐙', ar:'أخطبوط', action:'حرّك ذراعيك كأرجل الأخطبوط: أو أو', phase:2},
  {l:'c', sound:'k', word:'cat', pic:'🐱', ar:'قطة', action:'افتح وأغلق يديك كالصنجات: ك ك ك', phase:2},
  {l:'k', sound:'k', word:'kite', pic:'🪁', ar:'طائرة ورقية', action:'ارفع يديك كأنك تمسك طائرة ورقية: ك ك', phase:2},
  {l:'e', sound:'e', word:'egg', pic:'🥚', ar:'بيضة', action:'اكسر بيضة وهمية على طرف الصحن: إيه إيه 🍳', phase:2},
  {l:'u', sound:'u', word:'umbrella', pic:'☂️', ar:'مظلة', action:'افتح مظلة وهمية فوق رأسك: أَ أَ ☂️', phase:2},
  {l:'r', sound:'rrr', word:'rabbit', pic:'🐰', ar:'أرنب', action:'كن جرواً يهز الخرقة بأسنانه: رررر', phase:2},
  {l:'h', sound:'h', word:'hat', pic:'🎩', ar:'قبعة', action:'ضع يدك أمام فمك كأنك تلهث بعد الجري: هه هه', phase:2},
  {l:'b', sound:'b', word:'ball', pic:'⚽', ar:'كرة', action:'اضرب كرة وهمية بمضرب: ب ب ب', phase:2},
  {l:'f', sound:'fff', word:'fish', pic:'🐟', ar:'سمكة', action:'اضغط يديك كأنك تفرغ هواء بالون: فففف 🎈', phase:2},
  {l:'l', sound:'lll', word:'lion', pic:'🦁', ar:'أسد', action:'العق مصاصة وهمية: لللل 🍭', phase:2},
  {l:'j', sound:'j', word:'jelly', pic:'🍮', ar:'جيلي', action:'اهتز كالجيلي: ج ج ج', phase:3},
  {l:'v', sound:'vvv', word:'van', pic:'🚐', ar:'شاحنة صغيرة', action:'امسك مقود سيارة وهمي: ڤڤڤڤ 🚐', phase:3},
  {l:'w', sound:'w', word:'whale', pic:'🐋', ar:'حوت', action:'انفخ على يدك كالريح: وو وو 🌬️', phase:3},
  {l:'x', sound:'ks', word:'box', pic:'📦', ar:'صندوق', action:'تظاهر بأخذ صورة أشعة: كس كس', phase:3},
  {l:'y', sound:'y', word:'yo-yo', pic:'🪀', ar:'يويو', action:'العب بيويو وهمي: يَ يَ يَ', phase:3},
  {l:'z', sound:'zzz', word:'zebra', pic:'🦓', ar:'حمار وحشي', action:'رفرف بذراعيك كالنحلة: زززز 🐝', phase:3},
  {l:'q', sound:'kw', word:'queen', pic:'👸', ar:'ملكة', action:'اصنع منقار بطة بيديك: كو كو 🦆', phase:3},
];

// الأصوات المركّبة (Digraphs & Trigraphs) — Phase 3 & 4/5
const DIGRAPHS = [
  {g:'sh', sound:'shh', words:['ship','fish','shop'], pic:'🚢', ar:'سفينة', action:'ضع إصبعك على فمك: شششش 🤫'},
  {g:'ch', sound:'ch', words:['chick','chair','lunch'], pic:'🐥', ar:'كتكوت', action:'حرّك ذراعيك كقطار: تش تش تش 🚂'},
  {g:'th', sound:'th', words:['three','thumb','bath'], pic:'👍', ar:'إبهام', action:'أخرج طرف لسانك قليلاً: ث ث'},
  {g:'ng', sound:'ng', words:['ring','king','sing'], pic:'💍', ar:'خاتم', action:'ارفع ذراعيك كرافع أثقال: نگگ'},
  {g:'ck', sound:'k', words:['duck','sock','clock'], pic:'🦆', ar:'بطة', action:'نقرتين بإصبعك على الطاولة: ك ك'},
  {g:'qu', sound:'kw', words:['queen','quilt','quack'], pic:'👑', ar:'تاج', action:'اصنع منقار بطة: كوو'},
  {g:'ai', sound:'ay', words:['rain','snail','train'], pic:'🌧️', ar:'مطر', action:'ضع يدك خلف أذنك: إيه؟ إي'},
  {g:'ee', sound:'ee', words:['tree','bee','sheep'], pic:'🌳', ar:'شجرة', action:'ضع يديك على رأسك كأذني حمار: إيي-أور'},
  {g:'igh', sound:'eye', words:['night','light','high'], pic:'🌙', ar:'ليل', action:'أشر إلى عينك: آي'},
  {g:'oa', sound:'oh', words:['boat','goat','coat'], pic:'⛵', ar:'قارب', action:'ضع يدك على فمك متفاجئاً: أوه!'},
  {g:'oo', sound:'oo', words:['moon','food','zoo'], pic:'🌕', ar:'قمر', action:'اصنع دائرة بيديك كالقمر: أوو'},
  {g:'ar', sound:'ar', words:['car','star','farm'], pic:'🚗', ar:'سيارة', action:'افتح فمك كالطبيب: آر'},
  {g:'or', sound:'or', words:['fork','horse','corn'], pic:'🍴', ar:'شوكة', action:'اصنع حركة التجديف: أور'},
  {g:'ur', sound:'er', words:['nurse','purse','turtle'], pic:'🐢', ar:'سلحفاة', action:'ادفع ببطء كالسلحفاة: أِر'},
  {g:'ow', sound:'ow', words:['cow','owl','town'], pic:'🐄', ar:'بقرة', action:'تظاهر أنك وقعت: آو!'},
  {g:'oi', sound:'oy', words:['coin','boil','soil'], pic:'🪙', ar:'عملة', action:'نادِ صديقك من بعيد: أوي!'},
  {g:'ear', sound:'ear', words:['ear','hear','beard'], pic:'👂', ar:'أذن', action:'المس أذنك: إيَر'},
  {g:'air', sound:'air', words:['hair','chair','fair'], pic:'💇', ar:'شعر', action:'المس شعرك: إيَر'},
  {g:'er', sound:'er', words:['letter','hammer','ladder'], pic:'🔨', ar:'مطرقة', action:'اطرق مطرقة وهمية: أَر'},
];

// الكلمات حسب المواضيع
const TOPICS = [
 {id:'animals', name:'الحيوانات', icon:'🦁', color:'#FF9F43', words:[
  ['cat','🐱','قطة'],['dog','🐶','كلب'],['fish','🐟','سمكة'],['bird','🐦','طائر'],['lion','🦁','أسد'],['tiger','🐯','نمر'],
  ['elephant','🐘','فيل'],['monkey','🐒','قرد'],['horse','🐴','حصان'],['cow','🐄','بقرة'],['sheep','🐑','خروف'],['goat','🐐','ماعز'],
  ['duck','🦆','بطة'],['hen','🐔','دجاجة'],['rabbit','🐰','أرنب'],['frog','🐸','ضفدع'],['bear','🐻','دب'],['camel','🐫','جمل'],
  ['zebra','🦓','حمار وحشي'],['giraffe','🦒','زرافة'],['snake','🐍','أفعى'],['owl','🦉','بومة'],['bee','🐝','نحلة'],['ant','🐜','نملة'],
  ['mouse','🐭','فأر'],['pig','🐷','خنزير'],['fox','🦊','ثعلب'],['whale','🐋','حوت'],['turtle','🐢','سلحفاة'],['butterfly','🦋','فراشة']]},
 {id:'colours', name:'الألوان', icon:'🎨', color:'#EE5A9B', words:[
  ['red','🟥','أحمر'],['blue','🟦','أزرق'],['green','🟩','أخضر'],['yellow','🟨','أصفر'],['orange','🟧','برتقالي'],['purple','🟪','بنفسجي'],
  ['pink','🌸','وردي'],['brown','🟫','بني'],['black','⬛','أسود'],['white','⬜','أبيض'],['grey','🐘','رمادي'],['gold','🥇','ذهبي']]},
 {id:'numbers', name:'الأرقام', icon:'🔢', color:'#5F27CD', words:[
  ['one','1️⃣','واحد'],['two','2️⃣','اثنان'],['three','3️⃣','ثلاثة'],['four','4️⃣','أربعة'],['five','5️⃣','خمسة'],['six','6️⃣','ستة'],
  ['seven','7️⃣','سبعة'],['eight','8️⃣','ثمانية'],['nine','9️⃣','تسعة'],['ten','🔟','عشرة'],['eleven','11','أحد عشر'],['twelve','12','اثنا عشر'],
  ['twenty','20','عشرون'],['hundred','💯','مئة']]},
 {id:'fruit', name:'الفواكه والخضار', icon:'🍓', color:'#10AC84', words:[
  ['apple','🍎','تفاحة'],['banana','🍌','موزة'],['orange','🍊','برتقالة'],['grapes','🍇','عنب'],['strawberry','🍓','فراولة'],['watermelon','🍉','بطيخ'],
  ['lemon','🍋','ليمون'],['pear','🍐','كمثرى'],['cherry','🍒','كرز'],['peach','🍑','خوخ'],['mango','🥭','مانجو'],['pineapple','🍍','أناناس'],
  ['carrot','🥕','جزر'],['tomato','🍅','طماطم'],['potato','🥔','بطاطا'],['corn','🌽','ذرة'],['onion','🧅','بصل'],['cucumber','🥒','خيار']]},
 {id:'food', name:'الطعام والشراب', icon:'🍕', color:'#FF6B6B', words:[
  ['bread','🍞','خبز'],['milk','🥛','حليب'],['water','💧','ماء'],['egg','🥚','بيضة'],['cheese','🧀','جبن'],['rice','🍚','أرز'],
  ['pizza','🍕','بيتزا'],['cake','🍰','كعكة'],['juice','🧃','عصير'],['soup','🍲','حساء'],['chicken','🍗','دجاج'],['ice cream','🍦','آيس كريم'],
  ['sandwich','🥪','شطيرة'],['honey','🍯','عسل'],['tea','🍵','شاي'],['biscuit','🍪','بسكويت']]},
 {id:'family', name:'العائلة', icon:'👨‍👩‍👧', color:'#F368E0', words:[
  ['mum','👩','أمي'],['dad','👨','أبي'],['sister','👧','أخت'],['brother','👦','أخ'],['baby','👶','رضيع'],['grandma','👵','جدة'],
  ['grandad','👴','جد'],['family','👨‍👩‍👧‍👦','عائلة'],['friend','🧑‍🤝‍🧑','صديق'],['teacher','🧑‍🏫','معلم'],['boy','👦','ولد'],['girl','👧','بنت']]},
 {id:'body', name:'جسمي', icon:'🖐️', color:'#FECA57', words:[
  ['head','🗣️','رأس'],['eye','👁️','عين'],['ear','👂','أذن'],['nose','👃','أنف'],['mouth','👄','فم'],['hand','✋','يد'],
  ['foot','🦶','قدم'],['leg','🦵','ساق'],['arm','💪','ذراع'],['hair','💇','شعر'],['tooth','🦷','سن'],['finger','☝️','إصبع']]},
 {id:'clothes', name:'الملابس', icon:'👕', color:'#48DBFB', words:[
  ['shirt','👕','قميص'],['dress','👗','فستان'],['hat','👒','قبعة'],['shoes','👟','حذاء'],['socks','🧦','جوارب'],['coat','🧥','معطف'],
  ['trousers','👖','بنطال'],['gloves','🧤','قفازات'],['scarf','🧣','وشاح'],['bag','🎒','حقيبة'],['glasses','👓','نظارة'],['boots','👢','جزمة']]},
 {id:'home', name:'البيت', icon:'🏠', color:'#FF9FF3', words:[
  ['house','🏠','بيت'],['door','🚪','باب'],['window','🪟','نافذة'],['bed','🛏️','سرير'],['chair','🪑','كرسي'],['table','🍽️','طاولة'],
  ['sofa','🛋️','أريكة'],['lamp','💡','مصباح'],['clock','⏰','ساعة'],['key','🔑','مفتاح'],['bath','🛁','حوض'],['cup','☕','كوب'],
  ['spoon','🥄','ملعقة'],['phone','📱','هاتف'],['tv','📺','تلفاز'],['mirror','🪞','مرآة']]},
 {id:'school', name:'المدرسة', icon:'🏫', color:'#54A0FF', words:[
  ['book','📕','كتاب'],['pen','🖊️','قلم حبر'],['pencil','✏️','قلم رصاص'],['ruler','📏','مسطرة'],['school','🏫','مدرسة'],['paper','📄','ورقة'],
  ['scissors','✂️','مقص'],['crayon','🖍️','قلم تلوين'],['computer','💻','حاسوب'],['desk','🗄️','مكتب'],['board','🧑‍🏫','سبورة'],['glue','🧴','صمغ']]},
 {id:'transport', name:'المواصلات', icon:'🚗', color:'#1DD1A1', words:[
  ['car','🚗','سيارة'],['bus','🚌','حافلة'],['train','🚆','قطار'],['plane','✈️','طائرة'],['boat','⛵','قارب'],['ship','🚢','سفينة'],
  ['bike','🚲','دراجة'],['taxi','🚕','تاكسي'],['lorry','🚚','شاحنة'],['rocket','🚀','صاروخ'],['helicopter','🚁','مروحية'],['tractor','🚜','جرار']]},
 {id:'nature', name:'الطبيعة والطقس', icon:'🌈', color:'#00D2D3', words:[
  ['sun','☀️','شمس'],['moon','🌙','قمر'],['star','⭐','نجمة'],['cloud','☁️','غيمة'],['rain','🌧️','مطر'],['snow','❄️','ثلج'],
  ['wind','🌬️','رياح'],['rainbow','🌈','قوس قزح'],['tree','🌳','شجرة'],['flower','🌸','زهرة'],['sea','🌊','بحر'],['mountain','⛰️','جبل'],
  ['hot','🥵','حار'],['cold','🥶','بارد'],['sunny','🌞','مشمس'],['fire','🔥','نار']]},
 {id:'actions', name:'الأفعال (حركة!)', icon:'🏃', color:'#FF7F50', words:[
  ['run','🏃','يركض'],['jump','🤸','يقفز'],['swim','🏊','يسبح'],['eat','🍽️','يأكل'],['drink','🥤','يشرب'],['sleep','😴','ينام'],
  ['read','📖','يقرأ'],['write','✍️','يكتب'],['sing','🎤','يغني'],['dance','💃','يرقص'],['clap','👏','يصفق'],['walk','🚶','يمشي'],
  ['climb','🧗','يتسلق'],['draw','🎨','يرسم'],['play','⚽','يلعب'],['wash','🧼','يغسل'],['cry','😢','يبكي'],['laugh','😂','يضحك']]},
 {id:'feelings', name:'المشاعر', icon:'😊', color:'#FFC312', words:[
  ['happy','😊','سعيد'],['sad','😢','حزين'],['angry','😠','غاضب'],['scared','😨','خائف'],['tired','🥱','متعب'],['hungry','😋','جائع'],
  ['sick','🤒','مريض'],['surprised','😲','متفاجئ'],['silly','🤪','مضحك'],['proud','🥹','فخور']]},
 {id:'opposites', name:'الأضداد', icon:'↔️', color:'#A3CB38', words:[
  ['big','🐘','كبير'],['small','🐭','صغير'],['fast','🐆','سريع'],['slow','🐌','بطيء'],['up','⬆️','فوق'],['down','⬇️','تحت'],
  ['open','📖','مفتوح'],['closed','📕','مغلق'],['day','🌞','نهار'],['night','🌚','ليل'],['tall','🦒','طويل'],['short','🐧','قصير']]},
];

// الكلمات الصعبة (Common Exception / Tricky Words) — المنهج البريطاني Year 1
const TRICKY = ['I','the','to','no','go','into','he','she','we','me','be','was','my','you','they','her','all','are',
 'said','have','like','so','do','some','come','were','there','little','one','when','out','what','says','here','today',
 'friend','school','put','push','pull','full','house','our','your','by','one','once','ask'];

// جمل وعبارات للمحادثة (Year 1 - Year 2)
const PHRASES = [
 {cat:'التحية 👋', items:[
  ['Hello!','مرحباً!'],['Good morning!','صباح الخير!'],['Good night!','تصبح على خير!'],['Goodbye!','مع السلامة!'],
  ['How are you?','كيف حالك؟'],['I am fine, thank you.','أنا بخير، شكراً.'],['What is your name?','ما اسمك؟'],['My name is Sara.','اسمي سارة.'],
  ['Nice to meet you.','سعيد بلقائك.'],['How old are you?','كم عمرك؟'],['I am seven.','عمري سبع سنوات.']]},
 {cat:'الأدب 🙏', items:[
  ['Please.','من فضلك.'],['Thank you.','شكراً لك.'],['You are welcome.','عفواً.'],['Sorry.','آسف.'],['Excuse me.','لو سمحت.'],['Can I help you?','هل أساعدك؟']]},
 {cat:'في الصف 🏫', items:[
  ['Sit down, please.','اجلس من فضلك.'],['Stand up, please.','قف من فضلك.'],['Open your book.','افتح كتابك.'],['Close your book.','أغلق كتابك.'],
  ['Listen!','استمع!'],['Look!','انظر!'],['Can I go to the toilet?','هل أذهب إلى الحمام؟'],['I don\'t understand.','لا أفهم.'],
  ['Can you say it again?','هل تعيدها؟'],['I know!','أنا أعرف!'],['Raise your hand.','ارفع يدك.']]},
 {cat:'عن نفسي 🙋', items:[
  ['I like apples.','أحب التفاح.'],['I don\'t like snakes.','لا أحب الأفاعي.'],['I have a cat.','عندي قطة.'],['I can run fast.','أستطيع الركض بسرعة.'],
  ['My favourite colour is blue.','لوني المفضل الأزرق.'],['I am happy.','أنا سعيد.'],['I am hungry.','أنا جائع.'],['This is my mum.','هذه أمي.'],
  ['I live in a big house.','أعيش في بيت كبير.'],['I go to school.','أذهب إلى المدرسة.']]},
 {cat:'أسئلة ❓', items:[
  ['What is this?','ما هذا؟'],['It is a cat.','إنها قطة.'],['Where is the ball?','أين الكرة؟'],['The ball is under the table.','الكرة تحت الطاولة.'],
  ['What colour is it?','ما لونه؟'],['How many apples?','كم تفاحة؟'],['Do you like pizza?','هل تحب البيتزا؟'],['Yes, I do.','نعم، أحبها.'],['No, I don\'t.','لا، لا أحبها.'],
  ['What time is it?','كم الساعة؟'],['What day is it today?','ما اليوم؟']]},
];

// جمل للقراءة والترتيب (Sentence builder)
const SENTENCES = [
 'I can see a cat.','The dog is big.','I like red apples.','The sun is hot.','My mum is kind.','The fish can swim.',
 'I have a blue pen.','The bird is in the tree.','We go to school.','She can jump.','He is my brother.','The cat is on the mat.',
 'I am six.','It is a red bus.','The frog is green.','Look at the moon.','I can run fast.','The duck is in the pond.',
 'This is my book.','We play in the park.'
];

// القصص القصيرة (قراءة)
const STORIES = [
 {title:'The Red Hen', pic:'🐔', lines:[
   ['A red hen sat on a nest.','دجاجة حمراء جلست على عش.','🐔🪺'],
   ['Pop! Pop! Pop!','بوب! بوب! بوب!','💥'],
   ['Three little chicks!','ثلاثة كتاكيت صغيرة!','🐥🐥🐥'],
   ['The chicks said, "Cheep, cheep!"','قالت الكتاكيت: "صيو صيو!"','🎵'],
   ['The hen is happy.','الدجاجة سعيدة.','😊']]},
 {title:'Sam and the Sun', pic:'☀️', lines:[
   ['Sam is a boy.','سام ولد.','👦'],
   ['Sam can see the sun.','سام يرى الشمس.','☀️'],
   ['The sun is hot.','الشمس حارة.','🥵'],
   ['Sam gets a hat.','سام يأخذ قبعة.','🧢'],
   ['Sam has fun in the sun!','سام يستمتع تحت الشمس!','🏖️']]},
 {title:'The Big Fish', pic:'🐟', lines:[
   ['A little fish swims in the sea.','سمكة صغيرة تسبح في البحر.','🐠🌊'],
   ['A big fish comes. Oh no!','تأتي سمكة كبيرة. أوه لا!','🦈'],
   ['The little fish hides in a rock.','السمكة الصغيرة تختبئ في صخرة.','🪨'],
   ['The big fish swims away.','السمكة الكبيرة تسبح بعيداً.','👋'],
   ['The little fish is safe!','السمكة الصغيرة بأمان!','🎉']]},
 {title:'My Pet Cat', pic:'🐱', lines:[
   ['I have a pet cat.','عندي قطة أليفة.','🐱'],
   ['Her name is Tom.','اسمها توم.','🏷️'],
   ['Tom likes milk.','توم تحب الحليب.','🥛'],
   ['Tom sleeps on my bed.','توم تنام على سريري.','🛏️'],
   ['I love my cat!','أحب قطتي!','❤️']]},
];

// المستويات — خريطة التعلم من الصفر إلى التمكن
const LEVELS = [
 {n:1, title:'الحروف وأصواتها', en:'Letters & Sounds', icon:'🔤', view:'letters', year:'Reception'},
 {n:2, title:'كتابة الحروف', en:'Handwriting', icon:'✍️', view:'trace', year:'Reception'},
 {n:3, title:'الأصوات المركبة', en:'Digraphs', icon:'🔊', view:'digraphs', year:'Year 1'},
 {n:4, title:'الكلمات والصور', en:'Words', icon:'🖼️', view:'topics', year:'Year 1'},
 {n:5, title:'الكلمات الصعبة', en:'Tricky Words', icon:'⭐', view:'tricky', year:'Year 1'},
 {n:6, title:'التمارين', en:'Practice', icon:'📝', view:'exercises', year:'كل المستويات'},
 {n:7, title:'الألعاب', en:'Games', icon:'🎮', view:'games', year:'كل المستويات'},
 {n:8, title:'الجمل والمحادثة', en:'Speaking', icon:'💬', view:'phrases', year:'Year 1–2'},
 {n:9, title:'القصص والقراءة', en:'Stories', icon:'📚', view:'stories', year:'Year 2'},
 {n:10, title:'Year 2: القواعد والإملاء', en:'Grammar & Spelling', icon:'📗', view:'year/2', year:'Year 2'},
 {n:11, title:'Year 3: نحو الطلاقة', en:'Grammar, Spelling & Reading', icon:'📘', view:'year/3', year:'Year 3'},
 {n:12, title:'فيديوهات تعليمية', en:'Videos', icon:'📺', view:'videos', year:'مساند'},
];

const AVATARS = ['🦁','🐼','🦄','🐯','🐸','🐰','🦊','🐨','🐙','🦋','🐬','🚀'];
const STICKERS = ['🌟','🏆','🎖️','🦄','🌈','🍭','🎈','🚀','👑','💎','🐳','🦖','🍩','🎁','🌻','🐞'];
