$(document).ready(function(){
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3js = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    //web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  $("#abc").click(function(e){
    e.preventDefault();
    let address = $("#address").val();
    let password = $("#password").val();
    let fingerprint = $("#fingerprint").val();
    let email = $("#email").val();
    let phone = $("#phone").val();
    let perAddr = $("#perAddr").val();
    let country = $("#country").val();
    let name = $("#name").val();
    let dob = $("#dob").val();
  
    let msgParams = [
      {
        type: 'bytes32',      // Any valid solidity type
        name: 'Message',     // Any string label you want
        value: password
      }
    ]
  
    var from = $("#address").val();
  
    var params = [msgParams, from]
    var method = 'eth_signTypedData'
  
    //console.log("Hash is ");
    //console.log(sigUtil.typedSignatureHash(msgParams));
  
    web3.currentProvider.sendAsync({
      method,
      params,
      from,
    }, function (err, result) {
      if (err) return console.error(err)
      if (result.error) return console.error(result.error)
    

      var finalResult = {
        signature : result.result,
        address:address,
        password:password,
        fingerprint: fingerprint,
        email:email,
        phone:phone,
        perAddr:perAddr,
      country:country,
        name:name,
        dob:dob

      };
    //  var signaturePost =  $.post( "/getData",{signature : result.result,from : from } );
    //  signaturePost.done(function(data){
    //    console.log("success");
    //    console.log(data);
    //  })
     $.ajax({
       type:"POST",
       url:"http://localhost:8005/getData",
       data:finalResult,
       success: function(data){
          console.log("ppppp");
       },
       error: function(err){
          console.log(err);
       }
      });
    });
  });
});