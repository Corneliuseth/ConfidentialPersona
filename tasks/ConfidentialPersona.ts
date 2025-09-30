import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("persona:address", "Prints the ConfidentialPersona address").setAction(async function (_: TaskArguments, hre) {
  const { deployments } = hre;
  const d = await deployments.get("ConfidentialPersona");
  console.log("ConfidentialPersona address:", d.address);
});

task("persona:set-questions", "Set quiz question definitions")
  .addOptionalParam("ids", "Comma-separated ids, e.g., 1,2,3,4,5")
  .addOptionalParam("opts", "Comma-separated option counts, e.g., 4,4,3,2,4")
  .setAction(async function (args: TaskArguments, hre) {
    const { ethers, deployments } = hre;
    const d = await deployments.get("ConfidentialPersona");
    const contract = await ethers.getContractAt("ConfidentialPersona", d.address);

    const ids: number[] = (args.ids ? String(args.ids) : "1,2,3,4,5").split(",").map((s: string) => parseInt(s.trim()));
    const opts: number[] = (args.opts ? String(args.opts) : "4,4,4,4,4").split(",").map((s: string) => parseInt(s.trim()));

    const tx = await contract.setQuestions(ids, opts);
    console.log("Submitting setQuestions tx:", tx.hash);
    await tx.wait();
    console.log("Questions set.");
  });

task("persona:decrypt", "Decrypt one answer for a user")
  .addParam("user", "User address")
  .addParam("qid", "Question id")
  .setAction(async function (args: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    await fhevm.initializeCLIApi();
    const d = await deployments.get("ConfidentialPersona");
    const contract = await ethers.getContractAt("ConfidentialPersona", d.address);
    const enc = await contract.getAnswer(args.user, parseInt(args.qid));
    if (enc === ethers.ZeroHash) {
      console.log("No answer or not submitted.");
      return;
    }
    const [signer] = await ethers.getSigners();
    const clear = await fhevm.userDecryptEuint(FhevmType.euint8, enc, d.address, signer);
    console.log(`Decrypted answer for qid ${args.qid}:`, clear);
  });

task("persona:submit-sample", "Submit five answers for the sender")
  .addOptionalParam("ans", "Comma-separated answers 1..4, e.g., 1,2,3,4,2")
  .setAction(async function (args: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;
    const d = await deployments.get("ConfidentialPersona");
    const contract = await ethers.getContractAt("ConfidentialPersona", d.address);

    const answers: number[] = (args.ans ? String(args.ans) : "1,2,3,4,2").split(",").map((s: string) => parseInt(s.trim()));
    if (answers.length !== 5) {
      throw new Error("Provide exactly 5 answers");
    }

    const [signer] = await ethers.getSigners();
    const input = await fhevm.createEncryptedInput(d.address, signer.address).add8(answers[0]).add8(answers[1]).add8(answers[2]).add8(answers[3]).add8(answers[4]).encrypt();

    const qids = [1, 2, 3, 4, 5];
    const tx = await contract.connect(signer).submitAnswers(qids, [
      input.handles[0],
      input.handles[1],
      input.handles[2],
      input.handles[3],
      input.handles[4],
    ], input.inputProof);
    console.log("submitAnswers tx:", tx.hash);
    await tx.wait();
    console.log("Submitted answers for sender");
  });

