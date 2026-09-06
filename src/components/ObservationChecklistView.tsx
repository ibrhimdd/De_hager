import React, { useState } from 'react';
import { CheckSquare, Star, Save, UserCheck, Shield, Award, CheckCircle2 } from 'lucide-react';
import { Student, ObservationScore } from '../types';
import { OBSERVATION_CHECKLIST_CRITERIA } from '../data/assessmentData';
import { storageService } from '../services/storageService';

interface ObservationChecklistViewProps {
  activeStudent: Student;
  onRefreshStudent: () => void;
}

export const ObservationChecklistView: React.FC<ObservationChecklistViewProps> = ({
  activeStudent,
  onRefreshStudent,
}) => {
  const existing = activeStudent.checklistScores;

  const [evaluatorName, setEvaluatorName] = useState<string>(existing?.evaluatorName || 'الباحث الأكاديمي');
  const [scores, setScores] = useState<{
    identification: number;
    analysis: number;
    evaluation: number;
    mitigation: number;
  }>({
    identification: existing?.dimensions.identification ?? 8,
    analysis: existing?.dimensions.analysis ?? 7,
    evaluation: existing?.dimensions.evaluation ?? 8,
    mitigation: existing?.dimensions.mitigation ?? 9,
  });

  const [notes, setNotes] = useState<string>(existing?.notes || 'أظهر الطالب دقة عالية في فحص شفرات الاستعلام ومطابقة دوال الهاش التشفيرية.');
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const totalScore = scores.identification + scores.analysis + scores.evaluation + scores.mitigation;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newScore: ObservationScore = {
      studentId: activeStudent.id,
      evaluatorName,
      evaluatedAt: new Date().toISOString(),
      dimensions: { ...scores },
      totalScore,
      notes
    };

    storageService.saveObservationScore(newScore);
    onRefreshStudent();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const getPerformanceLevel = (val: number) => {
    if (val >= 8) return { label: 'مرتفع / إتقان تام', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    if (val >= 5) return { label: 'متوسط / مقبول', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    return { label: 'متدنٍ / بحاجة لمعالجة', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-purple-500/20 text-purple-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-purple-500/30">
              أداة القياس رقم (2) - بطاقة الملاحظة المباشرة
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              بطاقة ملاحظة الأداء المهاري في إدارة المخاطر السيبرانية
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              أداة تقييم موحدة يستخدمها الباحث/المحكم لملاحظة الأداء العملي للطالب خلال أنشطة المنصة وتدقيق البلوكشين.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-purple-500/40 rounded-xl p-3 text-center min-w-[150px]">
            <span className="text-[11px] text-slate-400 block">إجمالي الدرجة المهارية:</span>
            <span className="text-2xl font-black text-purple-300">{totalScore} / 40</span>
            <span className="text-[10px] text-purple-400 block font-medium mt-0.5">
              {Math.round((totalScore / 40) * 100)}% ({getPerformanceLevel(totalScore / 4).label})
            </span>
          </div>
        </div>
      </div>

      {/* Observation Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Evaluator Header Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <UserCheck className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300 font-semibold">الطالب المفحوص: </span>
            <span className="text-white font-bold text-sm">{activeStudent.name}</span>
            <span className="text-slate-500 font-mono">({activeStudent.id})</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-400">اسم الملاحظ/المحكم:</label>
            <input
              type="text"
              value={evaluatorName}
              onChange={(e) => setEvaluatorName(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-purple-500 text-xs"
              placeholder="اسم الباحث"
            />
          </div>
        </div>

        {/* 4 Core Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Dim 1: Vulnerability Identification */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>1. تحديد واستكشاف الثغرات</span>
              </h3>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-bold ${getPerformanceLevel(scores.identification).color}`}>
                {scores.identification} / 10
              </span>
            </div>

            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>يفحص سجلات النظام ومدخلات المستخدم لاكتشاف ثغرات SQLi و XSS.</li>
              <li>يميز بين الثغرات المصنفة في OWASP Top 10 بدقة متناهية.</li>
              <li>يحدد نقاط الضعف في آليات المصادقة وإدارة الجلسات.</li>
            </ul>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-xs text-slate-400">
                <span>التقدير المهاري:</span>
                <span className="font-bold text-white">{scores.identification} درجات</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={scores.identification}
                onChange={(e) => setScores(s => ({ ...s, identification: Number(e.target.value) }))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Dim 2: Risk Impact Analysis */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>2. تحليل وقياس أثر الخطر</span>
              </h3>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-bold ${getPerformanceLevel(scores.analysis).color}`}>
                {scores.analysis} / 10
              </span>
            </div>

            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>يطبق مقاييس CVSS v3.1 لتحديد درجة خطورة الثغرة.</li>
              <li>يقدر أثر استغلال الثغرة على الثالوث الأمني (CIA Triad).</li>
              <li>يحدد موقع الخطر على مصفوفة الاحتمالية والأثر بدقة.</li>
            </ul>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-xs text-slate-400">
                <span>التقدير المهاري:</span>
                <span className="font-bold text-white">{scores.analysis} درجات</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={scores.analysis}
                onChange={(e) => setScores(s => ({ ...s, analysis: Number(e.target.value) }))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Dim 3: Incident Response Plan */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>3. تنفيذ خطة الاستجابة للحوادث</span>
              </h3>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-bold ${getPerformanceLevel(scores.evaluation).color}`}>
                {scores.evaluation} / 10
              </span>
            </div>

            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>ينفذ إجراءات العزل والاحتواء (Containment) لمنع الانتشار فوراً.</li>
              <li>يطبق خطوات الاستئصال (Eradication) وسد الثغرة المستغلة.</li>
              <li>يتبع بروتوكولات التعافي الآمن واستعادة البيانات الموثوقة.</li>
            </ul>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-xs text-slate-400">
                <span>التقدير المهاري:</span>
                <span className="font-bold text-white">{scores.evaluation} درجات</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={scores.evaluation}
                onChange={(e) => setScores(s => ({ ...s, evaluation: Number(e.target.value) }))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Dim 4: Blockchain Verification & Auditing */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>4. التدقيق والتحقق اللامركزي بالبلوكشين</span>
              </h3>
              <span className={`text-[11px] px-2 py-0.5 rounded-full border font-bold ${getPerformanceLevel(scores.mitigation).color}`}>
                {scores.mitigation} / 10
              </span>
            </div>

            <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
              <li>يتعامل مع محافظ البلوكشين (MetaMask) والعقود الذكية بسلاسة.</li>
              <li>يطابق دوال الهاش التشفيرية (Keccak256) للتأكد من عدم التلاعب.</li>
              <li>يوثق الأدلة الجنائية ويقدم تقرير تدقيق سيبراني متكامل.</li>
            </ul>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between text-xs text-slate-400">
                <span>التقدير المهاري:</span>
                <span className="font-bold text-white">{scores.mitigation} درجات</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={scores.mitigation}
                onChange={(e) => setScores(s => ({ ...s, mitigation: Number(e.target.value) }))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Qualitative Notes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <label className="block text-sm font-bold text-white">
            الملاحظات النوعية والتوصيات التربوية للباحث:
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
            placeholder="سجل ملاحظاتك حول سرعة الاستجابة، السلوك الاستقصائي، ومستوى التفاعل مع بيئة البلوكشين..."
          />
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-semibold animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              تم حفظ تقييم بطاقة الملاحظة بنجاح في سجل الطالب للبحث العلمي!
            </span>
          )}
          <div className="mr-auto">
            <button
              type="submit"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>اعتماد وحفظ بطاقة الملاحظة</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
