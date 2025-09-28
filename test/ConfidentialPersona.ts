import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { ConfidentialPersona, ConfidentialPersona__factory } from "../types";
import { expect } from "chai";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("ConfidentialPersona")) as ConfidentialPersona__factory;
  const confidentialPersonaContract = (await factory.deploy()) as ConfidentialPersona;
  const confidentialPersonaContractAddress = await confidentialPersonaContract.getAddress();

  return { confidentialPersonaContract, confidentialPersonaContractAddress };
}

describe("ConfidentialPersona", function () {
  let signers: Signers;
  let confidentialPersonaContract: ConfidentialPersona;
  let confidentialPersonaContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ confidentialPersonaContract, confidentialPersonaContractAddress } = await deployFixture());
  });

  describe("Initialization", function () {
    it("should initialize with 5 questions", async function () {
      const questionCount = await confidentialPersonaContract.questionCount();
      expect(questionCount).to.equal(5);
    });

    it("should set the deployer as owner", async function () {
      const owner = await confidentialPersonaContract.owner();
      expect(owner).to.equal(signers.deployer.address);
    });

    it("should initialize first question correctly", async function () {
      const question = await confidentialPersonaContract.getQuestion(0);
      expect(question[0]).to.equal("How do you prefer to spend your free time?");
      expect(question[1]).to.have.length(4);
      expect(question[2]).to.equal(4);
    });

    it("should initialize all questions as active", async function () {
      for (let i = 0; i < 5; i++) {
        const question = await confidentialPersonaContract.getQuestion(i);
        expect(question[1].length).to.be.greaterThan(1);
      }
    });
  });

  describe("Question Management", function () {
    it("should get question details correctly", async function () {
      const question = await confidentialPersonaContract.getQuestion(1);
      expect(question[0]).to.equal("When making important decisions, you:");
      expect(question[1]).to.have.length(4);
      expect(question[2]).to.equal(4);
    });

    it("should revert when getting invalid question ID", async function () {
      await expect(confidentialPersonaContract.getQuestion(5)).to.be.revertedWith("Invalid question ID");
    });

    it("should allow owner to update questions", async function () {
      const newQuestion = "Test question?";
      const newOptions = ["Option 1", "Option 2", "Option 3"];

      await confidentialPersonaContract
        .connect(signers.deployer)
        .updateQuestion(0, newQuestion, newOptions);

      const updatedQuestion = await confidentialPersonaContract.getQuestion(0);
      expect(updatedQuestion[0]).to.equal(newQuestion);
      expect(updatedQuestion[1]).to.have.length(3);
      expect(updatedQuestion[2]).to.equal(3);
    });

    it("should revert when non-owner tries to update questions", async function () {
      const newQuestion = "Test question?";
      const newOptions = ["Option 1", "Option 2"];

      await expect(
        confidentialPersonaContract
          .connect(signers.alice)
          .updateQuestion(0, newQuestion, newOptions)
      ).to.be.revertedWith("Only owner can perform this action");
    });

    it("should revert when updating with invalid number of options", async function () {
      const newQuestion = "Test question?";
      const invalidOptions = ["Only one option"];

      await expect(
        confidentialPersonaContract
          .connect(signers.deployer)
          .updateQuestion(0, newQuestion, invalidOptions)
      ).to.be.revertedWith("Question must have 2-4 options");
    });
  });

  describe("Answer Submission", function () {
    it("should allow user to submit encrypted answers", async function () {
      // Create encrypted inputs for 5 answers
      const answers = [0, 1, 2, 0, 1]; // Sample answers
      const input = fhevm.createEncryptedInput(confidentialPersonaContractAddress, signers.alice.address);

      answers.forEach(answer => input.add8(answer));
      const encryptedInput = await input.encrypt();

      // Submit answers
      const tx = await confidentialPersonaContract
        .connect(signers.alice)
        .submitAnswers(
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

      // Check completion status
      const completion = await confidentialPersonaContract.hasUserCompleted(signers.alice.address);
      expect(completion[0]).to.be.true;
      expect(completion[1]).to.be.greaterThan(0);
    });

    it("should prevent duplicate submissions", async function () {
      // First submission
      const answers = [0, 1, 2, 0, 1];
      const input1 = fhevm.createEncryptedInput(confidentialPersonaContractAddress, signers.alice.address);
      answers.forEach(answer => input1.add8(answer));
      const encryptedInput1 = await input1.encrypt();

      await confidentialPersonaContract
        .connect(signers.alice)
        .submitAnswers(
          [
            encryptedInput1.handles[0],
            encryptedInput1.handles[1],
            encryptedInput1.handles[2],
            encryptedInput1.handles[3],
            encryptedInput1.handles[4]
          ],
          encryptedInput1.inputProof
        );

      // Attempt second submission
      const input2 = fhevm.createEncryptedInput(confidentialPersonaContractAddress, signers.alice.address);
      answers.forEach(answer => input2.add8(answer));
      const encryptedInput2 = await input2.encrypt();

      await expect(
        confidentialPersonaContract
          .connect(signers.alice)
          .submitAnswers(
            [
              encryptedInput2.handles[0],
              encryptedInput2.handles[1],
              encryptedInput2.handles[2],
              encryptedInput2.handles[3],
              encryptedInput2.handles[4]
            ],
            encryptedInput2.inputProof
          )
      ).to.be.revertedWith("User has already submitted answers");
    });

    it("should track multiple users separately", async function () {
      // Alice submits
      const aliceAnswers = [0, 1, 2, 0, 1];
      const aliceInput = fhevm.createEncryptedInput(confidentialPersonaContractAddress, signers.alice.address);
      aliceAnswers.forEach(answer => aliceInput.add8(answer));
      const aliceEncryptedInput = await aliceInput.encrypt();

      await confidentialPersonaContract
        .connect(signers.alice)
        .submitAnswers(
          [
            aliceEncryptedInput.handles[0],
            aliceEncryptedInput.handles[1],
            aliceEncryptedInput.handles[2],
            aliceEncryptedInput.handles[3],
            aliceEncryptedInput.handles[4]
          ],
          aliceEncryptedInput.inputProof
        );

      // Bob submits
      const bobAnswers = [1, 0, 1, 2, 0];
      const bobInput = fhevm.createEncryptedInput(confidentialPersonaContractAddress, signers.bob.address);
      bobAnswers.forEach(answer => bobInput.add8(answer));
      const bobEncryptedInput = await bobInput.encrypt();

      await confidentialPersonaContract
        .connect(signers.bob)
        .submitAnswers(
          [
            bobEncryptedInput.handles[0],
            bobEncryptedInput.handles[1],
            bobEncryptedInput.handles[2],
            bobEncryptedInput.handles[3],
            bobEncryptedInput.handles[4]
          ],
          bobEncryptedInput.inputProof
        );

      // Check both users completed
      const aliceCompletion = await confidentialPersonaContract.hasUserCompleted(signers.alice.address);
      const bobCompletion = await confidentialPersonaContract.hasUserCompleted(signers.bob.address);

      expect(aliceCompletion[0]).to.be.true;
      expect(bobCompletion[0]).to.be.true;
    });
  });

  describe("Answer Retrieval", function () {
    beforeEach(async function () {
      // Submit answers for Alice
      const answers = [0, 1, 2, 0, 1];
      const input = fhevm.createEncryptedInput(confidentialPersonaContractAddress, signers.alice.address);
      answers.forEach(answer => input.add8(answer));
      const encryptedInput = await input.encrypt();

      await confidentialPersonaContract
        .connect(signers.alice)
        .submitAnswers(
          [
            encryptedInput.handles[0],
            encryptedInput.handles[1],
            encryptedInput.handles[2],
            encryptedInput.handles[3],
            encryptedInput.handles[4]
          ],
          encryptedInput.inputProof
        );
    });

    it("should allow user to get individual encrypted answers", async function () {
      const encryptedAnswer = await confidentialPersonaContract
        .connect(signers.alice)
        .getUserAnswer(0);

      // The answer should be encrypted, so we can't directly compare values
      // but we can verify it's not zero hash
      expect(encryptedAnswer).to.not.equal(ethers.ZeroHash);
    });

    it("should allow user to get all encrypted answers", async function () {
      const result = await confidentialPersonaContract
        .connect(signers.alice)
        .getAllUserAnswers();

      // Check that we got 5 answers and a timestamp
      expect(result[0]).to.have.length(5);
      expect(result[1]).to.be.greaterThan(0);
    });

    it("should decrypt answers correctly", async function () {
      const encryptedAnswer = await confidentialPersonaContract
        .connect(signers.alice)
        .getUserAnswer(0);

      const decryptedAnswer = await fhevm.userDecryptEuint(
        FhevmType.euint8,
        encryptedAnswer,
        confidentialPersonaContractAddress,
        signers.alice
      );

      expect(decryptedAnswer).to.equal(0); // First answer was 0
    });

    it("should prevent access to answers before completion", async function () {
      await expect(
        confidentialPersonaContract
          .connect(signers.bob)
          .getUserAnswer(0)
      ).to.be.revertedWith("User has not completed the test");
    });

    it("should revert when getting invalid question answer", async function () {
      await expect(
        confidentialPersonaContract
          .connect(signers.alice)
          .getUserAnswer(5)
      ).to.be.revertedWith("Invalid question ID");
    });
  });

  describe("Owner Functions", function () {
    it("should allow owner to reset user answers", async function () {
      // Submit answers first
      const answers = [0, 1, 2, 0, 1];
      const input = fhevm.createEncryptedInput(confidentialPersonaContractAddress, signers.alice.address);
      answers.forEach(answer => input.add8(answer));
      const encryptedInput = await input.encrypt();

      await confidentialPersonaContract
        .connect(signers.alice)
        .submitAnswers(
          [
            encryptedInput.handles[0],
            encryptedInput.handles[1],
            encryptedInput.handles[2],
            encryptedInput.handles[3],
            encryptedInput.handles[4]
          ],
          encryptedInput.inputProof
        );

      // Verify submission
      let completion = await confidentialPersonaContract.hasUserCompleted(signers.alice.address);
      expect(completion[0]).to.be.true;

      // Reset by owner
      await confidentialPersonaContract
        .connect(signers.deployer)
        .resetUserAnswers(signers.alice.address);

      // Verify reset
      completion = await confidentialPersonaContract.hasUserCompleted(signers.alice.address);
      expect(completion[0]).to.be.false;
      expect(completion[1]).to.equal(0);
    });

    it("should prevent non-owner from resetting answers", async function () {
      await expect(
        confidentialPersonaContract
          .connect(signers.alice)
          .resetUserAnswers(signers.bob.address)
      ).to.be.revertedWith("Only owner can perform this action");
    });
  });

  describe("Events", function () {
    it("should emit AnswersSubmitted event", async function () {
      const answers = [0, 1, 2, 0, 1];
      const input = fhevm.createEncryptedInput(confidentialPersonaContractAddress, signers.alice.address);
      answers.forEach(answer => input.add8(answer));
      const encryptedInput = await input.encrypt();

      await expect(
        confidentialPersonaContract
          .connect(signers.alice)
          .submitAnswers(
            [
              encryptedInput.handles[0],
              encryptedInput.handles[1],
              encryptedInput.handles[2],
              encryptedInput.handles[3],
              encryptedInput.handles[4]
            ],
            encryptedInput.inputProof
          )
      ).to.emit(confidentialPersonaContract, "AnswersSubmitted")
       .withArgs(signers.alice.address, anyValue);
    });

    it("should emit QuestionsUpdated event when updating question", async function () {
      const newQuestion = "Updated question?";
      const newOptions = ["New Option 1", "New Option 2"];

      await expect(
        confidentialPersonaContract
          .connect(signers.deployer)
          .updateQuestion(0, newQuestion, newOptions)
      ).to.emit(confidentialPersonaContract, "QuestionsUpdated");
    });
  });
});