javascript:{
var img;
var url_captcha;
var OTPURL = 'payment.smartlink.com.vn/otp.do?method=ws';
var OTPURL2 = 'payment.napas.com.vn/otp.do?method=ws';
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
		img = gI;
		url_captcha = img.src;
		otp_onload();
		/*
		var src = document.getElementById("pagewrap");
		var imgTemp = document.createElement("img");
		imgTemp.src = gI.src;
		url_captcha = gI.src;
		imgTemp.id = "js_otpimg";
		src.appendChild(imgTemp);
		imgTemp.onload = otp_onload();*/
	 /* if (img != undefined) {
		  console.log('otp_get- img.clientWidth: ' + img.clientWidth);
	   if (img.clientWidth === 0 || img.clientHeight  === 0 || img.complete === false) {
		img = document.createElement('img');
		img.id = 'js_otpimg';
		img.onload = otp_onload();
		img.onerror = otp_error();
		img.src = url_captcha;
	   } else {
		otp_onload();
	   }
	  }else {
			console.log('acb - can not find image');
			otp_get();
	   }*/
	 }

	 function otp_error() {
		 console.log('acb ---- otp_error()====');
		 otp_get();
	 }

	 function otp_onload() {
		/*var c = document.createElement('canvas');
		var ctx = c.getContext('2d');
		console.log('otp_onload- img.width: ' + img.width);
		c.width = img.width;
		c.height = img.height;
		ctx.drawImage(img, 0, 0);*/
		var result = {};
		result.type = 2;
		result.elements = [];
		result.elements.push({'id': 'otp'
		,'hintText': 'Nhập mã OTP'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':1
		,'position': 0
		});
		
		result.elements.push({
		'show':false
		,'type':4
		});
		
		result.elements.push({'id': 'otpimg'
		,'hintText': 'Nhập captcha'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':2
		/*,'captchaImage': c.toDataURL().replace('data:image/png;base64,', '')*/
		,'captchaImage': ''
		,'captchaImageLink':url_captcha
		,'position': 1
		});
		
		result.elements.push({
			'btntext':'Thanh toán ngay'
			,'type':5
			});
		result.submitJSFunc = 'submitForm';
		result.removeView = true;
		check_error_submit(result);
		console.log('acb-get login form callback to java');
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
	 }

	 function genErrorFieldSubmit(error){
		var result = {};
		result.type = 2;
		result.elements = [];
		result.elements.push({'title': 'Thông báo'
				,'message': error
				,'stop': false
				,'popupType':0
				,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
				,'type':3
				,'skipclearform':true
				});
		zac_wpb.onJsPaymentResult(JSON.stringify(result));		
	 }
	 
	function submitForm(str){
		console.log('RUN acb submitForm ----- javascript-----');
		var json = JSON.parse(str);	
		
		if (!json.otp){
			genErrorFieldSubmit('Vui lòng nhập mã OTP vừa gửi đến số điện thoại/email /Token key hoặc theo dãy số trên thẻ ma trận của bạn. Quá thời gian quy định, mã OTP không còn hiệu lực.');
			return;
		}
		if (!json.otpimg){
			genErrorFieldSubmit('Vui lòng nhập captcha.');
			return;
		}
		
		document.getElementById('otp').value = json.otp;
		document.getElementById('otpimg').value = json.otpimg;
		document.getElementById('otppaynow').click();
	}
	
	function getform(){
		console.log('RUN acb get confirm payment otp-on-get()');
		var url = window.location.href;
		if (url.indexOf(OTPURL) > -1 || url.indexOf(OTPURL2) > -1){
			otp_get();
		}
	}
};