export type ExperimentalGroup = 'GROUP_A' | 'GROUP_B';

export interface Student {
  id: string;
  name: string;
  nationalId?: string;
  email: string;
  group: ExperimentalGroup;
  walletAddress?: string;
  preTestScore?: number;
  postTestScore?: number;
  preTestCompletedAt?: string;
  postTestCompletedAt?: string;
  activitiesCompleted: string[]; // activity IDs
  badgesEarned: DigitalBadge[];
  checklistScores?: ObservationScore;
  auditReports?: AuditReport[];
}

export interface DigitalBadge {
  id: string;
  tokenId: number;
  name: string;
  description: string;
  activityId: string;
  level: 'مبتدئ' | 'متقدم' | 'خبير';
  icon: string;
  issueDate: string;
  txHash: string;
  blockNumber: number;
  contractAddress: string;
  verifiableHash: string;
  criteria: string;
}

export interface CyberActivity {
  id: string;
  title: string;
  stage: 'تحديد الثغرات' | 'تحليل أثر الخطر' | 'تنفيذ خطة الاستجابة';
  description: string;
  scenario: string;
  objectives: string[];
  tasks: ActivityTask[];
  smartContractFunction: string;
  badgeReward: {
    name: string;
    description: string;
    level: 'مبتدئ' | 'متقدم' | 'خبير';
    icon: string;
  };
}

export interface ActivityTask {
  id: string;
  question: string;
  type: 'multiple-choice' | 'cvss-calc' | 'action-selection' | 'payload-analysis';
  options?: { label: string; value: string; isCorrect?: boolean }[];
  correctAnswer?: string;
  explanation: string;
}

export interface ObservationScore {
  studentId: string;
  evaluatorName: string;
  evaluatedAt: string;
  dimensions: {
    identification: number; // 0-10
    analysis: number;       // 0-10
    evaluation: number;     // 0-10
    mitigation: number;     // 0-10
  };
  totalScore: number;       // out of 40
  notes: string;
}

export interface BlockTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  gasUsed: number;
  timestamp: string;
  actionType: 'RISK_LOG' | 'INCIDENT_ALERT' | 'ACCESS_CONTROL' | 'SECURITY_PATCH' | 'ANOMALOUS_ACCESS';
  payloadSummary: string;
  payloadData: Record<string, any>;
  isTampered?: boolean;
  tamperDetails?: string;
  dataHash: string;
}

export interface LedgerBlock {
  blockNumber: number;
  hash: string;
  parentHash: string;
  timestamp: string;
  nonce: number;
  merkleRoot: string;
  miner: string;
  transactions: BlockTransaction[];
}

export interface AuditReport {
  id: string;
  studentId: string;
  submittedAt: string;
  targetBlockNumber: number;
  targetTxHash: string;
  integrityStatus: 'VALID' | 'TAMPERED';
  observedHash: string;
  expectedHash: string;
  attackVectorIdentified: string;
  incidentImpactAssessment: string;
  recommendedMitigation: string;
  isCorrect: boolean;
  score: number;
}

export interface TestQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  topic: 'Vulnerability Identification' | 'Risk Assessment' | 'Incident Response' | 'Blockchain Security';
  explanation: string;
}

export interface Web3State {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  balance: string | null;
  networkName: string;
  isMetaMaskAvailable: boolean;
  isSimulatedNetwork: boolean;
  contractAddress: string;
}
