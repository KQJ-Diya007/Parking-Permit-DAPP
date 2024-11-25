document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const web3 = new Web3("http://127.0.0.1:8545"); // Connect to Ganache

  // Fetchs contract ABI and address
  fetch("build/contracts/ParkingPass.json")
    .then((response) => response.json())
    .then(async (parkingPassArtifact) => {
      const contractABI = parkingPassArtifact.abi;

      // Get the current deployed network ID
      const networkId = await web3.eth.net.getId();
      if (!parkingPassArtifact.networks[networkId]) {
        throw new Error(`Contract not deployed on the current network (ID: ${networkId}).`);
      }

      const contractAddress = parkingPassArtifact.networks[networkId].address;
      const parkingContract = new web3.eth.Contract(contractABI, contractAddress);
      console.log("Contract initialized:", parkingContract); //Debug for checking if the contract is created

      
      document.querySelector(".submit-btn").addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent default behavior
        console.log("Purchase button clicked"); //debug to see if purchase button works

        // Collect form data
        const make = document.getElementById("make").value;
        const model = document.getElementById("model").value;
        const license = document.getElementById("license").value;
        const passType = parseInt(document.getElementById("passType").value);

        if (!make || !model || !license || isNaN(passType)) {
          alert("Please fill all fields correctly.");
          return;
        }

        await handlePurchase(parkingContract, web3, make, model, license, passType);
      });
    })
    .catch((error) => console.error("Failed to load contract artifact:", error));
});

// Handle the purchase process
async function handlePurchase(parkingContract, web3, make, model, license, passType) {
  try {
    const accounts = await web3.eth.getAccounts();
    const userAccount = accounts[0];

    // Determine Ether cost based on pass type
    let etherCost = "0";
    if (passType === 1) 
      etherCost = "1";
    else if (passType === 2) 
      etherCost = "2";
    else if (passType === 3) 
      etherCost = "3";

    const result = await parkingContract.methods
      .buyPass(userAccount, make, model, license, passType)
      .send({
        from: userAccount,
        value: web3.utils.toWei(etherCost, "ether"),
        gas: 500000, // Explicitly set gas limit
      });

    const schoolBalance = await parkingContract.methods.getSchoolBalance().call();
    console.log(`School Address Balance: ${schoolBalance} ETH`);

    // Display the balance on the webpage
    document.getElementById("status").innerHTML += `<p>School Balance: ${schoolBalance} ETH</p>`;
      
    // Display transaction result
    document.getElementById("status").innerHTML = `<p>Pass purchased successfully!</p>`;
    console.log("Transaction successful:", result);
  } catch (error) {
    console.error("Transaction failed:", error);
    document.getElementById("status").innerHTML = `<p>Transaction failed, you already have an active permit</p>`;
  }
}