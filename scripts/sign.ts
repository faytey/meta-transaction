const { ethers: any } = require("hardhat");
const { signMetaTxRequest } = require("./signer");
const { readFileSync, writeFileSync } = require("fs");
import dotenv from "dotenv";
dotenv.config();

const DEFAULT_NAME = "sign-test";
console.log("one");

function getInstance(name: any) {
  const address = JSON.parse(readFileSync("deploy.json"))[name];
  console.log("two");
  if (!address) throw new Error(`Contract ${name} not found in deploy.json`);
  console.log("thr");

  return ethers.getContractFactory(name).then((f: any) => f.attach(address));
}
console.log("fou");

async function main() {
  const forwarder = await getInstance("MinimalForwarder");
  console.log("fiv");

  const swapper = await getInstance("Swapper");
  console.log("six");

  const { NAME: name, PRIVATE_KEY1: signer } = process.env;
  console.log("seven");

  const from = new ethers.Wallet(signer).address;
  console.log(from);
  console.log("eight");

  console.log(`Testing the functions of ${name || DEFAULT_NAME} as ${from}...`);
  const data = swapper.interface.encodeFunctionData("daiToLink");
  console.log("nine");
  console.log(data);

  const result = await signMetaTxRequest(signer, forwarder, {
    to: swapper.address,
    from,
    data,
  });
  console.log("Ten");
  console.log(result);

  writeFileSync("tmp/request.json", JSON.stringify(result, null, 2));
  console.log(`Signature: `, result.signature);
  console.log(`Request: `, result.request);
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
