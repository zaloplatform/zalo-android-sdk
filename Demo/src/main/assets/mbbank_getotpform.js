javascript:{
var img;
var url_captcha
var OTPURL = 'payment.smartlink.com.vn/mbotp.do?method=ws';
var OTPURL2 = 'payment.napas.com.vn/mbotp.do?method=ws';
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
	getform();
}

function checkErrorStopPage(){
	/*var url = window.location.href;
	if (url.indexOf(ERROR_URL) > -1){
		var error = {};
		error.type = 2;
		error.elements = [];
		error.elements.push({'title': 'Hủy Giao Dịch'
		,'message': "Lỗi giao dịch thanh toán bị hủy!"
		,'stop': true
		,'popupType':0
		,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
		,'type':3
		});
		zac_wpb.onJsPaymentResult(JSON.stringify(error));
		return true;
	}
	return false;*/
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


function check_error_submit(result){
		if (document.getElementsByClassName('error').length > 0) {
			if ((document.getElementsByClassName('error')[0]).innerText != null &&
			(document.getElementsByClassName('error')[0]).innerText.length > 5 
			) {
				result.elements.push({'title': 'Thông báo'
					,'message': (document.getElementsByClassName('error')[0]).innerText
					,'stop': false
					,'popupType':0
					,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
					,'type':3
					});
			}
		}
	}
/**/

	
	 function otp_get() {
		 console.log('acb ---- otp-get====');
		 var gI = null;
		var inputs = document.getElementsByTagName('input');
		for (var i = 0; i < inputs.length; ++i) {
			var input = inputs[i];
			if (input.type == 'image') {
				console.log('=============FOUND CAPTCHA==========');
				gI = input;
				break;
			}
		};
		url_captcha = gI.src;
		otp_onload();
	 }

	 function otp_error() {
		 console.log('acb ---- otp_error()====');
		 otp_get();
	 }

	 function otp_onload() {
		
		var result = {};
		result.type = 2;
		result.elements = [];
		result.elements.push({'id': 'staticpassword'
		,'hintText': 'Mật khẩu'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':1
		,'position': 0
		});
		
		result.elements.push({'id': 'otp'
		,'hintText': 'Nhập OTP'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':1
		,'position': 1
		});
		
		result.elements.push({
		'show':false
		,'type':4
		});
		
		result.elements.push({'id': 'otpimg'
		,'hintText': 'Nhập chuỗi kí tự'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':2
		,'captchaImage': ''
		,'captchaImageLink':url_captcha
		,'position': 2
		});
		result.elements.push({
			'btntext':'Thanh toán ngay'
			,'type':5
			});
		result.submitJSFunc = 'submitForm';
		result.removeView = true;
		check_error_submit(result);
		console.log('mbbank-get login form callback to java');
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
	 }

	
	function submitForm(str){
		console.log('RUN mbbank submitForm ----- javascript-----');
		var json = JSON.parse(str);	
		document.getElementById('staticpassword').value = json.staticpassword;
		document.getElementById('otp').value = json.otp;
		document.getElementById('otpimg').value = json.otpimg;
		document.getElementById('mbotppaynow').click();
	}
	
	function getform(){
		console.log('RUN mbbank get confirm payment otp-on-get()');
		var url = window.location.href;
		if (url.indexOf(OTPURL) > -1 || url.indexOf(OTPURL2) > -1){
			otp_get();
		}
	}
};