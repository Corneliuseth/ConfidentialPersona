import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onAnswerSelect: (questionId: number, answerIndex: number) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect
}) => {
  return (
    <div className="question-card">
      <h3 className="question-title">
        {question.id + 1}. {question.text}
      </h3>
      <div className="options-grid">
        {question.options.map((option, index) => (
          <button
            key={index}
            className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
            onClick={() => onAnswerSelect(question.id, index)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};