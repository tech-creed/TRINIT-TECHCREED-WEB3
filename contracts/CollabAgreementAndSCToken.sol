// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CollaborationAgreement is ERC20 {
    enum AgreementStatus {
        Pending,
        Active,
        Completed,
        Cancelled
    }

    struct Agreement {
        string terms;
        AgreementStatus status;
        address creator;
        address[] collaborators;
        uint256 requiredTokens;
    }

    mapping(uint256 => Agreement) public agreements;
    uint256 public agreementCount;
    uint256 public tokenPrice;

    constructor() ERC20("SkillCollabToken", "SCT") {
        tokenPrice = 1 ether;
    }

     function setTokenPrice(uint256 newPrice) external {
        require(newPrice > 0, "Token price must be greater than zero");
        tokenPrice = newPrice;
    }

    function createAgreement(
        string memory terms,
        uint256 requiredTokens
    ) external {
        require(requiredTokens > 0, "Required tokens must be greater than zero");
        agreementCount++;
        agreements[agreementCount] = Agreement({
            terms: terms,
            status: AgreementStatus.Pending,
            creator: msg.sender,
            collaborators: new address[](0),
            requiredTokens: requiredTokens
        });
    }

    function signAgreement(uint256 agreementId) external {
        require(agreementId <= agreementCount && agreementId > 0, "Invalid agreement ID");
        require(
            agreements[agreementId].status == AgreementStatus.Pending,
            "Agreement is not open for signatures"
        );
        require(
            balanceOf(msg.sender) >= agreements[agreementId].requiredTokens,
            "Insufficient tokens to sign the agreement"
        );

        agreements[agreementId].collaborators.push(msg.sender);
    }

    function buyTokens() external payable {
        require(msg.value > 0, "Must send ETH to purchase tokens");

        uint256 tokensPurchased = msg.value / tokenPrice;
        require(tokensPurchased > 0, "Insufficient ETH sent to purchase tokens");

        _mint(msg.sender, tokensPurchased);
    }

    function provideContributionTokens(uint256 agreementId, uint256 amount) external {
        require(agreementId <= agreementCount && agreementId > 0, "Invalid agreement ID");
        require(
            agreements[agreementId].status == AgreementStatus.Active,
            "Agreement is not active"
        );
        require(msg.sender == agreements[agreementId].creator, "Only the creator can contribute");

        for (uint256 i = 0; i < agreements[agreementId].collaborators.length; i++) {
            _transfer(agreements[agreementId].creator, agreements[agreementId].collaborators[i], amount);
        }
    }

    function isCollaborator(uint256 agreementId, address user) internal view returns (bool) {
        for (uint256 i = 0; i < agreements[agreementId].collaborators.length; i++) {
            if (agreements[agreementId].collaborators[i] == user) {
                return true;
            }
        }
        return false;
    }
}
