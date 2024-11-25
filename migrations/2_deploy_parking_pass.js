const ParkingPass = artifacts.require("ParkingPass");

module.exports = function (deployer) {
    deployer.deploy(ParkingPass);
};