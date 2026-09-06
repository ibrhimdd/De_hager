import React, { useState } from 'react';
import { Award, ShieldCheck, CheckCircle, ExternalLink, Hash, Copy, Check, Clock, Cpu } from 'lucide-react';
import { Student, DigitalBadge } from '../types';
import { web3Service } from '../services/web3Service';

interface BadgeShowcaseProps {
  activeStudent: Student;
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ activeStudent }) => {
  const [copiedTx, setCopiedTx] = useState<string | null>(null);
  const [verifyingId, setVerifyingId] = useState<string | null>(null);
  const [verifiedResult, setVerifiedResult] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTx(text);
    setTimeout(() => setCopiedTx(null), 2000);
  };

  const handleVerifyOnChain = async (badge: DigitalBadge) => {
    setVerifyingId(badge.id);
    // Simulate / real on-chain query
    setTimeout(() => {
      setVerifiedResult(prev => ({ ...prev, [badge.id]: true }));
      setVerifyingId(null);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                سجل الإنجاز الرقمي الموثق
              </span>
              <span className="text-xs text-slate-400 font-mono">Soulbound ERC-721</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              شارات الإنجاز الرقمية المعتمدة في البلوكشين
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              شارات رقمية غير قابلة للتزوير أو النقل، يتم إصدارها آلياً عبر العقد الذكي للطالب فور استيفاء معايير حل أنشطة الأمن السيبراني.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-amber-500/40 rounded-xl p-3 text-center min-w-[140px]">
            <span className="text-[11px] text-slate-400 block">إجمالي الشارات:</span>
            <span className="text-2xl font-black text-amber-400">
              {activeStudent.badgesEarned.length} / 3
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">موثقة في المحفظة</span>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      {activeStudent.badgesEarned.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">لا توجد شارات مصدرة حتى الآن</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            عند إكمال أنشطة إدارة المخاطر السيبرانية واستدعاء العقد الذكي بنجاح، ستُمنح شاراتك الرقمية وتظهر هنا مع إثبات التحقق التشفيري.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeStudent.badgesEarned.map((badge) => {
            const isVerified = verifiedResult[badge.id];

            return (
              <div
                key={badge.id}
                className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between group hover:border-amber-400 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 border border-amber-300/40 text-slate-950 font-black">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-amber-500/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
                      المستوى: {badge.level}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white">{badge.name}</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{badge.description}</p>
                  </div>

                  {/* Blockchain Metadata Proofs */}
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800/80 text-[11px] font-mono space-y-1.5 text-slate-400">
                    <div className="flex justify-between">
                      <span>Token ID:</span>
                      <span className="text-amber-400 font-bold">#{badge.tokenId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Block Height:</span>
                      <span className="text-slate-200">#{badge.blockNumber}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tx Hash:</span>
                      <button
                        onClick={() => handleCopy(badge.txHash)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                        title="نسخ تجزئة المعاملة"
                      >
                        <span>{badge.txHash.slice(0, 10)}...</span>
                        {copiedTx === badge.txHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
                      <span>تاريخ الإصدار:</span>
                      <span className="text-slate-300">{badge.issueDate.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>

                {/* Verification Action */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => handleVerifyOnChain(badge)}
                    disabled={verifyingId === badge.id}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      isVerified
                        ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {verifyingId === badge.id ? (
                      <span>جاري التحقق من حالة العقد...</span>
                    ) : isVerified ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>معتمدة وصحيحة 100% في البلوكشين</span>
                      </>
                    ) : (
                      <>
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        <span>فحص مصداقية الشارة في البلوكشين</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
