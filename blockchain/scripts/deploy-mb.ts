import hre from 'hardhat';

async function main() {
  const signers = await hre.ethers.getSigners();
  const signer = signers[0];

  await hre.mbDeployer.setup();
  const usdcAddress = "0x5dEaC602762362FE5f135FA5904351916053cF70";

  const multichainNft = await hre.mbDeployer.deploy(signer, 'MultichainNFT', [usdcAddress], {
    addressAlias: 'multichainnft',
    contractVersion: '1.0',
    contractLabel: 'multichainnft',
  });

  console.log(`MultichainNFT with ${usdcAddress} options deployed to ${await multichainNft.contract.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
