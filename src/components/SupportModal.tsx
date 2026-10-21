import React, { useState } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Phone,
  User,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Headphones,
  Sparkles
} from 'lucide-react';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export interface SupportTicket {
  id: string;
  name: string;
  phone: string;
  message: string;
  category: string;
  status: 'جديدة' | 'تمت المراجعة';
  createdAt: string;
}

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentUser: { name: string; phone: string; grade: string } | null;
  onTicketSubmitted?: (ticket: SupportTicket) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  studentUser,
  onTicketSubmitted
}) => {
  const [name, setName] = useState(studentUser?.name || '');
  const [phone, setPhone] = useState(studentUser?.phone || '');
  const [category, setCategory] = useState('طلب كتاب أو مذكرة');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanMsg = message.trim();

    if (!cleanName || !cleanPhone || !cleanMsg) {
      setError('يرجى ملء جميع الحقول المطلوبة (الاسم، رقم الهاتف، والرسالة)');
      return;
    }

    setLoading(true);
    setError(null);

    const ticketId = `ticket-${Date.now()}`;
    const newTicket: SupportTicket = {
      id: ticketId,
      name: cleanName,
      phone: cleanPhone,
      category,
      message: cleanMsg,
      status: 'جديدة',
      createdAt: new Date().toISOString()
    };

    try {
      // 1. Save to Firestore
      try {
        await setDoc(doc(db, 'support_tickets', ticketId), newTicket);
      } catch (err) {
        console.warn('Firestore ticket write warning:', err);
      }

      // 2. Save to local storage for instant sync with dashboard
      try {
        const localTicketsStr = localStorage.getItem('bac_support_tickets');
        const localTickets: SupportTicket[] = localTicketsStr ? JSON.parse(localTicketsStr) : [];
        localTickets.unshift(newTicket);
        localStorage.setItem('bac_support_tickets', JSON.stringify(localTickets));
      } catch (e) {
        console.warn('Local ticket save error:', e);
      }

      if (onTicketSubmitted) {
        onTicketSubmitted(newTicket);
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setMessage('');
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-indigo-800 mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4">
          <Headphones className="w-7 h-7 text-white" />
        </div>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            الدعم الفني وخدمة الطلاب
          </div>
          <h3 className="text-xl font-bold text-white">تواصل مع إدارة المنصة والمعلمين</h3>
          <p className="text-xs text-slate-400 mt-1">
            أرسل استفسارك أو طلبك وسيتم الرد عليك ومراجعة طلبك في أسرع وقت
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-emerald-950/40 border border-emerald-800/80 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">تم إرسال رسالتك بنجاح!</h4>
            <p className="text-xs text-slate-300">
              شكراً لتواصلك. تم تحويل رسالتك إلى لوحة تحكم المعلم لمراجعتها والرد عليك عبر الهاتف أو الواتساب.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-slate-300 font-semibold mb-1">الاسم بالكامل *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="اكتب اسمك هنا"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-3 py-3 text-slate-100 focus:border-indigo-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">رقم الهاتف (للتواصل أو الرد عبر واتساب) *</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01xxxxxxxxx أو رقم هاتفك"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-3 py-3 text-slate-100 focus:border-indigo-500 text-right"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">نوع الطلب أو الاستفسار</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-indigo-500 cursor-pointer"
              >
                <option value="طلب كتاب أو مذكرة">طلب كتاب أو مذكرة غير موجودة</option>
                <option value="مشكلة في تحميل أو فتح ملف">مشكلة في تحميل أو فتح ملف</option>
                <option value="استفسار عن التقييمات والامتحانات">استفسار عن التقييمات والامتحانات</option>
                <option value="اقتراح لتطوير المنصة">اقتراح لتطوير المنصة</option>
                <option value="استفسار عام">استفسار عام</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">نص الرسالة أو الاستفسار بالتفصيل *</label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب مشكلتك أو طلبك هنا بوضوح..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-indigo-500 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>جاري الإرسال...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إرسال الرسالة للإدارة</span>
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
