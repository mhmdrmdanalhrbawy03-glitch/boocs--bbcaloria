import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { BookCard } from './components/BookCard';
import { BookReaderModal } from './components/BookReaderModal';
import { TeacherDashboard } from './components/TeacherDashboard';
import { EvaluationsView } from './components/EvaluationsView';
import { ExamRunner } from './components/ExamRunner';
import { QuranSection } from './components/QuranSection';
import { AuthModal } from './components/AuthModal';
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
} from './data/initialData';
import { auth, db, testConnection, handleFirestoreError, OperationType } from './firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import {
  Search,
  BookOpen,
  Sparkles,
  Flame,
  ArrowRight,
  Filter,
  CheckCircle2,
  GraduationCap,
  Heart,
  Volume2,
  Layers,
  Bell
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'books' | 'evaluations' | 'exams' | 'quran' | 'favorites' | 'teacher'>('books');
  
  // Data states
  const [books, setBooks] = useState<BookItem[]>(DEFAULT_BOOKS);
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>(DEFAULT_EVALUATIONS);
  const [exams, setExams] = useState<ExamItem[]>([DEFAULT_EXAM]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>(DEFAULT_ANNOUNCEMENTS);
  
  // Auth & Profile
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bac_favorites');
      return saved ? JSON.parse(saved) : ['book-1', 'book-2'];
    } catch {
      return ['book-1', 'book-2'];
    }
  });

  // Reading modal
  const [activeReadingBook, setActiveReadingBook] = useState<BookItem | null>(null);

  // Test connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Teacher admin default check
        if (currentUser.email === 'ramadanh66778@gmail.com') {
          setUserRole('teacher');
        } else {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
            if (userDoc.exists() && userDoc.data().role) {
              setUserRole(userDoc.data().role);
            }
          } catch (e) {
            console.warn('Could not read user profile:', e);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Books
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'books'), (snapshot) => {
      if (!snapshot.empty) {
        const fetchedBooks: BookItem[] = [];
        snapshot.forEach((doc) => {
          fetchedBooks.push(doc.data() as BookItem);
        });
        setBooks(fetchedBooks);
      }
    }, (error) => {
      console.warn('Firestore books listener fallback to default:', error.message);
    });
    return () => unsub();
  }, []);

  // Listen to Evaluations
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'evaluations'), (snapshot) => {
      if (!snapshot.empty) {
        const fetchedEvals: EvaluationItem[] = [];
        snapshot.forEach((doc) => {
          fetchedEvals.push(doc.data() as EvaluationItem);
        });
        setEvaluations(fetchedEvals);
      }
    }, (error) => {
      console.warn('Firestore evaluations listener fallback:', error.message);
    });
    return () => unsub();
  }, []);

  // Listen to Exams
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'exams'), (snapshot) => {
      if (!snapshot.empty) {
        const fetchedExams: ExamItem[] = [];
        snapshot.forEach((doc) => {
          const d = doc.data();
          let parsedQuestions = DEFAULT_EXAM.questions;
          if (typeof d.questions === 'string') {
            try {
              parsedQuestions = JSON.parse(d.questions);
            } catch {}
          } else if (Array.isArray(d.questions)) {
            parsedQuestions = d.questions;
          }
          fetchedExams.push({
            id: d.id || doc.id,
            title: d.title,
            subject: d.subject,
            timeLimit: d.timeLimit || 15,
            questions: parsedQuestions
          });
        });
        if (fetchedExams.length > 0) {
          setExams(fetchedExams);
        }
      }
    }, (error) => {
      console.warn('Firestore exams listener fallback:', error.message);
    });
    return () => unsub();
  }, []);

  // Listen to Announcements
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'announcements'), (snapshot) => {
      if (!snapshot.empty) {
        const fetchedAnn: AnnouncementItem[] = [];
        snapshot.forEach((doc) => {
          fetchedAnn.push(doc.data() as AnnouncementItem);
        });
        setAnnouncements(fetchedAnn);
      }
    }, (error) => {
      console.warn('Firestore announcements listener fallback:', error.message);
    });
    return () => unsub();
  }, []);

  const handleToggleFavorite = (bookId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId];
      try {
        localStorage.setItem('bac_favorites', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setUserRole('student');
  };

  // Filter books
  const filteredBooks = books.filter((b) => {
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const favoriteBooks = books.filter((b) => favorites.includes(b.id));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white" dir="rtl">
      
      {/* Platform Header Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        user={user}
        userRole={userRole}
        onLoginClick={() => setShowAuthModal(true)}
        onLogoutClick={handleLogout}
        favoritesCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* VIEW 1: Books & Library */}
        {currentTab === 'books' && (
          <div className="space-y-8">
            
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/30 p-6 sm:p-10 shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  المنصة التعليمية الرسمية • تانية بكالوريا والثانوية العامة
                </div>

                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  مكتبة الكتب والمذكرات والتقييمات المعتمدة
                </h1>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                  استعرض وحمل كافة كتب الوزارة، مذكرات التأسيس، والتقييمات الأسبوعية مع نماذج الإجابة النموذجية لكافة المواد والشعب في مكان واحد.
                </p>

                {/* Search Bar inside Hero */}
                <div className="relative max-w-2xl">
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                    <Search className="w-5 h-5 text-indigo-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ابحث باسم الكتاب، المادة، أو الموضوع (مثال: تاريخ، نحو، رياضيات، فيزياء)..."
                    className="w-full bg-slate-950/90 border border-indigo-500/40 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl pr-12 pl-4 py-3.5 text-sm text-slate-100 placeholder-slate-400 shadow-xl transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 left-0 pl-4 flex items-center text-xs text-slate-400 hover:text-white"
                    >
                      مسح
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Announcements Flash Bar */}
            {announcements.length > 0 && (
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                <span className="w-8 h-8 rounded-xl bg-violet-950 text-violet-400 border border-violet-800 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </span>
                <div className="flex-1 overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{announcements[0].title}</p>
                  <p className="text-[11px] text-slate-400 truncate">{announcements[0].content}</p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{announcements[0].date}</span>
              </div>
            )}

            {/* Categories Filter Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-indigo-400" />
                  تصفية حسب المادة أو الشعبة:
                </span>
                <span className="text-xs text-slate-400">
                  عرض {filteredBooks.length} من أصل {books.length} كتاب
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-slate-800'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Books Grid */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onRead={(b) => setActiveReadingBook(b)}
                    isFavorite={favorites.includes(book.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">لم يتم العثور على كتب مطابقة</h3>
                <p className="text-xs text-slate-500 mt-1">جرب البحث بكلمة أخرى أو اختر تصنيفاً مختلفاً</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: Evaluations & Weekly Homework */}
        {currentTab === 'evaluations' && (
          <EvaluationsView evaluations={evaluations} />
        )}

        {/* VIEW 3: Interactive Exams */}
        {currentTab === 'exams' && (
          <ExamRunner exam={exams[0] || DEFAULT_EXAM} />
        )}

        {/* VIEW 4: Quran & Adhkar */}
        {currentTab === 'quran' && (
          <QuranSection />
        )}

        {/* VIEW 5: Student Favorites */}
        {currentTab === 'favorites' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border border-rose-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-3">
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                قائمتك المفضلة للوصول السريع
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                الكتب والمذكرات المحفوظة
              </h2>
              <p className="text-slate-300 text-sm mt-2">
                الكتب التي قمت بحفظها للرجوع إليها في أي وقت أثناء المذاكرة.
              </p>
            </div>

            {favoriteBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {favoriteBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onRead={(b) => setActiveReadingBook(b)}
                    isFavorite={true}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
                <Heart className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">لا توجد كتب في المفضلة حالياً</h3>
                <p className="text-xs text-slate-500 mt-1">اضغط على أيقونة القلب على أي كتاب لإضافته هنا</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 6: Teacher Dashboard */}
        {currentTab === 'teacher' && (
          <TeacherDashboard
            books={books}
            evaluations={evaluations}
            exams={exams}
            announcements={announcements}
            userId={user?.uid || 'teacher-admin'}
            user={user}
            onRefresh={() => {}}
          />
        )}

      </main>

      {/* Embedded Book Reader Modal */}
      <BookReaderModal
        book={activeReadingBook}
        onClose={() => setActiveReadingBook(null)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(role) => setUserRole(role)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p className="font-bold text-slate-300">
            منصة المكتبة التعليمية الشاملة • تانية بكالوريا والثانوية العامة 2026/2027
          </p>
          <p className="text-slate-500 text-[11px]">
            مدعومة بقاعدة بيانات حية (Firestore Backend) ولوحة تحكم متكاملة للمعلمين
          </p>
        </div>
      </footer>
    </div>
  );
}
