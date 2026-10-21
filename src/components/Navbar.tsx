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
  Headphones,
  Sun,
  Moon,
  Video,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'books' | 'videos' | 'evaluations' | 'exams' | 'quran' | 'favorites' | 'teacher';
  setCurrentTab: (tab: 'books' | 'videos' | 'evaluations' | 'exams' | 'quran' | 'favorites' | 'teacher') => void;
  studentUser: { name: string; phone: string; grade: string } | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onSupportClick?: () => void;
  favoritesCount: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  isTeacherAuthenticated?: boolean;
  teacherProfile?: { name: string; email: string; photoURL?: string } | null;
  onTeacherLogout?: () => void;
  onTeacherLoginClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  studentUser,
  onLoginClick,
  onLogoutClick,
  onSupportClick,
  favoritesCount,
  theme = 'dark',
  onToggleTheme,
  isTeacherAuthenticated = false,
  teacherProfile,
  onTeacherLogout,
  onTeacherLoginClick
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors ${
        isDark
          ? 'bg-slate-900/90 border-slate-800 text-slate-100'
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
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
                <span
                  className={`font-extrabold text-base sm:text-lg group-hover:text-indigo-500 transition-colors ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  المكتبة التعليمية الشاملة
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/30">
                  تانية بكالوريا والثانوية
                </span>
              </div>
              <p className={`text-xs hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                كتب الوزارة • الفيديوهات والشروحات • التقييمات • الامتحانات
              </p>
            </div>
          </button>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('books')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                currentTab === 'books'
                  ? 'bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 font-semibold'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>المكتبة والكتب</span>
            </button>

            {/* NEW: Videos & Lectures Tab */}
            <button
              onClick={() => setCurrentTab('videos')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                currentTab === 'videos'
                  ? 'bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 font-semibold'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Video className="w-4 h-4 text-purple-400" />
              <span>الفيديوهات والشروحات</span>
            </button>

            <button
              onClick={() => setCurrentTab('evaluations')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                currentTab === 'evaluations'
                  ? 'bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 font-semibold'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>التقييمات والواجبات</span>
            </button>

            <button
              onClick={() => setCurrentTab('exams')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                currentTab === 'exams'
                  ? 'bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 font-semibold'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>الاختبارات التفاعلية</span>
            </button>

            <button
              onClick={() => setCurrentTab('favorites')}
              className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors relative cursor-pointer ${
                currentTab === 'favorites'
                  ? 'bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 font-semibold'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Heart className="w-4 h-4 text-rose-500" />
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
                  ? 'bg-indigo-600/20 text-indigo-500 border border-indigo-500/30 font-semibold'
                  : isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>القرآن والأدعية</span>
            </button>

            {onSupportClick && (
              <button
                onClick={onSupportClick}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer ${
                  isDark
                    ? 'text-cyan-400 hover:text-white hover:bg-slate-800/60'
                    : 'text-cyan-700 hover:text-cyan-900 hover:bg-cyan-50'
                }`}
                title="الدعم الفني وخدمة الطلاب"
              >
                <Headphones className="w-4 h-4 text-cyan-500" />
                <span>الدعم الفني</span>
              </button>
            )}
          </nav>

          {/* User, Theme Toggle & Teacher Dashboard (ONLY FOR AUTHENTICATED TEACHER) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Day / Night) */}
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-indigo-600 hover:bg-slate-200'
                }`}
                title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* TEACHER DASHBOARD BUTTON */}
            {isTeacherAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentTab('teacher')}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    currentTab === 'teacher'
                      ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 ring-2 ring-amber-400'
                      : isDark
                      ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  }`}
                  title="لوحة تحكم المعلم المشرف"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="hidden sm:inline">لوحة المعلم (محمد رمضان) 👑</span>
                  <span className="sm:hidden">المعلم 👑</span>
                </button>

                {onTeacherLogout && (
                  <button
                    onClick={onTeacherLogout}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="تسجيل خروج المعلم"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onTeacherLoginClick || (() => setCurrentTab('teacher'))}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isDark
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
                }`}
                title="بوابة دخول المعلم المشرف (محمد رمضان الحرباوي)"
              >
                <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="hidden sm:inline">دخول المعلم (محمد رمضان) 👑</span>
                <span className="sm:hidden">المعلم 👑</span>
              </button>
            )}

            {/* Student Account Badge or Login */}
            {studentUser ? (
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${
                  isDark
                    ? 'bg-slate-800/80 border-slate-700'
                    : 'bg-slate-100 border-slate-200'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                  <User className="w-4 h-4" />
                </div>
                <div className="hidden sm:block text-right">
                  <p
                    className={`text-xs font-semibold truncate max-w-[120px] ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {studentUser.name}
                  </p>
                  <span
                    className={`text-[10px] flex items-center gap-1 font-mono ${
                      isDark ? 'text-indigo-300' : 'text-indigo-700'
                    }`}
                    dir="ltr"
                  >
                    {studentUser.phone}
                  </span>
                </div>
                <button
                  onClick={onLogoutClick}
                  className="p-1 hover:text-red-500 text-slate-400 transition-colors cursor-pointer"
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
                <span>دخول</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div
          className={`flex lg:hidden items-center justify-between py-2 border-t overflow-x-auto gap-2 text-xs ${
            isDark ? 'border-slate-800/60' : 'border-slate-200'
          }`}
        >
          <button
            onClick={() => setCurrentTab('books')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'books'
                ? 'bg-indigo-600 text-white font-bold'
                : isDark
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>الكتب</span>
          </button>

          <button
            onClick={() => setCurrentTab('videos')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'videos'
                ? 'bg-indigo-600 text-white font-bold'
                : isDark
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>الفيديوهات</span>
          </button>

          <button
            onClick={() => setCurrentTab('evaluations')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'evaluations'
                ? 'bg-indigo-600 text-white font-bold'
                : isDark
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>التقييمات</span>
          </button>

          <button
            onClick={() => setCurrentTab('exams')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'exams'
                ? 'bg-indigo-600 text-white font-bold'
                : isDark
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>الامتحانات</span>
          </button>

          <button
            onClick={() => setCurrentTab('favorites')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'favorites'
                ? 'bg-indigo-600 text-white font-bold'
                : isDark
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-rose-500" />
            <span>المفضلة</span>
          </button>

          <button
            onClick={() => setCurrentTab('quran')}
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'quran'
                ? 'bg-indigo-600 text-white font-bold'
                : isDark
                ? 'text-slate-400'
                : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>القرآن</span>
          </button>

          <button
            onClick={
              isTeacherAuthenticated
                ? () => setCurrentTab('teacher')
                : (onTeacherLoginClick || (() => setCurrentTab('teacher')))
            }
            className={`px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 ${
              currentTab === 'teacher'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-amber-500 font-semibold'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isTeacherAuthenticated ? 'لوحة المعلم 👑' : 'دخول المعلم 👑'}</span>
          </button>

          {onSupportClick && (
            <button
              onClick={onSupportClick}
              className="px-3 py-1.5 rounded-lg shrink-0 flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>الدعم</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
