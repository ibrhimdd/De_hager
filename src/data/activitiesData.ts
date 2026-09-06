import { CyberActivity } from '../types';

export const CYBER_ACTIVITIES: CyberActivity[] = [
  {
    id: 'act-1',
    title: 'تحديد وتقييم الثغرات الأمنية السيبرانية',
    stage: 'تحديد الثغرات',
    description: 'فحص نظام مستشفى رقمي واكتشاف ثغرات حقن الاستعلامات (SQLi) وضعف المصادقة (Broken Authentication) لتحديد مسار التهديد.',
    scenario: 'خلال فحص دوري لبوابة المرضى الإلكترونية بمستشفى جامعي، رصد فريق مراقبة الأمان (SOC) محاولات وصول غير طبيعية إلى جدول السجلات الطبية. يتطلب منك فحص الشفرة وسجلات الخادم، وتحديد نوع الثغرة المستغلة، وتأكيد أسلوب المعالجة البرمجية الصارم.',
    objectives: [
      'فحص سجلات المدخلات البرمجية لتحديد هجمات SQL Injection',
      'كشف خلل إدارة الجلسات ومصادقة المستخدمين',
      'توليد التوقيع الرقمي المشفر للحل واعتماده برمجياً'
    ],
    smartContractFunction: 'verifyAndIssueBadge(1, 0x3f5d1e67b2d556..., "Vulnerability Assessment", "مبتدئ", ...)',
    badgeReward: {
      name: 'شارة خبير استكشاف الثغرات',
      description: 'تم التحقق آلياً بواسطة العقد الذكي من قدرة الباحث/الطالب على تحديد وتحييد ثغرات الحقن والمصادقة.',
      level: 'مبتدئ',
      icon: 'ShieldAlert'
    },
    tasks: [
      {
        id: 't1-1',
        question: 'أي من الاستعلامات التالية يمثل ثغرة حقن SQL غير مؤمنة تُمكن المهاجم من تجاوز التحقق من الهوية؟',
        type: 'multiple-choice',
        options: [
          { label: 'SELECT * FROM users WHERE user = ? AND pass = ? (Parameterized Query)', value: 'A', isCorrect: false },
          { label: 'SELECT * FROM users WHERE user = \'admin\' --\' AND pass = \'\' (Dynamic String Concatenation)', value: 'B', isCorrect: true },
          { label: 'ORM.Users.find({ where: { username, passwordHash } })', value: 'C', isCorrect: false },
          { label: 'StoredProcedure_VerifyUser(@user, @passHash)', value: 'D', isCorrect: false }
        ],
        correctAnswer: 'B',
        explanation: 'دمج المدخلات النصية دون تجهيز مسبق (Prepared Statements) يسمح للمهاجم باستخدام الرمز `--` لتجاوز فحص كلمة المرور.'
      },
      {
        id: 't1-2',
        question: 'ما هي الإجراءات الدفاعية الجذرية الأنسب لمعالجة ثغرة Broken Authentication في جلسات الويب؟',
        type: 'multiple-choice',
        options: [
          { label: 'زيادة مدة صلاحية الـ Session Token إلى 30 يوماً وتخزينه في LocalStorage', value: 'A', isCorrect: false },
          { label: 'تطبيق التوثيق متعدد العوامل (MFA) وتعيين ملفات تعريف الارتباط بخاصية HttpOnly و Secure و SameSite=Strict مع تجديد الـ Session ID بعد تسجيل الدخول', value: 'B', isCorrect: true },
          { label: 'إلغاء تشفير كلمات المرور لتسهيل فحصها من قبل مدير الشبكة', value: 'C', isCorrect: false },
          { label: 'الاعتماد على عنوان IP فقط للمصادقة', value: 'D', isCorrect: false }
        ],
        correctAnswer: 'B',
        explanation: 'حماية الـ Cookies بخواص HttpOnly و SameSite مع تجديد Session ID يمنع هجمات سرقة الجلسة (Session Hijacking) و XSS.'
      },
      {
        id: 't1-3',
        question: 'ما هو التوقيع الرقمي الآلي المعتمد في العقد الذكي لإثبات اجتياز فحص الثغرات (Automated Proof Payload)؟',
        type: 'action-selection',
        options: [
          { label: 'SQL_INJECTION_AND_BROKEN_AUTH_MITIGATED (مطابقة لمعيار keccak256 في العقد)', value: 'VERIFIED_HASH_MATCH', isCorrect: true },
          { label: 'IGNORE_VULNERABILITY_TEMPORARILY', value: 'WRONG_1', isCorrect: false },
          { label: 'BYPASS_SECURITY_FIREWALL_LOGS', value: 'WRONG_2', isCorrect: false }
        ],
        correctAnswer: 'VERIFIED_HASH_MATCH',
        explanation: 'يقوم العقد الذكي بمطابقة keccak256 لهذا التوقيع الرياضي المشفر لمنح الشارة رقمياً بدون تدخل بشري.'
      }
    ]
  },
  {
    id: 'act-2',
    title: 'تحليل أثر الخطر السيبراني وحساب مؤشر CVSS',
    stage: 'تحليل أثر الخطر',
    description: 'تطبيق مقاييس تقييم المخاطر وتحديد درجة خطورة الثغرة (CVSS v3.1) وتحديد مصفوفة الأثر والاحتمالية وفق المعايير الدولية.',
    scenario: 'تم اكتشاف ثغرة خطيرة في واجهة برمجة التطبيقات (API Endpoint) لنظام الدفع، تتيح للمستخدمين غير المصرح لهم قراءة وتعديل أرصدة المحافظ دون الحاجة لامتيازات خاصة وعبر الشبكة العامة. المطلوب: حساب درجة CVSS، وتحديد مستوى الأثر على الثالوث الأمني (CIA Triad: السرية، السلامة، والتوافر).',
    objectives: [
      'حساب درجة CVSS الأساسية (Base Score) بناءً على مقاييس الهجوم والأثر',
      'تحديد تصنيف الخطر (Critical / High / Medium / Low) في مصفوفة المخاطر',
      'تشفير مصفوفة الخطر واستدعاء العقد الذكي للتحقق من دقة التقييم'
    ],
    smartContractFunction: 'verifyAndIssueBadge(2, 0x894e772ea11b0e..., "Risk Impact Analysis", "متقدم", ...)',
    badgeReward: {
      name: 'شارة محلل أثر المخاطر المحترف',
      description: 'ممنوحة آلياً للطالب بعد إثبات دقة الحساب الرياضي لمعاملات CVSS وتقييم مصفوفة المخاطر بنجاح.',
      level: 'متقدم',
      icon: 'BarChart3'
    },
    tasks: [
      {
        id: 't2-1',
        question: 'في الثغرة الموضحة بالسيناريو (متجه الهجوم عبر الشبكة، التعقيد منخفض، لا تتطلب امتيازات، لا تتطلب تفاعل مستخدم، الأثر على السرية والسلامة مرتفع): ما هي درجة CVSS v3.1 المتوقعة تقريباً؟',
        type: 'multiple-choice',
        options: [
          { label: 'درجة منخفضة (Low: 2.1 - 3.9)', value: 'A', isCorrect: false },
          { label: 'درجة متوسطة (Medium: 4.0 - 6.9)', value: 'B', isCorrect: false },
          { label: 'درجة عالية إلى حرجة (High / Critical: 8.5 - 9.8)', value: 'C', isCorrect: true },
          { label: 'خطر صفري (None: 0.0)', value: 'D', isCorrect: false }
        ],
        correctAnswer: 'C',
        explanation: 'متجه هجوم شبكي (AV:N) مع تعقيد منخفض (AC:L) ودون صلاحيات (PR:N) وتأثير مباشر على السلامة والسرية يضع الدرجة في فئة High أو Critical.'
      },
      {
        id: 't2-2',
        question: 'إذا كان احتمال حدوث الهجوم "مرتفع جداً" والأثر المالي والتشغيلي "كارثي"، أين يقع هذا الخطر في مصفوفة إدارة المخاطر؟',
        type: 'multiple-choice',
        options: [
          { label: 'منطقة القبول والتجاهل (Accept & Retain)', value: 'A', isCorrect: false },
          { label: 'منطقة الخطر الحرج / الأولوية القصوى رقم 1 (Immediate Remediation & Mitigation)', value: 'B', isCorrect: true },
          { label: 'تأجيل المعالجة للربع المالي القادم', value: 'C', isCorrect: false },
          { label: 'نقل الخطر إلى الموظفين شخصياً', value: 'D', isCorrect: false }
        ],
        correctAnswer: 'B',
        explanation: 'تقاطع الاحتمالية العالية مع الأثر الكارثي يضع الخطر في الخانة الحمراء القصوى التي تستوجب الاستجابة الفورية.'
      },
      {
        id: 't2-3',
        question: 'تأكيد صحة الحل لنشاط تقييم الأثر بالعقد الذكي (High Impact CVSS Solution Hash):',
        type: 'action-selection',
        options: [
          { label: 'HIGH_IMPACT_CVSS_SCORE_8_8_VERIFIED (التوقيع المطابق للعقد الذكي)', value: 'VERIFIED_HASH_MATCH', isCorrect: true },
          { label: 'LOW_PRIORITY_RISK_REJECTED', value: 'WRONG_1', isCorrect: false }
        ],
        correctAnswer: 'VERIFIED_HASH_MATCH',
        explanation: 'التحقق الآلي من حل الطالب لترقية شارة الإنجاز إلى "متقدم" في سجل البلوكشين.'
      }
    ]
  },
  {
    id: 'act-3',
    title: 'تنفيذ خطة الاستجابة للحوادث السيبرانية (Incident Response)',
    stage: 'تنفيذ خطة الاستجابة',
    description: 'محاكاة تسلسل خطوات الاستجابة لحادث أمني طبقاً لدورة حياة NIST SP 800-61 (الاحتواء، الاستئصال، التعافي، والدروس المستفادة).',
    scenario: 'تعرضت خوادم المؤسسة لهجمة برمجيات الفدية (Ransomware) بدأت عبر بريد تصيد احتيالي (Phishing)، ويحاول المهاجم التحرك الجانبي (Lateral Movement) نحو خوادم النسخ الاحتياطي ووحدة تحكم المجال (Domain Controller). المطلوب: تنفيذ الخطوات المعيارية لاحتواء الهجمة وتطهير البيئة واستعادة الخدمات بأمان.',
    objectives: [
      'تطبيق إجراءات الاحتواء العاجل (Containment) لمنع انتشار الفدية',
      'تنفيذ مرحلة الاستئصال (Eradication) للبرمجيات الخبيثة ومفاتيح التهديد',
      'تنفيذ إجراءات التعافي (Recovery) وتوثيق الأدلة الجنائية في البلوكشين'
    ],
    smartContractFunction: 'verifyAndIssueBadge(3, 0x7a305f8f8bb1..., "Incident Response Plan", "خبير", ...)',
    badgeReward: {
      name: 'شارة خبير الاستجابة للحوادث السيبرانية',
      description: 'أعلى شارة رقمية تصدرها المنصة آلياً لإثبات إتقان بروتوكولات احتواء واستئصال الحوادث السيبرانية المتقدمة.',
      level: 'خبير',
      icon: 'Award'
    },
    tasks: [
      {
        id: 't3-1',
        question: 'ما هو الإجراء الفوري الأول الواجب اتخاذه في مرحلة الاحتواء (Containment) عند رصد انتشار برمجية فدية نشطة؟',
        type: 'multiple-choice',
        options: [
          { label: 'إعادة تشغيل جميع الخوادم المصابة على الفور', value: 'A', isCorrect: false },
          { label: 'عزل الأجهزة المصابة شبكياً فوراً (Network Isolation) وفصلها عن شبكة المؤسسة وخوادم النسخ الاحتياطي مع الحفاظ على الذاكرة العشوائية RAM سليمة للفحص الجنائي', value: 'B', isCorrect: true },
          { label: 'دفع الفدية فوراً بعملات مشفرة للمهاجم دون إبلاغ الإدارة', value: 'C', isCorrect: false },
          { label: 'تنسيق (Format) كافة الأقراص الصلبة دون أخذ نسخ احتياطية للأدلة', value: 'D', isCorrect: false }
        ],
        correctAnswer: 'B',
        explanation: 'العزل الشبكي يوقف الانتشار الجانبي فوراً، والحفاظ على RAM يتيح استخراج مفاتيح التشفير ومسار الهجمة في الفحص الجنائي.'
      },
      {
        id: 't3-2',
        question: 'في مرحلة الاستئصال والتعافي (Eradication & Recovery)، ما هو الترتيب الصحيح للعمليات؟',
        type: 'multiple-choice',
        options: [
          { label: 'إعادة الاتصال بالإنترنت أولاً ثم البحث عن الثغرة لاحقاً', value: 'A', isCorrect: false },
          { label: 'إزالة البرمجيات الخبيثة، سد الثغرة المستغلة، تغيير كافة كلمات المرور والشهادات، واستعادة البيانات من نسخ احتياطية معزولة ونظيفة مع مراقبة مكثفة لحركة الشبكة', value: 'B', isCorrect: true },
          { label: 'تجاهل الحسابات المخترقة والاكتفاء بمضاد فيروسات عادي', value: 'C', isCorrect: false }
        ],
        correctAnswer: 'B',
        explanation: 'الاستئصال يتطلب تطهير الحسابات والبرمجيات الخبيثة وسد نقطة الدخول قبل إعادة تشغيل الخدمات.'
      },
      {
        id: 't3-3',
        question: 'تأكيد تنفيذ دورة الاستجابة الكاملة بالرمز المشفر المعتمد (NIST Incident Response Protocol):',
        type: 'action-selection',
        options: [
          { label: 'CONTAINMENT_ERADICATION_RECOVERY_DONE (المطابق لشرط العقد الذكي)', value: 'VERIFIED_HASH_MATCH', isCorrect: true },
          { label: 'ABORT_INCIDENT_PLAN', value: 'WRONG_1', isCorrect: false }
        ],
        correctAnswer: 'VERIFIED_HASH_MATCH',
        explanation: 'يتم إرسال هذا التوقيع للعقد الذكي لصك شارة "خبير" وتسجيل الإنجاز نهائياً في محفظة الطالب.'
      }
    ]
  }
];
