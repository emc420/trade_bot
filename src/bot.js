
const http = require('http')
const express = require('express')
const fs = require('fs');

//Get Price ETH
const { ChainId, Fetcher, WETH, Route, Trade, TradeType, TokenAmount, Percent} = require('@uniswap/sdk');
const { ethers } = require('ethers');
const chainId = ChainId.MAINNET;
const tokenAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
var dai
var weth
var pair
var pair
var route
var trade
var tolerance
async function checkIfMoreThanTarget(_amount){
    dai = await Fetcher.fetchTokenData(chainId, tokenAddress);
    weth = WETH[chainId];
    pair = await Fetcher.fetchPairData(dai, weth);
    route = new Route([pair], weth);
    let balance = route.midPrice.toSignificant(6);
    //Read target Json
    let student = JSON.parse(fs.readFileSync('../target-prices.json'));
    for(var attributename in student){
        if(student[attributename]['amount'] == _amount && balance>=student[attributename]['target']){
            trade = new Trade(route, new TokenAmount(weth, '1000000000000000000'), TradeType.EXACT_INPUT);
            tolerance = new Percent('50', '10000');
            function toHex(currencyAmount) {
                return `0x${currencyAmount.raw.toString(16)}`
              }     
            const amountOut = toHex(trade.minimumAmountOut(tolerance));  
            console.log(amountOut)
            const path = [weth.address, dai.address];
            const to = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
            const deadline = Math.floor(Date.now() / 1000)+60*20;
            console.log(deadline)
            const value = toHex(trade.inputAmount); 
            const provider = ethers.getDefaultProvider('mainnet', {
                infura: 'https://mainnet.infura.io/v3/66059fc070b74b6d91a04ea4e64980d0'
            });
        // const signer = new ethers.Wallet(PRIVATE_KEY);
            const signer = ethers.Wallet.createRandom();
            const account = signer.connect(provider);
            const uniswap = new ethers.Contract(
                '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
                ['function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)'],
                account
            );
            const tx = await uniswap.swapExactETHForTokens(
                amountOut,
                path,
                to,
                deadline,
                {value, gasPrice: 20e9}
            );
            console.log(`Transaction hash: ${tx.hash}`);
            const receipt = await tx.wait();
            console.log(`Transaction was mined in block ${receipt.blockNumber}`); 
            return true
        }else{
            return false
        }
    }    
}

//Sell ETH
async function sellETHtoDAI(){
   
}
checkIfMoreThanTarget(1).then(function(result) {
        console.log(result)
});

// SERVER CONFIG
/*const PORT = 5000
const HOSTNAME = '127.0.0.1';
const app = express();
const server = http.createServer(app).listen(PORT, HOSTNAME, () => console.log(`Server running at http://${HOSTNAME}:${PORT}/`))*/
