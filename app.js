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
web3.eth.defaultAccount = '0x8d94f5549ec081d77acfae6a0b42692fed75d52f';
var privKey = "5D511D4051388235C03AA1D49A847A91269864EAFFFE753FFC0ACD7F685C75C9";
var abi = JSON.parse(fs.readFileSync('./UserAbi.json'));
var address = '0xeea4d4a04d2c01d0402151538e0300753298ceb4';
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
     //var hashedPassword = web3.utils.keccak256("\x19Ethereum Signed Message:\n5"+ bod.password);
     //var password =web3.utils.fromAscii(bod.password);
     let msgParams = [
        {
          type: 'bytes32',      // Any valid solidity type
          name: 'Message',     // Any string label you want
          value: bod.password
        }
      ]
     var password =  sigUtil.typedSignatureHash(msgParams);
     var fingerprint = web3.utils.fromAscii(bod.fingerprint);
     var email = web3.utils.fromAscii(bod.email);;
     var phone = web3.utils.fromAscii(bod.phone);
     var perAddr = web3.utils.fromAscii(bod.perAddr);
     var country = web3.utils.fromAscii(bod.country);
     var name = web3.utils.fromAscii(bod.name);
     var dob = web3.utils.fromAscii(bod.dob);

     console.log(password,fingerprint,email,phone,perAddr,country,name,dob,bod.signature);



    //console.log(sigUtil.typedSignatureHash(msgParams));
    //console.log(sigUtil.recoverTypedSignature({ data: msgParams, sig: bod.signature }));



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
                "gasPrice": web3.utils.toHex(web3.utils.toWei('70', 'gwei')),
                "gas": 3000000,
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

            }).on('receipt', function(receipt){
                console.log(receipt);


                res.status(200).send(receipt);
                contract.methods.getUserData(userAddress,bod.signature).call({from:web3.eth.defaultAccount},function(err,result){
                    if(err){
                        console.log(err);
                    }
                    console.log(result);



                });

            });
        });
        //creating contract object for getting details
        /*const contract = new web3.eth.Contract(abi,address, {
            from: web3.eth.defaultAccount ,
                gas: 3000000,
        });*/


});

app.listen(8000,function(){
    console.log("Server running on the port 8000");
});
