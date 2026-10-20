import React, { useState, useEffect } from 'react';
import { ExamItem, DEFAULT_EXAM } from '../data/initialData';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface ExamRunnerProps {
  exam?: ExamItem;
}

export const ExamRunner: React.FC<ExamRunnerProps> = ({ exam = DEFAULT_EXAM }) => {
  const questions = exam.questions && exam.questions.length > 0 ? exam.questions : DEFAULT_EXAM.questions;
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qIdx: number]: number }>({});
  const [showExplanation, setShowExplanation] = useState<{ [qIdx: number]: boolean }>({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(exam.timeLimit * 60);

  // Timer countdown
  useEffect(() => {
    if (isFinished) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isFinished]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelectOption = (optIdx: number) => {
    if (isFinished) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx
    }));
  };

  const currentQ = questions[currentIdx];
  const isSelected = userAnswers[currentIdx] !== undefined;
  const selectedOpt = userAnswers[currentIdx];

  // Calculate score
  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.ans) score++;
    });
    return score;
  };

  const resetExam = () => {
    setUserAnswers({});
    setShowExplanation({});
    setCurrentIdx(0);
    setIsFinished(false);
    setTimeLeft(exam.timeLimit * 60);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            اختبار إلكتروني تدريبي تفاعلي
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">
            {exam.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            المادة: {exam.subject} • إجمالي الأسئلة: {questions.length} أسئلة
          </p>
        </div>

        {/* Timer Badge */}
        {!isFinished && (
          <div className="flex items-center gap-2 bg-slate-950 px-4 py-2.5 rounded-xl border border-indigo-500/30 font-mono text-indigo-300 font-bold text-sm shadow-md">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>الوقت المتبقي: {formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Main Exam Card / Results View */}
      {!isFinished ? (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Progress & Question Numbers */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold mb-3">
              <span>السؤال {currentIdx + 1} من {questions.length}</span>
              <span>{Math.round(((currentIdx + 1) / questions.length) * 100)}% تم الإنجاز</span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-indigo-500 to-violet-500 transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Quick navigator pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-3">
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center justify-center ${
                    currentIdx === i
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md'
                      : userAnswers[i] !== undefined
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 mb-2 inline-block">
              {currentQ.cat}
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-100 leading-relaxed">
              {currentQ.q}
            </h3>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.opts.map((opt, optIdx) => {
              const isOptionSelected = selectedOpt === optIdx;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-right p-4 rounded-xl border text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${
                    isOptionSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950/70 border-slate-800/90 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isOptionSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {optIdx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isOptionSelected ? 'border-indigo-500 bg-indigo-500' : 'border-slate-600'
                  }`}>
                    {isOptionSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Teacher Explanation Reveal */}
          {isSelected && (
            <div className="pt-2">
              <button
                onClick={() => setShowExplanation(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }))}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 font-semibold"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{showExplanation[currentIdx] ? 'إخفاء شرح الإجابة' : 'عرض شرح الإجابة وقاعدة الإعراب'}</span>
              </button>
              {showExplanation[currentIdx] && (
                <div className="mt-2 p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-800/60 text-xs text-indigo-200 leading-relaxed">
                  💡 <strong>شرح المعلم:</strong> {currentQ.exp}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1.5"
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsFinished(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30"
              >
                <Award className="w-4 h-4" />
                <span>إنهاء الاختبار وعرض النتيجة</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 via-indigo-600 to-indigo-800 mx-auto flex items-center justify-center shadow-xl shadow-indigo-600/30">
            <Award className="w-10 h-10 text-white" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">نتيجة الاختبار التفاعلي</h3>
            <p className="text-sm text-slate-400 mt-1">تم تصحيح جميع الأسئلة تلقائياً</p>
          </div>

          {/* Score display */}
          <div className="max-w-xs mx-auto p-5 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">درجتك النهائية</span>
            <div className="text-4xl font-extrabold text-amber-400 mt-1">
              {calculateScore()} <span className="text-lg text-slate-500">/ {questions.length}</span>
            </div>
            <p className="text-xs text-slate-300 mt-2 font-medium">
              النسبة المئوية: {Math.round((calculateScore() / questions.length) * 100)}%
            </p>
          </div>

          {/* Review of Questions */}
          <div className="text-right space-y-3 pt-6 border-t border-slate-800">
            <h4 className="font-bold text-white text-base mb-4">مراجعة إجاباتك بالتفصيل:</h4>
            {questions.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.ans;
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs text-right ${
                    isCorrect
                      ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-200'
                      : 'bg-rose-950/20 border-rose-800/60 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">السؤال {idx + 1}: {q.q}</span>
                    {isCorrect ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> إجابة صحيحة
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <XCircle className="w-4 h-4" /> غير صحيحة
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 mb-1">
                    إجابتك: <span className="text-white font-semibold">{userAns !== undefined ? q.opts[userAns] : 'لم تجب'}</span>
                  </p>
                  {!isCorrect && (
                    <p className="text-emerald-400 mb-2">
                      الإجابة النموذجية: <span className="font-semibold">{q.opts[q.ans]}</span>
                    </p>
                  )}
                  <p className="text-indigo-300 text-[11px] bg-slate-950/60 p-2 rounded-lg">
                    💡 <strong>الشرح:</strong> {q.exp}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="pt-4">
            <button
              onClick={resetExam}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار مرة أخرى</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
