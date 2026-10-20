import React from 'react';
import {
  BookOpen,
  GraduationCap,
  FileCheck2,
  HelpCircle,
  Heart,
  Settings,
  LogIn,
  LogOut,
  User,
  Sparkles,
  Phone
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'books' | 'evaluations' | 'exams' | 'quran' | 'favorites' | 'teacher';
  setCurrentTab: (tab: 'books' | 'evaluations' | 'exams' | 'quran' | 'favorites' | 'teacher') => void;
  studentUser: { name: string; phone: string; grade: string } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  favoritesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  studentUser,
  onLoginClick,
  onLogoutClick,
  favoritesCount
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          
          {/* Logo */}
          <button
            onClick={() => setCurrentTab('books')}
            className="flex items-center gap-3 text-right group cursor-pointer focus:outline-none"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-600/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-white group-hover:text-indigo-400 transition-colors">
                  المكتبة التعليمية الشاملة
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  تانية بكالوريا والثانوية
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">كتب الوزارة • التقييمات الأسبوعية • بنك الاختبارات</p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('books')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                currentTab === 'books'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>المكتبة والكتب</span>
            </button>

            <button
              onClick={() => setCurrentTab('evaluations')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                currentTab === 'evaluations'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>التقييمات والواجبات</span>
            </button>

            <button
              onClick={() => setCurrentTab('exams')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                currentTab === 'exams'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>الاختبارات التفاعلية</span>
            </button>

            <button
              onClick={() => setCurrentTab('favorites')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors relative cursor-pointer ${
                currentTab === 'favorites'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-400" />
              <span>المفضلة</span>
              {favoritesCount > 0 && (
                <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('quran')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                currentTab === 'quran'
                  ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>القرآن والأدعية</span>
            </button>
          </nav>

          {/* User & Teacher Dashboard CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Teacher Dashboard Button */}
            <button
              onClick={() => setCurrentTab('teacher')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                currentTab === 'teacher'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              <Settings className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">لوحة تحكم المعلم</span>
              <span className="sm:hidden">المعلم</span>
            </button>

            {/* Student Account Badge or Login */}
            {studentUser ? (
              <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden lg:block text-right">
                  <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {studentUser.name}
                  </p>
                  <span className="text-[10px] text-indigo-300 flex items-center gap-1 font-mono" dir="ltr">
                    {studentUser.phone}
                  </span>
                </div>
                <button
                  onClick={onLogoutClick}
                  className="p-1 hover:text-red-400 text-slate-400 transition-colors cursor-pointer"
                  title="تسجيل الخروج"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onLoginClick}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>دخول / تسجيل طالب</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-800/60 overflow-x-auto gap-2 text-xs">
          <button
            onClick={() => setCurrentTab('books')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'books' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>الكتب</span>
          </button>
          <button
            onClick={() => setCurrentTab('evaluations')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'evaluations' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>التقييمات</span>
          </button>
          <button
            onClick={() => setCurrentTab('exams')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'exams' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>الاختبارات</span>
          </button>
          <button
            onClick={() => setCurrentTab('favorites')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'favorites' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>المفضلة</span>
          </button>
          <button
            onClick={() => setCurrentTab('quran')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'quran' ? 'bg-indigo-600 text-white' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>القرآن</span>
          </button>
        </div>
      </div>
    </header>
  );
};
