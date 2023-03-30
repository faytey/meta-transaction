// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";
import "./IToken.sol";

contract Swapper is ERC2771Context {
    address internal client1;
    address internal client2;
    IToken DAI = IToken(0x65a5ba240CBd7fD75700836b683ba95EBb2F32bd);
    IToken LINK = IToken(0xA0Fe6077A4994eedd3e1d0358A1afcDb9fcF3A6b);

    /**
     * Network: SEPOLIA
     * Aggregator: DAI/USD
     * Address: 0x0d79df66BE487753B02D015Fb622DED7f0E9798d
     * Aggregator: LINK/USD
     * Address: 0x48731cF7e84dc94C5f84577882c14Be11a5B7456
     * Decimals: 8
     * Contract: DAI
     * Address: 0x65a5ba240CBd7fD75700836b683ba95EBb2F32bd
     * Contract: LINK
     * Address: 0xA0Fe6077A4994eedd3e1d0358A1afcDb9fcF3A6b
     */
    constructor(MinimalForwarder forwarder) ERC2771Context(address(forwarder)){
    }

    function daiToLink() public view returns (int256) {
        (, int256 basePrice, , , ) = AggregatorV3Interface(
            0x0d79df66BE487753B02D015Fb622DED7f0E9798d
        ).latestRoundData();

        return basePrice / 100000000;
    }

    function linkToDai() public view returns (int256) {
        (, int256 basePrice, , , ) = AggregatorV3Interface(
            0x48731cF7e84dc94C5f84577882c14Be11a5B7456
        ).latestRoundData();

        return basePrice / 100000000;
    }

    function swapDaiToLink(int256 _daiQuantity) external {
        address recipient = _msgSender();
        uint256 daiQuantity = uint256(_daiQuantity);
        require(
            daiQuantity <= DAI.balanceOf(_msgSender()),
            "Insufficient Dai Amount"
        );
        // DAI.transferFrom(recipient, address(this), daiQuantity);
        int256 Dai = daiToLink();
        int256 Link = linkToDai();
        uint256 swapAmount = (uint256(Dai) * daiQuantity) / uint256(Link);
        uint256 balance = LINK.balanceOf(address(this));
        require(
            balance >= swapAmount,
            "Not enough funds, please try again later"
        );
        LINK.transfer(recipient, swapAmount);
    }

    function swapLinkToDai(int256 _linkQuantity) external {
        address recipient = _msgSender();
        uint256 linkQuantity = uint256(_linkQuantity);
        require(
            linkQuantity <= LINK.balanceOf(_msgSender()),
            "Insufficient Link Amount"
        );
        int256 Dai = daiToLink();
        int256 Link = linkToDai();
        uint256 swapAmount = (uint256(Link) * linkQuantity) / uint256(Dai);
        uint256 balance = DAI.balanceOf(address(this));
        require(
            balance >= swapAmount,
            "Not enough funds, please try again later"
        );
        DAI.transfer(recipient, swapAmount);
    }
}