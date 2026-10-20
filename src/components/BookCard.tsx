import React from 'react';
import { BookItem } from '../data/initialData';
import { BookOpen, Download, Heart, Sparkles, ExternalLink, MessageSquare } from 'lucide-react';

interface BookCardProps {
  book: BookItem;
  onRead: (book: BookItem) => void;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onRead,
  isFavorite,
  onToggleFavorite
}) => {
  return (
    <div className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 shadow-lg transition-all duration-300 flex flex-col justify-between hover:shadow-indigo-500/10 hover:-translate-y-1 relative overflow-hidden">
      
      {/* Popular or New Tag */}
      {book.isNew && (
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5" /> جديد
          </span>
        </div>
      )}

      <div>
        {/* Category & Icon */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
            {book.icon || '📚'}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 font-medium">
              {book.category}
            </span>
            <button
              onClick={() => onToggleFavorite(book.id)}
              className={`p-2 rounded-xl border transition-colors ${
                isFavorite
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-rose-400'
              }`}
              title={isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title & Grade */}
        <h3 className="font-bold text-white text-base group-hover:text-indigo-300 transition-colors line-clamp-1 mb-1">
          {book.title}
        </h3>
        <p className="text-[11px] font-medium text-amber-400/90 mb-2">{book.grade}</p>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {book.description || 'كتاب دراسي ومذكرة شاملة مخصصة لطلاب تانية بكالوريا والثانوية العامة.'}
        </p>

        {/* Teacher Notes Tooltip / box */}
        {book.teacherNotes && (
          <div className="mb-4 p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-300/90 text-xs flex items-start gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
            <span className="line-clamp-2 text-[11px]">{book.teacherNotes}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2 mt-auto">
        <button
          onClick={() => onRead(book)}
          className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-indigo-600/25"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>قراءة وعرض</span>
        </button>

        <a
          href={book.url}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
          title="تحميل مباشر عبر Google Drive"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">تحميل</span>
        </a>
      </div>
    </div>
  );
};
