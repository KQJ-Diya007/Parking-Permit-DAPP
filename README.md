# CSUS Parking DApp

This project is a decentralized parking permit application built using Ethereum smart contracts, Truffle, and Web3.js. Users can purchase parking permits, track account balances, and interact with the blockchain via a user-friendly frontend.

---

## Prerequisites

Below are the tools and dependencies you need to install before running this project.

### 1. Node.js
Node.js is a JavaScript runtime required to install and run the app.

**Installation**:
- Download Node.js from [Node.js Official Website](https://nodejs.org/).
- Install the **LTS version** for better stability.

**Verify Node Installation**:
```bash
node -version
```
**Verify Node Installation**:
```bash
npm -version
```

### 2. Truffle
Truffle is a development framework for Ethereum smart contracts.


**Installation**:
```bash
npm install -g truffle
```

**Verify Truffle Installation**:
```bash
truffle --version
```

### 3. Ganache CLI
Ganache provides a local Ethereum blockchain for testing.

**Installation**:

```bash
npm install -g ganache
```

**Verify Ganache CLI Installation**:

```bash
ganache --version
```


### 3. Lite-Server
Lite-Server is a lightweight development server for hosting the frontend.

**Installation**:
```bash
npm install lite-server --save-dev
```

**Verify Lite-Server Installation**:

```bash
lite-server --version
```

### 3. Web3.js
Web3.js is a library for interacting with Ethereum smart contracts from the frontend.

**Installation**:

```bash
npm install web3
```

**Verify Web3.js Installation**:

```bash

```

The output should look similar to this
```bash
yourUserNameHere@ /Users/yourUserNameHere
└─┬ truffle@5.11.5
  ├─┬ @truffle/db@2.0.36
  │ └─┬ @truffle/config@1.3.61
  │   └─┬ @truffle/provider@0.3.13
  │     ├─┬ @truffle/interface-adapter@0.5.37
  │     │ └── web3@1.10.0 deduped
  │     └── web3@1.10.0 deduped
  └─┬ @truffle/debugger@12.1.5
    └── web3@1.10.0   <--- This is your web3 version
```


## Setup DAPP and Run the Application
Follow these steps to run the application locally:

### Step 1: Clone the Repository
Clone the project repository from GitHub:

bash
Copy code
git clone <repository-url>
Navigate into the project directory:

bash
Copy code
cd CSUS-Parking-DAPP


### Step 2: Start Ganache
Option 1: Ganache Desktop
Open Ganache and create a new workspace.
Option 2: Ganache CLI Start Ganache CLI with the following command:
bash
Copy code
ganache
This will run a local Ethereum blockchain on http://127.0.0.1:8545.

### Step 3: Compile and Deploy Smart Contracts
Open a new terminal in the project directory.
Compile the smart contracts:
bash
Copy code
truffle compile
Deploy the smart contracts to Ganache:
bash
Copy code
truffle migrate --reset
Step 4: Start the Frontend
Open another terminal in the project directory.
Start the lite-server:
bash
Copy code
npx lite-server
The frontend will open automatically in your default browser at http://127.0.0.1:3000.
Testing the Application
1. Purchase a Permit
Fill out the parking permit form on the webpage:
Make: Vehicle make (e.g., Toyota)
Model: Vehicle model (e.g., Camry)
License Plate: Enter a license plate number (e.g., ABC123).
Pass Type: Select daily, weekly, or semester.
Click Purchase Permit.
2. View Console Logs
Open the browser developer tools (Right-click > Inspect > Console).
Logs will include:
Student and school balances (before and after the transaction).
Gas costs for the transaction.
Status messages for successful and unsuccessful purchases.
3. Error Handling
If you try to purchase a second permit before the first expires, you will see this error message in the console and on the webpage:

plaintext
Copy code
Unable to purchase: you already have an active pass.
Additional Testing: getBalances.js
You can manually check account balances using the getBalances.js script.

Steps:
Open a terminal in the project directory.
Run the script:
bash
Copy code
node getBalances.js
The output will show:
plaintext
Copy code
School Balance: 3 ETH
Student Balance: 990 ETH
Project Structure
contracts/: Contains the Solidity smart contracts.
src/: Contains the frontend JavaScript (app.js).
build/: Contains the compiled contract artifacts.
index.html: The main entry point for the DApp frontend.
FAQs
1. What should I do if I see "Contract not deployed on the current network"?
Ensure Ganache is running.
Redeploy the contract:
bash
Copy code
truffle migrate --reset
2. How do I clear browser cache?
Open your browser settings and clear the cache.
Alternatively, open the DApp in an incognito/private browsing window.
3. Can I test using multiple accounts?
Use other accounts listed in Ganache.
Update the account in the console log if needed for testing.
