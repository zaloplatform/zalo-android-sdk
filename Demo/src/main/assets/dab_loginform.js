javascript: {
/**/
var storedDataJS = {};
function loadStoredData(jsonData){
	console.log('storedDataJS: ' + jsonData);
	try {
		if (jsonData.length > 3)
			storedDataJS = JSON.parse(jsonData);
	}
	catch(err) {
		console.log('page finish error message ' + err.message);
	}
}
function storeData(name, value){
	try {
		storedDataJS[name] = value;
		var stored = {};
		stored.type = 4;
		stored.data = JSON.stringify(storedDataJS);
		console.log('storeData startscript: ' + JSON.stringify(stored));
		zac_wpb.onJsPaymentResult(JSON.stringify(stored));
	}
	catch(err) {
		console.log('page finish error message ' + err.message);
	}
}

function getStoreData(key){
	return storedDataJS[key];
}
/**/	
	
 var img;

 function otp_get() {
  img = document.getElementsByClassName("gwt-Image")[0];
  if (img != undefined) {
   if (img.naturalWidth === 0 || img.naturalHeight === 0 || img.complete === false) {
    img = document.createElement('img');
    img.id = 'js_otpimg';
    img.onload = otp_onload();
    img.onerror = otp_error();
    img.src = document.getElementsByClassName("gwt-Image")[0].src;
   } else {
    otp_onload();
   }
  } else {
	    console.log('dongabank get login form otp_get NULL ');
		var msg = $('.demo-DialogBox-message').text();
		if (!!msg && msg.indexOf('Quý khách được điều hướng về trang thanh toán của DongABank') > -1){
	    	$('.demo-DialogBox-button').click();
	    	setTimeout(function(){ otp_get(); }, 1000);
		 }
  	}
 }

 function otp_error() {
	 console.log('dongabank get login form otp_error occur');
     otp_get();
 }

 function otp_onload() {
  var c = document.createElement('canvas');
  var ctx = c.getContext('2d');
  c.width = img.width;
  c.height = img.height;
  ctx.drawImage(img, 0, 0);
  		  /**/
		var result = {};
		result.type = 2;
		result.elements = [];
		result.elements.push({'id': 'j_username'
		,'hintText': 'Mã số khách hàng'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':1
		,'position': 0
		});
		result.elements.push({'id': 'j_password'
		,'hintText': 'Số mật mã'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':1
		,'position': 1
		});
		result.elements.push({
		'show':false
		,'type':4
		});
		
		result.elements.push({'id': 'captchaid'
		,'hintText': 'Nhập mã an toàn'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':2
		,'position': 2
		,'captchaImage': c.toDataURL().replace('data:image/png;base64,', '')
		,'captchaImageLink':img.src
		});
		result.submitJSFunc = 'submitForm';
		result.removeView = true;
		console.log('dongabank-get login form callback to java');
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
		/**/
 };

 function submitForm(str){
		console.log('dongabank-get submitForm : ' + str);
		var json = JSON.parse(str);	
		
			$('.demo-DialogBox').remove();
			$('.backgroundPopup').css('display', 'none');
		  
		   var userName = document.getElementsByName("j_username")[0];
		   if (userName != null) {
			userName.value = json.j_username;
		   }
		   var userPassword = document.getElementsByName("j_password")[0];
		   if (userPassword != null) {
			userPassword.value = json.j_password;
		   }

			var form=document.forms[0];
			if(form.elements['captchaInput'] != null) form.elements['captchaInput'].value = json.captchaid;
			var capt = $('.dtsc-textbox-size-partnerOnline').last();
			if(capt) {
				capt.val(json.captchaid);
			};
			var btn = document.getElementsByClassName("dtsc-hover-bt")[0];
			if (btn != null){
				btn.click();
			}
		   /* $('.dtsc-captchaPanel-PayOnlinePartner-style .gwt-Image').removeAttr('src');*/
		  checkLoginError();
	}
 
var intervalListener = self.setInterval(function() {
		console.log('dongabank ===getloginform ---- checkInitPageSucc!!!!');
		checkInitPageSucc();
	}, 2000);
 
 function checkInitPageSucc(){
 	if ($('input[name=j_username]').length > 0) {
 		window.clearInterval(intervalListener);
 		console.log('dongabank ===getloginform!!!! window.clearInterval(intervalListener);');
        otp_get();
    }
 }
 
 /*****/
 
 var znp_dab_captcha = function() {
    console.log("znp_dab_captcha - 0000: ");
    var tags = $('.gwt-Image');
    if(tags.lengt == 0) {
        console.log("ko tim thay the img - 11111: ");
        return;
    };
    img = tags[0];
    var src = img.src;
    if(!src){
    	console.log("captchage src null and continue waiting .....");
        window.idTimeOut = setTimeout(function(){ znp_dab_captcha() }, 1000);
        return;
    }
    if(img.naturalWidth === 0 || img.naturalHeight === 0 || img.complete === false) {
        img = document.createElement('img');
        img.id = 'js_otpimg';
        img.onload = otp_onload_2();
        img.onerror = otp_error_2();
        img.src = src;
    }
    else {
        otp_onload_2();
    }
};
	
	
	 function otp_error_2() {
		 console.log("otp_error_2");
		/*znp_dab_captcha();*/
	 }
	
	 function otp_onload_2() {
	  console.log("otp_onload - 0000: ");
	  var c = document.createElement('canvas');
	  var ctx = c.getContext('2d');
	  c.width = img.width;
	  c.height = img.height;
	  ctx.drawImage(img, 0, 0);
		var result = {};
		result.type = 2;
		result.elements = [];
		result.elements.push({'id': 'j_username'
		,'hintText': 'Mã số khách hàng'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':1
		,'position': 0
		});
		result.elements.push({'id': 'j_password'
		,'hintText': 'Số mật mã'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':1
		,'position': 1
		,'inputType':1
		});
		result.elements.push({
		'show':false
		,'type':4
		});
		
		result.elements.push({'id': 'captchaid'
		,'hintText': 'Nhập mã an toàn'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':2
		,'position': 2
		,'captchaImage': c.toDataURL().replace('data:image/png;base64,', '')
		,'captchaImageLink':img.src
		});
		result.submitJSFunc = 'submitForm';
		result.removeView = true;
		console.log('dongabank-get login form callback to java 2222');
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
	 };
 
	function checkLoginError() {
		console.log("checkLoginError run"); 
		var msgDialog = $('.demo-DialogBox');
		var msg = msgDialog.find('.demo-DialogBox-message').text();
		console.log("checkLoginError - **** : " + msgDialog.length);
	    if(msgDialog.length > 0){
	        msgDialog.find('.demo-DialogBox-button').click();
	        console.log("checkLoginError - 0000: " + msg);
			var error = {};
			error.type = 2;
			error.elements = [];
			error.elements.push({'title': 'Thông báo'
			,'message': msg.trim()
			,'stop': false
			,'popupType':0
			,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
			,'type':3
			});
			zac_wpb.onJsPaymentResult(JSON.stringify(error));
	        clearTimeout(window.idTimeOut);
	        $('.dtsc-captchaPanel-PayOnlinePartner-style .gwt-Image').removeAttr('src');
	        znp_dab_captcha();
	    }  else {
	    	console.log("nothing and continue loop @@@@ ");
	        window.idTimeOut = setTimeout(function(){ checkLoginError() }, 1000);
	    }
	}
};