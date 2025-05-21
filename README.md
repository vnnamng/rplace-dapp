# RPlaceV2 DApp

RPlaceV2 is a decentralized pixel canvas game inspired by Reddit's r/place, built on Ethereum. Users can connect their wallets, buy pixels, and compete for canvas ownership in real time.

## Live Demo

[Live Front-End Demo](https://vnnamng.github.io/rplace-dapp/)

## Ethereum Testnet

This DApp is deployed on the **Sepolia** Ethereum testnet.

- **RPC URL:** https://rpc.ankr.com/eth_sepolia

## Features

- Connect with MetaMask and interact with the canvas.
- Buy one or more pixels by selecting them, choosing a color, and setting a price in ETH.
- Leaderboards for top wallets by ETH spent and pixel count.
- Real-time updates via smart contract events.

## How to Use

1. Install [MetaMask](https://metamask.io/) and create a wallet on Sepolia.
2. Get SepoliaETH from a faucet (e.g., [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia)).
3. Visit the [live demo](https://your-deployed-frontend-link.com) and connect your wallet.
4. Select pixels, choose a color, set the ETH price per pixel, and click **Buy**.

## Contract Details

- **Contract Address:** `0x84B0FD3dd1288542f4E189f8170eB94B303214C3`
- **ABI:** See [`src/constants.js`](src/constants.js)

## Development

- Front-end: React + Vite ([src/](src/))
- Smart contract: Solidity ([rplace_contract/contracts/1_PixelWarV2.sol](rplace_contract/contracts/1_PixelWarV2.sol))
