// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ParkingPass {
    address public schoolAddress;
    uint public cost;

    enum PassType { 
        Daily, 
        Weekly, 
        Semester 
    }

    struct ParkingPassInfo {
        PassType passType;
        uint256 expirationTimestamp;
        address studentAddress;
    }

    struct Vehicle {
        string make;
        string model;
        string licensePlate;
    }

    Vehicle public studentVehicle;

    // Mapping of license plates to parking pass history
    mapping(string => ParkingPassInfo[]) private allPasses;
    // Current active pass by license plate
    mapping(string => ParkingPassInfo) private mostRecentPass;
    mapping(address => uint) public balance;

    // Constructor to initialize state variable
    constructor(
        string memory _make, 
        string memory _model, 
        string memory _licensePlate, 
        address payable _schoolAddress
    ) {
        // Setting variables
        studentVehicle = Vehicle(_make, _model, _licensePlate);
        schoolAddress = _schoolAddress;
    }

    // Function to buy a pass
    function buyPass(PassType _pass, address _studentAddress) public payable {
        uint256 duration;

        // Determine cost and duration based on pass type
        if (_pass == PassType.Daily) {
            duration = 10 seconds;
            cost = 0.1 ether;
        } else if (_pass == PassType.Weekly) {
            duration = 20 seconds;
            cost = 0.2 ether;
        } else if (_pass == PassType.Semester) {
            duration = 30 seconds;
            cost = 0.3 ether;
        }

        // Set expiration timestamp
        uint256 expiration = block.timestamp + duration;

        // Update the most recent pass and the history
        mostRecentPass[studentVehicle.licensePlate] = ParkingPassInfo(
            _pass,
            expiration,
            _studentAddress
        );
        allPasses[studentVehicle.licensePlate].push(
            ParkingPassInfo(_pass, expiration, _studentAddress)
        );

        // Transfer Ether to the school address
        payable(schoolAddress).transfer(msg.value);
    }

    // Function to get the most recent pass for a vehicle
    function getMostRecentPass(string memory _licensePlate) 
        public 
        view 
        returns (address) 
    {
        return mostRecentPass[_licensePlate].studentAddress;
    }

    // Function to deposit Ether into the contract
    function deposit() public payable {
        require(msg.value > 0, "Deposit must be greater than 0");
        balance[msg.sender] += msg.value;
    }

    // Function to withdraw Ether from the contract
    function withdraw(uint amount) public {
        // Check if the sender has enough balance
        require(amount <= balance[msg.sender], "Insufficient balance");

        // Perform the withdrawal
        balance[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }
}
