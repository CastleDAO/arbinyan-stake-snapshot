const fs = require('fs')
const addresses = require('./output.json');


function getRandomItemFromArray(items) {
    return  items[Math.floor(Math.random()*items.length)];
}

const winners = []

for(var i = 0; i < 100 ; i++) {
    winners.push(getRandomItemFromArray(addresses))
}

fs.writeFileSync('./winners.json', JSON.stringify(winners, null, 2))