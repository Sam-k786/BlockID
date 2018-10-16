//initializing
var Web3 = require('web3');
var fs = require('fs');
var web3 = new Web3('http://localhost:8545');

//contract declaration
var abi = JSON.parse(fs.readFileSync('./abi.json'));
var contractAddress = '0x8996ba2A180dB63a35E67def466F913e53b42bB9';
var UserProfileContract =new web3.eth.Contract(abi,contractAddress);
//console.log(UserProfileContract);

//Currently using this random Username. 
//But actually we will have to retrieve the account username from the front end.
var userAddress = '0xBd6d84306a37993180E61a6415fa487db9795c12';

//inserting value in the contract;

/*UserProfileContract.methods.setUserData(userAddress,"Name","01121998","email","kgiugiuviuv","pswd").send({from:userAddress,gas:3000000},function(err,result){
    if(err){
        console.log(err);
    }
    //console.log(result);
}).then(function(receipt){
    console.log(receipt)
});*/

//getting the value
UserProfileContract.methods.getUserData(userAddress).call({from:"0xBd6d84306a37993180E61a6415fa487db9795c12"},function(err,result){
    if(err){
        console.log(err);
    }
    //0-Name, 1-DOB, 2-Email, 3-Email, 4-Username, 5-Password
    console.log(result[3]);
});


