// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import {IERC20} from "./IERC20.sol";

contract LINK_AAVE {

    // --------- State Variables ---------
    address constant AAVE_ETH	=	0xbE23a3AA13038CfC28aFd0ECe4FdE379fE7fBfc4;
    address constant LINK_ETH	=	0xb77fa460604b9C6435A235D057F7D319AC83cb53;
    address constant Link = 0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39;
    address constant Aave = 0xD6DF932A45C0f255f85145f286eA0b292B21C90B;

    int216 public Link_Eth_exchangePrice;
    uint40 public Link_Eth_decimals;
    int216 public AAVE_Eth_exchangePrice;
    uint40 public AAVE_Eth_decimals;

    AggregatorV3Interface internal Link_Eth_priceFeed;
    AggregatorV3Interface internal AAVE_Eth_priceFeed;

     // --------- Errors ---------
     error InsufficientFunds();

    // --------- Constructor ---------
    constructor(){
        Link_Eth_priceFeed = AggregatorV3Interface(LINK_ETH);
        AAVE_Eth_priceFeed = AggregatorV3Interface(AAVE_ETH);
    }

    // --------- Functions ---------
    // function to get both LINK and AAVe price feeds
    function getLatestPrices() public {
        (
        ,int256 link_price,,,
        ) = Link_Eth_priceFeed.latestRoundData();
        Link_Eth_exchangePrice = int216(link_price);
        Link_Eth_decimals  = uint40(Link_Eth_priceFeed.decimals());

         (
        ,int256 aave_price,,,
        ) = AAVE_Eth_priceFeed.latestRoundData();
        AAVE_Eth_exchangePrice = int216(aave_price);
        AAVE_Eth_decimals  = uint40(AAVE_Eth_priceFeed.decimals());
    }

    // function to view both LINK and AAVE price feeds
     function viewPrices() view public returns(uint, uint){
        return (uint256(int256(Link_Eth_exchangePrice)), uint256(int256(AAVE_Eth_exchangePrice)));
    }

    // function that converts link to AAVE 
     function LinkToAAVE (uint _amountIn) internal{
        uint LinkRate = uint256(int256(Link_Eth_exchangePrice));
        uint AAVERate = uint256(int256(AAVE_Eth_exchangePrice));
        uint ratio = (AAVERate * 100000000) / LinkRate;
        uint swappedAmount = _amountIn * ratio;
        if ( IERC20(Aave).balanceOf(address(this))<= swappedAmount) revert InsufficientFunds();
        assert(IERC20(Link).transferFrom(msg.sender, address(this), _amountIn));
        assert(IERC20(Aave).transferFrom(address(this), msg.sender, (swappedAmount/100000000)));
    }

    function AAveToLink (uint _amountIn) internal{
        uint LinkRate = uint256(int256(Link_Eth_exchangePrice));
        uint AAVERate = uint256(int256(AAVE_Eth_exchangePrice));
        uint ratio = ( LinkRate * 100000000) / AAVERate;
        uint swappedAmount = _amountIn * ratio;
        if ( IERC20(Aave).balanceOf(address(this))<= swappedAmount) revert InsufficientFunds();
        assert(IERC20(Link).transferFrom(msg.sender, address(this), _amountIn));
        assert(IERC20(Aave).transferFrom(address(this), msg.sender, (swappedAmount/100000000)));
    }
    
}