// Connect to local Ganache blockchain
const web3 = new web3("http://127.0.0.1:8545");

// Get the contract ABI and address from ParkingPass.json
const contractABI = [
  {
    inputs: [],
    name: "cost",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "schoolAddress",
    outputs: [
      {
        internalType: "address payable",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "studentAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_studentAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "_make",
        type: "string",
      },
      {
        internalType: "string",
        name: "_model",
        type: "string",
      },
      {
        internalType: "string",
        name: "_licensePlate",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_pass",
        type: "uint256",
      },
    ],
    name: "buyPass",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_licensePlate",
        type: "string",
      },
    ],
    name: "getMostRecentPass",
    outputs: [
      {
        internalType: "address",
        name: "studentAddr",
        type: "address",
      },
      {
        internalType: "string",
        name: "make",
        type: "string",
      },
      {
        internalType: "string",
        name: "model",
        type: "string",
      },
      {
        internalType: "string",
        name: "licensePlate",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "passType",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "expiration",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_licensePlate",
        type: "string",
      },
    ],
    name: "getAllPasses",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "studentAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "make",
            type: "string",
          },
          {
            internalType: "string",
            name: "model",
            type: "string",
          },
          {
            internalType: "string",
            name: "licensePlate",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "passType",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "expiration",
            type: "uint256",
          },
        ],
        internalType: "struct ParkingPass.ParkingPassInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const contractAddress = "0xYourDeployedContractAddress"; // Replace with deployed contract address
const parkingContract = new web3.eth.Contract(contractABI, contractAddress);

// Event listener for form submission
document
  .querySelector(".submit-btn")
  .addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent form submission

    // Get input values from the form
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const license = document.getElementById("license").value;
    const passType = parseInt(document.getElementById("passType").value); // Convert to integer

    console.log({ make, model, license, passType });

    // Call the blockchain function to purchase the permit
    await purchasePermit(make, model, license, passType);
  });

// Function to handle purchasing a parking pass
async function purchasePermit(make, model, license, passType) {
  try {
    // Get the user's Ethereum accounts
    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0]; // Use the first account as the sender

    // Validate pass type and determine Ether cost
    let etherCost;
    if (passType === 1) etherCost = "1"; // 1 Ether for pass type 1
    else if (passType === 2) etherCost = "2"; // 2 Ether for pass type 2
    else if (passType === 3) etherCost = "3"; // 3 Ether for pass type 3
    else {
      alert("Invalid pass type selected!");
      return;
    }

    // Interact with the smart contract's `buyPass` function
    const result = await parkingContract.methods
      .buyPass(userAccount, make, model, license, passType)
      .send({
        from: userAccount,
        value: web3.utils.toWei(etherCost, "ether"), // Send the correct Ether amount
      });

    // Log the transaction result and notify the user
    console.log("Transaction successful:", result);
    alert("Permit purchased successfully!");
  } catch (error) {
    // Log errors and alert the user
    console.error("Transaction failed:", error);
    alert("Transaction failed. Please try again.");
  }
}
