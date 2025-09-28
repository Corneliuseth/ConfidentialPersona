import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Confidential Persona Test',
  projectId: 'YOUR_PROJECT_ID', // Get from WalletConnect Cloud
  chains: [sepolia],
  ssr: false,
});