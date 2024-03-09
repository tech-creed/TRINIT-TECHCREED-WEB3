// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract IdentityVerification {
    enum VerificationStatus {
        Pending,
        Approved,
        Rejected
    }

    uint256 public documentCount = 0;

    struct Document {
        string ipfsUrl;
        VerificationStatus status;
        address submittedBy;
        address verifiedBy;
    }

    mapping(address => Document) public documents;
    address[] public users;

    modifier onlyPendingVerification(address user) {
        require(documents[user].status == VerificationStatus.Pending, "IdentityVerification: Document not pending verification");
        _;
    }

    function submitDocument(string memory ipfsUrl) external {
        require(bytes(ipfsUrl).length > 0, "IdentityVerification: IPFS URL cannot be empty");
        require(documents[msg.sender].submittedBy == address(0), "IdentityVerification: Document already submitted");

        documents[msg.sender] = Document({
            ipfsUrl: ipfsUrl,
            status: VerificationStatus.Pending,
            submittedBy: msg.sender,
            verifiedBy: address(0)
        });

        documentCount++;
        users.push(msg.sender);
    }

    function verifyDocument(address user, VerificationStatus status) external onlyPendingVerification(user) {
        documents[user].status = status;
        documents[user].verifiedBy = msg.sender;
    }
}
