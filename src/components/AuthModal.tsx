import React, { useState } from 'react';
import { X, LogIn, UserPlus, Phone, Lock, User, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { name: string; phone: string; grade: string }) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Form fields
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [grade, setGrade] = useState('تانية بكالوريا / الصف الثاني الثانوي');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim();
    const cleanPass = password.trim();

    if (!cleanPhone || !cleanPass) {
      setError('يرجى إدخال رقم الهاتف والرقم السري');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Check local session accounts first for instant speed
      const localUsersStr = localStorage.getItem('bac_registered_students');
      const localUsers = localUsersStr ? JSON.parse(localUsersStr) : {};

      // 2. Also check Firestore
      let foundUser = localUsers[cleanPhone];
      if (!foundUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', cleanPhone));
          if (userDoc.exists()) {
            foundUser = userDoc.data();
          }
        } catch (e) {
          console.warn('Firestore read fallback:', e);
        }
      }

      if (foundUser) {
        if (foundUser.password && foundUser.password !== cleanPass) {
          setError('الرقم السري غير صحيح. يرجى المحاولة مرة أخرى.');
          setLoading(false);
          return;
        }

        const studentData = {
          name: foundUser.name || 'طالب',
          phone: cleanPhone,
          grade: foundUser.grade || grade
        };

        localStorage.setItem('student_session', JSON.stringify(studentData));
        onSuccess(studentData);
        onClose();
      } else {
        // If account doesn't exist yet, we can easily register them or inform them
        setError('رقم الهاتف غير مسجل. يرجى الضغط على "إنشاء حساب جديد" بالأسفل.');
      }
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim();
    const cleanPass = password.trim();
    const cleanName = name.trim();

    if (!cleanPhone || !cleanPass || !cleanName) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (cleanPass.length < 4) {
      setError('الرقم السري يجب أن يتكون من 4 أرقام أو حروف على الأقل');
      return;
    }

    if (cleanPass !== confirmPassword.trim()) {
      setError('الرقم السري وتأكيده غير متطابقين');
      return;
    }

    setLoading(true);
    setError(null);

    const studentData = {
      name: cleanName,
      phone: cleanPhone,
      password: cleanPass,
      grade,
      role: 'student',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Save in Firestore
      try {
        await setDoc(doc(db, 'users', cleanPhone), studentData);
      } catch (err) {
        console.warn('Firestore profile write fallback:', err);
      }

      // 2. Save in localStorage
      const localUsersStr = localStorage.getItem('bac_registered_students');
      const localUsers = localUsersStr ? JSON.parse(localUsersStr) : {};
      localUsers[cleanPhone] = studentData;
      localStorage.setItem('bac_registered_students', JSON.stringify(localUsers));

      // 3. Set active session
      localStorage.setItem('student_session', JSON.stringify({
        name: cleanName,
        phone: cleanPhone,
        grade
      }));

      onSuccess({ name: cleanName, phone: cleanPhone, grade });
      onClose();
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إنشاء الحساب');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-white">
            {mode === 'login' ? 'تسجيل دخول الطالب' : 'إنشاء حساب طالب جديد'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' ? 'أدخل رقم هاتفك والرقم السري للمتابعة' : 'سجل بياناتك لحفظ كتبك المفضلة ومتابعة نتائجك'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4 text-xs">
          
          {mode === 'register' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">الاسم بالكامل *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد محمد علي"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-3 py-3 text-slate-100 focus:border-indigo-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">رقم الهاتف *</label>
            <div className="relative">
              <input
                type="tel"
                required
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx أو رقم الهاتف"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-3 py-3 text-slate-100 focus:border-indigo-500 text-right"
              />
              <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">الرقم السري *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="أدخل الرقم السري"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-3 py-3 text-slate-100 focus:border-indigo-500 text-right"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">تأكيد الرقم السري *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="أعد إدخال الرقم السري"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-3 py-3 text-slate-100 focus:border-indigo-500 text-right"
                  />
                  <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">الصف / الشعبة</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-indigo-500"
                >
                  <option value="تانية بكالوريا / الصف الثاني الثانوي">تانية بكالوريا / الصف الثاني الثانوي</option>
                  <option value="الصف الثالث الثانوي / بكالوريا علمي">الصف الثالث الثانوي / بكالوريا علمي</option>
                  <option value="الصف الثالث الثانوي / بكالوريا أدبي">الصف الثالث الثانوي / بكالوريا أدبي</option>
                  <option value="شعبة العلوم الرياضية">شعبة العلوم الرياضية</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>جاري المعالجة...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>دخول الطالب</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>إتمام إنشاء الحساب والدخول</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
