// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, externalEuint8} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title Confidential Personality Test Contract
/// @notice A privacy-preserving personality test using FHEVM encryption
contract ConfidentialPersona is SepoliaConfig {
    // Question structure
    struct Question {
        string questionText;
        string[] options;
        bool isActive;
    }

    // User's encrypted answers for all questions
    struct UserAnswers {
        euint8[5] encryptedAnswers; // Encrypted choices for 5 questions (0-3 for options)
        uint256 timestamp;
        bool hasCompleted;
    }

    // State variables
    Question[5] public questions;
    mapping(address => UserAnswers) private userAnswers;
    uint256 public questionCount;
    address public owner;

    // Events
    event QuestionsUpdated(uint256 timestamp);
    event AnswersSubmitted(address indexed user, uint256 timestamp);
    event AnswersRequested(address indexed user, uint256 timestamp);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can perform this action");
        _;
    }

    modifier questionsInitialized() {
        require(questionCount == 5, "All questions must be initialized");
        _;
    }

    constructor() {
        owner = msg.sender;
        _initializeQuestions();
    }

    /// @notice Initialize the 5 personality test questions
    function _initializeQuestions() private {
        // Question 1: Social preference
        questions[0].questionText = "How do you prefer to spend your free time?";
        questions[0].options = [
            "Reading alone at home",
            "Hanging out with close friends",
            "Attending large social gatherings",
            "Exploring new places solo"
        ];
        questions[0].isActive = true;

        // Question 2: Decision making
        questions[1].questionText = "When making important decisions, you:";
        questions[1].options = [
            "Follow your gut feeling",
            "Analyze all available data",
            "Ask friends for advice",
            "Consider long-term consequences"
        ];
        questions[1].isActive = true;

        // Question 3: Work style
        questions[2].questionText = "In a work environment, you thrive when:";
        questions[2].options = [
            "Working independently",
            "Collaborating in small teams",
            "Leading large projects"
        ];
        questions[2].isActive = true;

        // Question 4: Stress response
        questions[3].questionText = "When facing stress, you typically:";
        questions[3].options = [
            "Take time to reflect quietly",
            "Talk it through with others",
            "Take immediate action",
            "Plan methodically"
        ];
        questions[3].isActive = true;

        // Question 5: Learning preference
        questions[4].questionText = "You learn best through:";
        questions[4].options = [
            "Hands-on experience",
            "Reading and research",
            "Group discussions",
            "Visual demonstrations"
        ];
        questions[4].isActive = true;

        questionCount = 5;
        emit QuestionsUpdated(block.timestamp);
    }

    /// @notice Get a specific question and its options
    /// @param questionId The ID of the question (0-4)
    /// @return questionText The question text
    /// @return options Array of option strings
    /// @return optionCount Number of options for this question
    function getQuestion(uint256 questionId)
        external
        view
        returns (string memory questionText, string[] memory options, uint256 optionCount)
    {
        require(questionId < 5, "Invalid question ID");
        require(questions[questionId].isActive, "Question not active");

        return (
            questions[questionId].questionText,
            questions[questionId].options,
            questions[questionId].options.length
        );
    }

    /// @notice Submit encrypted answers for all 5 questions
    /// @param encryptedAnswers Array of 5 external encrypted answers
    /// @param inputProof The input proof for validation
    function submitAnswers(
        externalEuint8[5] calldata encryptedAnswers,
        bytes calldata inputProof
    ) external questionsInitialized {
        require(!userAnswers[msg.sender].hasCompleted, "User has already submitted answers");

        // Validate and convert external encrypted inputs
        euint8[5] memory validatedAnswers;
        for (uint256 i = 0; i < 5; i++) {
            validatedAnswers[i] = FHE.fromExternal(encryptedAnswers[i], inputProof);

            // Note: In production, you might want to add range validation
            // For now, we trust the frontend to send valid option indices

            // Grant permissions
            FHE.allowThis(validatedAnswers[i]);
            FHE.allow(validatedAnswers[i], msg.sender);
        }

        // Store the encrypted answers
        userAnswers[msg.sender] = UserAnswers({
            encryptedAnswers: validatedAnswers,
            timestamp: block.timestamp,
            hasCompleted: true
        });

        emit AnswersSubmitted(msg.sender, block.timestamp);
    }

    /// @notice Check if user has completed the personality test
    /// @param user The user address to check
    /// @return hasCompleted Whether user has completed the test
    /// @return timestamp When the test was completed (0 if not completed)
    function hasUserCompleted(address user)
        external
        view
        returns (bool hasCompleted, uint256 timestamp)
    {
        UserAnswers storage answers = userAnswers[user];
        return (answers.hasCompleted, answers.timestamp);
    }

    /// @notice Get user's encrypted answer for a specific question
    /// @param questionId The question ID (0-4)
    /// @return encryptedAnswer The encrypted answer for the question
    function getUserAnswer(uint256 questionId)
        external
        view
        returns (euint8 encryptedAnswer)
    {
        require(questionId < 5, "Invalid question ID");
        require(userAnswers[msg.sender].hasCompleted, "User has not completed the test");

        return userAnswers[msg.sender].encryptedAnswers[questionId];
    }

    /// @notice Get all user's encrypted answers (for decryption)
    /// @return encryptedAnswers Array of all 5 encrypted answers
    /// @return timestamp When the answers were submitted
    function getAllUserAnswers()
        external
        view
        returns (euint8[5] memory encryptedAnswers, uint256 timestamp)
    {
        require(userAnswers[msg.sender].hasCompleted, "User has not completed the test");

        UserAnswers storage answers = userAnswers[msg.sender];
        return (answers.encryptedAnswers, answers.timestamp);
    }

    /// @notice Update a question (owner only)
    /// @param questionId The question ID to update
    /// @param questionText New question text
    /// @param options New options array
    function updateQuestion(
        uint256 questionId,
        string calldata questionText,
        string[] memory options
    ) external onlyOwner {
        require(questionId < 5, "Invalid question ID");
        require(options.length >= 2 && options.length <= 4, "Question must have 2-4 options");

        questions[questionId].questionText = questionText;

        // Clear existing options first
        delete questions[questionId].options;

        // Add new options one by one
        for (uint256 i = 0; i < options.length; i++) {
            questions[questionId].options.push(options[i]);
        }

        questions[questionId].isActive = true;

        emit QuestionsUpdated(block.timestamp);
    }

    /// @notice Get total number of users who completed the test
    /// @return count Number of completed tests
    function getCompletedTestCount() external pure returns (uint256 count) {
        // Note: This is a simplified implementation
        // In a real contract, you might want to maintain a counter
        // For now, this function exists for interface completeness
        return 0; // Placeholder implementation
    }

    /// @notice Emergency function to reset user's answers (owner only)
    /// @param user The user address to reset
    function resetUserAnswers(address user) external onlyOwner {
        delete userAnswers[user];
    }
}