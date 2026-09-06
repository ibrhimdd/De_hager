import React from 'react';
import { Shield, Wallet, BookOpen, CheckSquare, Award, Settings, HelpCircle, Users, ExternalLink, Cpu } from 'lucide-react';
import { Student, Web3State } from '../types';

interface NavbarProps {
  activeTab: 'activities' | 'pre-test' | 'post-test' | 'observation' | 'badges' | 'admin' | 'guide';
  setActiveTab: (tab: 'activities' | 'pre-test' | 'post-test' | 'observation' | 'badges' | 'admin' | 'guide') => void;
  activeStudent: Student;
  students: Student[];
  onSelectStudent: (id: string) => void;
  web3State: Web3State;
  onConnectWallet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeStudent,
  students,
  onSelectStudent,
  web3State,
  onConnectWallet,
}) => {
  const isGroupA = activeStudent.group === 'GROUP_A';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Banner: Research Metadata & Group Status */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-emerald-950 border-b border-slate-800/80 px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 font-medium">
            <Cpu className="w-3 h-3 text-indigo-400" />
            منصة بحث علمي: تكنولوجيا التعليم والأمن السيبراني
          </span>
          <span className="text-slate-400 hidden sm:inline">
            دراسة أثر بيئة التعلم القائمة على البلوكشين في تنمية مهارات إدارة المخاطر السيبرانية
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Active Experimental Group Indicator */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">المجموعة المسجلة:</span>
            {isGroupA ? (
              <span className="bg-cyan-500/15 text-cyan-300 font-semibold px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                المجموعة 1: العقود الذكية والتقييم الآلي
              </span>
            ) : (
              <span className="bg-emerald-500/15 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                المجموعة 2: سلسلة التتبع وتدقيق البيانات
              </span>
            )}
          </div>

          {/* Student Switcher for experimental demo */}
          <div className="flex items-center gap-1 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={activeStudent.id}
              onChange={(e) => onSelectStudent(e.target.value)}
              className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer pr-1"
              title="تبديل الطالب لتجربة المجموعتين"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id} className="bg-slate-900 text-slate-200">
                  {s.name} ({s.group === 'GROUP_A' ? 'مجموعة أ' : 'مجموعة ب'})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('activities')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">CyberSec EduLab</span>
                <span className="text-[10px] uppercase font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-1.5 py-0.5 rounded">
                  Web3
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">منصة التجارب التعليمية القائمة على البلوكشين</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800 text-sm font-medium">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'activities'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>الأنشطة التعليمية</span>
            </button>

            <button
              onClick={() => setActiveTab('pre-test')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'pre-test'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>الاختبار القبلي</span>
              {activeStudent.preTestScore !== undefined && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('post-test')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'post-test'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>الاختبار البعدي</span>
              {activeStudent.postTestScore !== undefined && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('observation')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'observation'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>بطاقة الملاحظة</span>
            </button>

            <button
              onClick={() => setActiveTab('badges')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'badges'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>شارات البلوكشين ({activeStudent.badgesEarned.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'admin'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 font-semibold'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/30'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>لوحة الباحث</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'guide'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 font-semibold'
                  : 'text-cyan-300 hover:text-white hover:bg-cyan-900/30'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>دليل Ganache/Remix</span>
            </button>
          </nav>

          {/* Web3 / MetaMask Wallet Status */}
          <div className="flex items-center gap-2">
            <button
              onClick={onConnectWallet}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                web3State.isConnected
                  ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                  : 'bg-indigo-600 hover:bg-indigo-500 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
              }`}
              title="ربط محفظة MetaMask أو الاتصال بشبكة Ganache"
            >
              <Wallet className="w-4 h-4" />
              <div className="text-right">
                {web3State.isConnected ? (
                  <div className="flex flex-col items-start leading-tight">
                    <span className="font-mono text-[11px] font-semibold">
                      {web3State.address ? `${web3State.address.slice(0, 6)}...${web3State.address.slice(-4)}` : 'متصل'}
                    </span>
                    <span className="text-[10px] text-emerald-400/80">
                      {web3State.balance ? `${web3State.balance} ETH` : 'Ganache 1337'}
                    </span>
                  </div>
                ) : (
                  <span>ربط محفظة MetaMask</span>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Tab Scroller */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none text-xs border-t border-slate-800">
          <button
            onClick={() => setActiveTab('activities')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'activities' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            الأنشطة
          </button>
          <button
            onClick={() => setActiveTab('pre-test')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'pre-test' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            الاختبار القبلي
          </button>
          <button
            onClick={() => setActiveTab('post-test')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'post-test' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            الاختبار البعدي
          </button>
          <button
            onClick={() => setActiveTab('observation')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'observation' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            بطاقة الملاحظة
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'badges' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            شارات البلوكشين
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'admin' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-purple-300'
            }`}
          >
            لوحة الباحث
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap ${
              activeTab === 'guide' ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-cyan-300'
            }`}
          >
            دليل Ganache/Remix
          </button>
        </div>
      </div>
    </header>
  );
};
