import { useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import { useZamaInstance } from '../hooks/useZamaInstance';
import { useEthersSigner } from '../hooks/useEthersSigner';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contracts';
import { Contract } from 'ethers';

type Props = { onSubmitted: () => void };

// Static quiz content (text only). Options are numbered 1..N on-chain.
const QUESTIONS = [
  { id: 1, text: 'You’re at a party. What do you do?', options: ['Meet new people', 'Talk with close friends', 'Stay with one person', 'Observe quietly'] },
  { id: 2, text: 'How do you plan your day?', options: ['Strict schedule', 'Loose plan', 'Go with the flow'] },
  { id: 3, text: 'When solving a problem, you prefer…', options: ['Logic', 'Creativity', 'Past experience', 'Group input'] },
  { id: 4, text: 'Your workspace is usually…', options: ['Very tidy', 'Somewhat tidy', 'Organized chaos'] },
  { id: 5, text: 'Decisions are made mostly by…', options: ['Head', 'Heart', 'Both equally'] },
];

export function Quiz({ onSubmitted }: Props) {
  const { address } = useAccount();
  const { instance } = useZamaInstance();
  const signerPromise = useEthersSigner();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const canSubmit = useMemo(() => QUESTIONS.every(q => !!answers[q.id]), [answers]);

  const handleSelect = (qid: number, choiceIndex: number) => {
    setAnswers(prev => ({ ...prev, [qid]: choiceIndex + 1 })); // 1-based index
  };

  const submit = async () => {
    if (!instance || !address || !signerPromise) {
      alert('Missing wallet or encryption service');
      return;
    }
    if (!canSubmit) {
      alert('Please answer all questions');
      return;
    }
    setSubmitting(true);
    try {
      const qids = QUESTIONS.map(q => q.id);
      const input = instance.createEncryptedInput(CONTRACT_ADDRESS, address);
      for (const q of QUESTIONS) {
        input.add8(answers[q.id]);
      }
      const encryptedInput = await input.encrypt();

      const signer = await signerPromise;
      const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      const tx = await contract.submitAnswers(
        qids,
        [
          encryptedInput.handles[0],
          encryptedInput.handles[1],
          encryptedInput.handles[2],
          encryptedInput.handles[3],
          encryptedInput.handles[4],
        ],
        encryptedInput.inputProof
      );
      await tx.wait();
      onSubmitted();
    } catch (e) {
      console.error(e);
      alert('Submit failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <h2 className="title">Personality Quiz</h2>
      <div className="list">
        {QUESTIONS.map(q => (
          <div key={q.id} className="q">
            <div className="qtext">{q.text}</div>
            <div className="opts">
              {q.options.map((o, idx) => (
                <label key={idx} className={`opt ${answers[q.id] === idx + 1 ? 'sel' : ''}`}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    checked={answers[q.id] === idx + 1}
                    onChange={() => handleSelect(q.id, idx)}
                  />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="primary" disabled={!canSubmit || submitting} onClick={submit}>
        {submitting ? 'Submitting…' : 'Submit'}
      </button>
    </div>
  );
}

