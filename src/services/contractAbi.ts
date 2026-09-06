export const CYBER_BADGE_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const ACTIVITY_SOLUTION_HASHES = {
  1: "0x3f5d1e67b2d5568f18d72f913d0739ba6188448ea9ef8f2c3498877bc955e8c1", // SQL_INJECTION_AND_BROKEN_AUTH_MITIGATED
  2: "0x894e772ea11b0e0eb86716768393e9ad175caefae49d8e7dc8524d77685ba05b", // HIGH_IMPACT_CVSS_SCORE_8_8_VERIFIED
  3: "0x7a305f8f8bb15dfc37f37470fcf100790dc8feea8b856cf7dbe91ef1fcb007cb", // CONTAINMENT_ERADICATION_RECOVERY_DONE
};

export const CYBER_BADGE_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function researcherOwner() view returns (address)",
  "function verifyAndIssueBadge(uint256 activityId, bytes32 solutionHash, string activityTitle, string badgeLevel, string metadataURI) returns (uint256)",
  "function getStudentBadges(address student) view returns (tuple(uint256 tokenId, address studentAddress, uint256 activityId, string activityTitle, string badgeLevel, bytes32 verificationProofHash, uint256 timestamp, string tokenURI, bool isValid)[])",
  "function verifyBadge(uint256 tokenId) view returns (bool isValid, address student, string title, string level, uint256 timestamp, bytes32 proofHash)",
  "function hasCompletedActivity(address student, uint256 activityId) view returns (bool)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address owner) view returns (uint256)",
  "event BadgeMinted(address indexed student, uint256 indexed tokenId, uint256 indexed activityId, string badgeLevel, bytes32 proofHash, uint256 timestamp)",
  "event ActivityVerified(address indexed student, uint256 indexed activityId, bool success, bytes32 submittedHash)"
];
