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

    constructor() ERC20("SkillCollabToken", "SCT") {}

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

        _mint(msg.sender, requiredTokens);
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

    function isCollaborator(uint256 agreementId, address user) internal view returns (bool) {
        for (uint256 i = 0; i < agreements[agreementId].collaborators.length; i++) {
            if (agreements[agreementId].collaborators[i] == user) {
                return true;
            }
        }
        return false;
    }
}
