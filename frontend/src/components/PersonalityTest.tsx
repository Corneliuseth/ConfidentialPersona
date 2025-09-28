import React, { useState, useEffect } from 'react';
import { QuestionCard } from './QuestionCard';
import { LoadingSpinner } from './LoadingSpinner';
import { useContract } from '../hooks/useContract';
import { useFHE } from '../hooks/useFHE';
import { Question, UserAnswers } from '../types';
import { QUESTIONS } from '../utils/constants';

interface PersonalityTestProps {
  onTestComplete: () => void;
}

export const PersonalityTest: React.FC<PersonalityTestProps> = ({ onTestComplete }) => {
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [answers, setAnswers] = useState<UserAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { submitAnswers, loading: contractLoading, error: contractError, address } = useContract();
  const { encryptAnswers, isInitialized: fheInitialized, error: fheError } = useFHE();

  useEffect(() => {
    if (contractError) {
      setError(contractError);
    }
    if (fheError) {
      setError(fheError);
    }
  }, [contractError, fheError]);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
    setError(null);
  };

  const isAllQuestionsAnswered = () => {
    return questions.every(q => answers[q.id] !== undefined);
  };

  const getProgressPercentage = () => {
    const answeredCount = Object.keys(answers).length;
    return (answeredCount / questions.length) * 100;
  };

  const handleSubmit = async () => {
    if (!isAllQuestionsAnswered()) {
      setError('Please answer all questions before submitting');
      return;
    }

    if (!fheInitialized) {
      setError('FHE encryption not ready. Please wait and try again.');
      return;
    }

    if (!address) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Convert answers to array in order
      const answersArray = questions.map(q => answers[q.id]);

      // Encrypt the answers
      const encryptedInput = await encryptAnswers(
        answersArray,
        // Using placeholder for now - will be updated after deployment
        "0x0000000000000000000000000000000000000000",
        address
      );

      // Submit to contract
      const txHash = await submitAnswers(encryptedInput.handles, encryptedInput.inputProof);

      console.log('Answers submitted successfully:', txHash);
      onTestComplete();
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.message || 'Failed to submit answers. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!fheInitialized) {
    return (
      <div className="test-section">
        <div className="loading">
          <LoadingSpinner />
          <p>Initializing secure encryption...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="test-section">
      <h2>Confidential Personality Test</h2>
      <p>
        Answer all 5 questions honestly. Your answers will be encrypted and stored securely on the blockchain.
        Only you will be able to decrypt and view your personality analysis.
      </p>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>
      <p style={{ textAlign: 'center', margin: '10px 0' }}>
        Progress: {Object.keys(answers).length} / {questions.length} questions answered
      </p>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {questions.map((question) => (
        <QuestionCard
          key={question.id}
          question={question}
          selectedAnswer={answers[question.id] ?? null}
          onAnswerSelect={handleAnswerSelect}
        />
      ))}

      <div className="submit-section">
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!isAllQuestionsAnswered() || isSubmitting || contractLoading}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Encrypted Answers'}
        </button>

        {!isAllQuestionsAnswered() && (
          <p style={{ marginTop: '10px', color: '#666' }}>
            Please answer all questions to submit
          </p>
        )}
      </div>
    </div>
  );
};