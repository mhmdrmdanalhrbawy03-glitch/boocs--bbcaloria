import React, { useState } from 'react';
import { EvaluationItem } from '../data/initialData';
import { FileCheck2, Download, CheckCircle, ExternalLink, Calendar, BookOpen } from 'lucide-react';

interface EvaluationsViewProps {
  evaluations: EvaluationItem[];
}

export const EvaluationsView: React.FC<EvaluationsViewProps> = ({ evaluations }) => {
  const [selectedSubject, setSelectedSubject] = useState('الكل');

  const subjects = ['الكل', ...Array.from(new Set(evaluations.map(e => e.subject)))];

  const filtered = selectedSubject === 'الكل'
    ? evaluations
    : evaluations.filter(e => e.subject === selectedSubject);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
            <FileCheck2 className="w-3.5 h-3.5" />
            التقييمات الأسبوعية والواجبات المنزلية الرسمية
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ملفات التقييم الأسبوعي ونماذج الإجابة
          </h2>
          <p className="text-slate-300 text-sm mt-2 leading-relaxed">
            جميع أوراق الواجبات والتقييمات المدرسية الأسبوعية المقررة لمختلف المواد مع إتاحة نماذج الإجابة النموذجية المعتمدة للمراجعة الذاتية.
          </p>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              selectedSubject === sub
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Grid of Evaluations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  {item.subject}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {item.week}
                </span>
              </div>

              <h3 className="font-bold text-white text-base mb-2 leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-400 mb-4">
                يشمل أسئلة التقييم الوزاري الأسبوعي واختبارات قياس الفهم والاستيعاب.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-emerald-600/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>تحميل ورقة التقييم</span>
              </a>

              {item.solutionUrl && (
                <a
                  href={item.solutionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  title="عرض نموذج الإجابة"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">الحل</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
