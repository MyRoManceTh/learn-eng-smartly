-- Seed: Core A1 Lessons (Level 1)
-- Modules: core-a1-greetings(6), core-a1-numbers(5), core-a1-family(5),
--          core-a1-daily(6), core-a1-food(5), core-a1-places(5),
--          core-a1-shopping(5), core-a1-conversation(6)

SET search_path TO public;

DELETE FROM lessons WHERE module_id LIKE 'core-a1-%';

INSERT INTO lessons (level, lesson_order, title, title_thai, vocabulary, article_sentences, article_translation, image_prompt, quiz, is_published, module_id, topic)
VALUES

-- ==========================================
-- Module: core-a1-greetings (6 lessons)
-- ==========================================

-- Lesson 1
(1, 1, 'Hello! How Are You?', 'สวัสดี! เป็นยังไงบ้าง?',
'[{"word":"hello","phonetic":"เฮลโล","meaning":"สวัสดี","partOfSpeech":"interj."},{"word":"how are you","phonetic":"ฮาว อาร์ ยู","meaning":"เป็นยังไงบ้าง","partOfSpeech":"phr."},{"word":"fine","phonetic":"ไฟน์","meaning":"ดี / โอเค","partOfSpeech":"adj."},{"word":"thank you","phonetic":"แธงค์ยู","meaning":"ขอบคุณ","partOfSpeech":"phr."},{"word":"and you","phonetic":"แอนด์ ยู","meaning":"แล้วคุณล่ะ","partOfSpeech":"phr."},{"word":"great","phonetic":"เกรท","meaning":"ดีมาก","partOfSpeech":"adj."}]'::jsonb,
'[[{"english":"Hello!","thai":"เฮลโล!"},{"english":"My","thai":"มาย"},{"english":"name","thai":"เนม"},{"english":"is","thai":"อิส"},{"english":"Tom.","thai":"ทอม"}],[{"english":"How","thai":"ฮาว"},{"english":"are","thai":"อาร์"},{"english":"you?","thai":"ยู?"}],[{"english":"I","thai":"ไอ"},{"english":"am","thai":"แอม"},{"english":"fine,","thai":"ไฟน์,"},{"english":"thank","thai":"แธงค์"},{"english":"you.","thai":"ยู"}],[{"english":"And","thai":"แอนด์"},{"english":"you?","thai":"ยู?"}],[{"english":"I","thai":"ไอ"},{"english":"am","thai":"แอม"},{"english":"great!","thai":"เกรท!"}]]'::jsonb,
'สวัสดี! ฉันชื่อทอม เป็นยังไงบ้าง? ฉันดี ขอบคุณ แล้วคุณล่ะ? ฉันดีมาก!',
'Two cartoon students greeting each other at school, bright and friendly atmosphere',
'[{"question":"\"How are you?\" แปลว่าอะไร?","options":["ชื่ออะไร","เป็นยังไงบ้าง","อยู่ที่ไหน","ทำอะไร"],"correctIndex":1,"type":"vocab"},{"question":"\"Fine\" แปลว่าอะไร?","options":["แย่","ดี","เหนื่อย","หิว"],"correctIndex":1,"type":"vocab"},{"question":"ทอมตอบว่าอะไรเมื่อถูกถาม How are you?","options":["Hello","Great","Fine, thank you","And you?"],"correctIndex":2,"type":"comprehension"},{"question":"\"Great\" แปลว่าอะไร?","options":["โอเค","แย่","ดีมาก","พอใช้"],"correctIndex":2,"type":"comprehension"}]'::jsonb,
true, 'core-a1-greetings', 'Basic Greetings'),

-- Lesson 2
(1, 2, 'What Is Your Name?', 'ชื่ออะไร?',
'[{"word":"name","phonetic":"เนม","meaning":"ชื่อ","partOfSpeech":"n."},{"word":"my name is","phonetic":"มาย เนม อิส","meaning":"ฉันชื่อ","partOfSpeech":"phr."},{"word":"what","phonetic":"ว็อท","meaning":"อะไร","partOfSpeech":"pron."},{"word":"your","phonetic":"ยัวร์","meaning":"ของคุณ","partOfSpeech":"pron."},{"word":"nice to meet you","phonetic":"ไนซ์ ทู มีท ยู","meaning":"ยินดีที่ได้รู้จัก","partOfSpeech":"phr."},{"word":"too","phonetic":"ทู","meaning":"เช่นกัน","partOfSpeech":"adv."}]'::jsonb,
'[[{"english":"\"What","thai":"\"ว็อท"},{"english":"is","thai":"อิส"},{"english":"your","thai":"ยัวร์"},{"english":"name?\"","thai":"เนม?\""}],[{"english":"\"My","thai":"\"มาย"},{"english":"name","thai":"เนม"},{"english":"is","thai":"อิส"},{"english":"Amy.\"","thai":"เอมี่\""}],[{"english":"\"Nice","thai":"\"ไนซ์"},{"english":"to","thai":"ทู"},{"english":"meet","thai":"มีท"},{"english":"you!\"","thai":"ยู!\""}],[{"english":"\"Nice","thai":"\"ไนซ์"},{"english":"to","thai":"ทู"},{"english":"meet","thai":"มีท"},{"english":"you","thai":"ยู"},{"english":"too!\"","thai":"ทู!\""}]]'::jsonb,
'"ชื่ออะไร?" "ฉันชื่อเอมี่" "ยินดีที่ได้รู้จัก!" "ยินดีที่ได้รู้จักเช่นกัน!"',
'Two children introducing themselves, shaking hands, school setting, cartoon style',
'[{"question":"\"My name is\" แปลว่าอะไร?","options":["ชื่อของคุณ","ฉันชื่อ","ชื่อเขา","ชื่อเธอ"],"correctIndex":1,"type":"vocab"},{"question":"\"Nice to meet you\" แปลว่าอะไร?","options":["ลาก่อน","ขอบคุณ","ยินดีที่ได้รู้จัก","สวัสดี"],"correctIndex":2,"type":"vocab"},{"question":"เด็กผู้หญิงชื่ออะไร?","options":["Tom","Amy","Sam","Ann"],"correctIndex":1,"type":"comprehension"},{"question":"\"Too\" แปลว่าอะไร?","options":["มาก","เช่นกัน","แต่","และ"],"correctIndex":1,"type":"comprehension"}]'::jsonb,
true, 'core-a1-greetings', 'Introductions'),

-- Lesson 3
(1, 3, 'Good Morning, Good Evening', 'สวัสดีตอนเช้า ตอนเย็น',
'[{"word":"good morning","phonetic":"กู๊ด มอร์นิง","meaning":"สวัสดีตอนเช้า","partOfSpeech":"phr."},{"word":"good afternoon","phonetic":"กู๊ด อาฟเตอร์นูน","meaning":"สวัสดีตอนบ่าย","partOfSpeech":"phr."},{"word":"good evening","phonetic":"กู๊ด อีฟนิง","meaning":"สวัสดีตอนเย็น","partOfSpeech":"phr."},{"word":"good night","phonetic":"กู๊ด ไนท์","meaning":"ราตรีสวัสดิ์","partOfSpeech":"phr."},{"word":"teacher","phonetic":"ทีเชอร์","meaning":"ครู","partOfSpeech":"n."},{"word":"class","phonetic":"คลาส","meaning":"ชั้นเรียน","partOfSpeech":"n."}]'::jsonb,
'[[{"english":"Good","thai":"กู๊ด"},{"english":"morning,","thai":"มอร์นิง,"},{"english":"class!","thai":"คลาส!"}],[{"english":"Good","thai":"กู๊ด"},{"english":"morning,","thai":"มอร์นิง,"},{"english":"teacher!","thai":"ทีเชอร์!"}],[{"english":"Good","thai":"กู๊ด"},{"english":"afternoon,","thai":"อาฟเตอร์นูน,"},{"english":"everyone.","thai":"เอฟรีวัน"}],[{"english":"Good","thai":"กู๊ด"},{"english":"evening!","thai":"อีฟนิง!"},{"english":"How","thai":"ฮาว"},{"english":"was","thai":"วอส"},{"english":"your","thai":"ยัวร์"},{"english":"day?","thai":"เดย์?"}],[{"english":"Good","thai":"กู๊ด"},{"english":"night!","thai":"ไนท์!"},{"english":"Sleep","thai":"สลีป"},{"english":"well.","thai":"เวล"}]]'::jsonb,
'สวัสดีตอนเช้าชั้นเรียน! สวัสดีตอนเช้าครู! สวัสดีตอนบ่ายทุกคน สวัสดีตอนเย็น! วันนี้เป็นยังไงบ้าง? ราตรีสวัสดิ์! นอนหลับฝันดี',
'Classroom scene showing different times of day, teacher and students greeting, cartoon style',
'[{"question":"\"Good afternoon\" แปลว่าอะไร?","options":["สวัสดีตอนเช้า","สวัสดีตอนบ่าย","สวัสดีตอนเย็น","ราตรีสวัสดิ์"],"correctIndex":1,"type":"vocab"},{"question":"\"Teacher\" แปลว่าอะไร?","options":["นักเรียน","เพื่อน","ครู","พ่อแม่"],"correctIndex":2,"type":"vocab"},{"question":"ครูพูดว่าอะไรกับชั้นเรียนตอนเช้า?","options":["Good night","Good evening","Good morning","Good afternoon"],"correctIndex":2,"type":"comprehension"},{"question":"\"Good night\" ใช้เมื่อไหร่?","options":["ตอนเช้า","ตอนบ่าย","ตอนเย็น","ก่อนนอน"],"correctIndex":3,"type":"comprehension"}]'::jsonb,
true, 'core-a1-greetings', 'Time Greetings'),

-- Lesson 4
(1, 4, 'Where Are You From?', 'คุณมาจากไหน?',
'[{"word":"where","phonetic":"แวร์","meaning":"ที่ไหน","partOfSpeech":"adv."},{"word":"from","phonetic":"ฟรอม","meaning":"จาก","partOfSpeech":"prep."},{"word":"I am from","phonetic":"ไอ แอม ฟรอม","meaning":"ฉันมาจาก","partOfSpeech":"phr."},{"word":"Thailand","phonetic":"ไทแลนด์","meaning":"ประเทศไทย","partOfSpeech":"n."},{"word":"country","phonetic":"คันทรี","meaning":"ประเทศ","partOfSpeech":"n."},{"word":"live","phonetic":"ลิฟ","meaning":"อาศัยอยู่","partOfSpeech":"v."}]'::jsonb,
'[[{"english":"\"Where","thai":"\"แวร์"},{"english":"are","thai":"อาร์"},{"english":"you","thai":"ยู"},{"english":"from?\"","thai":"ฟรอม?\""}],[{"english":"\"I","thai":"\"ไอ"},{"english":"am","thai":"แอม"},{"english":"from","thai":"ฟรอม"},{"english":"Thailand.\"","thai":"ไทแลนด์\""}],[{"english":"\"I","thai":"\"ไอ"},{"english":"live","thai":"ลิฟ"},{"english":"in","thai":"อิน"},{"english":"Bangkok.\"","thai":"แบงค็อก\""}],[{"english":"\"What","thai":"\"ว็อท"},{"english":"country","thai":"คันทรี"},{"english":"are","thai":"อาร์"},{"english":"you","thai":"ยู"},{"english":"from?\"","thai":"ฟรอม?\""}],[{"english":"\"I","thai":"\"ไอ"},{"english":"am","thai":"แอม"},{"english":"from","thai":"ฟรอม"},{"english":"Japan.\"","thai":"เจแปน\""}]]'::jsonb,
'"คุณมาจากไหน?" "ฉันมาจากประเทศไทย" "ฉันอาศัยอยู่ที่กรุงเทพ" "คุณมาจากประเทศอะไร?" "ฉันมาจากญี่ปุ่น"',
'Two students from different countries talking, world map in background, cartoon style',
'[{"question":"\"Where are you from?\" แปลว่าอะไร?","options":["คุณชื่ออะไร","คุณอายุเท่าไหร่","คุณมาจากไหน","คุณอยู่ที่ไหน"],"correctIndex":2,"type":"vocab"},{"question":"\"Country\" แปลว่าอะไร?","options":["เมือง","ประเทศ","หมู่บ้าน","ทวีป"],"correctIndex":1,"type":"vocab"},{"question":"เด็กคนแรกมาจากที่ไหน?","options":["Japan","China","Thailand","Korea"],"correctIndex":2,"type":"comprehension"},{"question":"\"Live\" แปลว่าอะไร?","options":["ทำงาน","เรียน","อาศัยอยู่","เดินทาง"],"correctIndex":2,"type":"comprehension"}]'::jsonb,
true, 'core-a1-greetings', 'Where Are You From'),

-- Lesson 5
(1, 5, 'How Old Are You?', 'คุณอายุเท่าไหร่?',
'[{"word":"how old","phonetic":"ฮาว โอลด์","meaning":"อายุเท่าไหร่","partOfSpeech":"phr."},{"word":"years old","phonetic":"เยียร์ส โอลด์","meaning":"ขวบ / ปี","partOfSpeech":"phr."},{"word":"I am ... years old","phonetic":"ไอ แอม ... เยียร์ส โอลด์","meaning":"ฉันอายุ ... ปี","partOfSpeech":"phr."},{"word":"birthday","phonetic":"เบิร์ธเดย์","meaning":"วันเกิด","partOfSpeech":"n."},{"word":"when","phonetic":"เวน","meaning":"เมื่อไหร่","partOfSpeech":"adv."},{"word":"month","phonetic":"มันธ์","meaning":"เดือน","partOfSpeech":"n."}]'::jsonb,
'[[{"english":"\"How","thai":"\"ฮาว"},{"english":"old","thai":"โอลด์"},{"english":"are","thai":"อาร์"},{"english":"you?\"","thai":"ยู?\""}],[{"english":"\"I","thai":"\"ไอ"},{"english":"am","thai":"แอม"},{"english":"twelve","thai":"ทเวลฟ์"},{"english":"years","thai":"เยียร์ส"},{"english":"old.\"","thai":"โอลด์\""}],[{"english":"\"When","thai":"\"เวน"},{"english":"is","thai":"อิส"},{"english":"your","thai":"ยัวร์"},{"english":"birthday?\"","thai":"เบิร์ธเดย์?\""}],[{"english":"\"My","thai":"\"มาย"},{"english":"birthday","thai":"เบิร์ธเดย์"},{"english":"is","thai":"อิส"},{"english":"in","thai":"อิน"},{"english":"July.\"","thai":"จูไลย์\""}]]'::jsonb,
'"คุณอายุเท่าไหร่?" "ฉันอายุสิบสองปี" "วันเกิดของคุณเมื่อไหร่?" "วันเกิดของฉันอยู่ในเดือนกรกฎาคม"',
'Two kids talking about age and birthday, birthday cake in background, cartoon style',
'[{"question":"\"How old are you?\" แปลว่าอะไร?","options":["คุณชื่ออะไร","คุณอายุเท่าไหร่","คุณมาจากไหน","คุณอยู่ที่ไหน"],"correctIndex":1,"type":"vocab"},{"question":"\"Birthday\" แปลว่าอะไร?","options":["วันหยุด","วันเกิด","วันครบรอบ","วันสำคัญ"],"correctIndex":1,"type":"vocab"},{"question":"เด็กอายุเท่าไหร่?","options":["ten","eleven","twelve","thirteen"],"correctIndex":2,"type":"comprehension"},{"question":"วันเกิดอยู่ในเดือนอะไร?","options":["June","July","August","September"],"correctIndex":1,"type":"comprehension"}]'::jsonb,
true, 'core-a1-greetings', 'Age and Birthday'),

-- Lesson 6
(1, 6, 'Goodbye! See You Later!', 'ลาก่อน! แล้วเจอกัน!',
'[{"word":"goodbye","phonetic":"กู๊ดบาย","meaning":"ลาก่อน","partOfSpeech":"interj."},{"word":"see you later","phonetic":"ซี ยู เลเตอร์","meaning":"แล้วเจอกัน","partOfSpeech":"phr."},{"word":"see you tomorrow","phonetic":"ซี ยู ทูมอร์โรว์","meaning":"แล้วเจอกันพรุ่งนี้","partOfSpeech":"phr."},{"word":"take care","phonetic":"เทค แคร์","meaning":"ดูแลตัวเองด้วย","partOfSpeech":"phr."},{"word":"have a good day","phonetic":"แฮฟ อะ กู๊ด เดย์","meaning":"ขอให้มีวันที่ดี","partOfSpeech":"phr."},{"word":"you too","phonetic":"ยู ทู","meaning":"คุณเช่นกัน","partOfSpeech":"phr."}]'::jsonb,
'[[{"english":"\"Goodbye,","thai":"\"กู๊ดบาย,"},{"english":"Tom!\"","thai":"ทอม!\""}],[{"english":"\"See","thai":"\"ซี"},{"english":"you","thai":"ยู"},{"english":"tomorrow!\"","thai":"ทูมอร์โรว์!\""}],[{"english":"\"Have","thai":"\"แฮฟ"},{"english":"a","thai":"อะ"},{"english":"good","thai":"กู๊ด"},{"english":"day!\"","thai":"เดย์!\""}],[{"english":"\"You","thai":"\"ยู"},{"english":"too!","thai":"ทู!"},{"english":"Take","thai":"เทค"},{"english":"care!\"","thai":"แคร์!\""}]]'::jsonb,
'"ลาก่อน ทอม!" "แล้วเจอกันพรุ่งนี้!" "ขอให้มีวันที่ดี!" "คุณเช่นกัน! ดูแลตัวเองด้วย!"',
'Two students waving goodbye at school gate, afternoon setting, cartoon style',
'[{"question":"\"Goodbye\" แปลว่าอะไร?","options":["สวัสดี","ขอบคุณ","ลาก่อน","ยินดีที่ได้รู้จัก"],"correctIndex":2,"type":"vocab"},{"question":"\"Take care\" แปลว่าอะไร?","options":["ขอบคุณ","ลาก่อน","ดูแลตัวเองด้วย","แล้วเจอกัน"],"correctIndex":2,"type":"vocab"},{"question":"\"See you tomorrow\" แปลว่าอะไร?","options":["แล้วเจอกันภายหลัง","แล้วเจอกันพรุ่งนี้","แล้วเจอกันสัปดาห์หน้า","ลาก่อน"],"correctIndex":1,"type":"comprehension"},{"question":"\"Have a good day\" แปลว่าอะไร?","options":["ราตรีสวัสดิ์","ดูแลตัวเองด้วย","ขอให้มีวันที่ดี","แล้วเจอกัน"],"correctIndex":2,"type":"comprehension"}]'::jsonb,
true, 'core-a1-greetings', 'Saying Goodbye'),

-- ==========================================
-- Module: core-a1-numbers (5 lessons)
-- ==========================================

-- Lesson 1
(1, 1, 'Counting to 100', 'นับถึงร้อย',
'[{"word":"thirty","phonetic":"เธอร์ตี","meaning":"สามสิบ","partOfSpeech":"number"},{"word":"forty","phonetic":"ฟอร์ตี","meaning":"สี่สิบ","partOfSpeech":"number"},{"word":"fifty","phonetic":"ฟิฟตี","meaning":"ห้าสิบ","partOfSpeech":"number"},{"word":"hundred","phonetic":"ฮันเดรด","meaning":"ร้อย","partOfSpeech":"number"},{"word":"count","phonetic":"เคานท์","meaning":"นับ","partOfSpeech":"v."},{"word":"number","phonetic":"นัมเบอร์","meaning":"ตัวเลข","partOfSpeech":"n."}]'::jsonb,
'[[{"english":"Let","thai":"เลท"},{"english":"us","thai":"อัส"},{"english":"count","thai":"เคานท์"},{"english":"together.","thai":"ทูเกเธอร์"}],[{"english":"Ten,","thai":"เทน,"},{"english":"twenty,","thai":"ทเวนตี,"},{"english":"thirty,","thai":"เธอร์ตี,"},{"english":"forty.","thai":"ฟอร์ตี"}],[{"english":"Fifty,","thai":"ฟิฟตี,"},{"english":"sixty,","thai":"ซิกซ์ตี,"},{"english":"seventy,","thai":"เซเวนตี,"},{"english":"eighty.","thai":"เอทตี"}],[{"english":"Ninety,","thai":"ไนน์ตี,"},{"english":"one","thai":"วัน"},{"english":"hundred!","thai":"ฮันเดรด!"}]]'::jsonb,
'มาร่วมกันนับ สิบ ยี่สิบ สามสิบ สี่สิบ ห้าสิบ หกสิบ เจ็ดสิบ แปดสิบ เก้าสิบ หนึ่งร้อย!',
'Cartoon children counting numbers on a big board, colorful classroom setting',
'[{"question":"\"Fifty\" แปลว่าอะไร?","options":["สี่สิบ","ห้าสิบ","หกสิบ","เจ็ดสิบ"],"correctIndex":1,"type":"vocab"},{"question":"\"Hundred\" แปลว่าอะไร?","options":["สิบ","ยี่สิบ","ร้อย","พัน"],"correctIndex":2,"type":"vocab"},{"question":"หลังจาก ninety มาอะไร?","options":["eighty","seventy","one hundred","sixty"],"correctIndex":2,"type":"comprehension"},{"question":"\"Count\" แปลว่าอะไร?","options":["บวก","ลบ","นับ","คูณ"],"correctIndex":2,"type":"comprehension"}]'::jsonb,
true, 'core-a1-numbers', 'Counting to 100'),

-- Lesson 2
(1, 2, 'How Much Does It Cost?', 'ราคาเท่าไหร่?',
'[{"word":"how much","phonetic":"ฮาว มัช","meaning":"เท่าไหร่","partOfSpeech":"phr."},{"word":"price","phonetic":"ไพรซ์","meaning":"ราคา","partOfSpeech":"n."},{"word":"baht","phonetic":"บาท","meaning":"บาท","partOfSpeech":"n."},{"word":"dollar","phonetic":"ดอลลาร์","meaning":"ดอลลาร์","partOfSpeech":"n."},{"word":"cheap","phonetic":"ชีพ","meaning":"ถูก","partOfSpeech":"adj."},{"word":"expensive","phonetic":"อิกซ์เพนซิฟ","meaning":"แพง","partOfSpeech":"adj."}]'::jsonb,
'[[{"english":"\"How","thai":"\"ฮาว"},{"english":"much","thai":"มัช"},{"english":"is","thai":"อิส"},{"english":"this?\"","thai":"ดิส?\""}],[{"english":"\"It","thai":"\"อิท"},{"english":"is","thai":"อิส"},{"english":"fifty","thai":"ฟิฟตี"},{"english":"baht.\"","thai":"บาท\""}],[{"english":"\"That","thai":"\"แดท"},{"english":"is","thai":"อิส"},{"english":"cheap!\"","thai":"ชีพ!\""}],[{"english":"\"This","thai":"\"ดิส"},{"english":"bag","thai":"แบก"},{"english":"is","thai":"อิส"},{"english":"five","thai":"ไฟว์"},{"english":"hundred","thai":"ฮันเดรด"},{"english":"baht.","thai":"บาท"},{"english":"It","thai":"อิท"},{"english":"is","thai":"อิส"},{"english":"expensive.\"","thai":"อิกซ์เพนซิฟ\""}]]'::jsonb,
'"ราคาเท่าไหร่?" "ห้าสิบบาท" "ถูกมาก!" "กระเป๋าใบนี้ห้าร้อยบาท มันแพง"',
'Market scene with price tags, cartoon style, colorful Thai market',
'[{"question":"\"How much?\" แปลว่าอะไร?","options":["กี่ชิ้น","เท่าไหร่","อะไร","ที่ไหน"],"correctIndex":1,"type":"vocab"},{"question":"\"Expensive\" แปลว่าอะไร?","options":["ถูก","ฟรี","แพง","ลดราคา"],"correctIndex":2,"type":"vocab"},{"question":"ของชิ้นแรกราคาเท่าไหร่?","options":["30 baht","50 baht","100 baht","500 baht"],"correctIndex":1,"type":"comprehension"},{"question":"กระเป๋าราคาเท่าไหร่?","options":["50 baht","100 baht","500 baht","1000 baht"],"correctIndex":2,"type":"comprehension"}]'::jsonb,
true, 'core-a1-numbers', 'Prices and Money'),

-- Lesson 3
(1, 3, 'What Time Is It?', 'กี่โมงแล้ว?',
'[{"word":"what time","phonetic":"ว็อท ไทม์","meaning":"กี่โมง","partOfSpeech":"phr."},{"word":"o''clock","phonetic":"โอคล็อค","meaning":"นาฬิกา (ตรง)","partOfSpeech":"phr."},{"word":"half past","phonetic":"ฮาฟ พาสท์","meaning":"ครึ่ง (30 นาที)","partOfSpeech":"phr."},{"word":"morning","phonetic":"มอร์นิง","meaning":"ตอนเช้า","partOfSpeech":"n."},{"word":"afternoon","phonetic":"อาฟเตอร์นูน","meaning":"ตอนบ่าย","partOfSpeech":"n."},{"word":"evening","phonetic":"อีฟนิง","meaning":"ตอนเย็น","partOfSpeech":"n."}]'::jsonb,
'[[{"english":"\"What","thai":"\"ว็อท"},{"english":"time","thai":"ไทม์"},{"english":"is","thai":"อิส"},{"english":"it?\"","thai":"อิท?\""}],[{"english":"\"It","thai":"\"อิท"},{"english":"is","thai":"อิส"},{"english":"eight","thai":"เอท"},{"english":"o''clock","thai":"โอคล็อค"},{"english":"in","thai":"อิน"},{"english":"the","thai":"เดอะ"},{"english":"morning.\"","thai":"มอร์นิง\""}],[{"english":"School","thai":"สคูล"},{"english":"starts","thai":"สตาร์ทส์"},{"english":"at","thai":"แอท"},{"english":"eight","thai":"เอท"},{"english":"thirty.","thai":"เธอร์ตี"}],[{"english":"Lunch","thai":"ลันช์"},{"english":"is","thai":"อิส"},{"english":"at","thai":"แอท"},{"english":"twelve","thai":"ทเวลฟ์"},{"english":"o''clock.","thai":"โอคล็อค"}]]'::jsonb,
'"กี่โมงแล้ว?" "แปดโมงเช้า" โรงเรียนเริ่มแปดโมงครึ่ง อาหารกลางวันตอนเที่ยงตรง',
'Clock showing different times, school schedule, cartoon style',
'[{"question":"\"What time is it?\" แปลว่าอะไร?","options":["วันนี้วันอะไร","กี่โมงแล้ว","อยู่ที่ไหน","ทำอะไร"],"correctIndex":1,"type":"vocab"},{"question":"\"Morning\" แปลว่าอะไร?","options":["ตอนเย็น","ตอนกลางคืน","ตอนเช้า","ตอนบ่าย"],"correctIndex":2,"type":"vocab"},{"question":"โรงเรียนเริ่มกี่โมง?","options":["7:00","7:30","8:00","8:30"],"correctIndex":3,"type":"comprehension"},{"question":"อาหารกลางวันกี่โมง?","options":["11:00","11:30","12:00","12:30"],"correctIndex":2,"type":"comprehension"}]'::jsonb,
true, 'core-a1-numbers', 'Telling Time'),

-- Lesson 4
(1, 4, 'Days of the Week', 'วันในสัปดาห์',
'[{"word":"Monday","phonetic":"มันเดย์","meaning":"วันจันทร์","partOfSpeech":"n."},{"word":"Wednesday","phonetic":"เวนส์เดย์","meaning":"วันพุธ","partOfSpeech":"n."},{"word":"Friday","phonetic":"ไฟรเดย์","meaning":"วันศุกร์","partOfSpeech":"n."},{"word":"weekend","phonetic":"วีคเอนด์","meaning":"วันหยุดสุดสัปดาห์","partOfSpeech":"n."},{"word":"today","phonetic":"ทูเดย์","meaning":"วันนี้","partOfSpeech":"n."},{"word":"tomorrow","phonetic":"ทูมอร์โรว์","meaning":"พรุ่งนี้","partOfSpeech":"n."}]'::jsonb,
'[[{"english":"Today","thai":"ทูเดย์"},{"english":"is","thai":"อิส"},{"english":"Monday.","thai":"มันเดย์"}],[{"english":"Tomorrow","thai":"ทูมอร์โรว์"},{"english":"is","thai":"อิส"},{"english":"Tuesday.","thai":"ทิวส์เดย์"}],[{"english":"I","thai":"ไอ"},{"english":"like","thai":"ไลค์"},{"english":"Friday","thai":"ไฟรเดย์"},{"english":"because","thai":"บีคอส"},{"english":"it","thai":"อิท"},{"english":"is","thai":"อิส"},{"english":"the","thai":"เดอะ"},{"english":"weekend!","thai":"วีคเอนด์!"}],[{"english":"Saturday","thai":"แซทเทอร์เดย์"},{"english":"and","thai":"แอนด์"},{"english":"Sunday","thai":"ซันเดย์"},{"english":"are","thai":"อาร์"},{"english":"my","thai":"มาย"},{"english":"favorite","thai":"เฟเวอริท"},{"english":"days.","thai":"เดย์ส"}]]'::jsonb,
'วันนี้วันจันทร์ พรุ่งนี้วันอังคาร ฉันชอบวันศุกร์เพราะเป็นวันหยุดสุดสัปดาห์! วันเสาร์และวันอาทิตย์เป็นวันที่ฉันชอบที่สุด',
'Weekly calendar with cartoon activities for each day, colorful and fun',
'[{"question":"\"Monday\" แปลว่าอะไร?","options":["วันอาทิตย์","วันจันทร์","วันอังคาร","วันพุธ"],"correctIndex":1,"type":"vocab"},{"question":"\"Weekend\" แปลว่าอะไร?","options":["วันธรรมดา","วันหยุดสุดสัปดาห์","วันหยุดนักขัตฤกษ์","วันเกิด"],"correctIndex":1,"type":"vocab"},{"question":"วันนี้วันอะไร?","options":["Sunday","Monday","Tuesday","Wednesday"],"correctIndex":1,"type":"comprehension"},{"question":"วันหยุดสุดสัปดาห์คือวันอะไรบ้าง?","options":["Mon-Tue","Fri-Sat","Sat-Sun","Thu-Fri"],"correctIndex":2,"type":"comprehension"}]'::jsonb,
true, 'core-a1-numbers', 'Days of the Week'),

-- Lesson 5
(1, 5, 'Months and Seasons', 'เดือนและฤดูกาล',
'[{"word":"January","phonetic":"แจนนิวแอรี","meaning":"มกราคม","partOfSpeech":"n."},{"word":"month","phonetic":"มันธ์","meaning":"เดือน","partOfSpeech":"n."},{"word":"season","phonetic":"ซีซัน","meaning":"ฤดูกาล","partOfSpeech":"n."},{"word":"summer","phonetic":"ซัมเมอร์","meaning":"ฤดูร้อน","partOfSpeech":"n."},{"word":"winter","phonetic":"วินเตอร์","meaning":"ฤดูหนาว","partOfSpeech":"n."},{"word":"year","phonetic":"เยียร์","meaning":"ปี","partOfSpeech":"n."}]'::jsonb,
'[[{"english":"There","thai":"แดร์"},{"english":"are","thai":"อาร์"},{"english":"twelve","thai":"ทเวลฟ์"},{"english":"months","thai":"มันธ์ส"},{"english":"in","thai":"อิน"},{"english":"a","thai":"อะ"},{"english":"year.","thai":"เยียร์"}],[{"english":"January","thai":"แจนนิวแอรี"},{"english":"is","thai":"อิส"},{"english":"the","thai":"เดอะ"},{"english":"first","thai":"เฟิร์สท์"},{"english":"month.","thai":"มันธ์"}],[{"english":"Summer","thai":"ซัมเมอร์"},{"english":"is","thai":"อิส"},{"english":"hot","thai":"ฮ็อท"},{"english":"and","thai":"แอนด์"},{"english":"sunny.","thai":"ซันนี"}],[{"english":"Winter","thai":"วินเตอร์"},{"english":"is","thai":"อิส"},{"english":"cold","thai":"โคลด์"},{"english":"and","thai":"แอนด์"},{"english":"snowy.","thai":"สโนวี"}]]'::jsonb,
'ในหนึ่งปีมีสิบสองเดือน มกราคมเป็นเดือนแรก ฤดูร้อนร้อนและมีแดด ฤดูหนาวหนาวและมีหิมะ',
'Four seasons shown in cartoon panels, colorful nature scenes',
'[{"question":"\"Season\" แปลว่าอะไร?","options":["เดือน","ปี","ฤดูกาล","สัปดาห์"],"correctIndex":2,"type":"vocab"},{"question":"\"Winter\" แปลว่าอะไร?","options":["ฤดูร้อน","ฤดูใบไม้ร่วง","ฤดูหนาว","ฤดูใบไม้ผลิ"],"correctIndex":2,"type":"vocab"},{"question":"ในหนึ่งปีมีกี่เดือน?","options":["ten","eleven","twelve","thirteen"],"correctIndex":2,"type":"comprehension"},{"question":"ฤดูร้อนเป็นยังไง?","options":["cold and snowy","hot and sunny","windy and rainy","cool and cloudy"],"correctIndex":1,"type":"comprehension"}]'::jsonb,
true, 'core-a1-numbers', 'Months and Seasons'),

-- ==========================================
-- Module: core-a1-family (5 lessons)
-- ==========================================

-- Lesson 1
(1, 1, 'My Family', 'ครอบครัวของฉัน',
'[{"word":"family","phonetic":"แฟมิลี","meaning":"ครอบครัว","partOfSpeech":"n."},{"word":"mother","phonetic":"มาเธอร์","meaning":"แม่","partOfSpeech":"n."},{"word":"father","phonetic":"ฟาเธอร์","meaning":"พ่อ","partOfSpeech":"n."},{"word":"sister","phonetic":"ซิสเตอร์","meaning":"พี่สาว/น้องสาว","partOfSpeech":"n."},{"word":"brother","phonetic":"บราเธอร์","meaning":"พี่ชาย/น้องชาย","partOfSpeech":"n."},{"word":"love","phonetic":"ลัฟ","meaning":"รัก","partOfSpeech":"v."}]'::jsonb,
'[[{"english":"This","thai":"ดิส"},{"english":"is","thai":"อิส"},{"english":"my","thai":"มาย"},{"english":"family.","thai":"แฟมิลี"}],[{"english":"My","thai":"มาย"},{"english":"mother","thai":"มาเธอร์"},{"english":"is","thai":"อิส"},{"english":"kind.","thai":"ไคนด์"}],[{"english":"My","thai":"มาย"},{"english":"father","thai":"ฟาเธอร์"},{"english":"is","thai":"อิส"},{"english":"tall.","thai":"ทอล"}],[{"english":"I","thai":"ไอ"},{"english":"have","thai":"แฮฟ"},{"english":"one","thai":"วัน"},{"english":"sister","thai":"ซิสเตอร์"},{"english":"and","thai":"แอนด์"},{"english":"one","thai":"วัน"},{"english":"brother.","thai":"บราเธอร์"}],[{"english":"I","thai":"ไอ"},{"english":"love","thai":"ลัฟ"},{"english":"my","thai":"มาย"},{"english":"family!","thai":"แฟมิลี!"}]]'::jsonb,
'นี่คือครอบครัวของฉัน แม่ของฉันใจดี พ่อของฉันสูง ฉันมีพี่สาวหนึ่งคนและพี่ชายหนึ่งคน ฉันรักครอบครัวของฉัน!',
'Happy cartoon family portrait with parents and two children, warm home setting',
'[{"question":"\"Mother\" แปลว่าอะไร?","options":["พ่อ","แม่","พี่สาว","น้องชาย"],"correctIndex":1,"type":"vocab"},{"question":"\"Brother\" แปลว่าอะไร?","options":["พี่สาว","น้องสาว","พี่ชาย/น้องชาย","ลูกพี่ลูกน้อง"],"correctIndex":2,"type":"vocab"},{"question":"พ่อเป็นยังไง?","options":["kind","short","tall","funny"],"correctIndex":2,"type":"comprehension"},{"question":"ฉันมีพี่น้องกี่คน?","options":["one","two","three","four"],"correctIndex":1,"type":"comprehension"}]'::jsonb,
true, 'core-a1-family', 'My Family'),

-- Lesson 2
(1, 2, 'Grandparents and Relatives', 'ปู่ย่าตายายและญาติ',
'[{"word":"grandfather","phonetic":"แกรนด์ฟาเธอร์","meaning":"ปู่/ตา","partOfSpeech":"n."},{"word":"grandmother","phonetic":"แกรนด์มาเธอร์","meaning":"ย่า/ยาย","partOfSpeech":"n."},{"word":"uncle","phonetic":"อังเคิล","meaning":"ลุง/น้า/อา","partOfSpeech":"n."},{"word":"aunt","phonetic":"อานท์","meaning":"ป้า/น้า/อา","partOfSpeech":"n."},{"word":"cousin","phonetic":"คัสซิน","meaning":"ลูกพี่ลูกน้อง","partOfSpeech":"n."},{"word":"old","phonetic":"โอลด์","meaning":"แก่/เก่า","partOfSpeech":"adj."}]'::jsonb,
'[[{"english":"My","thai":"มาย"},{"english":"grandfather","thai":"แกรนด์ฟาเธอร์"},{"english":"is","thai":"อิส"},{"english":"seventy","thai":"เซเวนตี"},{"english":"years","thai":"เยียร์ส"},{"english":"old.","thai":"โอลด์"}],[{"english":"My","thai":"มาย"},{"english":"grandmother","thai":"แกรนด์มาเธอร์"},{"english":"cooks","thai":"คุ๊คส์"},{"english":"very","thai":"เวรี"},{"english":"well.","thai":"เวล"}],[{"english":"I","thai":"ไอ"},{"english":"have","thai":"แฮฟ"},{"english":"three","thai":"ทรี"},{"english":"cousins.","thai":"คัสซินส์"}],[{"english":"We","thai":"วี"},{"english":"visit","thai":"วิซิท"},{"english":"our","thai":"เอาร์"},{"english":"grandparents","thai":"แกรนด์แพเรนทส์"},{"english":"every","thai":"เอฟรี"},{"english":"Sunday.","thai":"ซันเดย์"}]]'::jsonb,
'ปู่ของฉันอายุเจ็ดสิบปี ย่าของฉันทำอาหารเก่งมาก ฉันมีลูกพี่ลูกน้องสามคน เราไปเยี่ยมปู่ย่าทุกวันอาทิตย์',
'Extended family gathering at grandparents house, cartoon style, warm atmosphere',
'[{"question":"\"Grandmother\" แปลว่าอะไร?","options":["ปู่/ตา","ย่า/ยาย","ลุง","ป้า"],"correctIndex":1,"type":"vocab"},{"question":"\"Cousin\" แปลว่าอะไร?","options":["พี่ชาย","น้องสาว","ลูกพี่ลูกน้อง","เพื่อน"],"correctIndex":2,"type":"vocab"},{"question":"ปู่อายุเท่าไหร่?","options":["sixty","seventy","eighty","ninety"],"correctIndex":1,"type":"comprehension"},{"question":"เราไปเยี่ยมปู่ย่าวันอะไร?","options":["Saturday","Sunday","Monday","Friday"],"correctIndex":1,"type":"comprehension"}]'::jsonb,
true, 'core-a1-family', 'Grandparents'),

-- Lesson 3
(1, 3, 'Describing Family Members', 'บรรยายสมาชิกในครอบครัว',
'[{"word":"tall","phonetic":"ทอล","meaning":"สูง","partOfSpeech":"adj."},{"word":"short","phonetic":"ชอร์ท","meaning":"เตี้ย","partOfSpeech":"adj."},{"word":"young","phonetic":"ยัง","meaning":"อายุน้อย/หนุ่มสาว","partOfSpeech":"adj."},{"word":"kind","phonetic":"ไคนด์","meaning":"ใจดี","partOfSpeech":"adj."},{"word":"funny","phonetic":"ฟันนี","meaning":"ตลก","partOfSpeech":"adj."},{"word":"smart","phonetic":"สมาร์ท","meaning":"ฉลาด","partOfSpeech":"adj."}]'::jsonb,
'[[{"english":"My","thai":"มาย"},{"english":"sister","thai":"ซิสเตอร์"},{"english":"is","thai":"อิส"},{"english":"tall","thai":"ทอล"},{"english":"and","thai":"แอนด์"},{"english":"smart.","thai":"สมาร์ท"}],[{"english":"My","thai":"มาย"},{"english":"brother","thai":"บราเธอร์"},{"english":"is","thai":"อิส"},{"english":"short","thai":"ชอร์ท"},{"english":"and","thai":"แอนด์"},{"english":"funny.","thai":"ฟันนี"}],[{"english":"My","thai":"มาย"},{"english":"mother","thai":"มาเธอร์"},{"english":"is","thai":"อิส"},{"english":"kind","thai":"ไคนด์"},{"english":"and","thai":"แอนด์"},{"english":"young.","thai":"ยัง"}],[{"english":"What","thai":"ว็อท"},{"english":"is","thai":"อิส"},{"english":"your","thai":"ยัวร์"},{"english":"family","thai":"แฟมิลี"},{"english":"like?","thai":"ไลค์?"}]]'::jsonb,
'พี่สาวของฉันสูงและฉลาด น้องชายของฉันเตี้ยและตลก แม่ของฉันใจดีและยังสาว ครอบครัวของคุณเป็นยังไง?',
'Cartoon family members with different heights and personalities, fun and colorful',
'[{"question":"\"Tall\" แปลว่าอะไร?","options":["เตี้ย","สูง","อ้วน","ผอม"],"correctIndex":1,"type":"vocab"},{"question":"\"Kind\" แปลว่าอะไร?","options":["ตลก","ฉลาด","ใจดี","สวย"],"correctIndex":2,"type":"vocab"},{"question":"พี่สาวเป็นยังไง?","options":["short and funny","tall and smart","kind and young","old and tall"],"correctIndex":1,"type":"comprehension"},{"question":"น้องชายเป็นยังไง?","options":["tall and smart","kind and young","short and funny","old and kind"],"correctIndex":2,"type":"comprehension"}]'::jsonb,
true, 'core-a1-family', 'Describing Family'),

-- Lesson 4
(1, 4, 'Family Activities', 'กิจกรรมในครอบครัว',
'[{"word":"cook","phonetic":"คุ๊ค","meaning":"ทำอาหาร","partOfSpeech":"v."},{"word":"watch TV","phonetic":"ว็อทช์ ทีวี","meaning":"ดูทีวี","partOfSpeech":"phr."},{"word":"play","phonetic":"เพลย์","meaning":"เล่น","partOfSpeech":"v."},{"word":"together","phonetic":"ทูเกเธอร์","meaning":"ด้วยกัน","partOfSpeech":"adv."},{"word":"weekend","phonetic":"วีคเอนด์","meaning":"วันหยุดสุดสัปดาห์","partOfSpeech":"n."},{"word":"dinner","phonetic":"ดินเนอร์","meaning":"อาหารเย็น","partOfSpeech":"n."}]'::jsonb,
'[[{"english":"On","thai":"ออน"},{"english":"weekends,","thai":"วีคเอนดส์,"},{"english":"my","thai":"มาย"},{"english":"family","thai":"แฟมิลี"},{"english":"cooks","thai":"คุ๊คส์"},{"english":"together.","thai":"ทูเกเธอร์"}],[{"english":"We","thai":"วี"},{"english":"watch","thai":"ว็อทช์"},{"english":"TV","thai":"ทีวี"},{"english":"after","thai":"อาฟเตอร์"},{"english":"dinner.","thai":"ดินเนอร์"}],[{"english":"My","thai":"มาย"},{"english":"brother","thai":"บราเธอร์"},{"english":"and","thai":"แอนด์"},{"english":"I","thai":"ไอ"},{"english":"play","thai":"เพลย์"},{"english":"games.","thai":"เกมส์"}],[{"english":"I","thai":"ไอ"},{"english":"love","thai":"ลัฟ"},{"english":"spending","thai":"สเพนดิง"},{"english":"time","thai":"ไทม์"},{"english":"with","thai":"วิธ"},{"english":"my","thai":"มาย"},{"english":"family.","thai":"แฟมิลี"}]]'::jsonb,
'วันหยุดสุดสัปดาห์ครอบครัวของฉันทำอาหารด้วยกัน เราดูทีวีหลังอาหารเย็น ฉันและน้องชายเล่นเกม ฉันชอบใช้เวลากับครอบครัว',
'Happy family cooking together in kitchen, watching TV, playing games, cartoon style',
'[{"question":"\"Cook\" แปลว่าอะไร?","options":["กิน","ดื่ม","ทำอาหาร","ซื้อ"],"correctIndex":2,"type":"vocab"},{"question":"\"Together\" แปลว่าอะไร?","options":["คนเดียว","ด้วยกัน","แยกกัน","บางครั้ง"],"correctIndex":1,"type":"vocab"},{"question":"ครอบครัวทำอะไรวันหยุด?","options":["go shopping","cook together","go to school","work"],"correctIndex":1,"type":"comprehension"},{"question":"ฉันและน้องชายทำอะไร?","options":["cook","watch TV","play games","sleep"],"correctIndex":2,"type":"comprehension"}]'::jsonb,
true, 'core-a1-family', 'Family Activities'),

-- Lesson 5
(1, 5, 'My Pet', 'สัตว์เลี้ยงของฉัน',
'[{"word":"pet","phonetic":"เพ็ท","meaning":"สัตว์เลี้ยง","partOfSpeech":"n."},{"word":"dog","phonetic":"ด็อก","meaning":"หมา","partOfSpeech":"n."},{"word":"cat","phonetic":"แคท","meaning":"แมว","partOfSpeech":"n."},{"word":"feed","phonetic":"ฟีด","meaning":"ให้อาหาร","partOfSpeech":"v."},{"word":"walk","phonetic":"วอล์ค","meaning":"เดิน/พาเดิน","partOfSpeech":"v."},{"word":"cute","phonetic":"คิวท์","meaning":"น่ารัก","partOfSpeech":"adj."}]'::jsonb,
'[[{"english":"I","thai":"ไอ"},{"english":"have","thai":"แฮฟ"},{"english":"a","thai":"อะ"},{"english":"pet","thai":"เพ็ท"},{"english":"dog.","thai":"ด็อก"}],[{"english":"His","thai":"ฮิส"},{"english":"name","thai":"เนม"},{"english":"is","thai":"อิส"},{"english":"Max.","thai":"แม็กซ์"}],[{"english":"He","thai":"ฮี"},{"english":"is","thai":"อิส"},{"english":"very","thai":"เวรี"},{"english":"cute.","thai":"คิวท์"}],[{"english":"I","thai":"ไอ"},{"english":"feed","thai":"ฟีด"},{"english":"him","thai":"ฮิม"},{"english":"every","thai":"เอฟรี"},{"english":"day.","thai":"เดย์"}],[{"english":"We","thai":"วี"},{"english":"walk","thai":"วอล์ค"},{"english":"in","thai":"อิน"},{"english":"the","thai":"เดอะ"},{"english":"park","thai":"พาร์ค"},{"english":"together.","thai":"ทูเกเธอร์"}]]'::jsonb,
'ฉันมีหมาเลี้ยง ชื่อแม็กซ์ เขาน่ารักมาก ฉันให้อาหารเขาทุกวัน เราเดินเล่นในสวนด้วยกัน',
'Child playing with cute dog in park, cartoon style, sunny day',
'[{"question":"\"Pet\" แปลว่าอะไร?","options":["สัตว์ป่า","สัตว์เลี้ยง","สัตว์ทะเล","สัตว์ฟาร์ม"],"correctIndex":1,"type":"vocab"},{"question":"\"Feed\" แปลว่าอะไร?","options":["อาบน้ำ","ให้อาหาร","พาเดิน","เล่นด้วย"],"correctIndex":1,"type":"vocab"},{"question":"หมาชื่ออะไร?","options":["Buddy","Rex","Max","Lucky"],"correctIndex":2,"type":"comprehension"},{"question":"ฉันและหมาไปที่ไหนด้วยกัน?","options":["school","park","market","home"],"correctIndex":1,"type":"comprehension"}]'::jsonb,
true, 'core-a1-family', 'My Pet'),
