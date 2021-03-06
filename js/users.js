$( document ).ready(function() {
    $( ".successMessage" ).slideDown(300).delay(2000).slideUp(300);
    $( ".errorMessage" ).slideDown(300);

	users_table = $('#userstable').DataTable({
		"bLengthChange": false,
		"pagingType": "numbers",
		"pageLength": 10,
		"info":     true,
		"searching": true,
		 "language": {
	        "emptyTable": "No users found, create one using the button above.",
	        "info":           "Showing _START_ - _END_ of _TOTAL_ entries",
	        "search": "_INPUT_",
        	"searchPlaceholder": "Search",
	    },
		"columns": [
		    null,
		    null,
		    null,
		    { "orderable": false },
		    { "orderable": false },
		    { "orderable": false },
		],
	});
			

    //bind new user button
    $('#newUserBtn').click(function(){
		bootbox.dialog({
			message: "<h3>Add a new user</h3><hr><form id='newUserForm' action='/createuser' method='post'>\
		     <label for='email'>Email Address</label><br><span id='noblankemail' class='text-danger' hidden>Email cannot be blank.</span><br><input id='email' name='email' autocomplete='off' placeholder='you@server.com' class='form-control' type='text' /><br/>\
		     <label for='password'>Password</label><br><span id='noblankpassword' class='text-danger' hidden>Password cannot be blank.</span><br><input id='password' name='password' autocomplete='off' placeholder='Password' class='form-control' type='password' />\
		    <br>\
		    <input id='admin' name='admin' type='checkbox' style='margin-right:10px'>Admin\
		    </form>",
			closeButton: false,
			buttons: {
				confirm: {
					label: 'Add User',
					className: 'btn-success pull-right',
					callback: function() {
						var emailEmpty = $('#email').val() == '';
						var passwordEmpty = $('#password').val() == '';
						if(!emailEmpty && !passwordEmpty){					
	                    	$('#newUserForm').submit();
						} else {
							emailEmpty ? $('#noblankemail').show() : $('#noblankemail').hide(); 
							passwordEmpty ? $('#noblankpassword').show() : $('#noblankpassword').hide(); 
							return false;
						}
					}
				},
				cancel: {
					label: 'Cancel',
					className: 'btn-link',
					callback: function() {
						return;
					}
				}
			},
		});
	});
	$('#userstable').on( "click",'.grant-admin', function(event) {
		event.preventDefault();
		var userID = $(this).data("userid");
		window.location.href = '/grantadmin/'+userID+'/'
	});

	$('#userstable').on( "click",'.revoke-admin', function(event) {
		event.preventDefault();
		var userID = $(this).data("userid");
		window.location.href = '/revokeadmin/'+userID+'/'
	});

    //bind delete user link
	$('#userstable').on( "click",'.text-danger', function(event) {
		event.preventDefault();
		var userID = $(this).data("userid");
		var email = $(this).data("email");
	    bootbox.confirm({
	    	size: 'small',
	    	closeButton: false,
		    message: "<b>Delete "+email+"?</b><br>This will also delete any studies created by this user.",
		    buttons: {confirm: {label: 'Delete User',className: 'btn-danger'},
	        		  cancel: {label: 'Cancel',className: 'btn-default'}
		    },
		    callback: function (result) {
		    	if(result){
		    		window.location.href = '/deleteuser/'+userID+'/'
		    	}
		    }
		});
	});
	//bind password reset link
	$('#userstable').on( "click",'.passwordreset', function(event) {
		event.preventDefault();
		var userid = $(this).data("id");
		var email = $(this).data("email");
		bootbox.dialog({
			message: "<h3>Reset password</h3><hr>\
		     <label for='password1'>New Password</label><br>\
		     <span id='noblank' class='text-danger' hidden>Password cannot be blank.</span><br>\
		     <input id='password1' name='password1' autocomplete='off' class='form-control' type='password' />\
		     <br/>",
 			backdrop: true,
			closeButton: false,
			buttons: {
				confirm: {
					label: 'Reset Password',
					className: 'btn-warning pull-right',
					callback: function() {
						if(!$('#password1').val()== ''){
							$.post({
								url: "/resetpassword",
								type: "POST",
								data: JSON.stringify({userid: userid, password: $('password1').val()}),
								contentType: "application/json",
				                success: function (data) {
				                    	$("#password-reset-success").fadeTo(2750, 500).slideUp(500);
				                }
							});
						} else {
							$('#noblank').show();
							return false;
						}
					}
				},
				cancel: {
					label: 'Cancel',
					className: 'btn-link',
					callback: function() {
						return;
					}
				}
			},
		});
	});

});

