pragma solidity ^0.4.0;
contract UserProfile{

    struct User {
        string name;
        string dob;
        string email;
        string username;
        string password;
    }
    address private master;
    mapping(address => User) private users;
    
    
    constructor() public{
        master = msg.sender;
    }

    function getUserData(address addr) public view returns(string,string,string,string,string){
        require(msg.sender == master || msg.sender == addr);
        return (users[addr].name,users[addr].dob,users[addr].email,users[addr].username,users[addr].password);
    }

    function setUserData(address addr,string name,string dob,string email,string username,string password) public {
        require(msg.sender == master || msg.sender == addr);
        users[addr].name = name;
        users[addr].dob = dob;
        users[addr].email = email;
        users[addr].username = username;
        users[addr].password = password;
    }



}