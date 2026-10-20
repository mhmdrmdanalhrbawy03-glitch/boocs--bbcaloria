import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Heart, BookOpen, Check } from 'lucide-react';

export const QuranSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl] = useState('https://server8.mp3quran.net/afs/001.mp3'); // Mishary Alafasy Al-Fatihah
  const [audio] = useState(() => new Audio('https://server8.mp3quran.net/afs/001.mp3'));

  const toggleAudio = () => {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const duas = [
    {
      title: 'دعاء بدء المذاكرة',
      text: 'اللهم إني أسألك فهم النبيين، وحفظ المرسلين، والملائكة المقربين، اللهم اجعل ألسنتنا عامرة بذكرك، وقلوبنا بخشيتك، وأسرارنا بطاعتك، إنك على كل شيء قدير.'
    },
    {
      title: 'دعاء تيسير الامتحان والصعاب',
      text: 'اللهم لا سهل إلا ما جعلته سهلاً، وأنت تجعل الحزن إذا شئت سهلاً، يا أرحم الراحمين.'
    },
    {
      title: 'دعاء النسيان والتذكر',
      text: 'اللهم يا جامع الناس ليوم لا ريب فيه اجمع بيني وبين ضالتي، وما نسيت فذكرني به وما جهلت فعلمني.'
    },
    {
      title: 'آية الكرسي للطمأنينة والسكينة',
      text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Quran Banner */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            واحة القرآن الكريم وأدعية التوفيق والتفوق
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            القرآن الكريم وأدعية الطالب
          </h2>
          <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
            الطمأنينة والتركيز أساس التفوق. استمع لتلاوة عطرة واقرأ أدعية الاستذكار وحفظ العلم.
          </p>
        </div>

        {/* Audio Recitation Player */}
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all shadow-lg shrink-0 ${
            isPlaying
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30 ring-2 ring-emerald-400'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
          }`}
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-5 h-5 text-white animate-pulse" />
              <div className="text-right">
                <p className="text-xs font-bold">تلاوة سورة الفاتحة تعمل</p>
                <p className="text-[10px] text-emerald-200">اضغط للإيقاف المؤقت</p>
              </div>
            </>
          ) : (
            <>
              <VolumeX className="w-5 h-5 text-emerald-400" />
              <div className="text-right">
                <p className="text-xs font-bold">تشغيل تلاوة سورة الفاتحة</p>
                <p className="text-[10px] text-slate-400">بصوت الشيخ مشاري العفاسي</p>
              </div>
            </>
          )}
        </button>
      </div>

      {/* Grid of Duas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {duas.map((d, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/80 flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-white text-base">{d.title}</h3>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed font-serif bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
                {d.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
