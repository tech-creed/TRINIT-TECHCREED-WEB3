const CollaborationAgreement = artifacts.require("CollaborationAgreement");

module.exports = function(deployer) {
  deployer.deploy(CollaborationAgreement);
};