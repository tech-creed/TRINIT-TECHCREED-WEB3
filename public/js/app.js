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
      const contractAddress = "0xE8C91930793012a5147E05CC42C1b83c0529A519";
      App.contracts.user = new web3.eth.Contract(
        UserContract.abi,
        contractAddress
      );

      const IDVerifyContract = await $.getJSON("/contracts/IdentityVerification.json");
      const IDVerifyContractAdd = "0xbCcb1Cc6B3Aa1974e247546e3fBe50E85a7d4220";
      App.contracts.verify = new web3.eth.Contract(
        IDVerifyContract.abi,
        IDVerifyContractAdd
      );

      const ProtfolioContract = await $.getJSON("/contracts/PortfolioContract.json");
      const ProtfolioContractAdd = "0xdE623787888F1cc7693B90Fe9e1be9E5C8ad259D";
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

      if(!isUserExists){
        let r = await fetch("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-type": "application/json;charset=UTF-8" },
          });
          r = await r.json();

        await App.contracts.user.methods
        .registerUser(data["name"],data["email"], data["role"] )
        .send({ from: App.account });
        alert(data["name"] + " Welcome to the Decentralized Talent Discovery Platform");
        window.location.href = `/verification`;
      }else{
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

      ResumeUpload:async()=>{
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
}