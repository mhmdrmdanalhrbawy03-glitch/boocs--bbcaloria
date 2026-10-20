import React, { useState } from 'react';
import { X, LogIn, GraduationCap, ShieldCheck, User, Sparkles, Check } from 'lucide-react';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from '../firebase';
import { signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: 'student' | 'teacher') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('teacher');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save or update profile in Firestore
      try {
        await setDoc(doc(db, 'users', user.uid), {
          id: user.uid,
          fullName: user.displayName || 'مستخدم',
          email: user.email || '',
          role: selectedRole,
          grade: 'تانية بكالوريا والثانوية العامة',
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (err) {
        console.warn('Profile write warning:', err);
      }

      onSuccess(selectedRole);
      onClose();
    } catch (err: any) {
      setError(err.message || 'تعذر تسجيل الدخول عبر حساب Google');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoTeacher = () => {
    onSuccess('teacher');
    onClose();
  };

  const handleQuickDemoStudent = () => {
    onSuccess('student');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-indigo-600 to-indigo-800 mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white">تسجيل الدخول للمنصة التعليمية</h3>
          <p className="text-xs text-slate-400 mt-1">اختر صفتك للدخول والاستفادة من كافة الصلاحيات</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setSelectedRole('teacher')}
            className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedRole === 'teacher'
                ? 'bg-amber-500/10 border-amber-500 text-amber-300 ring-2 ring-amber-400/40 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-6 h-6 mx-auto mb-1 text-amber-400" />
            <p className="text-sm font-bold">معلم / مشرف</p>
            <p className="text-[10px] text-slate-400 mt-0.5">لوحة تحكم كاملة</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole('student')}
            className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
              selectedRole === 'student'
                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-300 ring-2 ring-indigo-400/40 shadow-md'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-6 h-6 mx-auto mb-1 text-indigo-400" />
            <p className="text-sm font-bold">طالب</p>
            <p className="text-[10px] text-slate-400 mt-0.5">مذاكرة واختبارات</p>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs">
            {error}
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-3 transition-colors shadow-lg shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول بحساب Google الرسمي</span>
          </button>

          {/* Quick Instant Access Buttons */}
          <div className="pt-4 border-t border-slate-800/80 text-center">
            <span className="text-[11px] text-slate-400 block mb-2">أو الدخول المباشر للتجربة والمعاينة:</span>
            <div className="flex gap-2">
              <button
                onClick={handleQuickDemoTeacher}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-amber-500/30"
              >
                الدخول كمعلم
              </button>
              <button
                onClick={handleQuickDemoStudent}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-indigo-500/30"
              >
                الدخول كطالب
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
