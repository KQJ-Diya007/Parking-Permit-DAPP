// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ParkingPass {
    //School address should never change
    address payable constant public schoolAddress = payable(0x5B38Da6a701c568545dCfcB03FcB875f56beddC4);
    address public studentAddress;

    uint public cost;

    struct ParkingPassInfo 
    {
        address studentAddress;

        string make;
        string model;
        string licensePlate;

        uint passType;
        uint256 expiration;
    }

    // Mapping of license plates to parking pass history
    mapping(string => ParkingPassInfo[]) private allPasses;
    // Current active pass by license plate
    mapping(string => ParkingPassInfo) private mostRecentPass;


    // Function to buy a pass
    function buyPass(address _studentAddress, string memory _make, string memory _model, string memory _licensePlate, uint _pass) public payable 
    {
        uint256 duration;
        studentAddress = _studentAddress;
        
        // Transfer Ether to the school address
        payable(schoolAddress).transfer(msg.value);

        require(mostRecentPass[_licensePlate].expiration < block.timestamp, "ERROR: Cannot have more than one active pass at a time!");
        require(_pass >=1 && _pass <= 3, "ERROR: Pass seleciton not valid");

        // Determine cost and duration based on pass type
        if (_pass == 1) 
        {
            duration = 10 seconds;
            cost = 1 ether;
        } 
        else if (_pass == 2) 
        {
            duration = 20 seconds;
            cost = 2 ether;
        } 
        else if (_pass == 3) 
        {
            duration = 30 seconds;
            cost = 3 ether;
        }

        //Check for exact Eth amount sent
        require(msg.value == cost, "ERROR: Incorrect amount of Ether sent! ");
        
        // Set expiration timestamp
        uint256 expiration = block.timestamp + duration;

        // Update the most recent pass and the history
        mostRecentPass[_licensePlate] = ParkingPassInfo(_studentAddress, _make, _model, _licensePlate, _pass, expiration);
        allPasses[_licensePlate].push(ParkingPassInfo( _studentAddress, _make, _model, _licensePlate, _pass, expiration));

    }

    // Function to get the most recent pass for a vehicle
    function getMostRecentPass(string memory _licensePlate) public view
        returns (address studentAddr, string memory make, string memory model, string memory licensePlate, uint passType, uint256 expiration)
    {
        return (
            mostRecentPass[_licensePlate].studentAddress,
            mostRecentPass[_licensePlate].make,
            mostRecentPass[_licensePlate].model,
            mostRecentPass[_licensePlate].licensePlate,
            mostRecentPass[_licensePlate].passType,
            mostRecentPass[_licensePlate].expiration
        );
    }

    // Function to get all passes for a vehicle
    function getAllPasses(string memory _licensePlate)public view returns (ParkingPassInfo[] memory)
    {
        return allPasses[_licensePlate];
    }

}
