// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {

    AggregatorV3Interface internal priceFeed;
    constructor(address feedAddress) {
        priceFeed = AggregatorV3Interface(feedAddress);
    }

    function getLatestPrice() public view returns (int, uint) {
        (
        // uint80 roundId,
        ,int256 price,,,
        // uint256 startedAt,
        // uint256 updatedAt,
        // uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        uint decimals = priceFeed.decimals();
        return (price, decimals);
    }
}
