import { Student, ObservationScore, AuditReport, DigitalBadge } from '../types';

const STORAGE_KEY_STUDENTS = 'cybersec_research_students_v1';
const STORAGE_KEY_CURRENT_STUDENT = 'cybersec_research_active_student_id_v1';
const STORAGE_KEY_REPORTS = 'cybersec_research_audit_reports_v1';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-101',
    name: 'أحمد محمود العبدالله',
    nationalId: '1098234512',
    email: 'ahmed.student@univ.edu.sa',
    group: 'GROUP_A',
    walletAddress: '0x71C0A98F735c02F6b72a0845B25884B1cE84498e',
    preTestScore: 4,
    activitiesCompleted: ['act-1'],
    badgesEarned: [
      {
        id: 'badge-101-1',
        tokenId: 104,
        name: 'شارة خبير استكشاف الثغرات',
        description: 'تم التحقق آلياً بواسطة العقد الذكي من قدرة الطالب على تحييد ثغرات الحقن والمصادقة.',
        activityId: 'act-1',
        level: 'مبتدئ',
        icon: 'ShieldAlert',
        issueDate: '2026-09-06 09:40 UTC',
        txHash: '0x9a8f2c3498877bc955e8c13f5d1e67b2d5568f18d72f913d0739ba6188448ea9',
        blockNumber: 10481,
        contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        verifiableHash: '0x3f5d1e67b2d5568f18d72f913d0739ba6188448ea9ef8f2c3498877bc955e8c1',
        criteria: 'SQL_INJECTION_AND_BROKEN_AUTH_MITIGATED'
      }
    ]
  },
  {
    id: 'std-102',
    name: 'سارة خالد المنصور',
    nationalId: '1087452391',
    email: 'sara.khalid@univ.edu.sa',
    group: 'GROUP_A',
    walletAddress: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    preTestScore: 3,
    activitiesCompleted: [],
    badgesEarned: []
  },
  {
    id: 'std-201',
    name: 'عبدالرحمن طارق الحربي',
    nationalId: '1076239485',
    email: 'abdulrahman.h@univ.edu.sa',
    group: 'GROUP_B',
    walletAddress: '0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C',
    preTestScore: 4,
    activitiesCompleted: [],
    badgesEarned: []
  },
  {
    id: 'std-202',
    name: 'نورة فهد السبيعي',
    nationalId: '1099834120',
    email: 'noura.fahad@univ.edu.sa',
    group: 'GROUP_B',
    walletAddress: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    preTestScore: 3,
    activitiesCompleted: [],
    badgesEarned: []
  }
];

class StorageService {
  public getStudents(): Student[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_STUDENTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Error reading students from localStorage:', e);
    }
    this.saveStudents(INITIAL_STUDENTS);
    return INITIAL_STUDENTS;
  }

  public saveStudents(students: Student[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Error saving students to localStorage:', e);
    }
  }

  public getActiveStudent(): Student {
    const students = this.getStudents();
    const activeId = localStorage.getItem(STORAGE_KEY_CURRENT_STUDENT);
    const found = students.find(s => s.id === activeId);
    return found || students[0];
  }

  public setActiveStudentId(id: string): void {
    localStorage.setItem(STORAGE_KEY_CURRENT_STUDENT, id);
  }

  public updateStudent(updated: Partial<Student> & { id: string }): Student {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === updated.id);
    if (index !== -1) {
      students[index] = { ...students[index], ...updated };
      this.saveStudents(students);
      return students[index];
    }
    return students[0];
  }

  public addStudentBadge(studentId: string, badge: DigitalBadge): void {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (student) {
      const exists = student.badgesEarned.some(b => b.activityId === badge.activityId);
      if (!exists) {
        student.badgesEarned.push(badge);
        if (!student.activitiesCompleted.includes(badge.activityId)) {
          student.activitiesCompleted.push(badge.activityId);
        }
        this.saveStudents(students);
      }
    }
  }

  public savePreTestResult(studentId: string, score: number): void {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (student) {
      student.preTestScore = score;
      student.preTestCompletedAt = new Date().toISOString();
      this.saveStudents(students);
    }
  }

  public savePostTestResult(studentId: string, score: number): void {
    const students = this.getStudents();
    const student = students.find(s => s.id === studentId);
    if (student) {
      student.postTestScore = score;
      student.postTestCompletedAt = new Date().toISOString();
      this.saveStudents(students);
    }
  }

  public saveObservationScore(score: ObservationScore): void {
    const students = this.getStudents();
    const student = students.find(s => s.id === score.studentId);
    if (student) {
      student.checklistScores = score;
      this.saveStudents(students);
    }
  }

  public saveAuditReport(report: AuditReport): void {
    const students = this.getStudents();
    const student = students.find(s => s.id === report.studentId);
    if (student) {
      if (!student.auditReports) {
        student.auditReports = [];
      }
      student.auditReports.push(report);
      if (!student.activitiesCompleted.includes('audit-task-1')) {
        student.activitiesCompleted.push('audit-task-1');
      }
      this.saveStudents(students);
    }
  }

  /**
   * تصدير بيانات التجربة بصيغة CSV جاهزة للتحليل الإحصائي (SPSS / Excel)
   */
  public exportDataToCSV(): string {
    const students = this.getStudents();
    const headers = [
      'Student_ID',
      'Name',
      'National_ID',
      'Group_Code', // A = 1 (Smart Contracts), B = 2 (Decentralized Traceability)
      'Group_Name',
      'Wallet_Address',
      'Pre_Test_Score',
      'Post_Test_Score',
      'Gain_Score', // Post - Pre
      'Badges_Earned_Count',
      'Audit_Reports_Submitted',
      'Observation_Identification',
      'Observation_Analysis',
      'Observation_Evaluation',
      'Observation_Mitigation',
      'Observation_Total_Score',
      'Experiment_Status'
    ];

    const rows = students.map(s => {
      const pre = s.preTestScore ?? '';
      const post = s.postTestScore ?? '';
      const gain = (typeof post === 'number' && typeof pre === 'number') ? (post - pre) : '';
      const obs = s.checklistScores;
      const groupCode = s.group === 'GROUP_A' ? 1 : 2;
      const groupName = s.group === 'GROUP_A' ? 'Smart Contracts & Verification' : 'Decentralized Traceability & Auditing';
      const status = (s.preTestScore !== undefined && (s.badgesEarned.length > 0 || (s.auditReports && s.auditReports.length > 0))) ? 'Completed' : 'In_Progress';

      return [
        `"${s.id}"`,
        `"${s.name}"`,
        `"${s.nationalId || ''}"`,
        groupCode,
        `"${groupName}"`,
        `"${s.walletAddress || ''}"`,
        pre,
        post,
        gain,
        s.badgesEarned.length,
        s.auditReports?.length || 0,
        obs ? obs.dimensions.identification : '',
        obs ? obs.dimensions.analysis : '',
        obs ? obs.dimensions.evaluation : '',
        obs ? obs.dimensions.mitigation : '',
        obs ? obs.totalScore : '',
        `"${status}"`
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  public resetAllToDefault(): void {
    this.saveStudents(INITIAL_STUDENTS);
    this.setActiveStudentId(INITIAL_STUDENTS[0].id);
  }
}

export const storageService = new StorageService();
