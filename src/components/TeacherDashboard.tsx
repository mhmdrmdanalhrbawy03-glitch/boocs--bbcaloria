import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Database,
  CheckCircle,
  FileCheck2,
  HelpCircle,
  Bell,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import {
  BookItem,
  EvaluationItem,
  ExamItem,
  AnnouncementItem,
  CATEGORIES,
  DEFAULT_BOOKS,
  DEFAULT_EVALUATIONS,
  DEFAULT_EXAM,
  DEFAULT_ANNOUNCEMENTS
} from '../data/initialData';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

interface TeacherDashboardProps {
  books: BookItem[];
  evaluations: EvaluationItem[];
  exams: ExamItem[];
  announcements: AnnouncementItem[];
  onRefresh: () => void;
  userId?: string;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  books,
  evaluations,
  exams,
  announcements,
  onRefresh,
  userId = 'teacher-main'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'books' | 'evaluations' | 'exams' | 'announcements'>('books');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Modal states
  const [showBookModal, setShowBookModal] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);

  // Book form state
  const [bookTitle, setBookTitle] = useState('');
  const [bookCat, setBookCat] = useState('لغة عربية');
  const [bookGrade, setBookGrade] = useState('الصف الثاني / الثالث الثانوي');
  const [bookDesc, setBookDesc] = useState('');
  const [bookUrl, setBookUrl] = useState('');
  const [bookIcon, setBookIcon] = useState('📚');
  const [bookNotes, setBookNotes] = useState('');
  const [editingBookId, setEditingBookId] = useState<string | null>(null);

  // Evaluation form state
  const [evalSubject, setEvalSubject] = useState('اللغة العربية');
  const [evalWeek, setEvalWeek] = useState('الأسبوع الأول');
  const [evalTitle, setEvalTitle] = useState('');
  const [evalUrl, setEvalUrl] = useState('');
  const [evalSolutionUrl, setEvalSolutionUrl] = useState('');

  // Announcement form state
  const [announceTitle, setAnnounceTitle] = useState('');
  const [announceContent, setAnnounceContent] = useState('');
  const [announceCat, setAnnounceCat] = useState('تنبيه عام');

  // Exam question form state
  const [examQSubject, setExamQSubject] = useState('لغة عربية');
  const [examQCat, setExamQCat] = useState('قواعد وإعراب');
  const [examQText, setExamQText] = useState('');
  const [examOpt0, setExamOpt0] = useState('');
  const [examOpt1, setExamOpt1] = useState('');
  const [examOpt2, setExamOpt2] = useState('');
  const [examOpt3, setExamOpt3] = useState('');
  const [examAns, setExamAns] = useState(0);
  const [examExp, setExamExp] = useState('');

  // Sync initial repo data into Firestore
  const handleSyncToFirestore = async () => {
    setIsSyncing(true);
    setSyncStatus('جاري مزامنة الكتب والمواد مع قاعدة البيانات...');
    try {
      // 1. Sync Books
      for (const b of DEFAULT_BOOKS) {
        await setDoc(doc(db, 'books', b.id), {
          ...b,
          createdBy: userId,
          createdAt: new Date().toISOString()
        });
      }
      // 2. Sync Evaluations
      for (const ev of DEFAULT_EVALUATIONS) {
        await setDoc(doc(db, 'evaluations', ev.id), {
          ...ev,
          createdBy: userId,
          createdAt: new Date().toISOString()
        });
      }
      // 3. Sync Exam
      await setDoc(doc(db, 'exams', DEFAULT_EXAM.id), {
        id: DEFAULT_EXAM.id,
        title: DEFAULT_EXAM.title,
        subject: DEFAULT_EXAM.subject,
        timeLimit: DEFAULT_EXAM.timeLimit,
        questions: JSON.stringify(DEFAULT_EXAM.questions),
        createdBy: userId,
        createdAt: new Date().toISOString()
      });
      // 4. Sync Announcements
      for (const a of DEFAULT_ANNOUNCEMENTS) {
        await setDoc(doc(db, 'announcements', a.id), {
          ...a,
          createdBy: userId,
          createdAt: new Date().toISOString()
        });
      }

      setSyncStatus('تمت مزامنة جميع البيانات الأولية بنجاح في قاعدة بيانات Firestore!');
      onRefresh();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'books');
      setSyncStatus('حدث خطأ أثناء المزامنة. يرجى التحقق من الاتصال.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  // Save or Update Book
  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim() || !bookUrl.trim()) return;

    const id = editingBookId || `book-${Date.now()}`;
    const newBook: BookItem = {
      id,
      title: bookTitle,
      category: bookCat,
      grade: bookGrade,
      description: bookDesc,
      url: bookUrl,
      icon: bookIcon || '📚',
      popular: 85,
      isNew: true,
      teacherNotes: bookNotes,
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'books', id), newBook);
      setShowBookModal(false);
      resetBookForm();
      onRefresh();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `books/${id}`);
    }
  };

  const resetBookForm = () => {
    setBookTitle('');
    setBookCat('لغة عربية');
    setBookGrade('الصف الثاني / الثالث الثانوي');
    setBookDesc('');
    setBookUrl('');
    setBookIcon('📚');
    setBookNotes('');
    setEditingBookId(null);
  };

  const handleEditBook = (b: BookItem) => {
    setEditingBookId(b.id);
    setBookTitle(b.title);
    setBookCat(b.category);
    setBookGrade(b.grade);
    setBookDesc(b.description);
    setBookUrl(b.url);
    setBookIcon(b.icon);
    setBookNotes(b.teacherNotes || '');
    setShowBookModal(true);
  };

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من رغبتك في حذف هذا الكتاب؟')) return;
    try {
      await deleteDoc(doc(db, 'books', id));
      onRefresh();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `books/${id}`);
    }
  };

  // Save Evaluation
  const handleSaveEval = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalTitle.trim() || !evalUrl.trim()) return;

    const id = `eval-${Date.now()}`;
    const newEval: EvaluationItem = {
      id,
      subject: evalSubject,
      week: evalWeek,
      title: evalTitle,
      url: evalUrl,
      solutionUrl: evalSolutionUrl || evalUrl,
      icon: '📝',
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'evaluations', id), newEval);
      setShowEvalModal(false);
      setEvalTitle('');
      setEvalUrl('');
      setEvalSolutionUrl('');
      onRefresh();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `evaluations/${id}`);
    }
  };

  const handleDeleteEval = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا التقييم؟')) return;
    try {
      await deleteDoc(doc(db, 'evaluations', id));
      onRefresh();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `evaluations/${id}`);
    }
  };

  // Save Announcement
  const handleSaveAnnounce = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announceTitle.trim() || !announceContent.trim()) return;

    const id = `ann-${Date.now()}`;
    const newAnn: AnnouncementItem = {
      id,
      title: announceTitle,
      content: announceContent,
      category: announceCat,
      date: 'الآن',
      createdBy: userId,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'announcements', id), newAnn);
      setShowAnnounceModal(false);
      setAnnounceTitle('');
      setAnnounceContent('');
      onRefresh();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `announcements/${id}`);
    }
  };

  const handleDeleteAnnounce = async (id: string) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;
    try {
      await deleteDoc(doc(db, 'announcements', id));
      onRefresh();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `announcements/${id}`);
    }
  };

  // Add Question to Default Exam
  const handleAddExamQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!examQText.trim() || !examOpt0.trim() || !examOpt1.trim()) return;

    const currentQuestions = exams[0]?.questions || DEFAULT_EXAM.questions;
    const updated = [
      ...currentQuestions,
      {
        cat: examQCat,
        q: examQText,
        opts: [examOpt0, examOpt1, examOpt2 || 'خيار إضافي', examOpt3 || 'خيار إضافي'],
        ans: examAns,
        exp: examExp || 'توضيح الحل من المعلم.'
      }
    ];

    const examId = exams[0]?.id || DEFAULT_EXAM.id;
    try {
      await setDoc(doc(db, 'exams', examId), {
        id: examId,
        title: exams[0]?.title || DEFAULT_EXAM.title,
        subject: examQSubject,
        timeLimit: exams[0]?.timeLimit || DEFAULT_EXAM.timeLimit,
        questions: JSON.stringify(updated),
        createdBy: userId,
        updatedAt: new Date().toISOString()
      });
      setShowExamModal(false);
      setExamQText('');
      setExamOpt0('');
      setExamOpt1('');
      setExamOpt2('');
      setExamOpt3('');
      setExamExp('');
      onRefresh();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `exams/${examId}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              لوحة الإدارة والتحكم الأكاديمي للمعلمين
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              إدارة المحتوى والمكتبة وقاعدة البيانات
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              تحكم كامل في إضافة وحذف وتعديل كتب الوزارة، التقييمات الأسبوعية، بنك الأسئلة للاختبارات التفاعلية، وإشعارات الطلاب.
            </p>
          </div>

          {/* Quick Sync Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={handleSyncToFirestore}
              disabled={isSyncing}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-60"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري المزامنة...</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>مزامنة محتوى المشروع في Firestore</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sync message banner */}
        {syncStatus && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">الكتب والمذكرات</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{books.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">التقييمات الأسبوعية</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{evaluations.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">أسئلة الاختبارات</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
              {exams[0]?.questions?.length || DEFAULT_EXAM.questions.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
            <HelpCircle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium">الإعلانات والتنبيهات</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-violet-400 mt-1">{announcements.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 gap-2 sm:gap-4 overflow-x-auto text-xs sm:text-sm">
        <button
          onClick={() => setActiveSubTab('books')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeSubTab === 'books'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>إدارة الكتب والمذكرات ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('evaluations')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeSubTab === 'evaluations'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>إدارة التقييمات الأسبوعية ({evaluations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('exams')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeSubTab === 'exams'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>إدارة بنك الأسئلة</span>
        </button>

        <button
          onClick={() => setActiveSubTab('announcements')}
          className={`pb-3 px-3 font-semibold border-b-2 transition-colors flex items-center gap-2 shrink-0 ${
            activeSubTab === 'announcements'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>إعلانات الطلاب ({announcements.length})</span>
        </button>
      </div>

      {/* SubTab 1: Books Management */}
      {activeSubTab === 'books' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">قائمة الكتب والمقررات الحالية</h3>
            <button
              onClick={() => {
                resetBookForm();
                setShowBookModal(true);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة كتاب جديد</span>
            </button>
          </div>

          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950/80 text-slate-400 uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-4">الكتاب / المادة</th>
                    <th className="p-4">الشعبة / المادة</th>
                    <th className="p-4">الصف</th>
                    <th className="p-4">ملاحظات المعلم</th>
                    <th className="p-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {books.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{b.icon || '📚'}</span>
                          <div>
                            <p className="font-semibold text-slate-100 text-sm">{b.title}</p>
                            <p className="text-slate-400 text-[11px] truncate max-w-xs">{b.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-300 font-medium">
                          {b.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300">{b.grade}</td>
                      <td className="p-4 text-slate-400 max-w-xs truncate">
                        {b.teacherNotes || '—'}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={b.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                            title="معاينة الملف"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => handleEditBook(b)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                            title="تعديل"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBook(b.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SubTab 2: Evaluations Management */}
      {activeSubTab === 'evaluations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">التقييمات والواجبات المنزلية الأسبوعية</h3>
            <button
              onClick={() => setShowEvalModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة تقييم أسبوعي جديد</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {evaluations.map((ev) => (
              <div key={ev.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold">
                      {ev.subject}
                    </span>
                    <span className="text-xs text-slate-400">{ev.week}</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm mb-2">{ev.title}</h4>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-4">
                  <div className="flex items-center gap-2">
                    <a
                      href={ev.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>ورقة التقييم</span>
                    </a>
                    {ev.solutionUrl && (
                      <a
                        href={ev.solutionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-emerald-400 hover:underline flex items-center gap-1 mr-2"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>نموذج الإجابة</span>
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteEval(ev.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
                    title="حذف التقييم"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 3: Exams Management */}
      {activeSubTab === 'exams' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base">بنك أسئلة الاختبارات التفاعلية</h3>
              <p className="text-xs text-slate-400 mt-0.5">يمكنك إضافة أسئلة جديدة مع الخيارات الأربعة والشرح وتحديد الإجابة الصحيحة.</p>
            </div>
            <button
              onClick={() => setShowExamModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 text-xs font-bold shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة سؤال جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {(exams[0]?.questions || DEFAULT_EXAM.questions).map((q, idx) => (
              <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800 flex items-center justify-center text-xs font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      {q.cat}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                    الإجابة الصحيحة: الخيار رقم {q.ans + 1}
                  </span>
                </div>

                <p className="font-bold text-slate-100 text-sm mb-4 leading-relaxed">{q.q}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  {q.opts.map((opt, oIdx) => (
                    <div
                      key={oIdx}
                      className={`p-2.5 rounded-xl border flex items-center gap-2 ${
                        oIdx === q.ans
                          ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center shrink-0">
                        {oIdx + 1}
                      </span>
                      <span>{opt}</span>
                    </div>
                  ))}
                </div>

                {q.exp && (
                  <p className="text-xs text-indigo-300 bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-900/40">
                    💡 <strong>الشرح التعليمي:</strong> {q.exp}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SubTab 4: Announcements */}
      {activeSubTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-base">إعلانات وتنبيهات الطلاب</h3>
            <button
              onClick={() => setShowAnnounceModal(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>نشر إعلان جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-violet-950 text-violet-300 border border-violet-800">
                      {a.category}
                    </span>
                    <span className="text-xs text-slate-500">{a.date}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{a.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{a.content}</p>
                </div>
                <button
                  onClick={() => handleDeleteAnnounce(a.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors shrink-0"
                  title="حذف الإعلان"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Book Add / Edit Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-white text-base">
                {editingBookId ? 'تعديل بيانات الكتاب' : 'إضافة كتاب أو مذكرة جديدة للمكتبة'}
              </h3>
              <button onClick={() => setShowBookModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBook} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">عنوان الكتاب أو المذكرة *</label>
                <input
                  type="text"
                  required
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  placeholder="مثال: كتاب الفيزياء الحديثة - الفصل الأول"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المادة / التصنيف</label>
                  <select
                    value={bookCat}
                    onChange={(e) => setBookCat(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-indigo-500"
                  >
                    {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">أيقونة توضيحية</label>
                  <input
                    type="text"
                    value={bookIcon}
                    onChange={(e) => setBookIcon(e.target.value)}
                    placeholder="📚 أو 📖 أو 🏛️"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-indigo-500 text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">الصف / الشعبة</label>
                <input
                  type="text"
                  value={bookGrade}
                  onChange={(e) => setBookGrade(e.target.value)}
                  placeholder="مثال: تانية بكالوريا / علمي علوم"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">رابط تحميل أو قراءة الكتاب (Google Drive / PDF URL) *</label>
                <input
                  type="url"
                  required
                  dir="ltr"
                  value={bookUrl}
                  onChange={(e) => setBookUrl(e.target.value)}
                  placeholder="https://drive.google.com/file/d/... أو رابط مباشر"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">وصف مختصر</label>
                <textarea
                  rows={2}
                  value={bookDesc}
                  onChange={(e) => setBookDesc(e.target.value)}
                  placeholder="نبذة عن محتوى الكتاب وأهميته للطلاب..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">ملاحظات ونصائح المعلم للطلاب</label>
                <input
                  type="text"
                  value={bookNotes}
                  onChange={(e) => setBookNotes(e.target.value)}
                  placeholder="مثال: ركز على أسئلة الفصل الثاني والمسائل النموذجية"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowBookModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ الكتاب</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Evaluation Add Modal */}
      {showEvalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-white text-base">إضافة تقييم أو واجب أسبوعي جديد</h3>
              <button onClick={() => setShowEvalModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEval} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المادة</label>
                  <input
                    type="text"
                    required
                    value={evalSubject}
                    onChange={(e) => setEvalSubject(e.target.value)}
                    placeholder="مثال: اللغة العربية / التاريخ"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">الأسبوع الدراسي</label>
                  <input
                    type="text"
                    required
                    value={evalWeek}
                    onChange={(e) => setEvalWeek(e.target.value)}
                    placeholder="مثال: الأسبوع الثالث"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">عنوان التقييم</label>
                <input
                  type="text"
                  required
                  value={evalTitle}
                  onChange={(e) => setEvalTitle(e.target.value)}
                  placeholder="مثال: تقييم النحو الشامل وقواعد الإعراب للأسبوع 3"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">رابط ملف التقييم / الواجب (PDF)</label>
                <input
                  type="url"
                  required
                  dir="ltr"
                  value={evalUrl}
                  onChange={(e) => setEvalUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">رابط نموذج الإجابة النموذجية (اختياري)</label>
                <input
                  type="url"
                  dir="ltr"
                  value={evalSolutionUrl}
                  onChange={(e) => setEvalSolutionUrl(e.target.value)}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEvalModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التقييم</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Exam Question Add Modal */}
      {showExamModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-white text-base">إضافة سؤال جديد للاختبار التفاعلي</h3>
              <button onClick={() => setShowExamModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExamQuestion} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">المادة</label>
                  <input
                    type="text"
                    value={examQSubject}
                    onChange={(e) => setExamQSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">القسم / الموضوع</label>
                  <input
                    type="text"
                    value={examQCat}
                    onChange={(e) => setExamQCat(e.target.value)}
                    placeholder="مثال: المبتدأ والخبر / كان وأخواتها"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">نص السؤال *</label>
                <textarea
                  rows={2}
                  required
                  value={examQText}
                  onChange={(e) => setExamQText(e.target.value)}
                  placeholder="اكتب نص السؤال هنا..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-semibold">خيارات الإجابة الأربعة:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={examAns === 0}
                    onChange={() => setExamAns(0)}
                    className="accent-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    value={examOpt0}
                    onChange={(e) => setExamOpt0(e.target.value)}
                    placeholder="الخيار الأول (اضغط على الدائرة لتحديده كإجابة صحيحة)"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={examAns === 1}
                    onChange={() => setExamAns(1)}
                    className="accent-emerald-500"
                  />
                  <input
                    type="text"
                    required
                    value={examOpt1}
                    onChange={(e) => setExamOpt1(e.target.value)}
                    placeholder="الخيار الثاني"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={examAns === 2}
                    onChange={() => setExamAns(2)}
                    className="accent-emerald-500"
                  />
                  <input
                    type="text"
                    value={examOpt2}
                    onChange={(e) => setExamOpt2(e.target.value)}
                    placeholder="الخيار الثالث"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correctOpt"
                    checked={examAns === 3}
                    onChange={() => setExamAns(3)}
                    className="accent-emerald-500"
                  />
                  <input
                    type="text"
                    value={examOpt3}
                    onChange={(e) => setExamOpt3(e.target.value)}
                    placeholder="الخيار الرابع"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">شرح الإجابة والتعليل التعليمي</label>
                <textarea
                  rows={2}
                  value={examExp}
                  onChange={(e) => setExamExp(e.target.value)}
                  placeholder="سبب اختيار هذه الإجابة وقاعدة الإعراب لتوضيحها للطالب بعد الاختبار..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>إضافة السؤال</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Announcement Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-bold text-white text-base">نشر إشعار أو تنبيه للطلاب</h3>
              <button onClick={() => setShowAnnounceModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnounce} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">نوع الإعلان</label>
                <select
                  value={announceCat}
                  onChange={(e) => setAnnounceCat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                >
                  <option value="تنبيه عام">تنبيه عام</option>
                  <option value="واجب مدرسي">واجب مدرسي</option>
                  <option value="موعد امتحان">موعد امتحان</option>
                  <option value="إشعار هام">إشعار هام</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">عنوان الإشعار</label>
                <input
                  type="text"
                  required
                  value={announceTitle}
                  onChange={(e) => setAnnounceTitle(e.target.value)}
                  placeholder="مثال: تنبيه هام بخصوص موعد تسليم تقييم الأسبوع الثالث"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">نص وتفاصيل الإشعار</label>
                <textarea
                  rows={3}
                  required
                  value={announceContent}
                  onChange={(e) => setAnnounceContent(e.target.value)}
                  placeholder="اكتب التنبيه هنا..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>نشر الإعلان</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
