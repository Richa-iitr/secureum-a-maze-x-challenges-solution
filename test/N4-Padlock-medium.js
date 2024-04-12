const { expect } = require('chai');

// run the test
// npx hardhat test ./test/N4-Padlock-medium.js
describe('CTF #4 Padlock', function () {
  before(async function () {
    [deployer] = await ethers.getSigners();

    const Challenge = await ethers.getContractFactory('N4Padlock');
    challengeInstance = await Challenge.deploy({ value: ethers.utils.parseEther('0.0001') });
    await challengeInstance.deployed();
  });

  it('Should recover all funds', async function () {
    // Your code goes here
    let code1 = ethers.utils.solidityKeccak256(["string"], ["activatexwormholemiami"]);
    await challengeInstance.pick1(420);
    let b= await challengeInstance.tumbler1();
    console.log(b);
    await challengeInstance.pick2({value: 33});
    let a = await challengeInstance.tumbler2();
    console.log(a);
    await challengeInstance.pick3("0x69420000000000000000000000000000");
    let c = await challengeInstance.tumbler3();
    console.log(c);
    await challengeInstance.recoverFunds();
    expect(await ethers.provider.getBalance(challengeInstance.address)).to.equal('0');
  });
});
