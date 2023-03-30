const {
  DefenderRelayProvider,
  DefenderRelaySigner,
} = require("defender-relay-client/lib/ethers");
const { ethers } = require("hardhat");
const { writeFileSync } = require("fs");
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const credentials = {
    apiKey: process.env.RELAYER_API_KEY,
    apiSecret: process.env.RELAYER_API_SECRET,
  };
  //   console.log(`credentials are: ${await credentials}`);

  const provider = new DefenderRelayProvider(credentials);
  console.log(`provider is ${await provider}`);

  const relaySigner = new DefenderRelaySigner(credentials, provider, {
    speed: "fast",
  });
  console.log(`relayer is ${await relaySigner}`);

  const Forwarder = await ethers.getContractFactory("MinimalForwarder");
  const forwarder = await Forwarder.connect(relaySigner)
    .deploy()
    .then((f) => f.deployed());

  console.log(`forwarder address is ${await forwarder.address}`);

  const Swapper = await ethers.getContractFactory("Swapper");
  console.log("one");

  const swapper = await Swapper.connect(relaySigner)
    .deploy(forwarder.address)
    .then((f) => f.deployed());
  console.log(`swapper address is ${await swapper.address}`);

  writeFileSync(
    "deploy.json",
    JSON.stringify(
      {
        MinimalForwarder: forwarder.address,
        Swapper: swapper.address,
      },
      null,
      2
    )
  );

  console.log(
    `MinimalForwarder: ${forwarder.address}\nSwapper: ${swapper.address}`
  );
}

if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
