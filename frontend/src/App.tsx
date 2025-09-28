import React, { useState, useEffect } from 'react';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { WalletConnection } from './components/WalletConnection';
import { PersonalityTest } from './components/PersonalityTest';
import { Results } from './components/Results';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useContract } from './hooks/useContract';
import { config } from './utils/wagmi';

const queryClient = new QueryClient();

const AppContent: React.FC = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [isCheckingCompletion, setIsCheckingCompletion] = useState(false);

  const { hasUserCompleted, address } = useContract();

  useEffect(() => {
    const checkTestCompletion = async () => {
      if (isWalletConnected && address) {
        setIsCheckingCompletion(true);
        try {
          const result = await hasUserCompleted();
          setHasCompletedTest(result.hasCompleted);
        } catch (error) {
          console.error('Failed to check test completion:', error);
        } finally {
          setIsCheckingCompletion(false);
        }
      }
    };

    checkTestCompletion();
  }, [isWalletConnected, address, hasUserCompleted]);

  const handleTestComplete = () => {
    setHasCompletedTest(true);
  };

  const handleTakeNewTest = () => {
    setHasCompletedTest(false);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Confidential Persona</h1>
        <p>Discover your personality type with complete privacy using blockchain encryption</p>
      </header>

      <main>
        {!isWalletConnected && (
          <WalletConnection onConnectionChange={setIsWalletConnected} />
        )}

        {isWalletConnected && isCheckingCompletion && (
          <div className="test-section">
            <LoadingSpinner message="Checking your test status..." />
          </div>
        )}

        {isWalletConnected && !isCheckingCompletion && !hasCompletedTest && (
          <PersonalityTest onTestComplete={handleTestComplete} />
        )}

        {isWalletConnected && !isCheckingCompletion && hasCompletedTest && (
          <>
            <Results />
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                className="btn btn-secondary"
                onClick={handleTakeNewTest}
                style={{ marginRight: '10px' }}
              >
                Take Test Again
              </button>
              <small style={{ display: 'block', marginTop: '10px', color: '#666' }}>
                Note: Taking the test again will require admin approval to reset your previous answers
              </small>
            </div>
          </>
        )}
      </main>

      <footer style={{ textAlign: 'center', marginTop: '50px', color: '#666', fontSize: '0.9rem' }}>
        <p>
          🔒 Your privacy is protected by Fully Homomorphic Encryption (FHE) technology
        </p>
        <p>
          Built with Zama FHEVM • Sepolia Testnet
        </p>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;