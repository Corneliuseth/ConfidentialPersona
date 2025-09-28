import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

interface WalletConnectionProps {
  onConnectionChange?: (isConnected: boolean) => void;
}

export const WalletConnection: React.FC<WalletConnectionProps> = ({ onConnectionChange }) => {
  const { isConnected } = useAccount();

  React.useEffect(() => {
    if (onConnectionChange) {
      onConnectionChange(isConnected);
    }
  }, [isConnected, onConnectionChange]);

  return (
    <div className="wallet-section">
      <h2>Connect Your Wallet</h2>
      <p>Connect your wallet to take the confidential personality test</p>
      <div style={{ marginTop: '20px' }}>
        <ConnectButton />
      </div>
      {isConnected && (
        <div className="success" style={{ marginTop: '20px' }}>
          ✅ Wallet connected! You can now take the personality test.
        </div>
      )}
    </div>
  );
};