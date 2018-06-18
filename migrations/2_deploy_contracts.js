const MultiWallet = artifacts.require('MultiWallet');
const YASC = artifacts.require('YASC');

module.exports = async function (deployer) {
    deployer.deploy(MultiWallet);
    deployer.deploy(YASC);
};
