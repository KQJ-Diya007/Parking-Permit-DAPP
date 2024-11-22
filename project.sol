// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ParkingPass {
    address payable public schoolAddress;
    address public studentAddress;

    uint public cost;


    struct ParkingPassInfo {
        address studentAddress;

        string make;
        string model;
        string licensePlate;

        uint passType;
        uint256 expirationTimestamp;
    }


    // Mapping of license plates to parking pass history
    mapping(string => ParkingPassInfo[]) private allPasses;
    // Current active pass by license plate
    mapping(string => ParkingPassInfo) private mostRecentPass;
    mapping(address => uint) public balance;


    // Function to buy a pass
    function buyPass(address payable _schoolAddress, address _studentAddress, string memory _make, string memory _model, string memory _licensePlate, uint _pass) public payable {
        uint256 duration;
        schoolAddress = _schoolAddress;
        studentAddress = _studentAddress;

        require(msg.value == 1 ether, "You must send exactly 1 Ether!");
        // Transfer Ether to the school address
        payable(schoolAddress).transfer(msg.value);



        // Determine cost and duration based on pass type
        if (_pass == 1) {
            duration = 10 seconds;
            cost = 1 ether;
        } else if (_pass == 2) {
            duration = 20 seconds;
            cost = 2 ether;
        } else if (_pass == 3) {
            duration = 30 seconds;
            cost = 3 ether;
        }

        // Set expiration timestamp
        uint256 expiration = block.timestamp + duration;

        // Update the most recent pass and the history
        mostRecentPass[_licensePlate] = ParkingPassInfo(
            _studentAddress,
            _make,
            _model,
            _licensePlate,
            _pass,
            expiration
        );
        allPasses[_licensePlate].push(
            ParkingPassInfo
            (
                _studentAddress,
                _make,
                _model,
                _licensePlate,
                _pass,
                expiration
            )
        );

    }

    // Function to get the most recent pass for a vehicle
    function getMostRecentPass(string memory _licensePlate) public view returns (address) 
    {

        return mostRecentPass[_licensePlate].studentAddress;
    }

}
