import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:getQuestion")
  .addParam("contract", "The address of the ConfidentialPersona contract")
  .addParam("questionid", "The question ID (0-4)")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const contractFactory = await ethers.getContractFactory("ConfidentialPersona");
    const contract = contractFactory.attach(taskArguments.contract);

    const questionData = await contract.getQuestion(taskArguments.questionid);
    console.log(`Question ${taskArguments.questionid}:`);
    console.log(`Text: ${questionData[0]}`);
    console.log(`Options: ${questionData[1].join(", ")}`);
    console.log(`Option count: ${questionData[2]}`);
  });

task("task:hasUserCompleted")
  .addParam("contract", "The address of the ConfidentialPersona contract")
  .addParam("user", "The user address to check")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const contractFactory = await ethers.getContractFactory("ConfidentialPersona");
    const contract = contractFactory.attach(taskArguments.contract);

    const result = await contract.hasUserCompleted(taskArguments.user);
    console.log(`User ${taskArguments.user}:`);
    console.log(`Has completed: ${result[0]}`);
    console.log(`Timestamp: ${result[1].toString()}`);
  });

task("task:submitAnswers")
  .addParam("contract", "The address of the ConfidentialPersona contract")
  .addParam("answers", "Comma-separated list of answers (e.g., '0,1,2,0,1')")
  .setAction(async function (taskArguments: TaskArguments, { ethers, fhevm }) {
    const signers = await ethers.getSigners();
    const user = signers[1]; // Use second signer as test user

    const contractFactory = await ethers.getContractFactory("ConfidentialPersona");
    const contract = contractFactory.attach(taskArguments.contract);

    const answerArray = taskArguments.answers.split(",").map((a: string) => parseInt(a.trim()));

    if (answerArray.length !== 5) {
      throw new Error("Must provide exactly 5 answers");
    }

    // Create encrypted inputs
    const input = fhevm.createEncryptedInput(taskArguments.contract, user.address);

    // Add all 5 answers
    answerArray.forEach(answer => {
      input.add8(answer);
    });

    const encryptedInput = await input.encrypt();

    // Submit answers
    const tx = await contract.connect(user).submitAnswers(
      [
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.handles[2],
        encryptedInput.handles[3],
        encryptedInput.handles[4]
      ],
      encryptedInput.inputProof
    );

    await tx.wait();
    console.log(`Answers submitted successfully! Transaction: ${tx.hash}`);
  });

task("task:getUserAnswer")
  .addParam("contract", "The address of the ConfidentialPersona contract")
  .addParam("questionid", "The question ID (0-4)")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers = await ethers.getSigners();
    const user = signers[1]; // Use second signer as test user

    const contractFactory = await ethers.getContractFactory("ConfidentialPersona");
    const contract = contractFactory.attach(taskArguments.contract);

    const encryptedAnswer = await contract.connect(user).getUserAnswer(taskArguments.questionid);
    console.log(`Encrypted answer for question ${taskArguments.questionid}: ${encryptedAnswer}`);
  });

task("task:getAllUserAnswers")
  .addParam("contract", "The address of the ConfidentialPersona contract")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const signers = await ethers.getSigners();
    const user = signers[1]; // Use second signer as test user

    const contractFactory = await ethers.getContractFactory("ConfidentialPersona");
    const contract = contractFactory.attach(taskArguments.contract);

    const result = await contract.connect(user).getAllUserAnswers();
    console.log(`All encrypted answers: ${result[0]}`);
    console.log(`Timestamp: ${result[1].toString()}`);
  });