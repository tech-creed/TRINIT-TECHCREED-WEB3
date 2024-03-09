const PortfolioContract = artifacts.require("PortfolioContract");

module.exports = function(deployer) {
  deployer.deploy(PortfolioContract);
};