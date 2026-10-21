import React, { useState } from 'react';
import { VideoItem, VideoAttachment, StudentNote } from '../data/initialData';
import {
  Play,
  Video,
  FileText,
  Download,
  Save,
  Clock,
  Sparkles,
  ExternalLink,
  Paperclip,
  CheckCircle2,
  Search,
  BookOpen,
  Filter,
  GraduationCap,
  FileCheck2,
  User,
  AlertCircle
} from 'lucide-react';

interface VideoSectionProps {
  videos: VideoItem[];
  theme?: 'dark' | 'light';
  studentUser: { name: string; phone: string; grade: string } | null;
  onSaveNote: (note: StudentNote) => Promise<void>;
  savedNotes: StudentNote[];
  onOpenAuthModal: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  videos,
  theme = 'dark',
  studentUser,
  onSaveNote,
  savedNotes,
  onOpenAuthModal
}) => {
  const isDark = theme === 'dark';
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(() => videos[0] || null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Note taking state
  const [noteContent, setNoteContent] = useState<string>('');
  const [isSavingNote, setIsSavingNote] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // When selected video changes, pre-load existing note if any
  React.useEffect(() => {
    if (selectedVideo && studentUser) {
      const existing = savedNotes.find(
        (n) => n.relatedItemId === selectedVideo.id && n.studentPhone === studentUser.phone
      );
      if (existing) {
        setNoteContent(existing.content);
      } else {
        setNoteContent('');
      }
    } else {
      setNoteContent('');
    }
    setSaveSuccessMsg(null);
  }, [selectedVideo?.id, studentUser?.phone, savedNotes]);

  // Convert raw URL into embeddable URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    // YouTube
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('watch?v=')) {
        videoId = url.split('watch?v=')[1]?.split('&')[0];
      } else if (url.includes('embed/')) {
        return url;
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : url;
    }
    // Google Drive
    if (url.includes('drive.google.com')) {
      if (url.includes('/view') || url.includes('/edit')) {
        return url.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview');
      }
      if (!url.includes('/preview')) {
        return url + (url.includes('?') ? '&preview=true' : '/preview');
      }
      return url;
    }
    return url;
  };

  const handleSaveNoteSubmit = async () => {
    if (!selectedVideo) return;
    if (!studentUser) {
      onOpenAuthModal();
      return;
    }
    if (!noteContent.trim()) {
      return;
    }

    setIsSavingNote(true);
    setSaveSuccessMsg(null);

    const noteId = `note-${studentUser.phone}-${selectedVideo.id}`;
    const newNote: StudentNote = {
      id: noteId,
      studentPhone: studentUser.phone,
      studentName: studentUser.name,
      title: `ملاحظات: ${selectedVideo.title}`,
      content: noteContent.trim(),
      relatedItemId: selectedVideo.id,
      relatedItemTitle: selectedVideo.title,
      updatedAt: new Date().toISOString()
    };

    try {
      await onSaveNote(newNote);
      setSaveSuccessMsg('تم حفظ ملاحظاتك وتلخيصاتك بنجاح في قاعدة البيانات! 💾✨');
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      alert('خطأ في حفظ الملاحظات: ' + err.message);
    } finally {
      setIsSavingNote(false);
    }
  };

  const filteredVideos = videos.filter((v) => {
    const matchesCat = activeCategory === 'all' || v.category === activeCategory;
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = ['all', ...Array.from(new Set(videos.map((v) => v.category)))];

  return (
    <div className="space-y-8" dir="rtl">
      {/* Header Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 shadow-xl transition-colors ${
          isDark
            ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 border-indigo-500/30 text-white'
            : 'bg-gradient-to-br from-indigo-50 via-white to-sky-50 border-indigo-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
              <Video className="w-3.5 h-3.5" />
              <span>منصة المحاضرات والفيديوهات التعليمية المتطورة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black">
              شروحات وفيديوهات المناهج والمواد
            </h1>
            <p className={`text-xs sm:text-sm mt-2 max-w-2xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              استمتع بمشاهدة الكورسات التأسيسية والشروحات التفاعلية، مع إمكانية تحميل أوراق العمل المرفقة وكتابة ملخصاتك وحفظها تلقائياً في قاعدة البيانات.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/30 font-bold">
              👑 برعاية وتطوير: محمد رمضان الحرباوي
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Player + Sidebar playlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Video Player + Notes */}
        <div className="lg:col-span-2 space-y-6">
          {selectedVideo ? (
            <div
              className={`rounded-3xl border overflow-hidden shadow-2xl transition-all ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              {/* Responsive Video Frame */}
              <div className="relative aspect-video w-full bg-black overflow-hidden group">
                {selectedVideo.videoUrl.endsWith('.mp4') || selectedVideo.videoUrl.endsWith('.webm') ? (
                  <video
                    src={selectedVideo.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    poster={selectedVideo.thumbnail}
                  />
                ) : (
                  <iframe
                    src={getEmbedUrl(selectedVideo.videoUrl)}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                )}
              </div>

              {/* Video Info Header */}
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl bg-indigo-600/20 text-indigo-400 font-bold text-xs border border-indigo-500/30">
                      {selectedVideo.category}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
                      {selectedVideo.grade}
                    </span>
                    {selectedVideo.duration && (
                      <span className="text-xs flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{selectedVideo.duration}</span>
                      </span>
                    )}
                  </div>

                  <a
                    href={selectedVideo.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold"
                  >
                    <span>فتح في صفحة مستقلة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <h2 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedVideo.title}
                </h2>

                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {selectedVideo.description}
                </p>

                {selectedVideo.teacherNotes && (
                  <div className={`p-4 rounded-2xl border ${
                    isDark ? 'bg-amber-950/30 border-amber-500/30 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <p className="text-xs font-bold flex items-center gap-1.5 mb-1 text-amber-400">
                      <Sparkles className="w-4 h-4" />
                      <span>توجيهات وملاحظات المعلم:</span>
                    </p>
                    <p className="text-xs leading-relaxed">{selectedVideo.teacherNotes}</p>
                  </div>
                )}

                {/* Attached Worksheets & Files */}
                <div className="pt-4 border-t border-slate-800">
                  <h3 className="text-sm font-bold flex items-center gap-2 mb-3">
                    <Paperclip className="w-4 h-4 text-cyan-400" />
                    <span>الملفات وأوراق العمل المرفقة مع هذا الفيديو:</span>
                  </h3>

                  {selectedVideo.attachments && selectedVideo.attachments.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedVideo.attachments.map((att) => (
                        <a
                          key={att.id}
                          href={att.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all hover:scale-[1.01] ${
                            isDark
                              ? 'bg-slate-800/70 hover:bg-slate-800 border-slate-700 text-slate-200'
                              : 'bg-slate-50 hover:bg-indigo-50/50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <span className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                              <FileText className="w-5 h-5" />
                            </span>
                            <div className="overflow-hidden">
                              <p className="text-xs font-bold truncate">{att.title}</p>
                              <span className="text-[10px] text-slate-400">ملف دراسي جاهز للتحميل</span>
                            </div>
                          </div>
                          <span className="p-2 rounded-xl bg-cyan-600/20 text-cyan-400">
                            <Download className="w-4 h-4" />
                          </span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-800/40 text-slate-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-slate-500" />
                      <span>لا توجد أوراق عمل مرفقة مع هذا الفيديو حالياً.</span>
                    </div>
                  )}
                </div>

                {/* Student Personal Notes Editor */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <FileCheck2 className="w-4 h-4 text-emerald-400" />
                      <span>ملاحظاتي وتلخيصاتي الخاصة بهذه المحاضرة</span>
                    </h3>
                    {studentUser ? (
                      <span className="text-xs text-slate-400">
                        طالب: <span className="font-bold text-indigo-400">{studentUser.name}</span>
                      </span>
                    ) : (
                      <button
                        onClick={onOpenAuthModal}
                        className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>سجل دخولك لحفظ ملاحظاتك باسمك</span>
                      </button>
                    )}
                  </div>

                  <p className="text-xs text-slate-400">
                    اكتب هنا ملخص القوانين أو الأسئلة التي تريد مراجعتها أثناء مشاهدة الفيديو، وسيتم حفظها بأمان في قاعدة البيانات تلقائياً عند الضغط على زر الحفظ.
                  </p>

                  <textarea
                    rows={4}
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    placeholder="اكتب ملاحظاتك وتلخيصاتك هنا (مثال: ملخص قاعدة كان وأخواتها، القانون المستخدم في المسألة الثانية، إلخ)..."
                    className={`w-full p-4 rounded-2xl text-sm border focus:ring-2 focus:ring-emerald-500/30 transition-all ${
                      isDark
                        ? 'bg-slate-950/80 border-slate-700 text-slate-100 placeholder-slate-500'
                        : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                    }`}
                  />

                  {saveSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{saveSuccessMsg}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleSaveNoteSubmit}
                      disabled={isSavingNote || !noteContent.trim()}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSavingNote ? 'جاري الحفظ في قاعدة البيانات...' : 'حفظ الملاحظات في قاعدة البيانات'}</span>
                    </button>

                    {savedNotes.some((n) => n.relatedItemId === selectedVideo.id) && (
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>لديك ملخص محفوظ لهذه المحاضرة</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-12 text-center rounded-3xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <Video className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-400">اختر فيديو من القائمة للبدء في المشاهدة</p>
            </div>
          )}
        </div>

        {/* Right Col: Video Playlist / List */}
        <div className="space-y-4">
          {/* Search in Videos */}
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في الفيديوهات والشروحات..."
              className={`w-full pr-10 pl-3 py-2.5 rounded-2xl text-xs border ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500' : 'bg-white border-slate-200 text-slate-900'
              }`}
            />
          </div>

          {/* Categories Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                  activeCategory === c
                    ? 'bg-indigo-600 text-white'
                    : isDark
                    ? 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c === 'all' ? 'جميع المواد' : c}
              </button>
            ))}
          </div>

          {/* Videos List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>قائمة المحاضرات ({filteredVideos.length})</span>
            </div>

            {filteredVideos.map((video, idx) => {
              const isSelected = selectedVideo?.id === video.id;
              return (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600/15 shadow-lg shadow-indigo-600/20'
                      : isDark
                      ? 'bg-slate-900/80 hover:bg-slate-800/80 border-slate-800 text-slate-200'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : isDark
                          ? 'bg-slate-800 text-slate-400'
                          : 'bg-indigo-50 text-indigo-600'
                      }`}
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400">
                          {video.category}
                        </span>
                        {video.duration && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold truncate">{video.title}</h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {video.description}
                      </p>

                      {video.attachments && video.attachments.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-semibold mt-1.5">
                          <Paperclip className="w-3 h-3" />
                          <span>{video.attachments.length} ملفات وأوراق عمل مرفقة</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
