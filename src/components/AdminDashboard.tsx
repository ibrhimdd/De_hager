import React, { useState } from 'react';
import { Users, Download, Plus, RefreshCw, BarChart2, Shield, Settings, CheckCircle, Database, FileSpreadsheet, Key } from 'lucide-react';
import { Student, ExperimentalGroup, Web3State } from '../types';
import { storageService } from '../services/storageService';
import { web3Service } from '../services/web3Service';

interface AdminDashboardProps {
  students: Student[];
  onRefreshStudents: () => void;
  web3State: Web3State;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  students,
  onRefreshStudents,
  web3State,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNationalId, setNewNationalId] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newGroup, setNewGroup] = useState<ExperimentalGroup>('GROUP_A');
  const [contractAddressInput, setContractAddressInput] = useState(web3Service.getContractAddress());
  const [savedContractNotice, setSavedContractNotice] = useState(false);

  const groupAStudents = students.filter(s => s.group === 'GROUP_A');
  const groupBStudents = students.filter(s => s.group === 'GROUP_B');

  // Pre / Post Statistics
  const groupAPreAvg = groupAStudents.filter(s => s.preTestScore !== undefined).reduce((acc, s) => acc + (s.preTestScore || 0), 0) / (groupAStudents.filter(s => s.preTestScore !== undefined).length || 1);
  const groupAPostAvg = groupAStudents.filter(s => s.postTestScore !== undefined).reduce((acc, s) => acc + (s.postTestScore || 0), 0) / (groupAStudents.filter(s => s.postTestScore !== undefined).length || 1);

  const groupBPreAvg = groupBStudents.filter(s => s.preTestScore !== undefined).reduce((acc, s) => acc + (s.preTestScore || 0), 0) / (groupBStudents.filter(s => s.preTestScore !== undefined).length || 1);
  const groupBPostAvg = groupBStudents.filter(s => s.postTestScore !== undefined).reduce((acc, s) => acc + (s.postTestScore || 0), 0) / (groupBStudents.filter(s => s.postTestScore !== undefined).length || 1);

  const totalBadgesMinted = students.reduce((acc, s) => acc + s.badgesEarned.length, 0);
  const totalAuditReports = students.reduce((acc, s) => acc + (s.auditReports?.length || 0), 0);

  const handleToggleGroup = (student: Student) => {
    const nextGroup: ExperimentalGroup = student.group === 'GROUP_A' ? 'GROUP_B' : 'GROUP_A';
    storageService.updateStudent({ id: student.id, group: nextGroup });
    onRefreshStudents();
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newStudent: Student = {
      id: `std-${Date.now().toString().slice(-4)}`,
      name: newName,
      nationalId: newNationalId,
      email: newEmail || `student_${Date.now()}@univ.edu`,
      group: newGroup,
      walletAddress: `0x${Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')}`,
      activitiesCompleted: [],
      badgesEarned: []
    };

    const updated = [...students, newStudent];
    storageService.saveStudents(updated);
    onRefreshStudents();

    setNewName('');
    setNewNationalId('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const handleExportCSV = () => {
    const csvContent = storageService.exportDataToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CyberSec_Research_Dataset_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateContract = () => {
    web3Service.setContractAddress(contractAddressInput);
    setSavedContractNotice(true);
    setTimeout(() => setSavedContractNotice(false), 2500);
  };

  const handleResetData = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط عينة البحث للبيانات الافتراضية؟')) {
      storageService.resetAllToDefault();
      onRefreshStudents();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-500/30">
              وحدة إدارة وتصميم التجربة الميدانية
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              لوحة تحكم الباحث الأكاديمي (Research Admin Dashboard)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              إدارة توزيع الطلاب على المجموعتين التجريبيتين، ومتابعة مؤشرات الأداء، وتصدير البيانات الإحصائية لبرنامج SPSS.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              title="تصدير مصفوفة البيانات بصيغة CSV لـ SPSS"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير البيانات (SPSS CSV)</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة طالب</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400">إجمالي عينة البحث:</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-white">{students.length} طالباً</span>
            <span className="text-[11px] text-indigo-400 font-medium">{groupAStudents.length} مجموعة (1) / {groupBStudents.length} مجموعة (2)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400">شارات البلوكشين المصدرة (G1):</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-400">{totalBadgesMinted} شارة</span>
            <span className="text-[11px] text-slate-400">ERC-721 Soulbound</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400">تقارير التدقيق الجنائي المسلمة (G2):</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold text-emerald-400">{totalAuditReports} تقريراً</span>
            <span className="text-[11px] text-slate-400">مكتملة ومصححة</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1">
          <span className="text-xs text-slate-400">حالة الربط مع البلوكشين:</span>
          <div className="flex items-baseline justify-between">
            <span className="text-base font-bold text-cyan-300 truncate">{web3State.networkName}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Experimental Comparison Cards (Group 1 vs Group 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Group A Stats */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
              <h3 className="font-bold text-sm text-white">المجموعة الأولى: العقود الذكية والتقييم الآلي</h3>
            </div>
            <span className="text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              {groupAStudents.length} طلاب
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">متوسط الاختبار القبلي:</span>
              <span className="text-lg font-bold text-white">{groupAPreAvg.toFixed(2)} / 6</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">متوسط الاختبار البعدي:</span>
              <span className="text-lg font-bold text-cyan-300">
                {groupAPostAvg > 0 ? `${groupAPostAvg.toFixed(2)} / 6` : 'قيد التطبيق'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            المتغير المستقل: بيئة التعلم القائمة على العقود الذكية والتقييم والتعزيز الفوري بالشارات الرقمية.
          </p>
        </div>

        {/* Group B Stats */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
              <h3 className="font-bold text-sm text-white">المجموعة الثانية: سلسلة التتبع وتدقيق البيانات</h3>
            </div>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {groupBStudents.length} طلاب
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">متوسط الاختبار القبلي:</span>
              <span className="text-lg font-bold text-white">{groupBPreAvg.toFixed(2)} / 6</span>
            </div>
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">متوسط الاختبار البعدي:</span>
              <span className="text-lg font-bold text-emerald-300">
                {groupBPostAvg > 0 ? `${groupBPostAvg.toFixed(2)} / 6` : 'قيد التطبيق'}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            المتغير المستقل: بيئة التعلم القائمة على مستكشف الكتل اللامركزي وتدقيق الهاش والتحري الجنائي.
          </p>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>قائمة عينة البحث وتوزيع المجموعات التجريبية:</span>
          </h2>
          <button
            onClick={handleResetData}
            className="text-xs text-slate-400 hover:text-slate-200 underline"
          >
            إعادة تعيين البيانات الافتراضية
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">الطالب</th>
                <th className="p-3">المجموعة التجريبية</th>
                <th className="p-3">الاختبار القبلي</th>
                <th className="p-3">الاختبار البعدي</th>
                <th className="p-3">الكسب (Delta)</th>
                <th className="p-3">شارات / تقارير</th>
                <th className="p-3">بطاقة الملاحظة</th>
                <th className="p-3 text-center">تبديل المجموعة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {students.map((student) => {
                const gain = (student.postTestScore !== undefined && student.preTestScore !== undefined)
                  ? student.postTestScore - student.preTestScore
                  : null;

                return (
                  <tr key={student.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3 font-semibold text-white">
                      <div>{student.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{student.id}</div>
                    </td>

                    <td className="p-3">
                      {student.group === 'GROUP_A' ? (
                        <span className="bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30 text-[11px] font-semibold">
                          مجموعة 1: عقود ذكية
                        </span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 text-[11px] font-semibold">
                          مجموعة 2: سلسلة تتبع
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-mono">
                      {student.preTestScore !== undefined ? `${student.preTestScore} / 6` : '-'}
                    </td>

                    <td className="p-3 font-mono font-bold text-white">
                      {student.postTestScore !== undefined ? `${student.postTestScore} / 6` : '-'}
                    </td>

                    <td className="p-3 font-mono">
                      {gain !== null ? (
                        <span className={gain >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                          {gain > 0 ? `+${gain}` : gain}
                        </span>
                      ) : '-'}
                    </td>

                    <td className="p-3">
                      {student.group === 'GROUP_A' ? (
                        <span className="text-amber-400 font-bold">{student.badgesEarned.length} شارة</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">{student.auditReports?.length || 0} تقرير</span>
                      )}
                    </td>

                    <td className="p-3">
                      {student.checklistScores ? (
                        <span className="text-purple-400 font-bold">
                          {student.checklistScores.totalScore} / 40
                        </span>
                      ) : (
                        <span className="text-slate-500">لم تُقيّم</span>
                      )}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleToggleGroup(student)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] border border-slate-700 transition-all"
                        title="تحويل الطالب للمجموعة الأخرى للمقارنة"
                      >
                        تحويل إلى {student.group === 'GROUP_A' ? 'مجموعة (2)' : 'مجموعة (1)'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Smart Contract & Testnet Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-cyan-400" />
          <span>إعدادات العقد الذكي وشبكة البلوكشين المحلية (Ganache Local Testnet):</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2">
            <label className="block text-slate-400">عنوان العقد المنشور (Contract Address):</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={contractAddressInput}
                onChange={(e) => setContractAddressInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-cyan-300 font-mono text-xs focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleUpdateContract}
                className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold shrink-0 transition-all"
              >
                تحديث
              </button>
            </div>
            {savedContractNotice && (
              <span className="text-[11px] text-emerald-400 block">تم تحديث عنوان العقد الذكي بنجاح!</span>
            )}
          </div>

          <div className="space-y-2">
            <span className="block text-slate-400">بيانات الاتصال القياسية لـ Ganache:</span>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1">
              <div>RPC URL: <span className="text-white">http://127.0.0.1:7545</span> أو <span className="text-white">8545</span></div>
              <div>Chain ID: <span className="text-white">1337</span> أو <span className="text-white">5777</span></div>
              <div>Currency Symbol: <span className="text-white">ETH</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">إضافة طالب جديد لعينة البحث</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">اسم الطالب الرباعي:</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="مثال: فيصل سعود الشمري"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">الرقم الجامعي / الهوية:</label>
                <input
                  type="text"
                  value={newNationalId}
                  onChange={(e) => setNewNationalId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="10XXXXXXXX"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">البريد الأكاديمي:</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                  placeholder="student@univ.edu.sa"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">المجموعة التجريبية:</label>
                <select
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value as ExperimentalGroup)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="GROUP_A">المجموعة (1): العقود الذكية والتقييم الآلي</option>
                  <option value="GROUP_B">المجموعة (2): سلسلة التتبع وتدقيق البيانات</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-xs"
                >
                  حفظ الطالب
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
