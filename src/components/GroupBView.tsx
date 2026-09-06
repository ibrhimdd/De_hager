import React, { useState } from 'react';
import { Database, Search, ShieldAlert, CheckCircle2, AlertOctagon, Terminal, Copy, FileText, Check, Cpu, Eye, RefreshCw, Send, ArrowRight } from 'lucide-react';
import { Student, LedgerBlock, BlockTransaction, AuditReport } from '../types';
import { INITIAL_LEDGER_BLOCKS, FORENSIC_CASE_DETAILS } from '../data/blockchainData';
import { web3Service } from '../services/web3Service';
import { storageService } from '../services/storageService';

interface GroupBViewProps {
  activeStudent: Student;
  onRefreshStudent: () => void;
}

export const GroupBView: React.FC<GroupBViewProps> = ({
  activeStudent,
  onRefreshStudent,
}) => {
  const [blocks] = useState<LedgerBlock[]>(INITIAL_LEDGER_BLOCKS);
  const [selectedBlockNumber, setSelectedBlockNumber] = useState<number>(10482);
  const [selectedTxHash, setSelectedTxHash] = useState<string>(FORENSIC_CASE_DETAILS.compromisedTx);

  // Integrity Check Calculator State
  const [hashInputText, setHashInputText] = useState<string>('');
  const [computedHash, setComputedHash] = useState<string>('');
  const [comparedTxHash, setComparedTxHash] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<'MATCH' | 'MISMATCH' | null>(null);

  // Forensic Audit Form State
  const [auditTargetBlock, setAuditTargetBlock] = useState<number>(10482);
  const [auditTargetTx, setAuditTargetTx] = useState<string>('');
  const [auditIntegrityStatus, setAuditIntegrityStatus] = useState<'VALID' | 'TAMPERED'>('TAMPERED');
  const [auditAttackerAddress, setAuditAttackerAddress] = useState<string>('');
  const [auditCompromisedField, setAuditCompromisedField] = useState<string>('');
  const [auditAssessment, setAuditAssessment] = useState<string>('');
  const [auditMitigation, setAuditMitigation] = useState<string>('');
  const [submitFeedback, setSubmitFeedback] = useState<{ success: boolean; message: string; score: number } | null>(null);

  const activeBlock = blocks.find(b => b.blockNumber === selectedBlockNumber) || blocks[0];
  const activeTx = activeBlock.transactions.find(tx => tx.hash === selectedTxHash) || activeBlock.transactions[0];

  const handleComputeHash = (payload: any, originalDataHash: string) => {
    const rawString = typeof payload === 'string' ? payload : JSON.stringify(payload);
    setHashInputText(rawString);
    const hash = web3Service.computeKeccak256(rawString);
    setComputedHash(hash);
    setComparedTxHash(originalDataHash);

    // If the original dataHash matches the freshly computed hash, integrity is valid
    if (hash.toLowerCase() === originalDataHash.toLowerCase()) {
      setComparisonResult('MATCH');
    } else {
      setComparisonResult('MISMATCH');
    }
  };

  const handleInspectTx = (tx: BlockTransaction, blockNum: number) => {
    setSelectedBlockNumber(blockNum);
    setSelectedTxHash(tx.hash);
    setAuditTargetBlock(blockNum);
    setAuditTargetTx(tx.hash);
    handleComputeHash(tx.payloadData, tx.dataHash);
  };

  const handleSubmitAuditReport = (e: React.FormEvent) => {
    e.preventDefault();

    if (!auditTargetTx || !auditAttackerAddress || !auditAssessment || !auditMitigation) {
      setSubmitFeedback({
        success: false,
        message: 'يرجى تعبئة كافة حقول استمارة تقرير التدقيق الجنائي.',
        score: 0
      });
      return;
    }

    // Evaluate accuracy
    const isBlockCorrect = auditTargetBlock === FORENSIC_CASE_DETAILS.targetBlock;
    const isTxCorrect = auditTargetTx.toLowerCase() === FORENSIC_CASE_DETAILS.compromisedTx.toLowerCase();
    const isStatusCorrect = auditIntegrityStatus === 'TAMPERED';
    const isAttackerCorrect = auditAttackerAddress.toLowerCase().includes('9965507d1a55bcc2695c58ba16fb37d819b0a4df');

    let calculatedScore = 0;
    if (isBlockCorrect) calculatedScore += 25;
    if (isTxCorrect) calculatedScore += 25;
    if (isStatusCorrect) calculatedScore += 25;
    if (isAttackerCorrect) calculatedScore += 25;

    const report: AuditReport = {
      id: `audit-${Date.now()}`,
      studentId: activeStudent.id,
      submittedAt: new Date().toISOString(),
      targetBlockNumber: auditTargetBlock,
      targetTxHash: auditTargetTx,
      integrityStatus: auditIntegrityStatus,
      observedHash: computedHash || '0xCalculated...',
      expectedHash: comparedTxHash || '0xOriginal...',
      attackVectorIdentified: auditCompromisedField,
      incidentImpactAssessment: auditAssessment,
      recommendedMitigation: auditMitigation,
      isCorrect: calculatedScore >= 75,
      score: calculatedScore
    };

    storageService.saveAuditReport(report);
    onRefreshStudent();

    setSubmitFeedback({
      success: true,
      message: calculatedScore >= 75
        ? `أحسنت! تم قبول تقرير التدقيق الجنائي بنجاح وتوثيقه في سجلات الباحث. النتيجة: ${calculatedScore} / 100`
        : `تم تسليم التقرير ولكن هناك بعض التناقضات في تحديد المعاملة المخترقة أو عنوان المهاجم. درجتك: ${calculatedScore} / 100`,
      score: calculatedScore
    });
  };

  return (
    <div className="space-y-6">
      {/* Group Banner */}
      <div className="bg-gradient-to-l from-emerald-950/60 via-slate-900 to-teal-950/40 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-500/30">
                المجموعة التجريبية (2)
              </span>
              <span className="text-slate-400 text-xs font-mono flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                Decentralized Traceability & Data Auditing
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              سلسلة التتبع اللامركزية وتدقيق بيانات البلوكشين
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              تتيح لك هذه البيئة فحص مستكشف الكتل اللامركزي (Blockchain Explorer)، وتتبع سجلات المعاملات ومطابقة التجزئة التشفيرية (Hashes) لكشف التلاعب غير المصرح به بالبيانات وتوثيق تقرير التدقيق الجنائي السيبراني للباحث.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs space-y-1.5 min-w-[240px]">
            <div className="flex items-center justify-between text-slate-400">
              <span>تقارير التدقيق المسلمة:</span>
              <span className="text-white font-bold">{activeStudent.auditReports?.length || 0} تقرير</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>حالة القضية الجنائية:</span>
              <span className="text-amber-400 font-semibold">تحقيق نشط في السلسلة</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Case Alert Box */}
      <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-5 space-y-3">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-base text-amber-200">{FORENSIC_CASE_DETAILS.title}</h3>
            <p className="text-xs sm:text-sm text-amber-300/80 leading-relaxed">
              {FORENSIC_CASE_DETAILS.brief}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Ledger Explorer & Forensic Audit Form */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Blockchain Ledger Explorer */}
        <div className="xl:col-span-7 space-y-6">
          {/* Blocks Timeline / Selector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>مستكشف كتل السلسلة اللامركزية (Blocks Explorer):</span>
              </h2>
              <span className="text-xs text-slate-400">3 كتل مفحوصة</span>
            </div>

            {/* Block Carousel / Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {blocks.map((blk) => {
                const isSelected = selectedBlockNumber === blk.blockNumber;
                const hasCompromisedTx = blk.transactions.some(t => t.isTampered);

                return (
                  <button
                    key={blk.blockNumber}
                    onClick={() => {
                      setSelectedBlockNumber(blk.blockNumber);
                      setSelectedTxHash(blk.transactions[0].hash);
                      setAuditTargetBlock(blk.blockNumber);
                      setAuditTargetTx(blk.transactions[0].hash);
                    }}
                    className={`p-3.5 rounded-xl border text-right transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-850 border-emerald-500/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-white">Block #{blk.blockNumber}</span>
                        {hasCompromisedTx && (
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" title="تحذير: نشاط شاذ"></span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-1">{blk.transactions.length} معاملات</span>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400 truncate">
                      Hash: {blk.hash.slice(0, 10)}...
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Block Technical Metadata */}
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 text-xs font-mono space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-400">Current Block Hash: </span>
                  <span className="text-emerald-400 break-all">{activeBlock.hash}</span>
                </div>
                <div>
                  <span className="text-slate-400">Parent Block Hash: </span>
                  <span className="text-slate-400 break-all">{activeBlock.parentHash}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                <div>Nonce: <span className="text-white">{activeBlock.nonce}</span></div>
                <div>Miner: <span className="text-white">{activeBlock.miner.slice(0, 8)}...</span></div>
                <div>Merkle: <span className="text-white">{activeBlock.merkleRoot.slice(0, 8)}...</span></div>
                <div>Time: <span className="text-white">{activeBlock.timestamp.slice(11, 19)}</span></div>
              </div>
            </div>
          </div>

          {/* Transactions List inside Active Block */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>المعاملات المسجلة بالكتلة #{activeBlock.blockNumber}:</span>
            </h3>

            <div className="space-y-3">
              {activeBlock.transactions.map((tx, idx) => {
                const isSelected = selectedTxHash === tx.hash;

                return (
                  <div
                    key={tx.hash}
                    className={`p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-slate-850/90 border-indigo-500/70 shadow-md ring-1 ring-indigo-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                          tx.actionType === 'ANOMALOUS_ACCESS'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : tx.actionType === 'INCIDENT_ALERT'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        }`}>
                          {tx.actionType}
                        </span>
                        <span className="font-mono text-xs text-slate-400">
                          {tx.hash.slice(0, 16)}...
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleInspectTx(tx, activeBlock.blockNumber)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>فحص ومطابقة الهاش</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 font-medium">
                      {tx.payloadSummary}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
                      <div>From: <span className="text-slate-300">{tx.from}</span></div>
                      <div>Gas: <span className="text-slate-300">{tx.gasUsed}</span></div>
                    </div>

                    {/* Expandable JSON Payload if selected */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>حزمة البيانات الخام (Raw Payload):</span>
                          <span className="font-mono text-[10px] text-slate-500">JSON Stringified</span>
                        </div>
                        <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
                          {JSON.stringify(tx.payloadData, null, 2)}
                        </pre>

                        <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                          <span className="text-slate-400">Cryptographic Data Hash:</span>
                          <span className="font-mono text-slate-200 text-[11px]">{tx.dataHash.slice(0, 24)}...</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Cryptographic Hash Verifier Tool */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>أداة التدقيق التشفيري الرياضي (Keccak-256 Hash Verifier):</span>
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              تقوم هذه الأداة بحساب التجزئة التشفيرية لمحتوى المعاملة الحالي ومطابقتها مع الـ Data Hash المسجل في رأس الكتلة. إذا كان هناك اختلاف، فهذا دليل قاطع على تعديل غير مصرح به (Tampering).
            </p>

            <div className="space-y-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs font-mono">
              <div>
                <label className="text-slate-400 block mb-1">البيانات المفحوصة (Payload):</label>
                <textarea
                  value={hashInputText}
                  onChange={(e) => {
                    setHashInputText(e.target.value);
                    if (e.target.value) {
                      const h = web3Service.computeKeccak256(e.target.value);
                      setComputedHash(h);
                      if (comparedTxHash) {
                        setComparisonResult(h.toLowerCase() === comparedTxHash.toLowerCase() ? 'MATCH' : 'MISMATCH');
                      }
                    }
                  }}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-cyan-300 text-xs focus:outline-none focus:border-cyan-500 font-mono"
                  placeholder="اختر معاملة أو الصق كائن JSON هنا..."
                />
              </div>

              {computedHash && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-400">الهاش المحسوب حديثاً (Computed Hash):</span>
                    <span className="text-cyan-300 font-bold break-all">{computedHash}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-slate-400">الهاش الأصلي في البلوكشين (On-Chain Hash):</span>
                    <span className="text-slate-300 break-all">{comparedTxHash}</span>
                  </div>

                  {/* Verdict */}
                  {comparisonResult === 'MATCH' && (
                    <div className="mt-3 p-3 bg-emerald-950/50 border border-emerald-500/40 rounded-lg text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      <div>
                        <span className="font-bold">سلامة البيانات مؤكدة (Data Integrity Verified)</span>
                        <p className="text-[11px] text-emerald-400/80">لم يطرأ أي تعديل أو تلاعب على هذه المعاملة في البلوكشين.</p>
                      </div>
                    </div>
                  )}

                  {comparisonResult === 'MISMATCH' && (
                    <div className="mt-3 p-3 bg-rose-950/50 border border-rose-500/40 rounded-lg text-rose-300 flex items-center gap-2">
                      <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0" />
                      <div>
                        <span className="font-bold">⚠️ اكتشاف تلاعب غير مصرح به (Data Tampering Detected)!</span>
                        <p className="text-[11px] text-rose-300/80">
                          الهاش التشفيري للبيانات لا يطابق التجزئة المخزنة بالسلسلة. تم العبث بمحتوى هذا السجل بواسطة المهاجم!
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Forensic Audit Report Form */}
        <div className="xl:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5 sticky top-24">
            <div className="border-b border-slate-800 pb-3">
              <span className="bg-emerald-500/15 text-emerald-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                استمارة التقييم والتوثيق الميداني
              </span>
              <h2 className="text-lg font-bold text-white mt-2">تقرير التدقيق الجنائي السيبراني</h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                بعد فحص مستكشف الكتل ومطابقة الهاش، أدخل نتائج تحليلك الجنائي لتوثيقها في قاعدة بيانات البحث العلمي.
              </p>
            </div>

            <form onSubmit={handleSubmitAuditReport} className="space-y-4 text-xs">
              {/* Target Block */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  رقم الكتلة المستهدفة بالهجمة (Target Block Number):
                </label>
                <input
                  type="number"
                  value={auditTargetBlock}
                  onChange={(e) => setAuditTargetBlock(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  placeholder="مثال: 10482"
                />
              </div>

              {/* Target Transaction Hash */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  تجزئة المعاملة المشبوهة (Transaction Hash):
                </label>
                <input
                  type="text"
                  value={auditTargetTx}
                  onChange={(e) => setAuditTargetTx(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-cyan-300 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  placeholder="0x..."
                />
              </div>

              {/* Integrity Verdict */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  حالة سلامة البيانات الناتجة عن الفحص التشفيري:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAuditIntegrityStatus('TAMPERED')}
                    className={`p-2.5 rounded-lg border text-center font-bold transition-all ${
                      auditIntegrityStatus === 'TAMPERED'
                        ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    ⚠️ بيانات مخترقة / متلاعب بها
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuditIntegrityStatus('VALID')}
                    className={`p-2.5 rounded-lg border text-center font-bold transition-all ${
                      auditIntegrityStatus === 'VALID'
                        ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow'
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    ✓ بيانات سليمة وغير معدلة
                  </button>
                </div>
              </div>

              {/* Attacker Wallet Address */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  عنوان محفظة المهاجم المشتبه به (Attacker Wallet Address):
                </label>
                <input
                  type="text"
                  value={auditAttackerAddress}
                  onChange={(e) => setAuditAttackerAddress(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-emerald-500"
                  placeholder="0x9965507D..."
                />
              </div>

              {/* Compromised Field */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  الحقل أو السجل الذي تم التلاعب به داخل المعاملة:
                </label>
                <input
                  type="text"
                  value={auditCompromisedField}
                  onChange={(e) => setAuditCompromisedField(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  placeholder="مثال: modifiedRecord / EMERGENCY_OVERRIDE_FLAG"
                />
              </div>

              {/* Assessment */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  تقييم أثر الاختراق الأمني على نظام المؤسسة:
                </label>
                <textarea
                  value={auditAssessment}
                  onChange={(e) => setAuditAssessment(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  placeholder="اكتب تحليلك لأثر تعديل الصلاحيات على الثالوث الأمني..."
                />
              </div>

              {/* Mitigation */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  خطة الاستجابة والتوصيات الدفاعية المقترحة:
                </label>
                <textarea
                  value={auditMitigation}
                  onChange={(e) => setAuditMitigation(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  placeholder="تجميد الحساب، إبطال التوقيع الرقمي، وتطبيق التحديث KB-2026..."
                />
              </div>

              {/* Feedback Alert */}
              {submitFeedback && (
                <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  submitFeedback.success && submitFeedback.score >= 75
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                    : 'bg-amber-950/60 border-amber-500/50 text-amber-200'
                }`}>
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitFeedback.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>تسليم تقرير التدقيق الجنائي للباحث</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
