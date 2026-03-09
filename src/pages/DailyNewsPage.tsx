import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VocabTable from "@/components/VocabTable";
import ArticleReader from "@/components/ArticleReader";
import QuizSection from "@/components/QuizSection";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Newspaper, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";
import { VocabWord, InterlinearWord, QuizQuestion } from "@/types/lesson";

interface NewsArticle {
  id: string;
  level: 1 | 2 | 3;
  levelLabel: string;
  title: string;
  titleThai: string;
  category: string;
  date: string;
  vocabulary: VocabWord[];
  articleSentences: InterlinearWord[][];
  articleTranslation: string;
  quiz: QuizQuestion[];
}

// Sample daily news articles (in a real app, these would come from an API)
const dailyNews: NewsArticle[] = [
  {
    id: "news-1",
    level: 1,
    levelLabel: "Easy",
    title: "Robot Serves Food at Bangkok Restaurant",
    titleThai: "หุ่นยนต์เสิร์ฟอาหารที่ร้านในกรุงเทพ",
    category: "Technology",
    date: "วันนี้",
    vocabulary: [
      { word: "robot", phonetic: "โรบ็อท", meaning: "หุ่นยนต์", partOfSpeech: "n." },
      { word: "serve", phonetic: "เซิร์ฟ", meaning: "เสิร์ฟ", partOfSpeech: "v." },
      { word: "restaurant", phonetic: "เรสเทอร์ร็อนท์", meaning: "ร้านอาหาร", partOfSpeech: "n." },
      { word: "customer", phonetic: "คัสเทอเมอร์", meaning: "ลูกค้า", partOfSpeech: "n." },
      { word: "popular", phonetic: "พ็อพพิวลาร์", meaning: "เป็นที่นิยม", partOfSpeech: "adj." },
      { word: "future", phonetic: "ฟิวเจอร์", meaning: "อนาคต", partOfSpeech: "n." },
    ],
    articleSentences: [
      [{ english: "A", thai: "อะ" }, { english: "new", thai: "นิว" }, { english: "restaurant", thai: "เรสเทอร์ร็อนท์" }, { english: "in", thai: "อิน" }, { english: "Bangkok", thai: "กรุงเทพ" }, { english: "uses", thai: "ยูเซส" }, { english: "robots.", thai: "โรบ็อทส์" }],
      [{ english: "The", thai: "เดอะ" }, { english: "robots", thai: "โรบ็อทส์" }, { english: "serve", thai: "เซิร์ฟ" }, { english: "food", thai: "ฟูด" }, { english: "to", thai: "ทู" }, { english: "customers.", thai: "คัสเทอเมอร์ส" }],
      [{ english: "They", thai: "เดย์" }, { english: "can", thai: "แคน" }, { english: "carry", thai: "แคริ" }, { english: "many", thai: "เมนี่" }, { english: "plates", thai: "เพลทส์" }, { english: "at", thai: "แอ็ท" }, { english: "once.", thai: "วันซ์" }],
      [{ english: "Customers", thai: "คัสเทอเมอร์ส" }, { english: "love", thai: "เลิฟ" }, { english: "taking", thai: "เทคกิ้ง" }, { english: "photos", thai: "โฟโต้ส" }, { english: "with", thai: "วิธ" }, { english: "them.", thai: "เด็ม" }],
      [{ english: "The", thai: "เดอะ" }, { english: "restaurant", thai: "เรสเทอร์ร็อนท์" }, { english: "is", thai: "อิส" }, { english: "very", thai: "เวรี่" }, { english: "popular!", thai: "พ็อพพิวลาร์" }],
      [{ english: "Is", thai: "อิส" }, { english: "this", thai: "ดิส" }, { english: "the", thai: "เดอะ" }, { english: "future", thai: "ฟิวเจอร์" }, { english: "of", thai: "ออฟ" }, { english: "food?", thai: "ฟูด" }],
    ],
    articleTranslation: "ร้านอาหารใหม่ในกรุงเทพใช้หุ่นยนต์ หุ่นยนต์เสิร์ฟอาหารให้ลูกค้า มันถือจานได้หลายจานพร้อมกัน ลูกค้าชอบถ่ายรูปกับมัน ร้านนี้เป็นที่นิยมมาก! นี่คืออนาคตของอาหารหรือเปล่า?",
    quiz: [
      { question: "หุ่นยนต์ทำอะไรที่ร้านอาหาร?", options: ["ทำอาหาร", "เสิร์ฟอาหาร", "ล้างจาน", "เก็บเงิน"], correctIndex: 1, type: "comprehension" },
      { question: "'customer' แปลว่าอะไร?", options: ["พ่อครัว", "ลูกค้า", "พนักงาน", "หุ่นยนต์"], correctIndex: 1, type: "vocab" },
      { question: "ลูกค้าชอบทำอะไรกับหุ่นยนต์?", options: ["เต้น", "คุย", "ถ่ายรูป", "วิ่ง"], correctIndex: 2, type: "comprehension" },
      { question: "'popular' แปลว่าอะไร?", options: ["แพง", "ใหม่", "เป็นที่นิยม", "น่ากลัว"], correctIndex: 2, type: "vocab" },
    ],
  },
  {
    id: "news-2",
    level: 2,
    levelLabel: "Medium",
    title: "Thailand Bans Single-Use Plastic Bags",
    titleThai: "ไทยห้ามใช้ถุงพลาสติกใช้ครั้งเดียว",
    category: "Environment",
    date: "วันนี้",
    vocabulary: [
      { word: "ban", phonetic: "แบน", meaning: "ห้าม", partOfSpeech: "v." },
      { word: "single-use", phonetic: "ซิงเกิ้ลยูส", meaning: "ใช้ครั้งเดียว", partOfSpeech: "adj." },
      { word: "environment", phonetic: "เอ็นไวรอนเมนท์", meaning: "สิ่งแวดล้อม", partOfSpeech: "n." },
      { word: "reduce", phonetic: "รีดิวซ์", meaning: "ลด", partOfSpeech: "v." },
      { word: "reusable", phonetic: "รียูเซเบิล", meaning: "ใช้ซ้ำได้", partOfSpeech: "adj." },
      { word: "pollution", phonetic: "พอลลูชั่น", meaning: "มลพิษ", partOfSpeech: "n." },
    ],
    articleSentences: [
      [{ english: "Thailand", thai: "ไทยแลนด์" }, { english: "has", thai: "แฮส" }, { english: "banned", thai: "แบนด์" }, { english: "single-use", thai: "ซิงเกิ้ลยูส" }, { english: "plastic", thai: "พลาสติก" }, { english: "bags.", thai: "แบ็กส์" }],
      [{ english: "This", thai: "ดิส" }, { english: "is", thai: "อิส" }, { english: "to", thai: "ทู" }, { english: "help", thai: "เฮลพ์" }, { english: "the", thai: "เดอะ" }, { english: "environment.", thai: "เอ็นไวรอนเมนท์" }],
      [{ english: "Stores", thai: "สโตร์ส" }, { english: "will", thai: "วิล" }, { english: "no", thai: "โน" }, { english: "longer", thai: "ลองเกอร์" }, { english: "give", thai: "กิฟ" }, { english: "free", thai: "ฟรี" }, { english: "plastic", thai: "พลาสติก" }, { english: "bags.", thai: "แบ็กส์" }],
      [{ english: "People", thai: "พีเพิล" }, { english: "should", thai: "ชูด" }, { english: "bring", thai: "บริง" }, { english: "reusable", thai: "รียูเซเบิล" }, { english: "bags", thai: "แบ็กส์" }, { english: "when", thai: "เว็น" }, { english: "shopping.", thai: "ช็อปปิ้ง" }],
      [{ english: "This", thai: "ดิส" }, { english: "will", thai: "วิล" }, { english: "reduce", thai: "รีดิวซ์" }, { english: "pollution", thai: "พอลลูชั่น" }, { english: "in", thai: "อิน" }, { english: "our", thai: "อาวเออร์" }, { english: "oceans.", thai: "โอเชียนส์" }],
    ],
    articleTranslation: "ประเทศไทยห้ามใช้ถุงพลาสติกใช้ครั้งเดียว เพื่อช่วยสิ่งแวดล้อม ร้านค้าจะไม่แจกถุงพลาสติกฟรีอีกต่อไป ผู้คนควรนำถุงที่ใช้ซ้ำได้มาเวลาไปซื้อของ การทำแบบนี้จะช่วยลดมลพิษในมหาสมุทร",
    quiz: [
      { question: "ประเทศไทยห้ามใช้อะไร?", options: ["ขวดน้ำ", "ถุงพลาสติก", "หลอด", "กล่องโฟม"], correctIndex: 1, type: "comprehension" },
      { question: "'reusable' แปลว่าอะไร?", options: ["ใช้ครั้งเดียว", "ใช้ซ้ำได้", "ย่อยสลายได้", "รีไซเคิล"], correctIndex: 1, type: "vocab" },
      { question: "ทำไมถึงต้องห้าม?", options: ["แพงเกินไป", "น่าเกลียด", "ช่วยสิ่งแวดล้อม", "คนไม่ชอบ"], correctIndex: 2, type: "comprehension" },
      { question: "'pollution' แปลว่าอะไร?", options: ["ประชากร", "มลพิษ", "อาหาร", "พลังงาน"], correctIndex: 1, type: "vocab" },
    ],
  },
  {
    id: "news-3",
    level: 1,
    levelLabel: "Easy",
    title: "New Year Festival Lights Up Chiang Mai",
    titleThai: "เทศกาลปีใหม่จุดสว่างเชียงใหม่",
    category: "Culture",
    date: "เมื่อวาน",
    vocabulary: [
      { word: "festival", phonetic: "เฟสทิวัล", meaning: "เทศกาล", partOfSpeech: "n." },
      { word: "lantern", phonetic: "แลนเทิร์น", meaning: "โคม", partOfSpeech: "n." },
      { word: "sky", phonetic: "สกาย", meaning: "ท้องฟ้า", partOfSpeech: "n." },
      { word: "beautiful", phonetic: "บิวทิฟุล", meaning: "สวยงาม", partOfSpeech: "adj." },
      { word: "tradition", phonetic: "ทราดิชั่น", meaning: "ประเพณี", partOfSpeech: "n." },
      { word: "celebrate", phonetic: "เซลลิเบรท", meaning: "ฉลอง", partOfSpeech: "v." },
    ],
    articleSentences: [
      [{ english: "Thousands", thai: "ธาวเซินส์" }, { english: "of", thai: "ออฟ" }, { english: "lanterns", thai: "แลนเทิร์นส์" }, { english: "lit", thai: "ลิท" }, { english: "up", thai: "อัพ" }, { english: "the", thai: "เดอะ" }, { english: "sky.", thai: "สกาย" }],
      [{ english: "The", thai: "เดอะ" }, { english: "festival", thai: "เฟสทิวัล" }, { english: "in", thai: "อิน" }, { english: "Chiang Mai", thai: "เชียงใหม่" }, { english: "was", thai: "วอส" }, { english: "beautiful.", thai: "บิวทิฟุล" }],
      [{ english: "People", thai: "พีเพิล" }, { english: "came", thai: "เคม" }, { english: "from", thai: "ฟรอม" }, { english: "many", thai: "เมนี่" }, { english: "countries", thai: "คันทรีส์" }, { english: "to", thai: "ทู" }, { english: "celebrate.", thai: "เซลลิเบรท" }],
      [{ english: "It", thai: "อิท" }, { english: "is", thai: "อิส" }, { english: "a", thai: "อะ" }, { english: "Thai", thai: "ไทย" }, { english: "tradition.", thai: "ทราดิชั่น" }],
      [{ english: "Everyone", thai: "เอฟรี่วัน" }, { english: "smiled", thai: "สไมลด์" }, { english: "and", thai: "แอนด์" }, { english: "made", thai: "เมด" }, { english: "a", thai: "อะ" }, { english: "wish.", thai: "วิช" }],
    ],
    articleTranslation: "โคมนับพันลูกส่องสว่างขึ้นบนท้องฟ้า เทศกาลที่เชียงใหม่สวยงามมาก ผู้คนมาจากหลายประเทศเพื่อร่วมฉลอง นี่เป็นประเพณีไทย ทุกคนยิ้มและอธิษฐาน",
    quiz: [
      { question: "เทศกาลจัดที่ไหน?", options: ["กรุงเทพ", "เชียงใหม่", "ภูเก็ต", "พัทยา"], correctIndex: 1, type: "comprehension" },
      { question: "'lantern' แปลว่าอะไร?", options: ["ดอกไม้ไฟ", "โคม", "เทียน", "ดาว"], correctIndex: 1, type: "vocab" },
      { question: "'tradition' แปลว่าอะไร?", options: ["ศาสนา", "อาหาร", "ประเพณี", "เพลง"], correctIndex: 2, type: "vocab" },
      { question: "ผู้คนทำอะไรตอนปล่อยโคม?", options: ["ร้องเพลง", "เต้นรำ", "อธิษฐาน", "กินข้าว"], correctIndex: 2, type: "comprehension" },
    ],
  },
];

const levelColors: Record<number, string> = { 1: "bg-emerald-100 text-emerald-700 border-emerald-200", 2: "bg-amber-100 text-amber-700 border-amber-200", 3: "bg-red-100 text-red-700 border-red-200" };

const DailyNewsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addExp, addCoins } = useProfile();
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);

  const handleQuizComplete = async (score: number) => {
    if (user) {
      const exp = score * 10 + 5;
      const coins = score * 5;
      await addExp(exp);
      await addCoins(coins);
      toast.success(`+${exp} EXP, +${coins} เหรียญ!`);
    }
  };

  // Article view
  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
        <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
          <div className="px-4 py-3 flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setSelectedArticle(null); setShowQuiz(false); }}>
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border", levelColors[selectedArticle.level])}>
              {selectedArticle.levelLabel}
            </span>
            <span className="text-xs text-muted-foreground font-thai">{selectedArticle.category}</span>
          </div>
        </header>
        <main className="px-4 py-4 space-y-4 max-w-3xl mx-auto">
          <VocabTable vocabulary={selectedArticle.vocabulary} />
          <ArticleReader
            sentences={selectedArticle.articleSentences}
            translation={selectedArticle.articleTranslation}
            title={selectedArticle.title}
            titleThai={selectedArticle.titleThai}
          />
          {!showQuiz ? (
            <div className="text-center py-2">
              <Button onClick={() => setShowQuiz(true)} className="font-thai w-full max-w-xs bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg">
                📝 ทดสอบความเข้าใจ (+EXP & เหรียญ)
              </Button>
            </div>
          ) : (
            <QuizSection questions={selectedArticle.quiz} onComplete={handleQuizComplete} />
          )}
        </main>
      </div>
    );
  }

  // News list
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-purple-50 to-pink-50 pb-24">
      <header className="border-b border-white/50 bg-white/70 backdrop-blur-xl shadow-sm sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/practice")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
          </Button>
          <h1 className="text-lg font-bold font-thai">📰 ข่าวง่ายรายวัน</h1>
        </div>
      </header>
      <main className="px-4 py-5 max-w-3xl mx-auto">
        <p className="text-sm text-muted-foreground font-thai mb-4">ข่าวจริงเขียนใหม่ให้อ่านง่าย พร้อมคำศัพท์และ quiz</p>
        <div className="space-y-3">
          {dailyNews.map((article) => (
            <button
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group w-full text-left rounded-2xl border-2 border-white/60 bg-white/80 backdrop-blur-sm p-4 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-sm">
                  <Newspaper className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full border", levelColors[article.level])}>
                      {article.levelLabel}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{article.category}</span>
                    <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground ml-auto">
                      <Clock className="w-3 h-3" />
                      {article.date}
                    </div>
                  </div>
                  <h3 className="font-bold font-thai text-foreground text-sm">{article.titleThai}</h3>
                  <p className="text-xs text-muted-foreground font-reading line-clamp-1">{article.title}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DailyNewsPage;
