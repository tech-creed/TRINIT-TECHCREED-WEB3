App = {
    loading: false,
    contracts: {},
    account: "",

    load: async () => {
        console.log("App connecting...");
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContracts();
        return false;
    },

    loadWeb3: async () => {
        if (typeof web3 !== "undefined") {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
        } else {
            window.alert("Please connect to Metamask.");
        }
        // Modern dapp browsers...
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
                // Acccounts now exposed
                web3.eth.sendTransaction({
                    /* ... */
                });
            } catch (error) {
                // User denied account access...
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider;
            window.web3 = new Web3(web3.currentProvider);
            // Acccounts always exposed
            web3.eth.sendTransaction({
                /* ... */
            });
        }
        // Non-dapp browsers...
        else {
            console.log(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    },

    loadAccount: async () => {
        // get current account
        web3.eth
            .getAccounts()
            .then((accounts) => {
                App.account = accounts[0];
                console.log(App.account);
            })
            .catch((error) => {
                console.error(error);
            });
    },

    loadContracts: async () => {
      // users ABI
      const UserContract = await $.getJSON("/contracts/UserRegistration.json");
      const contractAddress = "0x06029a4FdAf652edBD8c15d2A0D5312C4f430DAf";
      App.contracts.user = new web3.eth.Contract(
        UserContract.abi,
        contractAddress
      );

      const IDVerifyContract = await $.getJSON("/contracts/IdentityVerification.json");
      const IDVerifyContractAdd = "0x722D203550D38CFCD8B23F1123DaC51418FE78A7";
      App.contracts.verify = new web3.eth.Contract(
        IDVerifyContract.abi,
        IDVerifyContractAdd
      );

      const ProtfolioContract = await $.getJSON("/contracts/PortfolioContract.json");
      const ProtfolioContractAdd = "0xf13fA75676c162663327f61E1791D56dd0F2FC91";
      App.contracts.portfolio = new web3.eth.Contract(
        ProtfolioContract.abi,
        ProtfolioContractAdd
      );
    },

    connectWalletRegister: async () => {
        await App.load();
        data = {};

        data["name"] = document.getElementById("register_username").value;
        data["role"] = document.getElementById("register_role").value;
        data["email"] = document.getElementById("register_email").value;
        data["wallet_id"] = App.account;

        const isUserExists = await App.contracts.user.methods.isUserExists(data["wallet_id"]).call();

        console.log(isUserExists)

        if (!isUserExists) {
            let r = await fetch("/auth/register", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json;charset=UTF-8" },
            });
            r = await r.json();

            await App.contracts.user.methods
                .registerUser(data["name"], data["email"], data["role"])
                .send({ from: App.account });
            alert(data["name"] + " Welcome to the Decentralized Talent Discovery Platform");
            window.location.href = `/verification`;
        } else {
            alert("You have already registered");
            window.location.href = `/login`;
        }
    },

    docVerify: async () => {
        await App.load();

        const form = document.getElementById("docVerifyForm");

        const formData = new FormData(form);
        try {
            const response = await fetch("/ipfs/file-upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Response:", responseData);

                await App.contracts.verify.methods
                    .submitDocument(responseData.ipfsUrl_Document)
                    .send({ from: App.account });

                alert("Your Document Submitted Successfully");
                window.location.href = `/profile`;
            } else {
                console.error("Failed to submit form");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    },

    connectWalletLogin: async () => {
        await App.load();
        data = {};
        data["wallet_id"] = App.account;

        var userOrNot = await App.contracts.user.methods.isUserExists(data["wallet_id"]).call();

        if (userOrNot) {
            var dataChain = await App.contracts.user.methods
                .users(App.account)
                .call();

            data["name"] = dataChain["username"];
            data["email"] = dataChain["email"];
            data["role"] = dataChain["role"];

            let r = await fetch("/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-type": "application/json; charset=UTF-8" },
            });
            r = await r.json();
            if (r) {
                alert(data["name"] + " Welcome to the Decentralized Talent Discovery Platform");
                window.location.href = `/profile`;
            }
        } else {
            alert("Need to register");
            window.location.href = `/register`;
        }
    },

    ResumeUpload: async () => {
        await App.load();

        const form = document.getElementById("resumeUploadForm");

        const formData = new FormData(form);
        try {
            const response = await fetch("/ipfs/resume-upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Response:", responseData);

                await App.contracts.portfolio.methods
                    .UpdatePortfolio(responseData.resumeUrl)
                    .send({ from: App.account });

                alert("Your Resume Uploaded Successfully");
            } else {
                alert("Failed to submit form");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    },
    AddSkills: async () => {
        await App.load();
        data = {};

        data["skill"] = document.getElementById("skill").value;
        data["proficiency"] = document.getElementById("proficiency").value;

        await App.contracts.portfolio.methods
        .addSkill(data["skill"],data["proficiency"] ).send({ from: App.account });
        
        alert(data["skill"] + " Skill Added");
        window.location.href = `/profile`;
      },
      FetchPublicPortfolio:async(wallet_id)=>{
        await App.load();
        var userOrNot = await App.contracts.user.methods.isUserExists(wallet_id).call();
        if (userOrNot) {
            var dataChain = await App.contracts.user.methods
                .users(wallet_id)
                .call();

                document.getElementById('card-name').innerHTML = dataChain["username"];
                document.getElementById('card-email').innerHTML = dataChain["email"];
                 document.getElementById('card-role').innerHTML = dataChain["role"];

                 document.getElementById('right-name').innerHTML = dataChain["username"];
                document.getElementById('right-email').innerHTML = dataChain["email"];
                 document.getElementById('right-role').innerHTML = dataChain["role"];

                 document.getElementById('right-wallet').innerHTML = wallet_id
        } else {
            window.location.href = `/`;
        }

        data = {};

        var data = await App.contracts.portfolio.methods
        .getPortfolio(wallet_id).call();
        
        console.log(data)

        if(data.resumeIpfsHash == ""){
          document.getElementById('resumeHref').style.display = 'none'
        }else{
          document.getElementById('resumeHref').href = data.resumeIpfsHash
        }

        var techStatus = document.getElementById('technicalStatus')
        var techNew = ''

        for (let i = 0; i < data.skills.length; i++) {
          var techNew = '<small>'+data.skills[i].name+'</small><div class="progress mb-3" style="height: 5px">' +
              '<div class="progress-bar bg-primary" role="progressbar" style="width: '+data.skills[i].proficiency+'%" aria-valuenow="'+data.skills[i].proficiency+'" aria-valuemin="0" aria-valuemax="100"></div>' +
              '</div>';
          techStatus.innerHTML += techNew;
        }

        var showProject = document.getElementById('projectShowcase')
        var techProject = ''
        
        for (let i = 0; i < data.projects.length; i++) {
          var techProject = '<div class="showcase"><div style="background: url('+data.projects[i].projectIpfsHash+');background-size: cover;background-position: center center; " class="thumbnail thumbnail--awesome"><div class="thumbnail__overlay">' +
              '<a class="btn" href="#0">DETAILS</a></div></div><div class="desc"><p>Project</p><h2>'+data.projects[i].name+'</h2><p>'+data.projects[i].description+'</p></div></div><hr>';
            showProject.innerHTML += techProject;
        }

        var showAchievement = document.getElementById('achievementShowcase')
        var techAchievement = ''
        
        for (let i = 0; i < data.achievements.length; i++) {
          if(i == 0){
            var active = 'active'
          }else{
            var active = ''

          }
          var techAchievement = '<div class="carousel-item '+active+'"><div class="row"><div class="col-md-6 mb-3"><div class="card">'+
                      '<img class="img-fluid" alt="100%x280" src="'+data.achievements[i].achievementIpfsHash+'"><div class="card-body">'+
                      '<h4 class="card-title">'+data.achievements[i].name+'</h4><p class="card-text">'+data.achievements[i].description+'</p></div></div></div></div></div>';
              showAchievement.innerHTML += techAchievement;
        }

      },
      FetchPortfolio: async()=>{
        await App.load();
        data = {};

        var data = await App.contracts.portfolio.methods
        .getPortfolio(App.account).call();
        
        console.log(data)
        document.getElementById('shareProfile').href = '/publicProfilePage/'+App.account

        if(data.resumeIpfsHash == ""){
          document.getElementById('resumeHref').style.display = 'none'
        }else{
          document.getElementById('resumeHref').href = data.resumeIpfsHash
        }

        var techStatus = document.getElementById('technicalStatus')
        var techNew = ''

        for (let i = 0; i < data.skills.length; i++) {
          var techNew = '<small>'+data.skills[i].name+'</small><div class="progress mb-3" style="height: 5px">' +
              '<div class="progress-bar bg-primary" role="progressbar" style="width: '+data.skills[i].proficiency+'%" aria-valuenow="'+data.skills[i].proficiency+'" aria-valuemin="0" aria-valuemax="100"></div>' +
              '</div>';
          techStatus.innerHTML += techNew;
        }

        var showProject = document.getElementById('projectShowcase')
        var techProject = ''
        
        for (let i = 0; i < data.projects.length; i++) {
          var techProject = '<div class="showcase"><div style="background: url('+data.projects[i].projectIpfsHash+');background-size: cover;background-position: center center; " class="thumbnail thumbnail--awesome"><div class="thumbnail__overlay">' +
              '<a class="btn" href="#0">DETAILS</a></div></div><div class="desc"><p>Project</p><h2>'+data.projects[i].name+'</h2><p>'+data.projects[i].description+'</p></div></div><hr>';
            showProject.innerHTML += techProject;
        }

        var showAchievement = document.getElementById('achievementShowcase')
        var techAchievement = ''
        
        for (let i = 0; i < data.achievements.length; i++) {
          if(i == 0){
            var active = 'active'
          }else{
            var active = ''

          }
          var techAchievement = '<div class="carousel-item '+active+'"><div class="row"><div class="col-md-6 mb-3"><div class="card">'+
                      '<img class="img-fluid" alt="100%x280" src="'+data.achievements[i].achievementIpfsHash+'"><div class="card-body">'+
                      '<h4 class="card-title">'+data.achievements[i].name+'</h4><p class="card-text">'+data.achievements[i].description+'</p></div></div></div></div></div>';
              showAchievement.innerHTML += techAchievement;
        }

      },

    AddProject: async () => {
        await App.load();
        data = {};
        const form = document.getElementById("AddProjectForm");

        const formData = new FormData(form);

        data["projectName"] = document.getElementById("projectName").value;
        data["description"] = document.getElementById("description").value;

        try {
            const response = await fetch("/ipfs/project-upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Response:", responseData);

                await App.contracts.portfolio.methods
                    .addProject(data["projectName"], data["description"], responseData.projectFileURL)
                    .send({ from: App.account });

                alert("Your project file Uploaded Successfully");
            } else {
                alert("Failed to submit form");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    },
    AddAchievement: async () => {
        await App.load();
        data = {};
        const form = document.getElementById("AddAchievementForm");

        const formData = new FormData(form);

        data["achievementName"] = document.getElementById("achievementName").value;
        data["description"] = document.getElementById("Adescription").value;

        try {
            const response = await fetch("/ipfs/achievement-upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log("Response:", responseData);

                await App.contracts.portfolio.methods
                    .addProject(data["achievementName"], data["description"], responseData.AchievementFileURL)
                    .send({ from: App.account });

                alert("Your project file Uploaded Successfully");
            } else {
                alert("Failed to submit form");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    },

    FetchVerifyList: async () => {
        await App.load();
        const documentCount = await App.contracts.verify.methods
            .documentCount()
            .call();

        tabel_body = document.getElementById("tabel-body");

        html = ''
        for (var j = 0; j <= documentCount; j++) {

            var usersWallet = await App.contracts.verify.methods.users(j).call()
            console.log(usersWallet)

            var documents = await App.contracts.verify.methods.documents(usersWallet).call();

            const getStatusText = (status) => {
                switch (status) {
                    case "0":
                        return "Pending";
                    case "1":
                        return "Approved";
                    case "2":
                        return "Rejected";
                    default:
                        return "Unknown";
                }
            };


            console.log(documents);
            const verifyStatus = getStatusText(documents[1]);
            html += `<tr>
              <th scope="row">${j + 1}</th>
              <td>${documents[2]}</td>
              <td>${documents[3]}</td>
              <td><a href="${documents[0]}" target="_blank">View Document</a></td>
              <td>${verifyStatus}</td>
              <td style="color:green;"><button onclick="App.ApprovedRequest('${documents[2]}')" class='btn'>Approve this user</button> </td>
              <td style="color:red;"><button onclick="App.RejectRequest('${documents[2]}')" class='btn'>Reject this user</button> </td>
              </tr>`;
            j += 1;
        }

        tabel_body.innerHTML = html;
    },
    ApprovedRequest: async (userID) => {
        await App.load();

        function getCookieValue(cookieName) {
            const cookies = document.cookie.split('; ');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].split('=');
                if (cookie[0] === cookieName) {
                    return cookie[1];
                }
            }
            return null;
        }

        const userRole = getCookieValue('role')
            await App.contracts.verify.methods
                .verifyDocument(userID, 1)
                .send({ from: App.account });

            window.location.href = "/adminVerification";
    },
    RejectRequest: async (userID) => {
        await App.load();

        function getCookieValue(cookieName) {
            const cookies = document.cookie.split('; ');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].split('=');
                if (cookie[0] === cookieName) {
                    return cookie[1];
                }
            }
            return null;
        }

        const userRole = getCookieValue('role')

            await App.contracts.verify.methods
                .verifyDocument(userID, 2)
                .send({ from: App.account });

            window.location.href = "/adminVerification";
    },
}

