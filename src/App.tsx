import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { GroupAView } from './components/GroupAView';
import { GroupBView } from './components/GroupBView';
import { AssessmentTestView } from './components/AssessmentTestView';
import { ObservationChecklistView } from './components/ObservationChecklistView';
import { BadgeShowcase } from './components/BadgeShowcase';
import { AdminDashboard } from './components/AdminDashboard';
import { SetupGuideModal } from './components/SetupGuideModal';
import { Student, Web3State } from './types';
import { storageService } from './services/storageService';
import { web3Service } from './services/web3Service';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => storageService.getStudents());
  const [activeStudent, setActiveStudent] = useState<Student>(() => storageService.getActiveStudent());
  const [activeTab, setActiveTab] = useState<'activities' | 'pre-test' | 'post-test' | 'observation' | 'badges' | 'admin' | 'guide'>('activities');

  const [web3State, setWeb3State] = useState<Web3State>({
    isConnected: false,
    address: null,
    chainId: null,
    balance: null,
    networkName: 'غير متصل بالمحفظة',
    isMetaMaskAvailable: false,
    isSimulatedNetwork: true,
    contractAddress: web3Service.getContractAddress(),
  });

  const refreshData = () => {
    const updatedList = storageService.getStudents();
    setStudents(updatedList);
    const updatedActive = storageService.getActiveStudent();
    setActiveStudent(updatedActive);
  };

  useEffect(() => {
    // Check Web3 status initially
    const checkWeb3 = async () => {
      try {
        const state = await web3Service.getNetworkState();
        setWeb3State(state);
      } catch (err) {
        console.warn('Initial web3 check warning:', err);
      }
    };
    checkWeb3();

    // Listen for MetaMask account & network changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = async () => {
        const state = await web3Service.getNetworkState();
        setWeb3State(state);
      };
      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum.on?.('accountsChanged', handleAccountsChanged);
      window.ethereum.on?.('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener?.('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener?.('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const handleConnectWallet = async () => {
    try {
      const state = await web3Service.connectWallet();
      setWeb3State(state);
    } catch (err: any) {
      alert(err.message || 'فشل الاتصال بمحفظة MetaMask');
    }
  };

  const handleSelectStudent = (id: string) => {
    storageService.setActiveStudentId(id);
    const found = students.find(s => s.id === id);
    if (found) {
      setActiveStudent(found);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white" dir="rtl">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeStudent={activeStudent}
        students={students}
        onSelectStudent={handleSelectStudent}
        web3State={web3State}
        onConnectWallet={handleConnectWallet}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'activities' && (
          activeStudent.group === 'GROUP_A' ? (
            <GroupAView
              activeStudent={activeStudent}
              web3State={web3State}
              onRefreshStudent={refreshData}
              onViewBadges={() => setActiveTab('badges')}
            />
          ) : (
            <GroupBView
              activeStudent={activeStudent}
              onRefreshStudent={refreshData}
            />
          )
        )}

        {activeTab === 'pre-test' && (
          <AssessmentTestView
            activeStudent={activeStudent}
            testType="pre"
            onRefreshStudent={refreshData}
            onNavigateToPostTest={() => setActiveTab('post-test')}
          />
        )}

        {activeTab === 'post-test' && (
          <AssessmentTestView
            activeStudent={activeStudent}
            testType="post"
            onRefreshStudent={refreshData}
          />
        )}

        {activeTab === 'observation' && (
          <ObservationChecklistView
            activeStudent={activeStudent}
            onRefreshStudent={refreshData}
          />
        )}

        {activeTab === 'badges' && (
          <BadgeShowcase
            activeStudent={activeStudent}
          />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard
            students={students}
            onRefreshStudents={refreshData}
            web3State={web3State}
          />
        )}

        {activeTab === 'guide' && (
          <SetupGuideModal />
        )}
      </main>

      {/* Academic Research Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 text-xs text-slate-500 text-center space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-slate-400">
            منصة <span className="text-indigo-400 font-semibold">CyberSec Blockchain EduLab</span> — بيئة التعلم التجريبية لرسالة علمية في تكنولوجيا التعليم والأمن السيبراني.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Solidity 0.8.20</span>
            <span>•</span>
            <span>Ethers.js v6</span>
            <span>•</span>
            <span>Ganache Local Testnet</span>
            <span>•</span>
            <span>SPSS Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
