const fs = require('fs');
const path = require('path');
const readline = require('readline');
var ethers = require('ethers');

function isHex(num) {
  return Boolean(num.match(/^0x[0-9a-f]+$/i))
}

async function exportObj() {

  // Initalize values
  let content = {};
  let a = {};
  let url = 'https://mainnet.infura.io/v3/d9dc75e90423491a8a70c1c264b7bebb';
  let customHttpProvider = new ethers.providers.JsonRpcProvider(url);

  // Create read stream of our csv file
  const fileStream = fs.createReadStream('./airdrop.csv');
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let index = 0;
  for await (const line of rl) {
    const splits = line.split(",");
    let num = Number(splits[1])
    console.log('Number: ', num);

    if(isHex(splits[0])) {
      console.log('Hex Address: ', splits[0]);
      await customHttpProvider.lookupAddress(splits[0]).then(function(address) {
        console.log("Name: " + address);
        a[address] = num;
      });
    }else{
      a[splits[0]] = num;
    }
    index++;
  }

  console.log('Json: ', a)

  content.airdrop = a;
  const result = JSON.stringify(content);
  console.log(result)
  //fs.writeFileSync("../generator/new-config.json", result);
  fs.writeFileSync("./new-config.json", result);
}

exportObj();
