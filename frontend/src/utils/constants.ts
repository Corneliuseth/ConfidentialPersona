export const SEPOLIA_CONFIG = {
  aclContractAddress: "0x687820221192C5B662b25367F70076A37bc79b6c",
  kmsContractAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
  inputVerifierContractAddress: "0xbc91f3daD1A5F19F8390c400196e58073B6a0BC4",
  verifyingContractAddressDecryption: "0xb6E160B1ff80D67Bfe90A85eE06Ce0A2613607D1",
  verifyingContractAddressInputVerification: "0x7048C39f048125eDa9d678AEbaDfB22F7900a29F",
  chainId: 11155111,
  gatewayChainId: 55815,
  network: "https://sepolia.infura.io/v3/c501d55ad9924cf5905ae1954ec6f7f3",
  relayerUrl: "https://relayer.testnet.zama.cloud",
};

// Contract address placeholder - will be updated after deployment
export const CONFIDENTIAL_PERSONA_ADDRESS = "CONTRACT_ADDRESS_PLACEHOLDER";

export const PERSONALITY_TYPES = {
  INTROVERT_ANALYTICAL: {
    type: "Thoughtful Analyst",
    description: "You prefer deep thinking and careful analysis. You enjoy solitude and make decisions based on thorough research and logical reasoning.",
    traits: ["Introspective", "Analytical", "Independent", "Methodical"]
  },
  INTROVERT_INTUITIVE: {
    type: "Creative Visionary",
    description: "You are a creative soul who trusts your intuition. You prefer working alone but value meaningful connections and think about long-term possibilities.",
    traits: ["Intuitive", "Creative", "Independent", "Visionary"]
  },
  EXTROVERT_COLLABORATIVE: {
    type: "Team Player",
    description: "You thrive in social environments and love working with others. You value collaboration and seek input from your network when making decisions.",
    traits: ["Social", "Collaborative", "Communicative", "Supportive"]
  },
  EXTROVERT_LEADER: {
    type: "Natural Leader",
    description: "You are a born leader who takes charge in social and work situations. You're decisive, action-oriented, and comfortable in the spotlight.",
    traits: ["Leadership", "Decisive", "Action-oriented", "Confident"]
  },
  BALANCED_ADAPTOR: {
    type: "Flexible Adaptor",
    description: "You are well-balanced and adaptable. You can work well both independently and in teams, and you adjust your approach based on the situation.",
    traits: ["Adaptable", "Balanced", "Versatile", "Pragmatic"]
  }
};

export const QUESTIONS = [
  {
    id: 0,
    text: "How do you prefer to spend your free time?",
    options: [
      "Reading alone at home",
      "Hanging out with close friends",
      "Attending large social gatherings",
      "Exploring new places solo"
    ]
  },
  {
    id: 1,
    text: "When making important decisions, you:",
    options: [
      "Follow your gut feeling",
      "Analyze all available data",
      "Ask friends for advice",
      "Consider long-term consequences"
    ]
  },
  {
    id: 2,
    text: "In a work environment, you thrive when:",
    options: [
      "Working independently",
      "Collaborating in small teams",
      "Leading large projects"
    ]
  },
  {
    id: 3,
    text: "When facing stress, you typically:",
    options: [
      "Take time to reflect quietly",
      "Talk it through with others",
      "Take immediate action",
      "Plan methodically"
    ]
  },
  {
    id: 4,
    text: "You learn best through:",
    options: [
      "Hands-on experience",
      "Reading and research",
      "Group discussions",
      "Visual demonstrations"
    ]
  }
];