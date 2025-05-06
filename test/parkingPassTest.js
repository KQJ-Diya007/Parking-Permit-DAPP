const ParkingPass = artifacts.require("ParkingPass");

contract("ParkingPass", (accounts) => {
  const student = accounts[1];
  const admin = accounts[0];
  const licensePlate = "ABC123";

  it("should allow a student to buy a permit", async () => {
    const instance = await ParkingPass.deployed();

    await instance.buyPass(
      student,
      "Toyota",
      "Camry",
      licensePlate,
      1, // daily pass
      { from: student, value: web3.utils.toWei("1", "ether") }
    );

    const pass = await instance.getMostRecentPass(licensePlate);
    assert.equal(pass.studentAddr, student, "Student address mismatch");
  });

  it("should allow a student to renew a permit", async () => {
    const instance = await ParkingPass.deployed();

    await instance.renewPermit(
      licensePlate,
      10, // add 10 seconds
      { from: student, value: web3.utils.toWei("0.001", "ether") }
    );

    const pass = await instance.getMostRecentPass(licensePlate);
    assert.isAbove(Number(pass.expiration), 0, "Expiration should be extended");
  });

  it("should allow admin to invalidate a permit", async () => {
    const instance = await ParkingPass.deployed();

    // Just check that admin can call invalidate
    const tx = await instance.invalidatePass(student, { from: admin });

    assert.isTrue(tx.receipt.status, "Invalidate transaction should succeed");
  });
});
