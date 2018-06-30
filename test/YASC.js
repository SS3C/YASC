// @flow

import EVMRevert from './helpers/EVMRevert';

const abi = require('ethereumjs-abi');

require('chai')
    .use(require('chai-as-promised'))
    .use(require('chai-bignumber')(web3.BigNumber))
    .should();

const MultiWallet = artifacts.require('MultiWallet');
const YASC = artifacts.require('YASC');

contract('YASC', function ([_, wallet1, wallet2, wallet3, wallet4, wallet5, user1]) {
    let multiWallet;
    let yasc;

    beforeEach(async function () {
        multiWallet = await MultiWallet.new();
        await multiWallet.transferOwnershipWithHowMany([wallet1, wallet2, wallet3, wallet4, wallet5], 4);

        yasc = await YASC.new();
        await yasc.transferOwnership(multiWallet.address);
    });

    it('should be inited correctly', async function () {
        (await multiWallet.ownersCount.call()).should.be.bignumber.equal(5);
        (await multiWallet.howManyOwnersDecide.call()).should.be.bignumber.equal(4);
        (await yasc.owner.call()).should.be.equal(multiWallet.address);
    });

    it('should fail on bad action', async function () {
        const action = '0x1' + abi.simpleEncode('mint(address,uint256)', user1, 100).toString('hex');
        await multiWallet.performAction(yasc.address, action, 7, { from: wallet1 });
        await multiWallet.performAction(yasc.address, action, 7, { from: wallet2 });
        await multiWallet.performAction(yasc.address, action, 7, { from: wallet3 });
        await multiWallet.performAction(yasc.address, action, 7, { from: wallet4 }).should.be.rejectedWith(EVMRevert);
    });

    describe('mint', async function () {
        it('should fail on unauthorized call', async function () {
            await yasc.mint(_, 10, { from: user1 }).should.be.rejectedWith(EVMRevert);
            await yasc.mint(user1, 10, { from: user1 }).should.be.rejectedWith(EVMRevert);
            await yasc.mint(yasc.address, 10, { from: user1 }).should.be.rejectedWith(EVMRevert);
            await yasc.mint(multiWallet.address, 10, { from: user1 }).should.be.rejectedWith(EVMRevert);
        });

        it('should mint when 1,2,3,4 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('mint(address,uint256)', user1, 100).toString('hex');

            await multiWallet.performAction(yasc.address, action, 999, { from: wallet1 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 999, { from: wallet2 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 999, { from: wallet3 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 999, { from: wallet4 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(100);
        });

        it('should mint when 1,2,3,5 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('mint(address,uint256)', user1, 100).toString('hex');

            await multiWallet.performAction(yasc.address, action, 777, { from: wallet1 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 777, { from: wallet2 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 777, { from: wallet3 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 777, { from: wallet5 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(100);
        });

        it('should mint when 1,2,4,5 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('mint(address,uint256)', user1, 100).toString('hex');

            await multiWallet.performAction(yasc.address, action, 666, { from: wallet1 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 666, { from: wallet2 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 666, { from: wallet4 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 666, { from: wallet5 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(100);
        });

        it('should mint when 1,3,4,5 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('mint(address,uint256)', user1, 100).toString('hex');

            await multiWallet.performAction(yasc.address, action, 333, { from: wallet1 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 333, { from: wallet3 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 333, { from: wallet4 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 333, { from: wallet5 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(100);
        });

        it('should mint when 2,3,4,5 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('mint(address,uint256)', user1, 100).toString('hex');

            await multiWallet.performAction(yasc.address, action, 123, { from: wallet2 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 123, { from: wallet3 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 123, { from: wallet4 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 123, { from: wallet5 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(100);
        });

        it('should mint when 5,1,3,2 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('mint(address,uint256)', user1, 100).toString('hex');

            await multiWallet.performAction(yasc.address, action, 345, { from: wallet5 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 345, { from: wallet1 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 345, { from: wallet3 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(0);

            await multiWallet.performAction(yasc.address, action, 345, { from: wallet2 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(100);
        });
    });

    describe('burn', async function () {
        beforeEach(async function () {
            const action = '0x' + abi.simpleEncode('mint(address,uint256)', user1, 100).toString('hex');
            await multiWallet.performAction(yasc.address, action, 135, { from: wallet1 });
            await multiWallet.performAction(yasc.address, action, 135, { from: wallet2 });
            await multiWallet.performAction(yasc.address, action, 135, { from: wallet3 });
            await multiWallet.performAction(yasc.address, action, 135, { from: wallet4 });
            await yasc.transfer(multiWallet.address, 50, { from: user1 });
            (await yasc.balanceOf.call(user1)).should.be.bignumber.equal(50);
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);
        });

        it('should fail on unauthorized call', async function () {
            await yasc.burn(0, { from: user1 }).should.be.rejectedWith(EVMRevert);
            await yasc.burn(10, { from: user1 }).should.be.rejectedWith(EVMRevert);
            await yasc.burn(50, { from: user1 }).should.be.rejectedWith(EVMRevert);
        });

        it('should burn when 1,2,3,4 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('burn(uint256)', 50).toString('hex');

            await multiWallet.performAction(yasc.address, action, 321, { from: wallet1 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 321, { from: wallet2 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 321, { from: wallet3 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 321, { from: wallet4 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(0);
        });

        it('should burn when 1,2,3,5 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('burn(uint256)', 50).toString('hex');

            await multiWallet.performAction(yasc.address, action, 567, { from: wallet1 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 567, { from: wallet2 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 567, { from: wallet3 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 567, { from: wallet5 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(0);
        });

        it('should burn when 1,2,4,5 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('burn(uint256)', 50).toString('hex');

            await multiWallet.performAction(yasc.address, action, 987, { from: wallet1 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 987, { from: wallet2 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 987, { from: wallet4 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 987, { from: wallet5 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(0);
        });

        it('should burn when 1,3,4,5 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('burn(uint256)', 50).toString('hex');

            await multiWallet.performAction(yasc.address, action, 2018, { from: wallet1 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 2018, { from: wallet3 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 2018, { from: wallet4 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 2018, { from: wallet5 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(0);
        });

        it('should burn when 2,3,4,5 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('burn(uint256)', 50).toString('hex');

            await multiWallet.performAction(yasc.address, action, 2017, { from: wallet2 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 2017, { from: wallet3 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 2017, { from: wallet4 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 2017, { from: wallet5 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(0);
        });

        it('should burn when 5,1,3,2 of 5 voted', async function () {
            const action = '0x' + abi.simpleEncode('burn(uint256)', 50).toString('hex');

            await multiWallet.performAction(yasc.address, action, 2000, { from: wallet5 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 2000, { from: wallet1 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 2000, { from: wallet3 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(50);

            await multiWallet.performAction(yasc.address, action, 2000, { from: wallet2 });
            (await yasc.balanceOf.call(multiWallet.address)).should.be.bignumber.equal(0);
        });
    });

    describe('transferOwnership', async function () {
        it('should success', async function () {
            const multiWallet2of3 = await MultiWallet.new();
            await multiWallet2of3.transferOwnershipWithHowMany([wallet1, wallet2, wallet3], 2);

            const action = '0x' + abi.simpleEncode('transferOwnership(address)', multiWallet2of3.address).toString('hex');
            await multiWallet.performAction(yasc.address, action, 11, { from: wallet1 });
            await multiWallet.performAction(yasc.address, action, 11, { from: wallet2 });
            await multiWallet.performAction(yasc.address, action, 11, { from: wallet3 });
            await multiWallet.performAction(yasc.address, action, 11, { from: wallet4 });
            (await yasc.owner.call()).should.be.equal(multiWallet2of3.address);
        });

        it('should success twice', async function () {
            const multiWallet2of3 = await MultiWallet.new();
            await multiWallet2of3.transferOwnershipWithHowMany([wallet1, wallet2, wallet3], 2);

            const action1 = '0x' + abi.simpleEncode('transferOwnership(address)', multiWallet2of3.address).toString('hex');
            await multiWallet.performAction(yasc.address, action1, 19, { from: wallet1 });
            await multiWallet.performAction(yasc.address, action1, 19, { from: wallet2 });
            await multiWallet.performAction(yasc.address, action1, 19, { from: wallet3 });
            await multiWallet.performAction(yasc.address, action1, 19, { from: wallet4 });

            const multiWallet1of2 = await MultiWallet.new();
            await multiWallet1of2.transferOwnershipWithHowMany([wallet1, wallet2], 1);

            const action2 = '0x' + abi.simpleEncode('transferOwnership(address)', multiWallet1of2.address).toString('hex');
            await multiWallet2of3.performAction(yasc.address, action2, 20, { from: wallet1 });
            await multiWallet2of3.performAction(yasc.address, action2, 20, { from: wallet2 });
            (await yasc.owner.call()).should.be.equal(multiWallet1of2.address);
        });
    });
});
