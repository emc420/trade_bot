const http = require('http')
const express = require('express')

//Get Price ETH
const { ChainId, Fetcher, WETH, Route, Trade, TradeType, TokenAmount} = require('@uniswap/sdk');
const chainId = ChainId.MAINNET;
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
async function checkIfMoreThanTarget(_amount){
    const dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
    const weth = WETH[chainId];
    const pair = await Fetcher.fetchPairData(dai, weth);
    const route = new Route([pair], weth);
    let balance = route.midPrice.toSignificant(6);
}

// SERVER CONFIG
/*const PORT = 5000
const HOSTNAME = '127.0.0.1';
const app = express();
const server = http.createServer(app).listen(PORT, HOSTNAME, () => console.log(`Server running at http://${HOSTNAME}:${PORT}/`))*/
