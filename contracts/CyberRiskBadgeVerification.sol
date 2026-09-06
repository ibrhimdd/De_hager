// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CyberRiskBadgeVerification
 * @dev عقد ذكي للتقييم الآلي لأنشطة إدارة المخاطر السيبرانية وإصدار شارات الإنجاز الرقمية (Soulbound / ERC-721)
 * تم تطويره كجزء من منصة البحث التجريبية في تكنولوجيا التعليم والأمن السيبراني.
 */

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

contract CyberRiskBadgeVerification {
    // اسم ورمز الشارات الرقمية
    string public name = "CyberRisk EduBadge";
    string public symbol = "CREB";

    // مالك العقد (الباحث الأكاديمي المشرف)
    address public researcherOwner;

    // عداد الشارات المصدرة
    uint256 private _tokenIdCounter;

    // هيكل بيانات شارة الإنجاز الرقمية
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

    // هيكل متطلبات النشاط المخزنة في البلوكشين للتقييم الآلي
    struct ActivityRequirement {
        uint256 activityId;
        string title;
        bytes32 expectedSolutionHash;
        uint256 passingScore;
        bool isActive;
    }

    // المعاملات المخزنة
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) private _studentBadges;
    mapping(uint256 => ActivityRequirement) public activityRequirements;
    
    // منع تكرار الحصول على نفس الشارة للنشاط نفسه لنفس الطالب
    mapping(address => mapping(uint256 => bool)) public hasCompletedActivity;

    // الأحداث (Events) لتسجيل وتتبع المعاملات على البلوكشين
    event BadgeMinted(
        address indexed student,
        uint256 indexed tokenId,
        uint256 indexed activityId,
        string badgeLevel,
        bytes32 proofHash,
        uint256 timestamp
    );

    event ActivityVerified(
        address indexed student,
        uint256 indexed activityId,
        bool success,
        bytes32 submittedHash
    );

    event ActivityConfigured(
        uint256 indexed activityId,
        string title,
        bytes32 solutionHash
    );

    modifier onlyResearcher() {
        require(msg.sender == researcherOwner, "Only researcher can invoke this function");
        _;
    }

    constructor() {
        researcherOwner = msg.sender;
        _tokenIdCounter = 1;

        // تهيئة الأنشطة الثلاثة للمجموعة التجريبية الأولى بحلولها المعتمدة برمجياً
        // نشاط 1: تحديد الثغرات (Vulnerability Identification)
        _setupInitialActivity(
            1,
            "Vulnerability Identification & Assessment",
            keccak256(abi.encodePacked("SQL_INJECTION_AND_BROKEN_AUTH_MITIGATED")),
            80
        );

        // نشاط 2: تحليل أثر الخطر وحساب CVSS (Risk Impact Analysis)
        _setupInitialActivity(
            2,
            "Risk Impact Analysis & CVSS Calculation",
            keccak256(abi.encodePacked("HIGH_IMPACT_CVSS_SCORE_8_8_VERIFIED")),
            85
        );

        // نشاط 3: تنفيذ خطة الاستجابة للحوادث (Incident Response Execution)
        _setupInitialActivity(
            3,
            "Incident Response Plan NIST Framework",
            keccak256(abi.encodePacked("CONTAINMENT_ERADICATION_RECOVERY_DONE")),
            90
        );
    }

    function _setupInitialActivity(
        uint256 _id,
        string memory _title,
        bytes32 _hash,
        uint256 _passScore
    ) internal {
        activityRequirements[_id] = ActivityRequirement({
            activityId: _id,
            title: _title,
            expectedSolutionHash: _hash,
            passingScore: _passScore,
            isActive: true
        });
    }

    /**
     * @dev التحقق الآلي من إجابة الطالب وصك شارة رقمية فورية
     * يتم الاستدعاء مباشرة من محفظة الطالب بعد إتمام النشاط بنجاح
     */
    function verifyAndIssueBadge(
        uint256 activityId,
        bytes32 solutionHash,
        string memory activityTitle,
        string memory badgeLevel,
        string memory metadataURI
    ) external returns (uint256) {
        ActivityRequirement memory req = activityRequirements[activityId];
        require(req.isActive, "Activity not active or not found");
        require(!hasCompletedActivity[msg.sender][activityId], "Badge already issued for this activity");

        // التحقق الآلي من تطابق رمز التحقق المشفر بدون أي تدخل بشري
        bool isVerified = (solutionHash == req.expectedSolutionHash);
        
        emit ActivityVerified(msg.sender, activityId, isVerified, solutionHash);
        require(isVerified, "Automated Verification Failed: Solution hash does not match contract criteria");

        // تسجيل إتمام النشاط
        hasCompletedActivity[msg.sender][activityId] = true;

        // صك الشارة الرقمية (Soulbound - غير قابلة للنقل للحفاظ على الأمانة الأكاديمية)
        uint256 newTokenId = _tokenIdCounter;
        _tokenIdCounter++;

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

        emit BadgeMinted(
            msg.sender,
            newTokenId,
            activityId,
            badgeLevel,
            solutionHash,
            block.timestamp
        );

        return newTokenId;
    }

    /**
     * @dev استرجاع جميع الشارات الرقمية لطالب معين
     */
    function getStudentBadges(address student) external view returns (Badge[] memory) {
        uint256[] memory tokenIds = _studentBadges[student];
        Badge[] memory studentBadgesList = new Badge[](tokenIds.length);

        for (uint256 i = 0; i < tokenIds.length; i++) {
            studentBadgesList[i] = badges[tokenIds[i]];
        }

        return studentBadgesList;
    }

    /**
     * @dev التحقق من صحة ومصداقية أي شارة رقمية صادرة عبر البلوكشين
     */
    function verifyBadge(uint256 tokenId) external view returns (
        bool isValid,
        address student,
        string memory title,
        string memory level,
        uint256 timestamp,
        bytes32 proofHash
    ) {
        require(_owners[tokenId] != address(0), "Badge does not exist");
        Badge memory b = badges[tokenId];
        return (
            b.isValid,
            b.studentAddress,
            b.activityTitle,
            b.badgeLevel,
            b.timestamp,
            b.verificationProofHash
        );
    }

    /**
     * @dev تحديث أو إضافة متطلبات نشاط جديد بواسطة الباحث
     */
    function configureActivity(
        uint256 activityId,
        string memory title,
        bytes32 solutionHash,
        uint256 passingScore
    ) external onlyResearcher {
        activityRequirements[activityId] = ActivityRequirement({
            activityId: activityId,
            title: title,
            expectedSolutionHash: solutionHash,
            passingScore: passingScore,
            isActive: true
        });

        emit ActivityConfigured(activityId, title, solutionHash);
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter - 1;
    }

    function ownerOf(uint256 tokenId) external view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Owner query for nonexistent token");
        return owner;
    }

    function balanceOf(address owner) external view returns (uint256) {
        require(owner != address(0), "Balance query for zero address");
        return _balances[owner];
    }
}
