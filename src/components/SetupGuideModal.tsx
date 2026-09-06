import React, { useState } from 'react';
import { HelpCircle, Copy, Check, Terminal, Play, Cpu, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';

export const SetupGuideModal: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const solidityCode = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CyberRiskBadgeVerification
 * @dev عقد ذكي للتقييم الآلي لأنشطة إدارة المخاطر السيبرانية وإصدار شارات الإنجاز الرقمية (Soulbound / ERC-721)
 */

contract CyberRiskBadgeVerification {
    string public name = "CyberRisk EduBadge";
    string public symbol = "CREB";
    address public researcherOwner;
    uint256 private _tokenIdCounter;

    struct Badge {
        uint256 tokenId;
        address studentAddress;
        uint256 activityId;
        string activityTitle;
        string badgeLevel;
        bytes32 verificationProofHash;
        uint256 timestamp;
        string tokenURI;
        bool isValid;
    }

    struct ActivityRequirement {
        uint256 activityId;
        string title;
        bytes32 expectedSolutionHash;
        uint256 passingScore;
        bool isActive;
    }

    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) private _studentBadges;
    mapping(uint256 => ActivityRequirement) public activityRequirements;
    mapping(address => mapping(uint256 => bool)) public hasCompletedActivity;

    event BadgeMinted(address indexed student, uint256 indexed tokenId, uint256 indexed activityId, string badgeLevel, bytes32 proofHash, uint256 timestamp);
    event ActivityVerified(address indexed student, uint256 indexed activityId, bool success, bytes32 submittedHash);

    modifier onlyResearcher() {
        require(msg.sender == researcherOwner, "Only researcher can invoke this");
        _;
    }

    constructor() {
        researcherOwner = msg.sender;
        _tokenIdCounter = 1;

        // تهيئة الأنشطة الثلاثة بحلولها المشفرة
        activityRequirements[1] = ActivityRequirement({
            activityId: 1,
            title: "Vulnerability Identification",
            expectedSolutionHash: keccak256(abi.encodePacked("SQL_INJECTION_AND_BROKEN_AUTH_MITIGATED")),
            passingScore: 80,
            isActive: true
        });

        activityRequirements[2] = ActivityRequirement({
            activityId: 2,
            title: "Risk Impact Analysis",
            expectedSolutionHash: keccak256(abi.encodePacked("HIGH_IMPACT_CVSS_SCORE_8_8_VERIFIED")),
            passingScore: 85,
            isActive: true
        });

        activityRequirements[3] = ActivityRequirement({
            activityId: 3,
            title: "Incident Response Execution",
            expectedSolutionHash: keccak256(abi.encodePacked("CONTAINMENT_ERADICATION_RECOVERY_DONE")),
            passingScore: 90,
            isActive: true
        });
    }

    function verifyAndIssueBadge(
        uint256 activityId,
        bytes32 solutionHash,
        string memory activityTitle,
        string memory badgeLevel,
        string memory metadataURI
    ) external returns (uint256) {
        ActivityRequirement memory req = activityRequirements[activityId];
        require(req.isActive, "Activity not active");
        require(!hasCompletedActivity[msg.sender][activityId], "Badge already issued");

        bool isVerified = (solutionHash == req.expectedSolutionHash);
        emit ActivityVerified(msg.sender, activityId, isVerified, solutionHash);
        require(isVerified, "Verification failed");

        hasCompletedActivity[msg.sender][activityId] = true;
        uint256 newTokenId = _tokenIdCounter++;

        _owners[newTokenId] = msg.sender;
        _balances[msg.sender] += 1;

        badges[newTokenId] = Badge({
            tokenId: newTokenId,
            studentAddress: msg.sender,
            activityId: activityId,
            activityTitle: activityTitle,
            badgeLevel: badgeLevel,
            verificationProofHash: solutionHash,
            timestamp: block.timestamp,
            tokenURI: metadataURI,
            isValid: true
        });

        _studentBadges[msg.sender].push(newTokenId);
        emit BadgeMinted(msg.sender, newTokenId, activityId, badgeLevel, solutionHash, block.timestamp);
        return newTokenId;
    }

    function getStudentBadges(address student) external view returns (Badge[] memory) {
        uint256[] memory tokenIds = _studentBadges[student];
        Badge[] memory list = new Badge[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            list[i] = badges[tokenIds[i]];
        }
        return list;
    }

    function verifyBadge(uint256 tokenId) external view returns (bool, address, string memory, string memory, uint256, bytes32) {
        Badge memory b = badges[tokenId];
        return (b.isValid, b.studentAddress, b.activityTitle, b.badgeLevel, b.timestamp, b.verificationProofHash);
    }
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(solidityCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 rounded-2xl p-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-cyan-500/20 text-cyan-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-cyan-500/30">
              الدليل التقني الميداني للباحث
            </span>
            <span className="text-xs text-slate-400 font-mono">Ganache + Remix IDE + MetaMask</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            خطوات تشغيل بيئة البلوكشين والعقود الذكية محلياً
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            دليل إجرائي مفصل خطوة بخطوة للباحث لإطلاق شبكة إيثيريوم محلية (Ganache)، وتجميع ونشر العقد الذكي عبر Remix IDE، وربط محافظ الطلاب بالمنصة لتطبيق التجربة العلمية.
          </p>
        </div>
      </div>

      {/* Step Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { num: 1, title: 'تشغيل Ganache' },
          { num: 2, title: 'إعداد MetaMask' },
          { num: 3, title: 'نشر العقد عبر Remix' },
          { num: 4, title: 'ربط المنصة بالتجربة' }
        ].map(s => (
          <button
            key={s.num}
            onClick={() => setActiveStep(s.num)}
            className={`p-3 rounded-xl border text-right transition-all flex items-center gap-2.5 ${
              activeStep === s.num
                ? 'bg-cyan-950/60 border-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/10'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-slate-200'
            }`}
          >
            <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
              activeStep === s.num ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            }`}>
              {s.num}
            </span>
            <span className="text-xs truncate">{s.title}</span>
          </button>
        ))}
      </div>

      {/* Step Content Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        {activeStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <span>الخطوة الأولى: تشغيل شبكة البلوكشين المحلية (Ganache)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              تعتبر أداة <strong>Ganache</strong> (المقدمة من Truffle Suite) بيئة محاكاة لاختبار شبكات الإيثيريوم المحلية دون تكلفة غاز حقيقية وتتيح لك 10 حسابات جاهزة برصيد 100 ETH لكل حساب.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <h4 className="font-bold text-cyan-300">الخيار (أ): استخدام تطبيق Ganache ذو الواجهة الرسومية (GUI):</h4>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pr-2">
                <li>قم بتحميل وتشغيل برنامج <strong>Ganache</strong> من موقع Truffle الرسمي.</li>
                <li>انقر على زر <strong>Quickstart Ethereum</strong>.</li>
                <li>تأكد من عنوان المنفذ في الشريط العلوي: <code className="text-amber-400 font-mono">RPC SERVER: HTTP://127.0.0.1:7545</code> أو <code className="text-amber-400 font-mono">8545</code>، ومعرف الشبكة (Network ID): <code className="text-amber-400 font-mono">5777</code> أو <code className="text-amber-400 font-mono">1337</code>.</li>
              </ol>

              <h4 className="font-bold text-cyan-300 pt-2 border-t border-slate-800">الخيار (ب): تشغيل Ganache عبر سطر الأوامر (CLI):</h4>
              <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 font-mono text-cyan-400 text-xs flex items-center justify-between">
                <span>npm install -g ganache && ganache --port 8545 --chainId 1337</span>
              </div>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <span>الخطوة الثانية: ربط محفظة MetaMask بشبكة Ganache المحلية</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              تثبيت إضافة <strong>MetaMask</strong> في متصفحك (Chrome / Firefox / Edge) وإضافة الشبكة المحلية كشبكة مخصصة (Custom RPC):
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <ol className="list-decimal list-inside space-y-2 text-slate-300 pr-2">
                <li>افتح إضافة <strong>MetaMask</strong> ثم انقر على قائمة الشبكات العلوية واضغط <strong>Add Network (إضافة شبكة)</strong> ثم <strong>Add a network manually</strong>.</li>
                <li>أدخل الإعدادات التالية:</li>
              </ol>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300 text-[11px]">
                <div>اسم الشبكة (Network Name): <span className="text-white font-bold">Ganache Local</span></div>
                <div>عنوان RPC URL: <span className="text-cyan-400 font-bold">http://127.0.0.1:7545</span> أو <span className="text-cyan-400">8545</span></div>
                <div>معرف السلسلة (Chain ID): <span className="text-white font-bold">1337</span> أو <span className="text-white">5777</span></div>
                <div>رمز العملة (Symbol): <span className="text-amber-400 font-bold">ETH</span></div>
              </div>

              <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-lg text-amber-200 text-xs">
                <strong>نصيحة هامة:</strong> انسخ المفتاح الخاص (Private Key) لأحد حسابات Ganache من خلال النقر على أيقونة المفتاح بجانب الحساب في تطبيق Ganache، ثم في MetaMask اختر <strong>Import Account</strong> والصق المفتاح لتحصل فوراً على 100 ETH لتجربة المعاملات مجاناً!
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-cyan-400" />
              <span>الخطوة الثالثة: تجميع ونشر العقد الذكي في Remix IDE</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Remix هو المحرر السحابي القياسي لمطوري Solidity التابع لمؤسسة Ethereum Foundation:
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <ol className="list-decimal list-inside space-y-2 text-slate-300 pr-2">
                <li>
                  توجه إلى الرابط: <a href="https://remix.ethereum.org" target="_blank" rel="noreferrer" className="text-cyan-400 underline font-semibold">remix.ethereum.org</a>
                </li>
                <li>أنشئ ملفاً جديداً في مجلد contracts باسم <code className="text-cyan-300 font-mono">CyberRiskBadgeVerification.sol</code>.</li>
                <li>انسخ الكود الكامل بالأسفل والصقه في الملف.</li>
                <li>
                  انتقل إلى تبويب <strong>Solidity Compiler</strong> واختر الإصدار <code className="text-cyan-300 font-mono">0.8.20</code> ثم اضغط <strong>Compile CyberRiskBadgeVerification.sol</strong>.
                </li>
                <li>
                  انتقل إلى تبويب <strong>Deploy & Run Transactions</strong>، وفي حقل <strong>Environment</strong> اختر <strong>Injected Provider - MetaMask</strong>.
                </li>
                <li>ستفتح نافذة MetaMask؛ وافق على الاتصال، ثم اضغط على الزر البرتقالي <strong>Deploy</strong>.</li>
                <li>انسخ عنوان العقد المنشور (Deployed Contract Address) أسفل الشاشة.</li>
              </ol>

              {/* Code Box */}
              <div className="pt-2">
                <div className="flex items-center justify-between pb-1.5">
                  <span className="font-bold text-white">كود العقد الذكي الجاهز للنسخ:</span>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-all"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'تم النسخ بنجاح!' : 'نسخ كود العقد (Solidity)'}</span>
                  </button>
                </div>
                <pre className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 max-h-48 overflow-y-auto leading-relaxed">
                  {solidityCode}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>الخطوة الرابعة: ربط المنصة التعليمية بالعقد المنشور وتطبيق التجربة</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              بعد نسخ عنوان العقد الذكي من Remix IDE:
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <ol className="list-decimal list-inside space-y-2 text-slate-300 pr-2">
                <li>افتح تبويب <strong>لوحة الباحث (Admin)</strong> في شريط المنصة العلوي.</li>
                <li>في قسم "إعدادات العقد الذكي"، الصق العنوان المنسوخ في حقل <strong>Contract Address</strong> واضغط <strong>تحديث</strong>.</li>
                <li>اضغط على زر <strong>ربط محفظة MetaMask</strong> في الزاوية العلوية؛ ستتزامن المنصة تلقائياً مع رصيد حسابك وشبكتك المحلية.</li>
                <li>الآن يمكنك تجربة دور الطالب في <strong>المجموعة الأولى</strong> (حل الأنشطة واستدعاء العقد وصك شارات NFT الحقيقية)، ودور الطالب في <strong>المجموعة الثانية</strong> (فحص مستكشف الكتل، واكتشاف التلاعب بالهاش، وتسليم تقرير التدقيق الجنائي).</li>
                <li>عند الانتهاء من جلسة التجربة، اضغط <strong>تصدير البيانات (SPSS CSV)</strong> لتحميل جدول النتائج المنسق والجاهز للتحليل الإحصائي المباشر (اختبارات T للعينات المترابطة والمستقلة).</li>
              </ol>
            </div>
          </div>
        )}

        {/* Quick Nav Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
          <button
            disabled={activeStep === 1}
            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
            className="px-3.5 py-2 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-700"
          >
            الخطوة السابقة
          </button>

          <span className="text-slate-400">الخطوة {activeStep} من 4</span>

          <button
            disabled={activeStep === 4}
            onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}
            className="px-3.5 py-2 rounded-lg bg-cyan-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-500 font-bold"
          >
            الخطوة التالية
          </button>
        </div>
      </div>
    </div>
  );
};
