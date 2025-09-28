import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { useContract } from '../hooks/useContract';
import { useFHE } from '../hooks/useFHE';
import { useWalletClient } from 'wagmi';
import { PersonalityResult } from '../types';
import { analyzePersonality, getPersonalityInsights } from '../utils/personalityAnalysis';
import { CONFIDENTIAL_PERSONA_ADDRESS } from '../utils/constants';

export const Results: React.FC = () => {
  const [decryptedAnswers, setDecryptedAnswers] = useState<number[] | null>(null);
  const [personalityResult, setPersonalityResult] = useState<PersonalityResult | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getUserAnswers, address } = useContract();
  const { decryptAnswers } = useFHE();
  const { data: walletClient } = useWalletClient();

  const handleDecryptAnswers = async () => {
    if (!address || !walletClient) {
      setError('Wallet not connected');
      return;
    }

    try {
      setIsDecrypting(true);
      setError(null);

      // Get encrypted answers from contract
      const encryptedAnswerHandles = await getUserAnswers();

      if (!encryptedAnswerHandles || encryptedAnswerHandles.length === 0) {
        throw new Error('No encrypted answers found');
      }

      // Create a signer-like object for the decryption
      const signer = {
        signTypedData: async (domain: any, types: any, message: any) => {
          return await walletClient.signTypedData({
            account: address as `0x${string}`,
            domain,
            types,
            primaryType: 'UserDecryptRequestVerification',
            message
          });
        }
      };

      // Decrypt the answers
      const decryptedData = await decryptAnswers(
        encryptedAnswerHandles,
        CONFIDENTIAL_PERSONA_ADDRESS,
        address,
        signer
      );

      // Extract the actual answer values
      const answers = encryptedAnswerHandles.map(handle => {
        const value = decryptedData[handle];
        return typeof value === 'number' ? value : parseInt(value.toString());
      });

      setDecryptedAnswers(answers);

      // Analyze personality
      const result = analyzePersonality(answers);
      setPersonalityResult(result);

    } catch (err: any) {
      console.error('Decryption failed:', err);
      setError(err.message || 'Failed to decrypt answers');
    } finally {
      setIsDecrypting(false);
    }
  };

  const resetResults = () => {
    setDecryptedAnswers(null);
    setPersonalityResult(null);
    setError(null);
  };

  if (isDecrypting) {
    return (
      <div className="results-section">
        <div className="loading">
          <LoadingSpinner size="large" />
          <h3>Decrypting Your Answers...</h3>
          <p>Please wait while we securely decrypt your personality test results.</p>
        </div>
      </div>
    );
  }

  if (personalityResult) {
    const insights = getPersonalityInsights(personalityResult);

    return (
      <div className="results-section">
        <h2>Your Personality Analysis</h2>

        <div className="personality-result">
          <h3>{personalityResult.type}</h3>
          <p>{personalityResult.description}</p>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h4>Key Insights:</h4>
          <ul style={{ lineHeight: '1.8', marginTop: '15px' }}>
            {insights.map((insight, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                {insight}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={resetResults}
          >
            View Raw Answers
          </button>
        </div>

        <div className="info" style={{ marginTop: '20px' }}>
          <strong>Privacy Note:</strong> Your answers were decrypted locally in your browser using your private key.
          The encrypted data remains secure on the blockchain, and only you can access the decrypted results.
        </div>
      </div>
    );
  }

  if (decryptedAnswers) {
    return (
      <div className="results-section">
        <h2>Your Decrypted Answers</h2>

        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px', margin: '20px 0' }}>
          <h4>Your Responses:</h4>
          {decryptedAnswers.map((answer, index) => (
            <div key={index} style={{ margin: '10px 0' }}>
              <strong>Question {index + 1}:</strong> Option {answer + 1}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              const result = analyzePersonality(decryptedAnswers);
              setPersonalityResult(result);
            }}
          >
            Analyze My Personality
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="results-section">
      <h2>View Your Results</h2>
      <p>
        Your personality test answers are encrypted and stored securely on the blockchain.
        Click the button below to decrypt and analyze your results.
      </p>

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <button
          className="btn btn-primary"
          onClick={handleDecryptAnswers}
          disabled={isDecrypting}
        >
          Decrypt & Analyze My Results
        </button>
      </div>

      <div className="info" style={{ marginTop: '30px' }}>
        <strong>How it works:</strong>
        <br />
        1. Your answers are encrypted using Fully Homomorphic Encryption (FHE)
        <br />
        2. Only you can decrypt them using your wallet's private key
        <br />
        3. The decryption happens locally in your browser
        <br />
        4. Your privacy is maintained at all times
      </div>
    </div>
  );
};