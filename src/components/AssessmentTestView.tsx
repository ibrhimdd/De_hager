import React, { useState } from 'react';
import { BookOpen, CheckCircle, AlertCircle, ArrowLeft, RefreshCw, Trophy, Clock, Check } from 'lucide-react';
import { Student } from '../types';
import { ACHIEVEMENT_TEST_QUESTIONS } from '../data/assessmentData';
import { storageService } from '../services/storageService';

interface AssessmentTestViewProps {
  activeStudent: Student;
  testType: 'pre' | 'post';
  onRefreshStudent: () => void;
  onNavigateToPostTest?: () => void;
}

export const AssessmentTestView: React.FC<AssessmentTestViewProps> = ({
  activeStudent,
  testType,
  onRefreshStudent,
  onNavigateToPostTest,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);

  const existingScore = testType === 'pre' ? activeStudent.preTestScore : activeStudent.postTestScore;
  const existingDate = testType === 'pre' ? activeStudent.preTestCompletedAt : activeStudent.postTestCompletedAt;

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(selectedAnswers).length < ACHIEVEMENT_TEST_QUESTIONS.length) {
      alert('يرجى الإجابة على جميع أسئلة الاختبار قبل التسليم.');
      return;
    }

    let calculatedScore = 0;
    ACHIEVEMENT_TEST_QUESTIONS.forEach(q => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);

    if (testType === 'pre') {
      storageService.savePreTestResult(activeStudent.id, calculatedScore);
    } else {
      storageService.savePostTestResult(activeStudent.id, calculatedScore);
    }

    onRefreshStudent();
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setScore(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="bg-indigo-500/20 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
              أداة القياس رقم (1) - البحث التجريبي
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              {testType === 'pre' ? 'الاختبار التحصيلي القبلي (Pre-Achievement Test)' : 'الاختبار التحصيلي البعدي (Post-Achievement Test)'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              يقيس المعارف والمفاهيم المرتبطة بإدارة المخاطر السيبرانية والأمن التشفيري للبلوكشين.
            </p>
          </div>

          {/* Current Score Badge if completed */}
          {(existingScore !== undefined || score !== null) && (
            <div className="bg-slate-950/80 border border-indigo-500/40 rounded-xl p-3 text-center min-w-[140px]">
              <span className="text-[11px] text-slate-400 block">الدرجة المحققة:</span>
              <span className="text-2xl font-black text-indigo-300">
                {score !== null ? score : existingScore} / {ACHIEVEMENT_TEST_QUESTIONS.length}
              </span>
              <span className="text-[10px] text-emerald-400 block font-medium mt-0.5">
                {Math.round(((score !== null ? score : (existingScore || 0)) / ACHIEVEMENT_TEST_QUESTIONS.length) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Comparison Insight if both tests completed */}
      {testType === 'post' && activeStudent.preTestScore !== undefined && (
        <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-4 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-300">
          <div>
            <span className="font-semibold text-white">مقارنة القياس القبلي والبعدي: </span>
            <span>القبلي: {activeStudent.preTestScore} | البعدي: {score !== null ? score : (activeStudent.postTestScore ?? 'لم يكتمل')}</span>
          </div>
          {activeStudent.postTestScore !== undefined && (
            <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg border border-emerald-500/30 font-bold flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>معدل التحسن (Gain): +{activeStudent.postTestScore - activeStudent.preTestScore} درجة</span>
            </div>
          )}
        </div>
      )}

      {/* Questions Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {ACHIEVEMENT_TEST_QUESTIONS.map((q, idx) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const currentSelected = selectedAnswers[q.id];
          const isCorrect = currentSelected === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`bg-slate-900 border rounded-2xl p-5 space-y-4 transition-all ${
                isSubmitted
                  ? isCorrect
                    ? 'border-emerald-500/50 bg-emerald-950/10'
                    : 'border-rose-500/50 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center shrink-0 border border-slate-700">
                    {idx + 1}
                  </span>
                  <div>
                    <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                      {q.topic}
                    </span>
                    <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
                      {q.question}
                    </p>
                  </div>
                </div>

                {isSubmitted && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 flex items-center gap-1 ${
                    isCorrect ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                  </span>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2 pr-10">
                {q.options.map((opt, oIdx) => {
                  const isOptSelected = currentSelected === oIdx;
                  let optStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-850 hover:border-slate-700';

                  if (isSubmitted) {
                    if (oIdx === q.correctIndex) {
                      optStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                    } else if (isOptSelected && !isCorrect) {
                      optStyle = 'bg-rose-950/60 border-rose-500 text-rose-300 line-through';
                    }
                  } else if (isOptSelected) {
                    optStyle = 'bg-indigo-950/70 border-indigo-500 text-white font-semibold shadow';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      className={`w-full text-right p-3 rounded-xl text-xs sm:text-sm transition-all border flex items-center justify-between gap-3 ${optStyle}`}
                    >
                      <span className="leading-relaxed">{opt}</span>
                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                        isOptSelected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-700'
                      }`}>
                        {isOptSelected && <Check className="w-3 h-3" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation upon submission */}
              {isSubmitted && (
                <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                  <span className="text-cyan-400 font-bold block">التفسير العلمي:</span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            <span>تمت الإجابة على: </span>
            <span className="text-white font-bold">{Object.keys(selectedAnswers).length}</span>
            <span> من أصل </span>
            <span className="text-white font-bold">{ACHIEVEMENT_TEST_QUESTIONS.length} أسئلة</span>
          </div>

          <div className="flex items-center gap-3">
            {isSubmitted ? (
              <>
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة للتدريب</span>
                </button>
                {testType === 'pre' && onNavigateToPostTest && (
                  <button
                    type="button"
                    onClick={onNavigateToPostTest}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
                  >
                    <span>الانتقال للاختبار البعدي</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </>
            ) : (
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>تسليم إجابات {testType === 'pre' ? 'الاختبار القبلي' : 'الاختبار البعدي'}</span>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
