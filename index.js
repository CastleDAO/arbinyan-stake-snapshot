require('dotenv').config()


const Web3 = require('web3');
const fs = require('fs');
const abi = require('./abi.json');
const contractAddress = '0x32e5594F14de658b0d577D6560fA0d9C6F1aa724';

const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_PROVIDER));

const myContract = new web3.eth.Contract(abi, contractAddress);

const firstBlock = 323654
const lastBlock = 450000

async function fetchBatch(current, acc = []) {
    const lastCurrentBlock = current + 2000 > lastBlock ? lastBlock : current + 2000;
    const options = {
        fromBlock: current,                  //Number || "earliest" || "pending" || "latest"
        toBlock: lastCurrentBlock
    };

    const results = await myContract.getPastEvents('Staked', options)
    acc = [...acc, ...results]
    console.log('Fetched first batch of items', results.length, 'new items');

    if (lastCurrentBlock >= lastBlock) {
        return acc
    } else {
        return await fetchBatch(lastCurrentBlock, acc)
    }
}

async function execute() {
    
    const items = await fetchBatch(firstBlock, [])
    // console.log(items)
    const filteredItems = []
    items.forEach(item => {
        if (!filteredItems.includes(item.returnValues.user)) {
            filteredItems.push(item.returnValues.user)
        }
    })

    console.log('Fetched events', filteredItems.length, 'new addresses');

    fs.writeFileSync('./output.json', JSON.stringify(filteredItems, null, 2))

    console.log('Printed output at output.json');
}

execute()