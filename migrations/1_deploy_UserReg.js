const UserRegistration = artifacts.require("UserRegistration");

module.exports = function(deployer) {
  deployer.deploy(UserRegistration);
};