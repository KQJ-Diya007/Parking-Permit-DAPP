# CSUS Parking DApp

This project is a decentralized parking permit application built using Ethereum smart contracts, Truffle, and Web3.js. Users can purchase parking permits, track account balances, and interact with the blockchain via a user-friendly frontend.

---

## Prerequisites

Below are the tools and dependencies you need to install before running this project.

### 1. Node.js
Node.js is a JavaScript runtime required to install and run the app.

**Installation**:
- Download Node.js from [Node.js Official Website](https://nodejs.org/).
- Install the LTS version for better stability.

**Verify Node Installation**:
```bash
node -version
```
**Verify npm Installation**:
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
npm list web3
```

The output should look similar to this:
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


## Setup DAPP and Run the Application (User View)
Follow these steps to run the application locally:
You will need to have three seperate terminals running at the same time.

### Step 1: Clone the Repository

1. Clone the project repository from GitHub:

```bash
git clone https://github.com/JM000N/CSUS-Parking-DAPP/
```


2. Navigate into the project directory:

```bash
cd CSUS-Parking-DAPP/
```

### Step 2: Start Ganache
1. Open the first terminal in your project directory.  

2. Start Ganache CLI with the following command:
   
```bash
ganache-cli
```
This will run a local Ethereum blockchain on http://127.0.0.1:8545.


### Step 3: Compile and Deploy Smart Contracts
1. Open a second terminal in the project directory.

2. Compile the smart contracts with the following command:
```bash
truffle compile
```

3. Deploy the smart contracts to Ganache with the following command:
```bash
truffle migrate --reset
```

Step 4: Start the Frontend
1. Open a third terminal in the project directory.
2. Start the lite-server with the following command:

```bash
npx lite-server
```
The frontend local webpage will open automatically in your default browser at http://127.0.0.1:3000.


## Testing the Student View of the DAPP

### Purchase a Permit
1. Fill out the parking permit form on the webpage:
   - Make: Vehicle make (e.g., Toyota)
   - Model: Vehicle model (e.g., Camry)
   - License Plate: Enter a license plate number (e.g., ABC123).
   - Pass Type: Select daily, weekly, or semester.
   
3. Click Purchase Permit.

### View Console Logs
1.  Open the browser developer tools (Right-click > Inspect > Console).
    - Logs will include:
       - Student and school balances (before and after the transaction).
       - Gas costs for the transaction.
       - Status messages for successful and unsuccessful purchases.

### Error Handling
- If you try to purchase a second permit before the first expires, you will see this error message in the console and on the webpage:
```bash
Transaction failed: Student has an active pass.
```

## Testing the Parking Enforcer View of the DAPP
1. With your Student view already running, open a new tab and copy the following url into the search bar to load the Parking Enforcement side of the application.
```bash
http://localhost:3000/enforcer.html
```
3. Once you have both webpages open, navigate back to the Student view and purchase a parking permit.
4. Once you have an active pass, go back to the enforcer webpage and fill out the form by entering the license plate number you would like to check.
   - It will output at the bottom of the form wether that car has an active pass or not.
 

## Additional Testing: getBalances.js
You can manually check account balances using the **getBalances.js** script.

### Checking Balances:

1. Open a terminal in the project directory.

```bash
cd CSUS-Parking-DAPP/
```

2. Run the following script:

```bash
node src/getBalances.js
```

The output should be similar to the following:
```bash
School Balance: 3 ETH
Student Balance: 990 ETH
```





