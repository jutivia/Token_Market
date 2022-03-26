// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IERC20} from "./IERC20.sol";

contract PriceConsumerV3 {
    struct TokenOrder{
    uint256 amountIn;
    address owner;
    bool done;
}

    AggregatorV3Interface internal priceFeed;
    int public exchangePrice;
    uint96 public decimals;
    address internal USDT = 0x55c18d10ded7968Cd980AbfE0547B410DF284413;
    address internal DAI = 0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F;
    uint96 internal swapIndex = 1;
    mapping(uint=> TokenOrder) public swaps;
    constructor(address feedAddress) {
        priceFeed = AggregatorV3Interface(feedAddress);
    }

    function getLatestPrice() public {
        (
        // uint80 roundId,
        ,int256 price,,,
        // uint256 startedAt,
        // uint256 updatedAt,
        // uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        exchangePrice = price;
        decimals = priceFeed.decimals();
    }

    function viewPrice() view public returns(uint){
        return uint256(exchangePrice);
    }

    function checkTokens(address _fromToken,address _toToken,uint _amountIn) public{
        if(_fromToken == DAI){
            swapTokenDaiToUsdt (_fromToken, _toToken,_amountIn);
        } else if (_fromToken == USDT) {
            swapTokeUsdtToDai (_fromToken, _toToken,_amountIn);
        }
    }
    function swapTokenDaiToUsdt (address _fromToken,address _toToken,uint _amountIn) internal{
        uint rate = uint256(exchangePrice)/decimals;
        uint swappedAmount = _amountIn * rate;
        require ( IERC20(_toToken).balanceOf(address(this))>= swappedAmount , "Insufficent funds");
        require(IERC20(_fromToken).transferFrom(msg.sender, address(this), _amountIn),"OGBENI!!!!!");
        TokenOrder storage o= swaps[swapIndex];
        o.amountIn= _amountIn;
        o.owner=msg.sender;
        swapIndex++;
        (bool status) = IERC20(_toToken).transferFrom(address(this), msg.sender, (swappedAmount));
        require(status, "transaction failed");
    }
    function swapTokeUsdtToDai(address _fromToken,address _toToken,uint _amountIn) internal{
        uint rate = uint256(exchangePrice)/decimals;
        uint swappedAmount = (_amountIn*100000)/rate;
        require ( IERC20(_toToken).balanceOf(address(this))>= swappedAmount, "Insufficent funds");
        require(IERC20(_fromToken).transferFrom(msg.sender,address(this), _amountIn),"OGBENI!!!!!");
        TokenOrder storage o= swaps[swapIndex];
        o.amountIn= _amountIn;
        o.owner=msg.sender;
        swapIndex++;
        (bool status) = IERC20(_toToken).transferFrom(address(this), msg.sender, swappedAmount/100000);
        require(status, "transaction failed");
    }
}
