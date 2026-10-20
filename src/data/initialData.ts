export interface BookItem {
  id: string;
  title: string;
  icon: string;
  category: string;
  grade: string;
  description: string;
  url: string;
  popular: number;
  isNew: boolean;
  teacherNotes?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface EvaluationItem {
  id: string;
  subject: string;
  icon: string;
  week: string;
  title: string;
  url: string;
  solutionUrl?: string;
  createdBy?: string;
  createdAt?: string;
}

export interface ExamQuestion {
  cat: string;
  q: string;
  opts: string[];
  ans: number;
  exp: string;
}

export interface ExamItem {
  id: string;
  title: string;
  subject: string;
  timeLimit: number;
  questions: ExamQuestion[];
  createdBy?: string;
  createdAt?: string;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: string;
  date: string;
  createdBy?: string;
  createdAt?: string;
}

export const CATEGORIES = [
  { id: 'all', name: 'الكل', icon: '📚' },
  { id: 'لغة عربية', name: 'لغة عربية', icon: '📖' },
  { id: 'تاريخ', name: 'تاريخ', icon: '🏛️' },
  { id: 'رياضيات', name: 'رياضيات', icon: '📐' },
  { id: 'فيزياء', name: 'فيزياء', icon: '⚡' },
  { id: 'كيمياء', name: 'كيمياء', icon: '🧪' },
  { id: 'أحياء', name: 'أحياء', icon: '🧬' },
  { id: 'مواد شرعية', name: 'مواد شرعية', icon: '🕌' },
  { id: 'لغات', name: 'لغات', icon: '🌍' },
  { id: 'فلسفة ومنطق', name: 'فلسفة ومنطق', icon: '💡' },
  { id: 'امتحانات ونماذج', name: 'امتحانات ونماذج', icon: '📝' },
];

export const DEFAULT_BOOKS: BookItem[] = [
  {
    id: 'book-1',
    title: 'كتاب التاريخ - ثانية بكالوريا والثانوية',
    icon: '🏛️',
    category: 'تاريخ',
    grade: 'الصف الثاني / الثالث الثانوي',
    description: 'الكتاب المدرسي المعتمد لمادة التاريخ يشمل الوحدات المقررة وخرائط التحليل التاريخي.',
    url: 'https://drive.google.com/file/d/1JQlVNklrEfleYtSSgntUNfUrP09mWhEu/view?usp=sharing',
    popular: 95,
    isNew: false,
    teacherNotes: 'ركز على تواريخ الحملة الفرنسية وبناء الدولة الحديثة في الفصل الثاني.'
  },
  {
    id: 'book-2',
    title: 'كتاب النحو الشامل وقواعد الإعراب',
    icon: '📖',
    category: 'لغة عربية',
    grade: 'الصف الثاني / الثالث الثانوي',
    description: 'شرح مبسط لقواعد النحو، إعراب الأفعال، التوابع، المنصوبات والمجرورات مع أمثلة تطبيقية.',
    url: 'https://drive.google.com/file/d/1DH8DeZDQqVnYfTovoug5EuGxTpA-7CqR/view?usp=sharing',
    popular: 98,
    isNew: true,
    teacherNotes: 'احرص على حل تدريبات التمييز والمستثنى بعد قراءة كل درس.'
  },
  {
    id: 'book-3',
    title: 'مذكرة التأسيس الذهبية في الرياضيات',
    icon: '📐',
    category: 'رياضيات',
    grade: 'علمي رياضة',
    description: 'أساسيات التفاضل والتكامل، الدوال، الجبر والهندسة الفراغية مع قوانين وحلول مباشرة.',
    url: 'https://drive.google.com/file/d/1qxqcD6p7RBt19L6EvxMRLa1aore8DmeD/view?usp=sharing',
    popular: 91,
    isNew: false,
    teacherNotes: 'مراجعة هذه المذكرة أساسية قبل البدء في منهج النهايات والاشتقاق.'
  },
  {
    id: 'book-4',
    title: 'الميسر في أصول الفقه الإسلامي',
    icon: '🕌',
    category: 'مواد شرعية',
    grade: 'شعبة العلوم الإسلامية والأدبية',
    description: 'مدخل ميسر في أصول الفقه، الأدلة الشرعية، القواعد الفقهية ومقاصد الشريعة.',
    url: 'https://drive.google.com/file/d/1S3guUKhyG89zaRtfRr4HTE_GKc0-gh2Z/view?usp=sharing',
    popular: 84,
    isNew: false,
    teacherNotes: 'هام جداً لفهم استنباط الأحكام والمصالح المرسلة.'
  },
  {
    id: 'book-5',
    title: 'ملخص الفصل الأول تاريخ (بناء الدولة الحديثة)',
    icon: '📜',
    category: 'تاريخ',
    grade: 'الصف الثاني / الثالث الثانوي',
    description: 'ملخص مكثف لأهم نقاط القوة والتسلسل الزمني لسياسة محمد علي الداخلية والخارجية.',
    url: 'https://drive.google.com/file/d/1qeeYaaEYTOUM4J9y3y_i92jA6nB8_eY/view?usp=sharing',
    popular: 89,
    isNew: true,
    teacherNotes: 'تم إعداد هذا التلخيص للمراجعة السريعة ليلة الامتحان.'
  },
  {
    id: 'book-6',
    title: 'كتاب الكافي في علوم البلاغة العربية',
    icon: '✨',
    category: 'لغة عربية',
    grade: 'جميع الشعب',
    description: 'شرح علم المعاني، علم البيان (التشبيه والاستعارة والكناية)، وعلم البديع بالتفصيل.',
    url: 'https://drive.google.com/file/d/1IxPP_VsH2Wom8T5n3IyPduudFXd3-DSc/view?usp=sharing',
    popular: 88,
    isNew: false,
    teacherNotes: 'أتقن الفرق بين الاستعارة التصريحية والمكنية من خلال الأمثلة المحلولة.'
  },
  {
    id: 'book-7',
    title: 'مذكرة الفيزياء الحديثة والكهربية',
    icon: '⚡',
    category: 'فيزياء',
    grade: 'شعبة العلوم والرياضيات',
    description: 'قوانين كيرشوف، الحث الكهرومغناطيسي، وأطياف الذرة مع مسائل نموذجية.',
    url: 'https://drive.google.com/file/d/1bC-17hC06L05p3w37gJkY8r6vY-fS99L/view?usp=sharing',
    popular: 92,
    isNew: true,
    teacherNotes: 'انتبه لوحدات القياس والتحويلات عند حل مسائل قانون فاراداي.'
  },
  {
    id: 'book-8',
    title: 'كتاب الكيمياء العضوية والتحليلية',
    icon: '🧪',
    category: 'كيمياء',
    grade: 'شعبة العلوم والرياضيات',
    description: 'تفاعلات الهيدروكربونات، الكحولات، الأسترات مع مخططات كشف الشقوق الحامضية والقاعدية.',
    url: 'https://drive.google.com/file/d/1dH8DeZDQqVnYfTovoug5EuGxTpA-901K/view?usp=sharing',
    popular: 94,
    isNew: false,
    teacherNotes: 'احفظ معادلات تحضير غاز الميثان والإيثين وكواشف الأكسدة والاختزال.'
  },
  {
    id: 'book-9',
    title: 'كتاب الفلسفة وقضايا العصر والمنطق الصوري',
    icon: '💡',
    category: 'فلسفة ومنطق',
    grade: 'الشعبة الأدبية',
    description: 'الأخلاق البيئية والبيوطبية، الاستدلال الاستقرائي ومغالطات التفكير المعاصر.',
    url: 'https://drive.google.com/file/d/1Z_f8_yO9qKlWbSgntUNfUrP09mWhEu/view?usp=sharing',
    popular: 82,
    isNew: false,
    teacherNotes: 'ركز على فلسفة هانز يوناس ودانيال كالهان في مسؤولية الأجيال القادمة.'
  }
];

export const DEFAULT_EVALUATIONS: EvaluationItem[] = [
  {
    id: 'eval-1',
    subject: 'اللغة العربية',
    icon: '📖',
    week: 'الأسبوع الأول',
    title: 'تقييم النحو والبلاغة - الأسبوع 1',
    url: 'https://drive.google.com/file/d/1IxPP_VsH2Wom8T5n3IyPduudFXd3-DSc/view?usp=sharing',
    solutionUrl: 'https://drive.google.com/file/d/1DH8DeZDQqVnYfTovoug5EuGxTpA-7CqR/view?usp=sharing'
  },
  {
    id: 'eval-2',
    subject: 'اللغة العربية',
    icon: '📖',
    week: 'الأسبوع الثاني',
    title: 'واجب القراءة المتحررة والتعبير - الأسبوع 2',
    url: 'https://drive.google.com/file/d/1IxPP_VsH2Wom8T5n3IyPduudFXd3-DSc/view?usp=sharing',
    solutionUrl: 'https://drive.google.com/file/d/1DH8DeZDQqVnYfTovoug5EuGxTpA-7CqR/view?usp=sharing'
  },
  {
    id: 'eval-3',
    subject: 'التاريخ',
    icon: '🏛️',
    week: 'الأسبوع الأول',
    title: 'تقييم الدرس الأول: الحملة الفرنسية وأثرها',
    url: 'https://drive.google.com/file/d/1JQlVNklrEfleYtSSgntUNfUrP09mWhEu/view?usp=sharing',
    solutionUrl: 'https://drive.google.com/file/d/1qeeYaaEYTOUM4J9y3y_i92jA6nB8_eY/view?usp=sharing'
  },
  {
    id: 'eval-4',
    subject: 'الرياضيات',
    icon: '📐',
    week: 'الأسبوع الأول',
    title: 'تقييم النهايات والاتصال - الأسبوع 1',
    url: 'https://drive.google.com/file/d/1qxqcD6p7RBt19L6EvxMRLa1aore8DmeD/view?usp=sharing',
    solutionUrl: 'https://drive.google.com/file/d/1qxqcD6p7RBt19L6EvxMRLa1aore8DmeD/view?usp=sharing'
  },
  {
    id: 'eval-5',
    subject: 'الفيزياء',
    icon: '⚡',
    week: 'الأسبوع الثاني',
    title: 'تقييم التيار الكهربي وتوصيل المقاومات',
    url: 'https://drive.google.com/file/d/1bC-17hC06L05p3w37gJkY8r6vY-fS99L/view?usp=sharing',
    solutionUrl: 'https://drive.google.com/file/d/1bC-17hC06L05p3w37gJkY8r6vY-fS99L/view?usp=sharing'
  }
];

export const DEFAULT_EXAM: ExamItem = {
  id: 'exam-naho-1',
  title: 'امتحان النحو الشامل (التطبيقي)',
  subject: 'لغة عربية',
  timeLimit: 15,
  questions: [
    {
      cat: "الفاعل",
      q: "في الجملة: (أكَلَ الولدُ التفاحةَ) — ما إعراب كلمة (الولدُ)؟",
      opts: ["فاعل مرفوع بالضمة", "مبتدأ مرفوع", "نائب فاعل مرفوع", "مفعول به منصوب"],
      ans: 0,
      exp: "الولدُ: فاعل مرفوع وعلامة رفعه الضمة الظاهرة لأنه من قام بالفعل."
    },
    {
      cat: "المفعول به",
      q: "في الجملة: (شرِبَ الطالبُ الماءَ) — ما إعراب (الماءَ)؟",
      opts: ["فاعل مرفوع", "مفعول به منصوب بالفتحة", "مبتدأ مؤخر", "تمييز منصوب"],
      ans: 1,
      exp: "الماءَ: مفعول به منصوب وعلامة نصبه الفتحة الظاهرة لأنه وقع عليه فعل الفاعل."
    },
    {
      cat: "نائب الفاعل",
      q: "في الجملة: (كُسِرَ الزجاجُ) — ما إعراب (الزجاجُ)؟",
      opts: ["فاعل مرفوع", "مبتدأ مرفوع", "نائب فاعل مرفوع بالضمة", "خبر مرفوع"],
      ans: 2,
      exp: "الزجاجُ: نائب فاعل مرفوع لأن الفعل (كُسِرَ) مبني للمجهول مضموم أوله مكسور ما قبل آخره."
    },
    {
      cat: "كان وأخواتها",
      q: "في الجملة: (كانَ الجوُّ باردًا) — ما إعراب كلمة (باردًا)؟",
      opts: ["خبر كان منصوب بالفتحة", "اسم كان مرفوع", "حال منصوب", "نعت منصوب"],
      ans: 0,
      exp: "باردًا: خبر كان منصوب وعلامة نصبه الفتحة، وكان ترفع المبتدأ وتنصب الخبر."
    },
    {
      cat: "إنّ وأخواتها",
      q: "في الجملة: (إنَّ الحقَّ منتصرٌ) — ما إعراب كلمة (الحقَّ)؟",
      opts: ["اسم إنّ منصوب بالفتحة", "خبر إنّ مرفوع", "مبتدأ منصوب", "فاعل مرفوع"],
      ans: 0,
      exp: "الحقَّ: اسم إنّ منصوب وعلامة نصبه الفتحة الظاهرة."
    },
    {
      cat: "الحال",
      q: "في الجملة: (جاءَ المعلمُ مسرورًا) — ما إعراب كلمة (مسرورًا)؟",
      opts: ["مفعول به", "تمييز منصوب", "حال منصوبة بالفتحة", "نعت مرفوع"],
      ans: 2,
      exp: "مسرورًا: حال منصوبة بالفتحة تبين هيئة الفاعل حين وقوع الفعل (إجابة كيف جاء المعلم؟)."
    },
    {
      cat: "التمييز",
      q: "في الجملة: (اشتريتُ عشرينَ كتابًا) — ما إعراب كلمة (كتابًا)؟",
      opts: ["مفعول به", "تمييز منصوب بالفتحة", "حال منصوب", "مضاف إليه مجرور"],
      ans: 1,
      exp: "كتابًا: تمييز ملفوظ منصوب بالفتحة بعد العدد من 11 إلى 99 يكون مفرداً منصوباً."
    },
    {
      cat: "المستثنى",
      q: "في الجملة: (حضرَ الطلابُ إلا زيدًا) — ما حكم إعراب (زيدًا)؟",
      opts: ["مستثنى واجب النصب بالفتحة", "بدل مرفوع", "مفعول به", "فاعل مؤخر"],
      ans: 0,
      exp: "زيدًا: مستثنى منصوب وجوباً لأن الكلام تام مثبت."
    }
  ]
};

export const DEFAULT_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    title: 'مرحباً بطلاب تانية بكالوريا والثانوية العامة للعام الدراسي الجديد',
    content: 'تم تحديث جميع كتب الوزارة والتقييمات الأسبوعية ونماذج الإجابة النموذجية لكافة المواد والشعب.',
    category: 'تنبيه عام',
    date: 'اليوم'
  },
  {
    id: 'ann-2',
    title: 'بدء نشر تقييمات الأسبوع الثالث والواجبات المدرسية',
    content: 'يمكنكم تحميل أوراق العمل وتقييمات الأسبوع الثالث من قسم التقييمات مع الحلول المعتمدة.',
    category: 'واجب مدرسي',
    date: 'أمس'
  },
  {
    id: 'ann-3',
    title: 'تفعيل لوحة تحكم المعلمين لإضافة المواد والاختبارات',
    content: 'يمكن للمعلمين تسجيل الدخول وإضافة كتب جديدة، تقييمات أسبوعية، أو إنشاء اختبارات إلكترونية تفاعلية للطلاب.',
    category: 'إشعار للمدرسين',
    date: 'منذ يومين'
  }
];
