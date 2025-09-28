import { useState, useCallback } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { Contract, ethers } from 'ethers';
import { createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import { CONFIDENTIAL_PERSONA_ABI } from '../utils/abi';
import { CONFIDENTIAL_PERSONA_ADDRESS } from '../utils/constants';
import { Question, UserAnswers } from '../types';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http()
});

export const useContract = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEthersContract = useCallback(async () => {
    if (!walletClient || !address) {
      throw new Error('Wallet not connected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new Contract(CONFIDENTIAL_PERSONA_ADDRESS, CONFIDENTIAL_PERSONA_ABI, signer);
  }, [walletClient, address]);

  const getQuestions = useCallback(async (): Promise<Question[]> => {
    try {
      setError(null);
      setLoading(true);

      const questions: Question[] = [];

      for (let i = 0; i < 5; i++) {
        try {
          const result = await publicClient.readContract({
            address: CONFIDENTIAL_PERSONA_ADDRESS as `0x${string}`,
            abi: CONFIDENTIAL_PERSONA_ABI,
            functionName: 'getQuestion',
            args: [BigInt(i)]
          });

          const [questionText, options] = result as [string, string[]];

          questions.push({
            id: i,
            text: questionText,
            options: options
          });
        } catch (err) {
          console.error(`Failed to get question ${i}:`, err);
          // Use fallback question if contract call fails
          questions.push({
            id: i,
            text: `Question ${i + 1}`,
            options: ['Option 1', 'Option 2']
          });
        }
      }

      return questions;
    } catch (err) {
      console.error('Failed to get questions:', err);
      setError('Failed to load questions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const submitAnswers = useCallback(async (
    encryptedAnswers: string[],
    inputProof: string
  ) => {
    try {
      setError(null);
      setLoading(true);

      if (!isConnected || !address) {
        throw new Error('Wallet not connected');
      }

      const contract = await getEthersContract();

      const tx = await contract.submitAnswers(encryptedAnswers, inputProof);
      await tx.wait();

      return tx.hash;
    } catch (err: any) {
      console.error('Failed to submit answers:', err);
      if (err.message.includes('already submitted')) {
        setError('You have already completed this personality test');
      } else {
        setError('Failed to submit answers. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, getEthersContract]);

  const hasUserCompleted = useCallback(async (userAddress?: string): Promise<{hasCompleted: boolean, timestamp: number}> => {
    try {
      const targetAddress = userAddress || address;
      if (!targetAddress) {
        throw new Error('No address provided');
      }

      const result = await publicClient.readContract({
        address: CONFIDENTIAL_PERSONA_ADDRESS as `0x${string}`,
        abi: CONFIDENTIAL_PERSONA_ABI,
        functionName: 'hasUserCompleted',
        args: [targetAddress as `0x${string}`]
      });

      const [hasCompleted, timestamp] = result as [boolean, bigint];

      return {
        hasCompleted,
        timestamp: Number(timestamp)
      };
    } catch (err) {
      console.error('Failed to check completion status:', err);
      return { hasCompleted: false, timestamp: 0 };
    }
  }, [address]);

  const getUserAnswers = useCallback(async (): Promise<string[]> => {
    try {
      setError(null);
      setLoading(true);

      if (!isConnected || !address) {
        throw new Error('Wallet not connected');
      }

      const contract = await getEthersContract();
      const result = await contract.getAllUserAnswers();

      return result[0]; // Returns array of encrypted answer handles
    } catch (err: any) {
      console.error('Failed to get user answers:', err);
      if (err.message.includes('not completed')) {
        setError('You have not completed the personality test yet');
      } else {
        setError('Failed to retrieve your answers');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [isConnected, address, getEthersContract]);

  return {
    loading,
    error,
    getQuestions,
    submitAnswers,
    hasUserCompleted,
    getUserAnswers,
    isConnected,
    address
  };
};