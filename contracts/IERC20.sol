// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
interface IERC20{
    function transferFrom(address _from,address _to,uint256 _amount) external returns(bool);
    function transfer(address _to,uint256 _amount) external returns(bool);
    function balanceOf(address account) external view returns (uint256);
}