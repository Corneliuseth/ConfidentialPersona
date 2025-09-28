import { useState, useEffect, useCallback } from 'react';
import { initSDK, createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk/bundle';
import { FHEInstance } from '../types';
import { SEPOLIA_CONFIG } from '../utils/constants';

export const useFHE = () => {
  const [fheInstance, setFheInstance] = useState<FHEInstance | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeFHE = useCallback(async () => {
    try {
      setError(null);
      await initSDK();

      const config = {
        ...SepoliaConfig,
        network: window.ethereum,
      };

      const instance = await createInstance(config);
      setFheInstance(instance);
      setIsInitialized(true);
    } catch (err) {
      console.error('Failed to initialize FHE:', err);
      setError('Failed to initialize FHE encryption');
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      initializeFHE();
    } else {
      setError('MetaMask not detected');
    }
  }, [initializeFHE]);

  const encryptAnswers = useCallback(async (
    answers: number[],
    contractAddress: string,
    userAddress: string
  ) => {
    if (!fheInstance) {
      throw new Error('FHE not initialized');
    }

    const input = fheInstance.createEncryptedInput(contractAddress, userAddress);

    // Add all 5 answers as encrypted uint8
    answers.forEach(answer => {
      input.add8(answer);
    });

    return await input.encrypt();
  }, [fheInstance]);

  const decryptAnswers = useCallback(async (
    encryptedHandles: string[],
    contractAddress: string,
    userAddress: string,
    signer: any
  ) => {
    if (!fheInstance) {
      throw new Error('FHE not initialized');
    }

    try {
      const keypair = fheInstance.generateKeypair();
      const handleContractPairs = encryptedHandles.map(handle => ({
        handle,
        contractAddress,
      }));

      const startTimeStamp = Math.floor(Date.now() / 1000).toString();
      const durationDays = "10";
      const contractAddresses = [contractAddress];

      const eip712 = fheInstance.createEIP712(
        keypair.publicKey,
        contractAddresses,
        startTimeStamp,
        durationDays
      );

      const signature = await signer.signTypedData(
        eip712.domain,
        {
          UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification,
        },
        eip712.message
      );

      const result = await fheInstance.userDecrypt(
        handleContractPairs,
        keypair.privateKey,
        keypair.publicKey,
        signature.replace("0x", ""),
        contractAddresses,
        userAddress,
        startTimeStamp,
        durationDays
      );

      return result;
    } catch (err) {
      console.error('Decryption failed:', err);
      throw new Error('Failed to decrypt answers');
    }
  }, [fheInstance]);

  return {
    fheInstance,
    isInitialized,
    error,
    encryptAnswers,
    decryptAnswers,
  };
};