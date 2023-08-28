### file structure



src\ \
  * classes\ \
    * app.ts \
      * - init - create comptroller, lens, wallet \
    * address.ts Singleton \
      * getAddress: string \
      * getEtherBallance: bigNumber \
      * getTokens: erc20  <-- cached version of comptroller getTokens, with cached balance, liquidity and etc \
      * getUntokens: unErc20|unEther <-- cached version of comptroller getUntokens, with cached balance, liquidity and etc \
    * comptroller.ts Singleton \
      * - [getAllMarkets](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/Comptroller.sol#L1328), get all tokens from market, even inactive tokens \
      * - [borrowAllowed](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/Comptroller.sol#L326), check if its possible to borrow token \
      * - [mintAllowed](https://github.com/UnFederalReserve/compound-protocol/blob/master/contracts/Comptroller.sol#L220) check if supply is allowed for the token \
      * - [enterMarkets](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/Comptroller.sol#L109) bring out tokens to the market \
      * - [checkMembership](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/Comptroller.sol#L99) verify if token is entered the market \
      * - [exitMarket](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/Comptroller.sol#L159) remove token from the market \
      * - [getAccountLiquidity](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/Comptroller.sol#L657), Determine the current account liquidity wrt collateral requirements TODO: ask sergey about return codes \
      * - [getHypotheticalAccountLiquidity](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/Comptroller.sol#L679) Determine what the account liquidity would be if the given amounts were redeemed/borrowed \
      * - [claimRewards](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/Comptroller.sol#L1261) claim rewards \
      * - [getCompSpeeds](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/ComptrollerStorage.sol#L113) unToken distribution speed \
    * lens.ts Singleton \
      * - [cTokenBalancesAll](https://github.com/UnFederalReserve/compound-protocol/blob/master/contracts/Lens/CompoundLens.sol#L117) return balance for all giving tokens  \
      * - [cTokenUnderlyingPriceAll](https://github.com/UnFederalReserve/compound-protocol/blob/master/contracts/Lens/CompoundLens.sol#L141) return prices for all giving tokens \
      * - [cTokenMetadata](https://github.com/UnFederalReserve/compound-protocol/blob/master/contracts/Lens/CompoundLens.sol#L38) return ctoken data (TODO: ask what kind of data) \
      * - [getCompBalance](https://github.com/UnFederalReserve/compound-protocol/blob/master/contracts/Lens/CompoundLens.sol#L276) return unToken balance
    unErc20.ts \
      * - [mint](https://github.com/UnFederalReserve/compound-protocol/blob/master/contracts/CErc20.sol#L44) supply tokens \
      * - [redeem](https://github.com/UnFederalReserve/compound-protocol/blob/master/contracts/CErc20.sol#L49) withdraw tokens \
      * - [borrow](https://github.com/UnFederalReserve/compound-protocol/blob/master/contracts/CErc20.sol#L69) borrow tokens \
      * - [repayBorrow](https://github.com/UnFederalReserve/compound-protocol/blob/master/contracts/CErc20.sol#L78) repay debt \
      * - [supplyRatePerBlock](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/CToken.sol#L239) Returns the current per-block supply interest rate for this cToken \
      * - [borrowRatePerBlock](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/CToken.sol#L231) Returns the current per-block borrow interest rate for this cToken \
      * - [decimals](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/CTokenInterfaces.sol#L25) return token mantissa \
      * - [balanceOfUnderlying](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/CToken.sol#L184) return price of original token  \
      * - [borrowBalanceCurrent](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/CToken.sol#L256) return account debt? TODO: verify \
      * - [getExchangeRate](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/CToken.sol#L314) return unToken/token exchange rate \
      * - [getCash](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/CToken.sol#L371) Get cash balance of this cToken in the underlying asset \
      * - [balanceOf](https://github.com/UnFederalReserve/compound-protocol/blob/456ba0a27fa61d81b4125ecf2fb246902bc6023a/contracts/CToken.sol#L175) Get the token balance of the owner \
    * erc20.ts \
      * - [approve](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol#L37) Sets `amount` as the allowance of `spender` over the caller's tokens. \
      * - [allowance](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol#L28) Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through {transferFrom}. This is zero by default. \
      * - [getDecimals](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol#L73) return token mantissa \
    * unEther.ts \
    * ether.ts \
    * wallet.ts Singleton \
      * getAddresses: []Address \
  
