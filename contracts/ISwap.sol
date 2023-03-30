// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ISwap {
    function daiToLink() external view returns (int256);
    function linkToDai() external view returns (int256);
    function swapDaiToLink(int256 _daiQuantity) external;
    function swapLinkToDai(int256 _linkQuantity) external;
}