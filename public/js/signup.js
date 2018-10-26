
$(document).ready(function(){

	/*
  	Validation part
  */
  		$('#address_error').hide();
        $('#email_error').hide();
        $('#phone_error').hide();
        $('#password_error').hide();
        $('#country_error').hide();
        
        var address_error = false;
        var name_error = false;
        var email_error = false;
        var phone_error = false;
        var password_error = false;
        var country_error = false;
        $('#name').focusout(function(){
        	check_name();
        });
        $('#email').focusout(function(){
            check_email();
        });
        $('#phone').focusout(function(){
            check_phone();
        });
        $('#password, #password2').focusout(function(){
            check_password();
        });
        $('#country_error').focusout(function(){
            check_country();
        });

        function check_name() {
        	var name = $('#name').val();
        	//name.trim();
        	if(name!='') {
        		$('#name_error').hide();
        	}
        	else {
        		$('#name_error').html("Name field cannot be empty");
        		$('#name_error').show();
        		name_error=true;	
        	}
        }
        function check_email() {
            var pattern = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9})$/;
            var email = $('#email').val().trim();
            if(pattern.test(email)&&email!='') {
                $('#email_error').hide();
            }
            else {
                $('#email_error').html("Invalid email address");
                $('#email_error').show();
                email_error=true;
            }
        }
        function check_phone() {
            var pattern = /^((\+[1-9]{1,4}[ \-]*)|(\([0-9]{2,3}\)[ \-]*)|([0-9]{2,4})[ \-]*)*?[0-9]{3,4}?[ \-]*[0-9]{3,4}?$/;
            var phone = $('#phone').val().trim();
            if(pattern.test(phone)&&phone!='') {
                $('#phone_error').hide();
            }
            else {
                $('#phone_error').html("Invalid phone number");
                $('#phone_error').show();
                phone_error=true;
            }
        }
        function check_password() {
            var password = $('#password').val();
            var password2 = $('#password2').val();
            if(password!='' && password2!='') {
                if(password == password2) {
                    $('#password_error').hide();
                }
                else {
                    $('#password_error').html("Passwords do not match");
                    $('#password_error').show();
                    password_error=true;
                }
            }
            
        }
        function check_country() {
            var country = $('#country').val();
            var temp=country.trim();
            if(temp!='') {
                $('#country_error').hide();
            }
            else {
                $('#country_error').html("Enter country name");
                $('#country_error').show();
                country_error=true;
            }
        }

        /*
        	Validation ends...
        */


  $(".form-wrapper .button").click(function(e){
    
    e.preventDefault();
                    
    var button = $(this);
    var currentSection = button.parents(".section");
    var currentSectionIndex = currentSection.index();
    var account_add = $('#account_add').val();
    var valid_add = false;
    // if(currentSectionIndex==0) {
    // 	$.ajax({
    // 		type: "POST",
    // 		url: "www.google.com",
    // 		data: { address : account_add },
    // 		success: function() {
    // 			alert("address sent!");
    // 		},
    // 		error: function() {
    // 			alert("error");
    // 		}
    // 	});
    // }
    // else {
    // 	var headerSection = $('.steps li').eq(currentSectionIndex);
	   //  currentSection.removeClass("is-active").next().addClass("is-active");
	   //  headerSection.removeClass("is-active").next().addClass("is-active");

	   //  $(".form-wrapper").submit(function(e) {
	   //    e.preventDefault();
	   //  });

	   //  if(currentSectionIndex === 2){
	   //    $(document).find(".form-wrapper .section").first().addClass("is-active");
	   //    $(document).find(".steps li").first().addClass("is-active");
	   //  }
    // }

    	if(currentSectionIndex==0) {
    		// $.ajax({
	    	// 	type: "POST",
	    	// 	url: "www.google.com",
	    	// 	data: { address : account_add },
	    	// 	success: function() {
	    	// 		alert("address sent!");
	    	// 	},
	    	// 	error: function() {
	    	// 		alert("error");
	    	// 	}
    		// });

    		//remove below line when calls work
    		valid_add=true;
    		if(valid_add) {
    			var headerSection = $('.steps li').eq(currentSectionIndex);
				    currentSection.removeClass("is-active").next().addClass("is-active");
				    headerSection.removeClass("is-active").next().addClass("is-active");

				    

				    if(currentSectionIndex === 2){
				      $(document).find(".form-wrapper .section").first().addClass("is-active");
				      $(document).find(".steps li").first().addClass("is-active");
				    }
    		}

    	}
    	else {
    		var headerSection = $('.steps li').eq(currentSectionIndex);
		    currentSection.removeClass("is-active").next().addClass("is-active");
		    headerSection.removeClass("is-active").next().addClass("is-active");

		    
		    if(currentSectionIndex === 2) {
		      $(document).find(".form-wrapper .section").first().addClass("is-active");
		      $(document).find(".steps li").first().addClass("is-active");
		    }
		    if(currentSectionIndex==1) {
		    	$('.submit').click(function() {
		    		email_error=false;
		    		password_error=false;
		    		phone_error=false;
		    		check_email();
		    		check_password();
		    		check_phone();
                    check_country();
		    		if(!name_error & !email_error && !password_error && !phone_error && !country_error) {
		    			var account_add = $('#account_add').val();
		    			var name  = $('#name').val();
		    			var email = $('#email').val();
		    			var password = $('#password').val();
		    			var phone = $('#phone').val();
                        var country = $('#country').val();
		    			$.ajax({
		    				type:'POST',
		    				url: '',
		    				data: {account_add: account_add, name: name, email: email, password: password,phone: phone,country: country},
		    				success: function() {
		    					alert("Values sent!");
		    				},
		    				error: function() {
		    					alert("Error :(");
		    				}
		    			});
		    		}
		    	});
		    }
    	}
    
  });



  


        


    //     $('.mailbtn').click(function() {
    //         name_error=false;
    //         email_error=false;
    //         phone_error=false;
    //         message_error=false;
    //         check_name();
    //         check_email();
    //         check_phone();
    //         check_message();
    //         if(name_error==false && email_error==false && phone_error==false && message_error==false) {
    //             var name = $('#name').val();
    //             var email = $('#email').val();
    //             var phone = $('#phone').val();
    //             var message = $('#message').val();
    //             $('.result').css("display","block");
                    
    //             $.ajax({
    //                 type: "POST",
    //                 url:'form_action.php',
    //                 data: {name : name, email : email, phone : phone, message : message},
    //                 success: function() {
				// 	alert("Message Sent!");
				// }
    //             });
    //         }
    //         else {
    //             alert("Please fill the form correctly.");
    //         }
    //     });


    /*
		Random Fingerprint
    */
    function randomFingerprint() {
	  var fingerprint = "";
	  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	  for (var i = 0; i < 32; i++)
	    fingerprint += possible.charAt(Math.floor(Math.random() * possible.length));

	  return fingerprint;
	}
	$('#fingerprint').val(randomFingerprint());

});


