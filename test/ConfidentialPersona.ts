import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

describe("ConfidentialPersona", function () {
  let deployer: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;
  let contract: any;
  let addr: string;

  before(async function () {
    [deployer, alice, bob] = await ethers.getSigners();
  });

  beforeEach(async function () {
    if (!fhevm.isMock) {
      console.warn("Skipping tests on non-mock network");
      this.skip();
    }
    const factory = await ethers.getContractFactory("ConfidentialPersona");
    contract = await factory.deploy();
    addr = await contract.getAddress();
    // Set 5 questions with 4 options each
    await contract.connect(deployer).setQuestions([1, 2, 3, 4, 5], [4, 4, 4, 4, 4]);
  });

  it("stores and decrypts single answer", async function () {
    const qid = 1;
    const clear = 3;
    const enc = await fhevm.createEncryptedInput(addr, alice.address).add8(clear).encrypt();
    await contract.connect(alice).submitAnswer(qid, enc.handles[0], enc.inputProof);

    const stored = await contract.getAnswer(alice.address, qid);
    expect(stored).not.eq(ethers.ZeroHash);

    const dec = await fhevm.userDecryptEuint(FhevmType.euint8, stored, addr, alice);
    expect(dec).to.eq(clear);
  });

  it("stores and decrypts five answers in one tx", async function () {
    const values = [1, 2, 3, 4, 2];
    const enc = await fhevm
      .createEncryptedInput(addr, bob.address)
      .add8(values[0])
      .add8(values[1])
      .add8(values[2])
      .add8(values[3])
      .add8(values[4])
      .encrypt();

    await contract
      .connect(bob)
      .submitAnswers([1, 2, 3, 4, 5], [enc.handles[0], enc.handles[1], enc.handles[2], enc.handles[3], enc.handles[4]], enc.inputProof);

    for (let i = 0; i < 5; i++) {
      const stored = await contract.getAnswer(bob.address, i + 1);
      const dec = await fhevm.userDecryptEuint(FhevmType.euint8, stored, addr, bob);
      expect(dec).to.eq(values[i]);
    }
  });
});

