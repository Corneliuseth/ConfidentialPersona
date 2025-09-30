// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, externalEuint8} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title ConfidentialPersona
/// @notice Stores quiz definitions and encrypted user choices using Zama FHEVM
contract ConfidentialPersona is SepoliaConfig {
    // Simple owner pattern (no external dependency)
    address public owner;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    struct QuestionDef {
        uint8 id; // 1..N
        uint8 optionsCount; // 2..4
        bool exists;
    }

    // Question definitions
    mapping(uint8 => QuestionDef) private _questions;
    uint8[] private _questionIds;

    // user => questionId => encrypted choice (1..optionsCount)
    mapping(address => mapping(uint8 => euint8)) private _answers;
    mapping(address => bool) public hasSubmitted; // whether user has submitted at least one answer set

    event QuestionsSet(uint8[] ids, uint8[] optionsCounts);
    event AnswerSubmitted(address indexed user, uint8 indexed questionId);
    event AnswersSubmitted(address indexed user, uint8 count);

    /// @notice Set or update question definitions
    /// @param ids Question IDs
    /// @param optionsCounts Number of options for each question
    function setQuestions(uint8[] calldata ids, uint8[] calldata optionsCounts) external onlyOwner {
        require(ids.length == optionsCounts.length, "Length mismatch");
        delete _questionIds;
        for (uint256 i = 0; i < ids.length; i++) {
            require(ids[i] != 0, "Invalid id");
            require(optionsCounts[i] >= 2 && optionsCounts[i] <= 4, "Options 2..4");
            _questions[ids[i]] = QuestionDef({id: ids[i], optionsCount: optionsCounts[i], exists: true});
            _questionIds.push(ids[i]);
        }
        emit QuestionsSet(ids, optionsCounts);
    }

    /// @notice Get all question IDs and option counts
    /// @return ids Question IDs
    /// @return optionsCounts Options count per question
    function getQuestions() external view returns (uint8[] memory ids, uint8[] memory optionsCounts) {
        uint256 n = _questionIds.length;
        ids = new uint8[](n);
        optionsCounts = new uint8[](n);
        for (uint256 i = 0; i < n; i++) {
            uint8 qid = _questionIds[i];
            ids[i] = qid;
            optionsCounts[i] = _questions[qid].optionsCount;
        }
    }

    /// @notice Submit a single encrypted answer
    /// @param questionId The question id to answer
    /// @param choice External encrypted choice (1..optionsCount)
    /// @param inputProof Zama input proof
    function submitAnswer(uint8 questionId, externalEuint8 choice, bytes calldata inputProof) external {
        require(_questions[questionId].exists, "Unknown question");
        euint8 enc = FHE.fromExternal(choice, inputProof);

        _answers[msg.sender][questionId] = enc;

        // Grant permanent access to the ciphertext for the user and contract
        FHE.allowThis(enc);
        FHE.allow(enc, msg.sender);

        hasSubmitted[msg.sender] = true;
        emit AnswerSubmitted(msg.sender, questionId);
    }

    /// @notice Submit multiple encrypted answers at once
    /// @dev All answers share the same input proof produced client-side
    /// @param questionIds Array of question ids
    /// @param choices Array of external encrypted choices
    /// @param inputProof Zama input proof
    function submitAnswers(
        uint8[] calldata questionIds,
        externalEuint8[] calldata choices,
        bytes calldata inputProof
    ) external {
        require(questionIds.length == choices.length, "Length mismatch");
        uint256 n = questionIds.length;
        require(n > 0, "No answers");

        for (uint256 i = 0; i < n; i++) {
            uint8 qid = questionIds[i];
            require(_questions[qid].exists, "Unknown question");
            euint8 enc = FHE.fromExternal(choices[i], inputProof);
            _answers[msg.sender][qid] = enc;
            FHE.allowThis(enc);
            FHE.allow(enc, msg.sender);
            emit AnswerSubmitted(msg.sender, qid);
        }
        hasSubmitted[msg.sender] = true;
        emit AnswersSubmitted(msg.sender, uint8(n));
    }

    /// @notice Get an encrypted answer for a given user and question
    /// @dev View method does not depend on msg.sender
    function getAnswer(address user, uint8 questionId) external view returns (euint8) {
        return _answers[user][questionId];
    }

    /// @notice Get encrypted answers for a given user for multiple questions
    /// @param user The user address
    /// @param questionIds The question ids to fetch
    /// @return answersBytes Encrypted answers as euint8 bytes32 handles
    function getAnswers(address user, uint8[] calldata questionIds) external view returns (euint8[] memory answersBytes) {
        uint256 n = questionIds.length;
        answersBytes = new euint8[](n);
        for (uint256 i = 0; i < n; i++) {
            answersBytes[i] = _answers[user][questionIds[i]];
        }
    }
}

