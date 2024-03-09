// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PortfolioContract {
    struct Portfolio {
        string resumeIpfsHash;
        Skill[] skills;
        Project[] projects;
        Achievement[] achievements;
    }

    struct Skill {
        string name;
        string proficiency;
    }

    struct Project {
        string name;
        string description;
        string projectIpfsHash;
    }

    struct Achievement {
        string name;
        string description;
        string achievementIpfsHash; 
    }

    mapping(address => Portfolio) public portfolios;

    function UpdatePortfolio(string memory resumeIpfsHash) external {
        portfolios[msg.sender].resumeIpfsHash = resumeIpfsHash;
    }

    function addSkill(string memory name, string memory proficiency) external {
        Skill memory newSkill = Skill({ name: name, proficiency: proficiency });
        portfolios[msg.sender].skills.push(newSkill);
    }

    function addProject(string memory name, string memory description, string memory projectIpfsHash) external {
        Project memory newProject = Project({
            name: name,
            description: description,
            projectIpfsHash: projectIpfsHash
        });
        portfolios[msg.sender].projects.push(newProject);
    }

    function addAchievement(
        string memory name,
        string memory description,
        string memory achievementIpfsHash
    ) external {
        Achievement memory newAchievement = Achievement({
            name: name,
            description: description,
            achievementIpfsHash: achievementIpfsHash
        });
        portfolios[msg.sender].achievements.push(newAchievement);
    }

    function getPortfolio(address user) external view returns (Portfolio memory) {
        return portfolios[user];
    }
}