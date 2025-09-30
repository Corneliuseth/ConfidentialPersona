# Confidential Persona

A privacy-preserving personality quiz application built on blockchain technology using Fully Homomorphic Encryption (FHE). Users can take a personality assessment where their answers remain completely encrypted on-chain, and only they can decrypt and view their personality analysis.

## 🎯 Project Overview

Confidential Persona is a decentralized application (dApp) that demonstrates the power of Fully Homomorphic Encryption in protecting user privacy while maintaining on-chain transparency. The application allows users to:

1. Complete a 5-question personality assessment
2. Submit encrypted answers directly to the blockchain
3. Decrypt their results client-side to reveal personality traits
4. Maintain complete privacy - no one else can see the raw answers

### Key Features

- **Complete Privacy**: All quiz answers are encrypted using Zama's FHEVM before being stored on-chain
- **User-Controlled Decryption**: Only the user who submitted answers can decrypt their results
- **On-Chain Storage**: Encrypted data is permanently stored on Ethereum blockchain
- **Personality Analysis**: Algorithmic analysis categorizes users into personality traits based on their answers
- **Web3 Integration**: Seamless wallet connection using RainbowKit and WalletConnect
- **Modern UI**: Clean, responsive React interface without heavy CSS frameworks

## 🚀 Advantages

### Privacy-First Design
- **Zero Knowledge**: Quiz responses are encrypted before leaving the user's browser
- **No Central Database**: No server stores plaintext answers - everything is on-chain and encrypted
- **Self-Sovereign Identity**: Users maintain full control over their personality data

### Technical Excellence
- **Cutting-Edge Cryptography**: Utilizes Zama's FHEVM for homomorphic encryption
- **Immutable Records**: Blockchain storage ensures answers cannot be tampered with
- **Type Safety**: Full TypeScript implementation across smart contracts and frontend
- **Battle-Tested Framework**: Built on Hardhat with comprehensive test coverage

### User Experience
- **Simple Interface**: Intuitive quiz flow with clear visual feedback
- **Fast Transactions**: Batch submission of all answers in a single transaction
- **Real-Time Status**: Live feedback on submission and decryption progress
- **Mobile Responsive**: Works seamlessly across desktop and mobile devices

## 🛠️ Technology Stack

### Smart Contracts
- **Solidity**: ^0.8.24 - Smart contract programming language
- **Hardhat**: Development environment for Ethereum
- **FHEVM by Zama**: Fully Homomorphic Encryption for Ethereum Virtual Machine
  - `@fhevm/solidity`: ^0.8.0 - FHE library for Solidity
  - `@fhevm/hardhat-plugin`: Development and testing tools
  - `@zama-fhe/oracle-solidity`: Oracle integration
- **Hardhat Deploy**: Deployment management system
- **TypeChain**: TypeScript bindings for Ethereum smart contracts
- **Ethers.js**: v6.15.0 - Ethereum library for contract interaction

### Frontend
- **React**: 19.1.1 - UI component library
- **Vite**: 7.1.6 - Next-generation frontend tooling
- **TypeScript**: 5.8.3 - Type-safe JavaScript
- **Wagmi**: 2.17.0 - React hooks for Ethereum
- **Viem**: 2.37.6 - TypeScript interface for Ethereum
- **RainbowKit**: 2.2.8 - Wallet connection UI
- **@zama-fhe/relayer-sdk**: ^0.2.0 - Client-side encryption/decryption
- **@tanstack/react-query**: 5.89.0 - Server state management

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Solhint**: Solidity linting
- **Mocha & Chai**: Testing framework
- **Hardhat Gas Reporter**: Gas usage analysis
- **Hardhat Verify**: Contract verification on Etherscan

### Blockchain Networks
- **Local Development**: Hardhat Network with FHEVM mock
- **Testnet**: Sepolia (Ethereum test network)
- **Mainnet Ready**: Configuration supports production deployment

### Infrastructure
- **Infura**: Ethereum node provider
- **Etherscan**: Contract verification and explorer
- **IPFS Ready**: Architecture supports decentralized frontend hosting

## 🔧 Problems Solved

### 1. **On-Chain Privacy Paradox**
**Problem**: Traditional blockchain transactions are public, making it impossible to store sensitive personal data like personality assessments without exposing it.

**Solution**: FHEVM encryption allows data to be stored on-chain while remaining completely confidential. Users submit encrypted answers that cannot be decrypted by anyone except the data owner.

### 2. **Data Ownership & Control**
**Problem**: Centralized personality quiz platforms own and monetize user data without user control or transparency.

**Solution**: Users own their encrypted data stored on blockchain. They control who can access it (currently only themselves) and can prove their personality traits without revealing raw answers.

### 3. **Trust in Analysis**
**Problem**: Users must trust centralized services to handle their data correctly and not manipulate results.

**Solution**: Smart contracts provide transparent, immutable logic. The personality analysis algorithm is on-chain and auditable, ensuring consistent and fair evaluation.

### 4. **Data Persistence & Portability**
**Problem**: Quiz results stored in traditional databases can be lost, deleted, or become inaccessible when services shut down.

**Solution**: Blockchain storage ensures permanent, decentralized persistence. Users can access their results from any interface that implements the protocol.

### 5. **Secure Multi-Party Computation Foundation**
**Problem**: Future applications might need to perform analysis on encrypted data (e.g., aggregate statistics) without decryption.

**Solution**: FHEVM's homomorphic encryption properties enable computation on encrypted data, setting the foundation for privacy-preserving analytics.

### 6. **Web3 Identity Integration**
**Problem**: Traditional authentication systems require centralized identity management.

**Solution**: Wallet-based authentication provides self-sovereign identity. Users connect their Ethereum wallet to participate - no passwords, no centralized accounts.

## 📁 Project Structure

```
ConfidentialPersona/
├── contracts/                    # Solidity smart contracts
│   ├── ConfidentialPersona.sol   # Main quiz contract with FHE
│   └── FHECounter.sol            # Example FHE contract
├── deploy/                       # Deployment scripts
│   └── deploy.ts                 # Hardhat-deploy configuration
├── test/                         # Contract test suites
│   ├── ConfidentialPersona.ts    # Quiz contract tests
│   ├── FHECounter.ts             # Counter tests (local)
│   └── FHECounterSepolia.ts      # Counter tests (testnet)
├── tasks/                        # Custom Hardhat tasks
├── frontend/                     # React application
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── PersonaApp.tsx    # Main app container
│   │   │   ├── Quiz.tsx          # Quiz interface
│   │   │   ├── Results.tsx       # Results & decryption
│   │   │   └── Header.tsx        # Navigation header
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useZamaInstance.ts    # FHE instance management
│   │   │   └── useEthersSigner.ts    # Ethers.js signer adapter
│   │   ├── config/               # Configuration files
│   │   │   └── contracts.ts      # Contract addresses & ABIs
│   │   ├── App.tsx               # App root
│   │   └── main.tsx              # Entry point
│   ├── index.html                # HTML template
│   ├── package.json              # Frontend dependencies
│   └── vite.config.ts            # Vite configuration
├── hardhat.config.ts             # Hardhat configuration
├── package.json                  # Root dependencies
├── tsconfig.json                 # TypeScript configuration
├── .env                          # Environment variables (private keys, API keys)
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Version 7.0.0 or higher
- **Metamask** or another Web3 wallet
- **Sepolia ETH**: For testnet deployment and testing
- **Infura Account**: For Ethereum node access
- **Etherscan Account**: (Optional) For contract verification

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/ConfidentialPersona.git
   cd ConfidentialPersona
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   # Private key for deployment (without 0x prefix)
   PRIVATE_KEY=your_private_key_here

   # Infura API key for Sepolia
   INFURA_API_KEY=your_infura_api_key_here

   # Etherscan API key for contract verification
   ETHERSCAN_API_KEY=your_etherscan_api_key_here
   ```

   **⚠️ SECURITY WARNING**: Never commit your `.env` file. The `.gitignore` is configured to exclude it.

### Compilation

Compile smart contracts:

```bash
npm run compile
```

This will:
- Compile Solidity contracts
- Generate TypeScript types via TypeChain
- Create contract artifacts in `artifacts/` directory

### Testing

#### Local Testing (Mock FHEVM)

Run tests on Hardhat network with FHEVM mock:

```bash
npm test
```

This executes all tests in the `test/` directory using a simulated FHE environment.

#### Testnet Testing

Run tests on Sepolia testnet (requires deployed contract):

```bash
npm run test:sepolia
```

### Deployment

#### Local Deployment

1. **Start local Hardhat node**

   ```bash
   npm run chain
   ```

   Keep this terminal running.

2. **Deploy contracts** (in a new terminal)

   ```bash
   npm run deploy:localhost
   ```

#### Sepolia Testnet Deployment

1. **Ensure you have Sepolia ETH** in the wallet corresponding to your `PRIVATE_KEY`

2. **Deploy to Sepolia**

   ```bash
   npm run deploy:sepolia
   ```

3. **Initialize contract**

   After deployment, initialize quiz questions on-chain:

   ```bash
   npx hardhat run scripts/initializeQuestions.ts --network sepolia
   ```

   This sets up 5 questions with 2-4 options each.

4. **Verify contract** (optional)

   ```bash
   npm run verify:sepolia
   ```

5. **Update frontend configuration**

   Copy the deployed contract address and ABI:

   ```bash
   # Contract address is output after deployment
   # ABI is located at: deployments/sepolia/ConfidentialPersona.json
   ```

   Update `frontend/src/config/contracts.ts`:

   ```typescript
   export const CONTRACT_ADDRESS = '0xYourDeployedAddress';
   export const CONTRACT_ABI = [...]; // Copy from deployments/sepolia/ConfidentialPersona.json
   ```

### Frontend Development

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Open browser**

   Navigate to `http://localhost:5173`

4. **Connect wallet**

   Click "Connect Wallet" and select your Ethereum wallet (Metamask, WalletConnect, etc.)

5. **Switch to Sepolia network**

   Ensure your wallet is connected to Sepolia testnet

### Production Build

Build optimized frontend for production:

```bash
cd frontend
npm run build
```

Build output is in `frontend/dist/` directory. Deploy to:
- Traditional hosting (Vercel, Netlify, AWS S3)
- Decentralized hosting (IPFS, Arweave)

## 📖 Usage Guide

### For Users

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - Select your preferred wallet provider
   - Approve connection request
   - Ensure you're on Sepolia network

2. **Take the Quiz**
   - Read each of the 5 personality questions
   - Select your preferred answer (2-4 options per question)
   - Questions cover: social behavior, planning style, problem-solving, organization, decision-making
   - Click "Submit" when all questions are answered

3. **Submission Process**
   - Your answers are encrypted locally using FHE
   - A single transaction submits all encrypted answers to blockchain
   - Confirm the transaction in your wallet
   - Wait for blockchain confirmation (~15 seconds on Sepolia)

4. **View Results**
   - Navigate to "Results" tab
   - Click "Decrypt My Answers"
   - Sign decryption request in your wallet
   - Decryption happens locally using your private key
   - View your personality analysis:
     - **Social**: Introvert vs. Extrovert
     - **Planning**: Planner vs. Flexible
     - **Thinking**: Analytical vs. Empathetic vs. Balanced

### For Developers

#### Smart Contract API

**Set Questions (Owner Only)**
```solidity
function setQuestions(uint8[] calldata ids, uint8[] calldata optionsCounts) external onlyOwner
```

**Submit Single Answer**
```solidity
function submitAnswer(uint8 questionId, externalEuint8 choice, bytes calldata inputProof) external
```

**Submit Multiple Answers (Batch)**
```solidity
function submitAnswers(
    uint8[] calldata questionIds,
    externalEuint8[] calldata choices,
    bytes calldata inputProof
) external
```

**Get Questions**
```solidity
function getQuestions() external view returns (uint8[] memory ids, uint8[] memory optionsCounts)
```

**Get Single Answer**
```solidity
function getAnswer(address user, uint8 questionId) external view returns (euint8)
```

**Get Multiple Answers**
```solidity
function getAnswers(address user, uint8[] calldata questionIds) external view returns (euint8[] memory)
```

#### Frontend Integration

**Creating Encrypted Input**
```typescript
import { useZamaInstance } from './hooks/useZamaInstance';

const { instance } = useZamaInstance();
const input = instance.createEncryptedInput(contractAddress, userAddress);
input.add8(answerValue); // Add 8-bit encrypted integer
const encryptedInput = await input.encrypt();
```

**Submitting Transaction**
```typescript
const contract = new Contract(contractAddress, abi, signer);
const tx = await contract.submitAnswers(
  questionIds,
  encryptedInput.handles,
  encryptedInput.inputProof
);
await tx.wait();
```

**Decrypting Results**
```typescript
const keypair = instance.generateKeypair();
const eip712 = instance.createEIP712(
  keypair.publicKey,
  [contractAddress],
  startTimestamp,
  validityDays
);
const signature = await signer.signTypedData(eip712.domain, eip712.types, eip712.message);
const result = await instance.userDecrypt(
  encryptedHandles,
  keypair.privateKey,
  keypair.publicKey,
  signature,
  [contractAddress],
  userAddress,
  startTimestamp,
  validityDays
);
```

## 🧪 Testing Strategy

### Contract Tests

**Unit Tests** (`test/ConfidentialPersona.ts`)
- Question initialization
- Single answer submission
- Batch answer submission
- Answer retrieval
- Encryption/decryption flow
- Access control (owner functions)

**Integration Tests**
- End-to-end user flow
- Multiple user interactions
- Edge cases (invalid inputs, overflow, etc.)

**Coverage Goals**
- 100% function coverage
- 95%+ branch coverage
- All error conditions tested

Run coverage report:
```bash
npm run coverage
```

### Frontend Testing

Manual testing checklist:
- [ ] Wallet connection (multiple providers)
- [ ] Network switching
- [ ] Quiz submission (all questions)
- [ ] Partial submission handling
- [ ] Transaction confirmation
- [ ] Result decryption
- [ ] Error handling (rejected transactions, network errors)
- [ ] Mobile responsiveness
- [ ] Loading states

## 🔮 Future Roadmap

### Phase 1: Enhanced Privacy (Q2 2025)
- [ ] **Encrypted Quiz Content**: Store question text encrypted on-chain
- [ ] **Zero-Knowledge Proofs**: Prove personality traits without revealing raw answers
- [ ] **Selective Disclosure**: Share specific traits without full answer exposure
- [ ] **Anonymous Submissions**: Submit answers from relayer without linking to wallet

### Phase 2: Social Features (Q3 2025)
- [ ] **Personality Matching**: Find compatible users based on encrypted traits
- [ ] **Group Analytics**: Aggregate statistics without individual data exposure
- [ ] **Encrypted Leaderboards**: Compare traits while preserving privacy
- [ ] **NFT Certificates**: Mint personality trait NFTs as verifiable credentials

### Phase 3: Advanced Analysis (Q4 2025)
- [ ] **AI-Powered Insights**: Machine learning on encrypted data using FHEVM
- [ ] **Multi-Dimensional Analysis**: Expand to 16-personality type framework (MBTI-style)
- [ ] **Temporal Tracking**: Track personality evolution over time
- [ ] **Comparative Analysis**: Benchmark against anonymized population data

### Phase 4: Platform Expansion (Q1 2026)
- [ ] **Custom Quiz Builder**: Allow anyone to create encrypted quizzes
- [ ] **Marketplace**: Trade access to anonymized personality data
- [ ] **DAO Governance**: Community-controlled quiz library and analysis algorithms
- [ ] **Cross-Chain Deployment**: Expand to Polygon, Arbitrum, Optimism

### Phase 5: Enterprise Solutions (Q2 2026)
- [ ] **HR Integration**: Private employee assessments for team building
- [ ] **Academic Research**: Privacy-preserving psychological studies
- [ ] **Healthcare Applications**: Mental health screening with confidentiality
- [ ] **Government Services**: Citizen surveys with guaranteed anonymity

### Technical Debt & Improvements
- [ ] Gas optimization (batch operations, storage patterns)
- [ ] Frontend unit and integration tests
- [ ] Accessibility (WCAG 2.1 AA compliance)
- [ ] Internationalization (i18n support)
- [ ] Progressive Web App (PWA) capabilities
- [ ] IPFS hosting for fully decentralized frontend
- [ ] GraphQL API for historical data queries
- [ ] Mobile native applications (React Native)

### Research & Innovation
- [ ] **Homomorphic ML**: Train models on encrypted personality data
- [ ] **Federated Learning**: Collaborative model training without data sharing
- [ ] **Quantum-Resistant Encryption**: Future-proof cryptographic upgrades
- [ ] **Layer 2 Integration**: Reduce costs with zkRollups or Optimistic Rollups

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Write tests for all new features
- Follow existing code style (enforced by ESLint/Prettier)
- Update documentation for API changes
- Use conventional commits for clear history
- Add comments for complex cryptographic operations

### Code of Conduct
- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize user privacy and security
- Report vulnerabilities privately to maintainers

## 📄 License

This project is licensed under the **BSD-3-Clause-Clear License**.

Key points:
- ✅ Commercial use allowed
- ✅ Modification allowed
- ✅ Distribution allowed
- ✅ Private use allowed
- ❌ No patent grant
- ❌ No trademark grant

See the [LICENSE](LICENSE) file for full details.

## 🔐 Security

### Reporting Vulnerabilities

If you discover a security vulnerability, please **do not** open a public issue. Instead:

1. Email security@[your-domain].com with details
2. Provide steps to reproduce
3. Allow 90 days for patch before public disclosure

### Security Best Practices

**Smart Contracts**
- Audited by [Audit Firm Name] (coming soon)
- Follows OpenZeppelin security patterns
- No upgradeable proxies (immutable contracts)
- Minimal access control (single owner)

**Frontend**
- No private key storage in browser
- Signature requests clearly explained to users
- HTTPS-only in production
- CSP headers configured
- No third-party analytics tracking user behavior

**Infrastructure**
- Environment variables never committed to git
- API keys rotated regularly
- Infura endpoints rate-limited
- Decryption happens client-side only

## 🆘 Support & Resources

### Documentation
- **FHEVM Documentation**: [https://docs.zama.ai/fhevm](https://docs.zama.ai/fhevm)
- **Hardhat Guides**: [https://hardhat.org/getting-started](https://hardhat.org/getting-started)
- **Wagmi Documentation**: [https://wagmi.sh](https://wagmi.sh)
- **Viem Documentation**: [https://viem.sh](https://viem.sh)

### Community
- **GitHub Issues**: [Report bugs or request features](https://github.com/yourusername/ConfidentialPersona/issues)
- **GitHub Discussions**: Ask questions and share ideas
- **Zama Discord**: [https://discord.gg/zama](https://discord.gg/zama) - FHE community
- **Twitter**: [@YourHandle] - Project updates

### Additional Resources
- **Example Deployment**: [https://confidentialpersona.app](https://confidentialpersona.app) (coming soon)
- **Video Tutorial**: [YouTube walkthrough] (coming soon)
- **Technical Blog**: [Medium articles explaining architecture] (coming soon)

## 🙏 Acknowledgments

- **Zama Team**: For developing FHEVM and making homomorphic encryption accessible
- **Hardhat Team**: For the excellent development framework
- **WalletConnect & RainbowKit**: For seamless wallet integration
- **Ethereum Community**: For building the decentralized web
- **Contributors**: Everyone who helps improve this project

## 📊 Project Status

- **Current Version**: 0.1.0
- **Status**: Beta (Testnet)
- **Network**: Sepolia Testnet
- **Last Updated**: September 2025
- **Mainnet Launch**: TBD (pending audit)

### Deployment Status
- ✅ Smart Contracts: Deployed on Sepolia
- ✅ Frontend: Deployed on [hosting platform]
- ⏳ Mainnet: Awaiting security audit
- ⏳ Mobile App: In development

---

**Built with ❤️ and 🔐 for a privacy-preserving future**

*Disclaimer: This is experimental software. Use at your own risk. Always verify contract addresses before interacting with smart contracts. Never share your private keys.*