import React, { useState } from 'react';
import { ShieldCheck, Cpu, Award, CheckCircle, AlertTriangle, ArrowLeft, RefreshCw, ExternalLink, Hash, Lock, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { CyberActivity, Student, DigitalBadge, Web3State } from '../types';
import { CYBER_ACTIVITIES } from '../data/activitiesData';
import { web3Service } from '../services/web3Service';
import { storageService } from '../services/storageService';

interface GroupAViewProps {
  activeStudent: Student;
  web3State: Web3State;
  onRefreshStudent: () => void;
  onViewBadges: () => void;
}

export const GroupAView: React.FC<GroupAViewProps> = ({
  activeStudent,
  web3State,
  onRefreshStudent,
  onViewBadges,
}) => {
  const [selectedActivity, setSelectedActivity] = useState<CyberActivity>(CYBER_ACTIVITIES[0]);
  const [taskAnswers, setTaskAnswers] = useState<Record<string, string>>({});
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failed'>('idle');
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [mintedBadge, setMintedBadge] = useState<DigitalBadge | null>(null);

  const isCompleted = activeStudent.activitiesCompleted.includes(selectedActivity.id);
  const existingBadge = activeStudent.badgesEarned.find(b => b.activityId === selectedActivity.id);

  const handleSelectAnswer = (taskId: string, value: string) => {
    setTaskAnswers(prev => ({
      ...prev,
      [taskId]: value
    }));
    setVerificationStatus('idle');
    setVerificationError(null);
  };

  const handleSmartContractVerification = async () => {
    // 1. Check if all tasks answered
    const allAnswered = selectedActivity.tasks.every(t => !!taskAnswers[t.id]);
    if (!allAnswered) {
      setVerificationError('يرجى إكمال جميع أسئلة النشاط قبل استدعاء العقد الذكي.');
      return;
    }

    // 2. Check if answers are correct
    const allCorrect = selectedActivity.tasks.every(t => {
      const selected = taskAnswers[t.id];
      const correctOption = t.options?.find(o => o.isCorrect)?.value;
      return selected === t.correctAnswer || selected === correctOption;
    });

    if (!allCorrect) {
      setVerificationStatus('failed');
      setVerificationError('فشل التحقق البرمجي: بعض الإجابات لا تطابق معايير حل النشاط في العقد الذكي. راجع الإجابات وحاول مجدداً.');
      return;
    }

    // 3. Automated Smart Contract execution
    try {
      setVerificationStatus('verifying');
      setVerificationError(null);

      const activityIndex = selectedActivity.id === 'act-1' ? 1 : selectedActivity.id === 'act-2' ? 2 : 3;
      const targetAddress = web3State.address || activeStudent.walletAddress || '0x71C0A98F735c02F6b72a0845B25884B1cE84498e';

      const result = await web3Service.verifyAndMintBadge(
        activityIndex,
        selectedActivity.title,
        selectedActivity.badgeReward.level,
        targetAddress
      );

      const newBadge: DigitalBadge = {
        id: `badge-${Date.now()}`,
        tokenId: result.tokenId,
        name: selectedActivity.badgeReward.name,
        description: selectedActivity.badgeReward.description,
        activityId: selectedActivity.id,
        level: selectedActivity.badgeReward.level,
        icon: selectedActivity.badgeReward.icon,
        issueDate: new Date().toISOString(),
        txHash: result.txHash,
        blockNumber: result.blockNumber,
        contractAddress: web3Service.getContractAddress(),
        verifiableHash: result.proofHash,
        criteria: selectedActivity.objectives.join(' | ')
      };

      // Save to student storage
      storageService.addStudentBadge(activeStudent.id, newBadge);
      setMintedBadge(newBadge);
      setVerificationStatus('success');
      onRefreshStudent();

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Safe fallback
      }
    } catch (err: any) {
      console.error('Smart contract call error:', err);
      setVerificationStatus('failed');
      setVerificationError(err.message || 'حدث خطأ أثناء الاتصال بالعقد الذكي.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Group Banner */}
      <div className="bg-gradient-to-l from-indigo-900/60 via-slate-900 to-cyan-950/40 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-cyan-500/20 text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-cyan-500/30">
                المجموعة التجريبية (1)
              </span>
              <span className="text-slate-400 text-xs font-mono flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                Solidity Automated Evaluation & ERC-721 Badges
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              العقود الذكية التفاعلية والتقييم الآلي للأمن السيبراني
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              في هذه البيئة، يتم تقييم أنشطتك في إدارة المخاطر السيبرانية برمجياً وبشكل آلي تماماً عن طريق استدعاء عقد ذكي (Solidity Smart Contract) دون تدخل بشري. عند تحقيق شروط النجاح، تُصك لك فوراً شارة إنجاز رقمية موثقة في البلوكشين.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs space-y-1.5 min-w-[240px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>إنجاز الأنشطة:</span>
              <span className="text-white font-bold">{activeStudent.activitiesCompleted.length} / 3</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2 transition-all duration-500"
                style={{ width: `${(activeStudent.activitiesCompleted.length / 3) * 100}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-slate-400 pt-1">
              <span>الشارات المكتسبة:</span>
              <span className="text-cyan-400 font-bold">{activeStudent.badgesEarned.length} شارة NFT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Activity List & Active Activity Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar: Activity Selector */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <span>مسار أنشطة إدارة المخاطر:</span>
          </h2>

          <div className="space-y-3">
            {CYBER_ACTIVITIES.map((act, index) => {
              const isActCompleted = activeStudent.activitiesCompleted.includes(act.id);
              const isSelected = selectedActivity.id === act.id;

              return (
                <div
                  key={act.id}
                  onClick={() => {
                    setSelectedActivity(act);
                    setTaskAnswers({});
                    setVerificationStatus('idle');
                    setVerificationError(null);
                    setMintedBadge(null);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-slate-850/90 border-cyan-500/70 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <span className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider">
                          {act.stage}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-white">{act.title}</h3>
                    </div>

                    {isActCompleted ? (
                      <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        مكتمل
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                        قيد التنفيذ
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {act.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">مكافأة العقد:</span>
                    <span className="text-amber-300 font-medium flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      {act.badgeReward.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Info Box on Smart Contract Logic */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>آلية التقييم بالعقد الذكي (Solidity):</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              يقوم العقد الذكي بحساب وتجزئة إجابة الطالب عبر دالة <code className="text-cyan-300 font-mono">keccak256()</code> ومقارنتها بالـ Expected Hash المخزن سلفاً على شبكة البلوكشين.
            </p>
            <div className="font-mono text-[10px] bg-slate-950 p-2 rounded border border-slate-800 text-cyan-400 overflow-x-auto">
              require(solutionHash == req.expectedSolutionHash);
            </div>
          </div>
        </div>

        {/* Main Workspace: Active Activity */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            {/* Header */}
            <div className="border-b border-slate-800 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="bg-indigo-500/15 text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                  {selectedActivity.stage}
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-500" />
                  Contract Call: <span className="text-cyan-400">{selectedActivity.smartContractFunction.slice(0, 24)}...</span>
                </span>
              </div>
              <h2 className="text-xl font-bold text-white mt-2">{selectedActivity.title}</h2>
            </div>

            {/* Scenario Box */}
            <div className="bg-slate-950/70 border border-indigo-500/20 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                سيناريو الخطر السيبراني العملي:
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedActivity.scenario}
              </p>
            </div>

            {/* Objectives */}
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-slate-400">أهداف النشاط ومحاور التقييم:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {selectedActivity.objectives.map((obj, i) => (
                  <div key={i} className="bg-slate-950/40 border border-slate-800/80 p-2.5 rounded-lg text-xs text-slate-300 flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks / Questions */}
            <div className="space-y-5 pt-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>المهام التحليلية المطلوبة للتحقق:</span>
              </h3>

              {selectedActivity.tasks.map((task, idx) => (
                <div key={task.id} className="bg-slate-950/50 border border-slate-800/90 rounded-xl p-4 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-sm font-semibold text-slate-100">{task.question}</p>
                  </div>

                  {/* Task Options */}
                  <div className="space-y-2 pr-8">
                    {task.options?.map((opt, oIdx) => {
                      const isSelected = taskAnswers[task.id] === (opt.value || opt.label);

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectAnswer(task.id, opt.value || opt.label)}
                          className={`w-full text-right p-3 rounded-lg text-xs transition-all border flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-indigo-950/60 border-indigo-500 text-white font-medium shadow-md'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/50 hover:border-slate-700'
                          }`}
                        >
                          <span className="leading-relaxed">{opt.label}</span>
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-700'
                          }`}>
                            {isSelected && <Check className="w-3 h-3" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Verification Section */}
            <div className="pt-4 border-t border-slate-800 space-y-4">
              {verificationError && (
                <div className="bg-rose-950/40 border border-rose-500/40 text-rose-300 p-3.5 rounded-xl text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{verificationError}</span>
                </div>
              )}

              {/* Already Completed Notice / Active Minted Badge */}
              {isCompleted && (
                <div className="bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 p-4 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5 text-sm">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      تم التحقق الآلي وصك الشارة بنجاح في البلوكشين!
                    </span>
                    <button
                      onClick={onViewBadges}
                      className="text-xs bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 px-3 py-1 rounded-lg border border-emerald-500/30 flex items-center gap-1"
                    >
                      <span>عرض الشارة في المحفظة</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {existingBadge && (
                    <div className="text-[11px] font-mono text-emerald-400/80 bg-slate-950/60 p-2 rounded border border-emerald-500/20 flex flex-wrap gap-x-4 gap-y-1">
                      <span>Token ID: #{existingBadge.tokenId}</span>
                      <span>Tx: {existingBadge.txHash.slice(0, 16)}...</span>
                      <span>Block: #{existingBadge.blockNumber}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="text-xs text-slate-400">
                  <span>المحفظة المستهدفة: </span>
                  <span className="font-mono text-cyan-400">
                    {web3State.address
                      ? `${web3State.address.slice(0, 8)}...${web3State.address.slice(-6)}`
                      : activeStudent.walletAddress
                      ? `${activeStudent.walletAddress.slice(0, 8)}...${activeStudent.walletAddress.slice(-6)}`
                      : 'محاكاة Ganache'}
                  </span>
                </div>

                <button
                  onClick={handleSmartContractVerification}
                  disabled={verificationStatus === 'verifying'}
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                    verificationStatus === 'verifying'
                      ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                      : isCompleted
                      ? 'bg-indigo-600/60 hover:bg-indigo-600 text-white border border-indigo-400/40'
                      : 'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-cyan-600/25'
                  }`}
                >
                  {verificationStatus === 'verifying' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                      <span>جاري الاستدعاء والتقييم الآلي على البلوكشين...</span>
                    </>
                  ) : isCompleted ? (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      <span>إعادة التحقق من العقد الذكي</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4 text-cyan-300" />
                      <span>استدعاء العقد الذكي والتحقق وصك الشارة</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
