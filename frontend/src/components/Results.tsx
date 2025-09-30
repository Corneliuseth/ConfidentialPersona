import { useMemo, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';

type Props = {
  onDecrypted: (answers: number[]) => void;
  lastDecrypted: number[] | null;
};

export function Results({ onDecrypted, lastDecrypted }: Props) {
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();
  const [decLoading, setDecLoading] = useState(false);

  const qids = useMemo(() => [1, 2, 3, 4, 5] as const, []);

  const { data: answersData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAnswers',
    args: address ? [address, [...qids]] : undefined,
    query: { enabled: !!address },
  });

  const decrypt = async () => {
    if (!instance || !address || !answersData || !signerPromise) {
      alert('Missing data for decryption');
      return;
    }
    setDecLoading(true);
    try {
      const keypair = instance.generateKeypair();
      const handles = (answersData as string[]);
      const pairs = handles.map(h => ({ handle: h, contractAddress: CONTRACT_ADDRESS }));
      const start = Math.floor(Date.now() / 1000).toString();
      const days = '10';

      const eip712 = instance.createEIP712(keypair.publicKey, [CONTRACT_ADDRESS], start, days);
      const signer = await signerPromise;
      if (!signer) throw new Error('Signer unavailable');
      const signature = await signer.signTypedData(
        eip712.domain,
        { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
        eip712.message
      );

      const result = await instance.userDecrypt(
        pairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace('0x', ''),
        [CONTRACT_ADDRESS],
        address,
        start,
        days
      );

      const decValues = handles.map(h => parseInt(result[h] || '0', 10));
      onDecrypted(decValues);
    } catch (e) {
      console.error(e);
      alert('Decrypt failed');
    } finally {
      setDecLoading(false);
    }
  };

  const traits = useMemo(() => {
    // Simple, deterministic pseudo-analysis from answers
    const a = lastDecrypted;
    if (!a) return null;
    const extrovert = a[0] <= 2 ? 'Introvert' : 'Extrovert';
    const planner = a[1] === 1 ? 'Planner' : 'Flexible';
    const thinker = a[4] === 1 ? 'Analytical' : a[4] === 2 ? 'Empathetic' : 'Balanced';
    return { extrovert, planner, thinker };
  }, [lastDecrypted]);

  if (!address) {
    return (
      <div className="card">
        <h2 className="title">Connect Your Wallet</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '1rem' }}>
          Please connect your wallet to view your personality assessment results.
        </p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="title">Your Personality Profile</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '2rem' }}>
        Your answers are securely stored on-chain with end-to-end encryption. Decrypt them to reveal your unique personality traits.
      </p>
      <div className="block">
        <button className="primary" onClick={decrypt} disabled={decLoading || !answersData}>
          <span>{decLoading ? 'Decrypting Your Profile…' : 'Decrypt My Results'}</span>
        </button>
      </div>
      {traits && (
        <div className="results">
          <div className="res-item">
            <span className="label">Social Style</span>
            <span>{traits.extrovert}</span>
          </div>
          <div className="res-item">
            <span className="label">Planning Style</span>
            <span>{traits.planner}</span>
          </div>
          <div className="res-item">
            <span className="label">Thinking Style</span>
            <span>{traits.thinker}</span>
          </div>
        </div>
      )}
    </div>
  );
}

