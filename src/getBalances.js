const Web3 = require("web3");
const fs = require("fs");

const web3 = new Web3("http://127.0.0.1:8545"); // Connect to Ganache

async function getBalances() {
  try {
    // Load contract ABI and network info
    const parkingPassArtifact = JSON.parse(fs.readFileSync("build/contracts/ParkingPass.json", "utf8"));
    const networkId = await web3.eth.net.getId();
    const contractAddress = parkingPassArtifact.networks[networkId]?.address;

    if (!contractAddress) {
      throw new Error(`Contract not deployed on the current network (ID: ${networkId}).`);
    }

    // Hardcoded school address and first student account
    const schoolAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"; // Replace with actual school address if different
    const accounts = await web3.eth.getAccounts();
    const studentAccount = accounts[0]; // Assume the first account is the student

    // Fetch balances
    const schoolBalanceWei = await web3.eth.getBalance(schoolAddress);
    const studentBalanceWei = await web3.eth.getBalance(studentAccount);

    // Convert balances to Ether
    const schoolBalance = web3.utils.fromWei(schoolBalanceWei, "ether");
    const studentBalance = web3.utils.fromWei(studentBalanceWei, "ether");

    // Log balances
    console.log(`School Balance: ${schoolBalance} ETH`);
    console.log(`Student Balance: ${studentBalance} ETH`);
  } catch (error) {
    console.error("Error fetching balances:", error.message);
  }
}

// Run the function
getBalances();
