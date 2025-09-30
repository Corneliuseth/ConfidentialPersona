// ConfidentialPersona contract deployed on Sepolia (update address after deploy)
export const CONTRACT_ADDRESS = '0x33Ce23b674C6aEA6E82B2C3bd54cB82c1c37000d';

// ABI for ConfidentialPersona – copied from contract interface
export const CONTRACT_ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [ { "internalType": "uint8[]", "name": "ids", "type": "uint8[]" }, { "internalType": "uint8[]", "name": "optionsCounts", "type": "uint8[]" } ], "name": "setQuestions", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "getQuestions", "outputs": [ { "internalType": "uint8[]", "name": "ids", "type": "uint8[]" }, { "internalType": "uint8[]", "name": "optionsCounts", "type": "uint8[]" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "uint8", "name": "questionId", "type": "uint8" }, { "internalType": "euint8", "name": "choice", "type": "bytes32" }, { "internalType": "bytes", "name": "inputProof", "type": "bytes" } ], "name": "submitAnswer", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "uint8[]", "name": "questionIds", "type": "uint8[]" }, { "internalType": "euint8[]", "name": "choices", "type": "bytes32[]" }, { "internalType": "bytes", "name": "inputProof", "type": "bytes" } ], "name": "submitAnswers", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint8", "name": "questionId", "type": "uint8" } ], "name": "getAnswer", "outputs": [ { "internalType": "euint8", "name": "", "type": "bytes32" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [ { "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint8[]", "name": "questionIds", "type": "uint8[]" } ], "name": "getAnswers", "outputs": [ { "internalType": "euint8[]", "name": "answersBytes", "type": "bytes32[]" } ], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }
] as const;
