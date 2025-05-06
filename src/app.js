document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");

  const web3 = new Web3("http://127.0.0.1:8545"); // Connect to Ganache

  if (!isAuthenticated()) {
    showAuthPage();
  } else {
    initApp();
  }

  function isAuthenticated() {
    return localStorage.getItem("loggedInUser") !== null;
  }

  // Signup/Login
  function showAuthPage() {
    document.body.innerHTML = `
      <div style="text-align: center; margin-top: 50px;">
        <h2>Login or Sign Up</h2>
        <input type="email" id="email" placeholder="Email" /><br/><br/>
        <input type="password" id="password" placeholder="Password" /><br/><br/>
        <button id="signupBtn">Sign Up</button>
        <button id="loginBtn">Log In</button>
      </div>
    `;

    document.getElementById("signupBtn").addEventListener("click", () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      if (!email || !password) {
        alert("Please enter both email and password!");
        return;
      }
      if (localStorage.getItem(email)) {
        alert("Account already exists. Please log in.");
        return;
      }
      localStorage.setItem(email, password);
      localStorage.setItem("loggedInUser", email);
      alert("Signup successful!");
      location.reload();
    });

    document.getElementById("loginBtn").addEventListener("click", () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      if (!email || !password) {
        alert("Please enter both email and password!");
        return;
      }
      const storedPassword = localStorage.getItem(email);
      if (storedPassword && storedPassword === password) {
        localStorage.setItem("loggedInUser", email);
        alert("Login successful!");
        location.reload();
      } else {
        alert("Invalid credentials. Please try again.");
      }
    });
  }

  function initApp() {
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

        document.querySelector(".submit-btn").addEventListener("click", async (event) => {
          event.preventDefault();
          console.log("Purchase button clicked");

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
  }

  async function handlePurchase(parkingContract, web3, make, model, license, passType) {
    try {
      const accounts = await web3.eth.getAccounts();
      const studentAccount = accounts[0];
      const schoolAddress = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4";

      console.log("Fetching balances before transaction...");
      const studentBalanceBefore = await web3.eth.getBalance(studentAccount);
      const schoolBalanceBefore = await web3.eth.getBalance(schoolAddress);

      console.log(`Student Balance Before: ${web3.utils.fromWei(studentBalanceBefore, "ether")} ETH`);
      console.log(`School Balance Before: ${web3.utils.fromWei(schoolBalanceBefore, "ether")} ETH`);

      let etherCost = "0";
      let passTypeText = "";
      if (passType === 1) {
        etherCost = "1";
        passTypeText = "Daily";
      } else if (passType === 2) {
        etherCost = "2";
        passTypeText = "Weekly";
      } else if (passType === 3) {
        etherCost = "3";
        passTypeText = "Semester";
      }

      const receipt = await parkingContract.methods
        .buyPass(studentAccount, make, model, license, passType)
        .send({
          from: studentAccount,
          value: web3.utils.toWei(etherCost, "ether"),
          gas: 500000,
        });

      console.log("Fetching balances after transaction...");
      const studentBalanceAfter = await web3.eth.getBalance(studentAccount);
      const schoolBalanceAfter = await web3.eth.getBalance(schoolAddress);

      const gasUsed = receipt.gasUsed;
      const gasPrice = await web3.eth.getGasPrice();
      const gasCost = web3.utils.fromWei((gasUsed * gasPrice).toString(), "ether");

      console.log(`Student Balance After: ${web3.utils.fromWei(studentBalanceAfter, "ether")} ETH`);
      console.log(`School Balance After: ${web3.utils.fromWei(schoolBalanceAfter, "ether")} ETH`);
      console.log(`Gas Used: ${gasUsed}, Gas Cost: ${gasCost} ETH`);

      document.getElementById("status").innerHTML = `<p>Successfully purchased a ${passTypeText} permit!</p>`;
      console.log(`Successfully purchased a ${passTypeText} permit.`);
    } catch (error) {
      console.error("Transaction failed:", "\n" + error.message);
      document.getElementById("status").innerHTML = `<p>Unable to purchase: you already have an active pass or error occurred.</p>`;
    }
  }
});
