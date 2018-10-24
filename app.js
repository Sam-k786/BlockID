//initializing
var Web3 = require('web3');
var fs = require('fs');
var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/c3e5ff7e41d34e45bd5e4338a8f6806a"));
var EthereumTx = require('ethereumjs-tx');
var express = require('express');
var app = express();
var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine","ejs");
var sigUtil = require('eth-sig-util');
var cors = require('cors');

app.use(cors());

//static files 

app.use('/public', express.static('public'));

//contract declaration
web3.eth.defaultAccount = '0x514e011e0Ce512c06E23E192A0469f448b0F52ce';
var privKey = "3D6A8A4B7B59F3EFC165B58B8AD9004DF7828F81B793E44601DB08AFAB83405E";
var abi = JSON.parse(fs.readFileSync('./UserAbi.json'));
var address = '0xec5c6F39979fA319Fb76C0b8643324A7c9Ccd125';
//var UserProfileContract =new web3.eth.Contract(abi,contractAddress);
//console.log(UserProfileContract);

//Currently using this random Username. 
//But actually we will have to retrieve the account username from the front end.
//var userAddress = '0x87eE894DEE0c8e936a7B15158F3f14E2d11316D1';

app.get("/",function(req,res){
    console.log("Home Page...");
    res.render('index.ejs');
});
//retrieving data from the user
app.get("/getData",function(req,res){
    console.log("Getting data...");
    console.log(req.body);

    res.send("The data has been uploaded");
});

app.post("/getData",function(req,res){
     //inserting value in the contract;
     var userAddress = req.body.address;
     var bod = req.body;
     var hashedPassword = sigUtil.typedSignatureHash([{ type: 'string', name: 'Message', value: bod.password}]);
     var password = Buffer.from(hashedPassword,'hex');
     var fingerprint = Buffer.from(bod.fingerprint,'hex');
     var email = Buffer.from(bod.email,'hex');
     var phone = Buffer.from(bod.phone,'hex');
     var perAddr = Buffer.from(bod.perAddr,'hex');
     var country = Buffer.from(bod.country,'hex')
     var name = Buffer.from(bod.name,'hex')
     var dob = Buffer.from(bod.dob,'hex');
    //  res.header('Access-Control-Allow-Origin', '*');
    //  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
        web3.eth.getTransactionCount(web3.eth.defaultAccount,(err,nonce) => {
            if(err){
                console.log("err0:"+err);
                res.status(500).send(err);
            }
            console.log("nonce value is"+nonce);
            const contract = new web3.eth.Contract(abi, address, {
                from: web3.eth.defaultAccount ,
                    gas: 3000000,
            });
            const functionAbi = contract.methods.setUserData(userAddress,password,fingerprint,email,phone,perAddr,country,name,dob).encodeABI();
            var details = {
                "nonce": nonce,
                "gasPrice": web3.utils.toHex(web3.utils.toWei('47', 'gwei')),
                "gas": 300000,
                "to": address,
                "value": 0,
                "data": functionAbi,
                };
            const transaction = new EthereumTx(details);
            transaction.sign(Buffer.from(privKey,'hex'));
            var rawdata = '0x' + transaction.serialize().toString('hex');
            web3.eth.sendSignedTransaction(rawdata,(err,txHash) => {
                if(err){
                    console.log(err);
                    res.status(500).send(err);
                }
                console.log("txhash",txHash);
                res.status(200).send(txHash);
            });
        });
        
        
    

    /*UserProfileContract.methods.getUserData(userAddress).call({from:userAddress},function(err,result){
    if(err){
        console.log(err);
        }
    //0-Name, 1-DOB, 2-Email, 3-Email, 4-Username, 5-Password
        console.log(result);
    });*/

});

app.listen(8005,function(){
    console.log("Server running on the port 8000");
});



