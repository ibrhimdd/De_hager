import { LedgerBlock } from '../types';

export const INITIAL_LEDGER_BLOCKS: LedgerBlock[] = [
  {
    blockNumber: 10481,
    hash: '0x9a8f2c3498877bc955e8c13f5d1e67b2d5568f18d72f913d0739ba6188448ea9',
    parentHash: '0x1b4c7d99a2e34f87a02c819d651c5f38e21a998c56e012fa872b4513904fc192',
    timestamp: '2026-09-06 09:15:22 UTC',
    nonce: 74219,
    merkleRoot: '0x4d79a2f1b8c6e3d9a1024b89c72e19a4f61e892c57a013fd981c24367980e123',
    miner: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    transactions: [
      {
        hash: '0x5c8e192a0f8b7d6e4a2c1b903f7e5d8a9b2c4e6f1a8d0b2c4e6f8a0b2c4e6f8a',
        from: '0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C',
        to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        value: '0.00 ETH',
        gasUsed: 42100,
        timestamp: '2026-09-06 09:14:50 UTC',
        actionType: 'ACCESS_CONTROL',
        payloadSummary: 'تسجيل صلاحية وصول موظف أمن سيبراني (SOC Analyst Level 2)',
        payloadData: {
          employeeId: 'EMP-7712',
          role: 'SOC_ANALYST',
          permissions: ['READ_LOGS', 'MONITOR_TRAFFIC'],
          clearanceLevel: 'SECRET',
          authorizedBy: '0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C'
        },
        dataHash: '0x7b2f913d0739ba6188448ea9ef8f2c3498877bc955e8c13f5d1e67b2d5568f18',
        isTampered: false
      },
      {
        hash: '0x2d9a8f4c1e0b7a6d5c3e2f1a9b8d7c6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c',
        from: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
        to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        value: '0.00 ETH',
        gasUsed: 65300,
        timestamp: '2026-09-06 09:15:10 UTC',
        actionType: 'RISK_LOG',
        payloadSummary: 'تسجيل تقرير دوري لفحص نقاط الضعف في جدار الحماية (Firewall Audit)',
        payloadData: {
          component: 'Perimeter_Firewall_Cisco_NGFW',
          vulnerabilitiesDetected: 0,
          status: 'COMPLIANT',
          reviewedAt: '2026-09-06T09:15:00Z'
        },
        dataHash: '0x18d72f913d0739ba6188448ea9ef8f2c3498877bc955e8c13f5d1e67b2d5568f',
        isTampered: false
      }
    ]
  },
  {
    blockNumber: 10482,
    hash: '0x4e772ea11b0e0eb86716768393e9ad175caefae49d8e7dc8524d77685ba05b18',
    parentHash: '0x9a8f2c3498877bc955e8c13f5d1e67b2d5568f18d72f913d0739ba6188448ea9',
    timestamp: '2026-09-06 09:32:45 UTC',
    nonce: 89312,
    merkleRoot: '0x3a9d7c5f1e8b2a4c6d0e7f9a8b1c3d5e2f4a6b8c0d1e3f5a7b9c1d3e5f7a9b1c',
    miner: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    transactions: [
      {
        hash: '0x8a9b2c4e6f1a8d0b2c4e6f8a0b2c4e6f8a5c8e192a0f8b7d6e4a2c1b903f7e5d',
        from: '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
        to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        value: '0.00 ETH',
        gasUsed: 54100,
        timestamp: '2026-09-06 09:30:15 UTC',
        actionType: 'INCIDENT_ALERT',
        payloadSummary: 'إنذار باكتشاف محاولة تسجيل دخول فاشلة متكررة (Brute-Force Attack Alert)',
        payloadData: {
          targetService: 'SSH_Gateway_Bastion',
          sourceIp: '198.51.100.44',
          failedAttempts: 154,
          automatedAction: 'IP_TEMPORARILY_BLOCKED_FOR_60_MINUTES'
        },
        dataHash: '0x37f37470fcf100790dc8feea8b856cf7dbe91ef1fcb007cb894e772ea11b0e0e',
        isTampered: false
      },
      {
        hash: '0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
        from: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
        to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        value: '0.00 ETH',
        gasUsed: 78900,
        timestamp: '2026-09-06 09:32:00 UTC',
        actionType: 'ANOMALOUS_ACCESS',
        payloadSummary: '⚠️ تعديل غير مصرح به على تصاريح قاعدة البيانات المشتركة (تغيير أثر الخطر)',
        // ATTACK SCENARIO: An inside attacker or compromised credential modified this payload!
        payloadData: {
          modifiedRecord: 'EMERGENCY_OVERRIDE_FLAG',
          previousValue: 'STRICT_AUDIT_REQUIRED',
          currentTamperedValue: 'BYPASS_AUDIT_LOGGING',
          alteredByAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
          targetAsset: 'Core_Financial_Ledger_Table',
          maliciousIntent: 'DISABLING_IMMUTABLE_CHAIN_TRIGGER'
        },
        dataHash: '0x9999999999999999999999999999999999999999999999999999999999999999', // This does NOT match the payload keccak256
        isTampered: true,
        tamperDetails: 'تم اكتشاف تباين بين التجزئة التشفيرية المخزنة ومحتوى المعاملة الأصلي! الحقل modifiedRecord تم التلاعب به لتعطيل التدقيق.'
      }
    ]
  },
  {
    blockNumber: 10483,
    hash: '0x7a305f8f8bb15dfc37f37470fcf100790dc8feea8b856cf7dbe91ef1fcb007cb',
    parentHash: '0x4e772ea11b0e0eb86716768393e9ad175caefae49d8e7dc8524d77685ba05b18',
    timestamp: '2026-09-06 09:50:11 UTC',
    nonce: 63102,
    merkleRoot: '0x6b8c0d1e3f5a7b9c1d3e5f7a9b1c3a9d7c5f1e8b2a4c6d0e7f9a8b1c3d5e2f4a',
    miner: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    transactions: [
      {
        hash: '0xf1a8d0b2c4e6f8a0b2c4e6f8a5c8e192a0f8b7d6e4a2c1b903f7e5d8a9b2c4e6',
        from: '0x14723A09ACff6D2A60DcdF7aA4AFf308FDDC160C',
        to: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        value: '0.00 ETH',
        gasUsed: 39400,
        timestamp: '2026-09-06 09:48:30 UTC',
        actionType: 'SECURITY_PATCH',
        payloadSummary: 'تطبيق التحديث الأمني العاجل وتجميد الحساب المشتبه به',
        payloadData: {
          patchId: 'KB-2026-SEC09',
          isolatedAccount: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
          status: 'ACCOUNT_QUARANTINED',
          enforcedMFA: true
        },
        dataHash: '0x4b89c72e19a4f61e892c57a013fd981c24367980e1234d79a2f1b8c6e3d9a102',
        isTampered: false
      }
    ]
  }
];

export const FORENSIC_CASE_DETAILS = {
  title: 'قضية التدقيق الجنائي: هجمة التلاعب بسجلات الصلاحيات في سلسلة الكتل',
  brief: 'رصد نظام كشف التسلل (IDS) مؤشراً على نشاط غير معتاد في سجلات المعاملات. بصفتك مدقق أمني وباحث في إدارة المخاطر السيبرانية، مهمتك تصفح السلسلة (Blocks 10481 - 10483)، وفحص الـ Hashes، ومطابقة التجزئة التشفيرية للبيانات (Keccak256 / SHA-256) للتأكد من سلامة البيانات (Data Integrity Check) وكشف المعاملة المخترقة وتوثيق عنوان المهاجم وتقديم التقرير العلمي للباحث.',
  targetBlock: 10482,
  compromisedTx: '0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
  attackerAddress: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4df',
  attackVector: 'Privilege Escalation & Audit Log Tampering via Compromised Key'
};
