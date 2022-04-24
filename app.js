const contract = require('@truffle/contract');

const evidence_artifact = require('./build/contracts/Evidences.json');
var Evidence = contract(evidence_artifact);

module.exports = {
  start: function(callback) {
    var self = this;

    Evidence.setProvider(self.web3.currentProvider);
    //self.web3.eth.defaultAccount='0x0B83A832C9C237d3D5D0FEA20b0F2Fac3B0685Cb';
    
     self.web3.eth.getAccounts( function(err, accs) {
      if (err) {
        console.log("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        console.log("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }
      self.accounts = accs;
      self.account = self.accounts[0];

      callback(self.accounts);
    });

  },
  getEvidences: function(  callback) {
    var self = this; 
    Evidence.setProvider(self.web3.currentProvider); 
    var meta;
    Evidence.deployed().then(function(instance) {
      meta = instance;
      const a=[];
      for(var i=1;i<=10;i++){
        a[i-1]=meta.evidarray(i)
      }
      const res=Promise.all(a);
      return res;
    }).then(function(value) {
        callback(value );
    }).catch(function(e) {
        console.log(e);
        callback("Error 404");
    });
  },
 
  createEvidences: function(sender,caseno ,evidno,data,capsule,owner, callback) {
    var self = this;
    Evidence.setProvider(self.web3.currentProvider);

    var meta;
    Evidence.deployed().then(function(instance) {
      meta = instance;
      return meta.createEvidence(caseno,evidno,data,capsule,owner, {from:sender});
    }).then(function() {
      self.getEvidences(  function (answer) {
        callback(answer);
      });
    }).catch(function(e) {
      console.log(e);
      callback("ERROR 404");
    });
  },
  
  
}