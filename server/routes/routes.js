const express = require("express");
const router = express.Router();
const users = require("../models/users.js");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/checkAuth.js');
const Web3 = require('web3');
const fs = require('fs');
const EthereumTx = require('ethereumjs-tx');
const sigUtil = require('eth-sig-util');

var web3 = new Web3(new Web3.providers.HttpProvider("https://ropsten.infura.io/v3/c3e5ff7e41d34e45bd5e4338a8f6806a"));
/* contract declaration */
web3.eth.defaultAccount = '0x514e011e0Ce512c06E23E192A0469f448b0F52ce';
var privKey = "3D6A8A4B7B59F3EFC165B58B8AD9004DF7828F81B793E44601DB08AFAB83405E";
var abi = JSON.parse(fs.readFileSync('./UserAbi.json'));
var address = '0xec5c6F39979fA319Fb76C0b8643324A7c9Ccd125';

router.post('/signup',(req,res,next) => {
    users
        .find({accountAddr: req.body.address})
        .exec()
        .then((user) => {
            if(user && user.length>0){
                return res.status(200).json({
                    status: "fail",
                    message: "The user already exists!"
                });
            }
            //inserting value in the contract
            var bod = req.body;
            var userAddress = bod.address;
            var hashedPassword = sigUtil.typedSignatureHash([{ type: 'string', name: 'Message', value: bod.password}]);
            var password = Buffer.from(hashedPassword,'hex');
            var fingerprint = Buffer.from(bod.fingerprint,'hex');
            var email = Buffer.from(bod.email,'hex');
            var phone = Buffer.from(bod.phone,'hex');
            var perAddr = Buffer.from(bod.perAddr,'hex');
            var country = Buffer.from(bod.country,'hex')
            var name = Buffer.from(bod.name,'hex')
            var dob = Buffer.from(bod.dob,'hex');
            web3.eth.getTransactionCount(web3.eth.defaultAccount,(err,nonce) => {
                if(err){
                    console.log('err1',err);
                    res.status(500).json({
                        status: "fail",
                        message: err
                    });
                }
                console.log("Nonce value is "+nonce);
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
                web3.eth.sendSignedTransaction(rawdata,(error,txHash) => {
                    if(error){
                        console.log('err2',error);
                        res.status(500).json({
                            status: "fail",
                            message: error
                        });
                    }
                    console.log("TxHash: ",txHash);
                    res.status(200).json({
                        status: "success",
                        message: "Account created successfully!"
                    });
                });
            });
        })
        .catch((err) => {
            console.log('catch',err);
            res.status(500).json({
                status: "fail",
                message: err
            });
        });
});

router.post('/login',(req, res, next) => {

});

router.get('/transactions', checkAuth, (req, res, next) => {

});

router.get('/profile', checkAuth, (req, res, next) => {

});
