// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract UserRegistration {
    struct User {
        string username;
        string email;
        string role;
        address userAddress;
    }

    mapping(address => User) public users;

    event UserRegistered(address indexed userAddress, string username, string email, string role);

    function registerUser(string memory _username, string memory _email, string memory _role) public {
        address newUserAddress = msg.sender;
        users[newUserAddress] = User(_username, _email, _role, newUserAddress);
        emit UserRegistered(newUserAddress, _username, _email, _role);
    }   

    function isUserExists(address _userAddress) external view returns (bool) {
        return users[_userAddress].userAddress != address(0);
    }
}
