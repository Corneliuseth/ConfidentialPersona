import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // const deployedFHECounter = await deploy("FHECounter", {
  //   from: deployer,
  //   log: true,
  // });

  const deployedConfidentialPersona = await deploy("ConfidentialPersona", {
    from: deployer,
    log: true,
  });

  // Initialize quiz questions once after deployment
  try {
    const persona = await hre.ethers.getContractAt(
      "ConfidentialPersona",
      deployedConfidentialPersona.address,
    );
    const tx = await persona.setQuestions([1, 2, 3, 4, 5], [4, 3, 4, 3, 3]);
    await tx.wait();
    console.log("ConfidentialPersona questions initialized.");
  } catch (e) {
    console.warn("Failed to initialize questions (may already be set):", e);
  }

  // console.log(`FHECounter contract: `, deployedFHECounter.address);
  console.log(`ConfidentialPersona contract: `, deployedConfidentialPersona.address);
};
export default func;
func.id = "deploy_contracts"; // id required to prevent reexecution
func.tags = ["FHECounter", "ConfidentialPersona"];
