document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const web3 = new Web3("http://127.0.0.1:8545"); // Connect to Ganache

  fetch("build/contracts/ParkingPass.json")
    .then((response) => response.json())
    .then(async (parkingPassArtifact) => {
      const contractABI = parkingPassArtifact.abi;
      const networkId = await web3.eth.net.getId();

      if (!parkingPassArtifact.networks[networkId]) {
        throw new Error(`Contract not deployed on the current network (ID: ${networkId}).`);
      }

      const contractAddress = parkingPassArtifact.networks[networkId].address;
      const parkingContract = new web3.eth.Contract(contractABI, contractAddress);

      console.log("Contract initialized:", parkingContract);

      // Event listener for checking the lisence plate button
      document.getElementById("checkPassButton").addEventListener("click", async (event) => {
        event.preventDefault(); // Prevent page reload
        const licensePlate = document.getElementById("licensePlate").value; // Get the value from the input field

        if (!licensePlate) {
          document.getElementById("result").innerText = "Please enter a valid license plate.";
          return;
        }

        // Call the function to check if the parking pass is valid
        await checkParkingPass(parkingContract, licensePlate);
      });
    })
    .catch((error) => console.error("Failed to load contract artifact:", error));
});

async function checkParkingPass(parkingContract, licensePlate) {
  try {
    // call the smart contract
    const hasValidPass = await parkingContract.methods.hasValidParkingPass(licensePlate).call();
    
    // if the given lisence plate has a parking pass, then it is valid, if not return a boolean
    if (hasValidPass) {
      console.log("The vehicle has a valid parking pass.");
      document.getElementById("result").innerText = "The vehicle has a valid parking pass.";
    } else {
      console.log("The vehicle does not have a valid parking pass.");
      document.getElementById("result").innerText = "The vehicle does not have a valid parking pass.";
    }

    //misc error checking
  } catch (error) {
    console.error("Error checking parking pass:", error);
    document.getElementById("result").innerText = "An error occurred while checking the parking pass.";
  }
}
