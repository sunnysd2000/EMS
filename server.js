
const express= require('express')
const app =express()
const Web3 = require('web3');
const mongodb = require('mongodb').MongoClient
const artifacts=require('./build/contracts/Evidences.json')
const contract=require("@truffle/contract");
const {spawn} =require('child_process');
const truffle_connect = require('./app.js');
const bodyParser = require('body-parser');
const path= require('path');
const evidence_artifact = require('./build/contracts/Evidences.json');
var Evidence = contract(evidence_artifact);
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());
app.set('view engine','ejs');
app.use(express.static("public"));

const port =8082;

// db=mongodb.ems;
// result= db.evidences.insertOne({'caseno':1,'evidno':2,'timestamp': Date.now()})
// var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
app.get('/',function(req,res){
  // res.render("login");
  truffle_connect.start(function(answer){
    res.render('home',{data:answer});

  })
  // res.render("home",{StartingContent:homeStartingContent,posts:posts});  // contents from the homeStartingContent is passed to StartingContent.
//res.render("whichPage",{key:value})
});
app.get("/about",function(req,res){
  res.render("about",{aboutContent_ejs:aboutContent});  // contents from the homeStartingContent is passed to StartingContent.
//res.render("whichPage",{key:value})
});

app.get("/contact",function(req,res){
  truffle_connect.start(function(answer){
    res.render("contact",{data:answer})
  })
 // contents from the homeStartingContent is passed to StartingContent.
//res.render("whichPage",{key:value})
});

app.get("/addEvidence",function(req,res){
  truffle_connect.start(function(answer){
    res.render("addEvidence",{data:answer});
  })
  
});

app.get("/showEvd",function(req,res){
  //Evidence.setProvider(web3.currentProvider);
  truffle_connect.start(function(answer){
    truffle_connect.getEvidences(function(answer1){
      res.render("showEvd",{data:answer,rows:answer1});
  })
  
  })

  //res.render("showEvd",{data:y});
});


// app.get('/',function(req, res){
//    console.log("**** GET /getAccounts ****");
//    truffle_connect.start(function(ans){
//      res.send(ans);
//    })
//  });
//  app.get('/getEvidences', function(req, res){   
   
// });
app.get('/getOriginal',function(req,res){
  var data1,capsule,decrypt;

  truffle_connect.getEvidences(function(answer){ 
    data1= "b'ZX\\xf7\\xe1\\xe5\\x0c\\x0b\\xfb\\xf2c\\xc0\\x1b{\\x86\\xc3L\\xe5\\x15\\xab\\x98\\xe8B\\xf9\\xdb\\xc7\\r8|\\x9c\\x96\\xc6\\x8e\\x84\\x908a5\\x06\\xc26\\xe1,\\xdd_\\xbfz\\xd5h{\\xfc'\r\n",
    capsule= "Capsule:02dd763a8e64c7a4";
    // spawn new child process to call the python script
    const python = spawn('python', ['process1.py',data1,capsule]);
    // collect data from script
    python.stdout.on('data', function (data) {
      console.log('Pipe data from python script ...');
      decrypt = data.toString();
      console.log(decrypt)
    })
    // in close event we are sure that stream from child process is closed
    python.on('close', (code) => {
      console.log(`child process close all stdio with code ${code}`);
      res.send(decrypt)
    });


    
  });
  

});

app.post('/addEvid', function(req, res){ 
  //console.log(req.body);
  // var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

  var caseno= req.body.caseno;
   var evidno= req.body.evidno;
   var data= req.body.data;
   var owner= req.body.owner;
   var dataToSend;
   const arr=[];
  console.log(req.body)
  // spawn new child process to call the python script
  
  const python = spawn('python', ['process.py',data]);
  // collect data from script
  python.stdout.on('data', function (data) {
   console.log('Pipe data from python script ...');
   dataToSend = data.toString()
   console.log(dataToSend.split(" ")[0])
   var capsule=dataToSend.split(" ")[0]
   var data1= dataToSend.split(" ")[1]
  //  arr.push(capsule)
  //  arr.push(data1)
  truffle_connect.start(function (answer) {
    console.log(answer[0]); 
    truffle_connect.createEvidences(answer[0] ,
      caseno,evidno,data1,capsule,owner, (answer) => {
      console.log("hello")
  });
  })
})

  
  
  // });
  // in close event we are sure that stream from child process is closed
  python.on('close', (code) => {
  console.log(`child process close all stdio with code ${code}`);
  })
  res.redirect('/showEvd')
});


app.listen(port, () => {

   // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
   truffle_connect.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
   // console.log(truffle_connect.web3)
   console.log("Express Listening at http://localhost:" + port);
 
 });

   
