javascript:{
	var bankURL = 'ebanking.vietinbank.vn/epayment/home.html?jsessionid=';
	var imgCapchaURL = 'ebanking.vietinbank.vn/epayment/captcha.jpg';
	var ERROR_URL = 'ebanking.vietinbank.vn/epayment/transact.do';
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
	/*if (checkErrorStopPage() === true){
		
	} else {
		getform();
	}*/
	getform();
}

function checkErrorStopPage(){
	var url = window.location.href;
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
	return false;
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
		var url = window.location.href;
		if (url.indexOf(ERROR_URL) > -1){
			var errorMsg = document.getElementById('error');
			if(!!errorMsg.innerText && errorMsg.innerText.length > 0) {
				console.log('error login vtb: ' + errorMsg.innerText);
				result.elements.push({'title': 'Thông báo'
				,'message': errorMsg.innerText
				,'stop': false
				,'popupType':0
				,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
				,'type':3
				});
				return;
			}
		}
	}
/**/

	 var img;

	 function otp_get() {
		console.log('RUN 000000');
		var container = document.getElementById('dImgCaptcha').getElementsByTagName('iframe');
		if (container == null){
			console.log('RUN container null');
		} else {
			console.log('RUN container length: ' + container.length);
		}
		var allImages = container[0].contentWindow.document.getElementsByTagName('img');
		if (allImages != undefined){
			console.log('RUN allImages.length: ' + allImages.length);
			for(var i = 0, max = allImages.length; i < max; i++){
				console.log('RUN 000000 img.src: ' + allImages[i].src);
				if (allImages[i].src.indexOf(imgCapchaURL) > -1){
					console.log('found image');
				   img = allImages[i];
				   break;
				} 
			}
		} else {
			console.log('RUN AAAAA');
		}
		console.log('RUN 111111');
	  if (img != undefined) {
		  console.log('RUN 2222222');
	   if (img.naturalWidth === 0 || img.naturalHeight === 0 || img.complete === false) {
		img = document.createElement('img');
		img.id = 'js_otpimg';
		img.onload = otp_onload();
		img.onerror = otp_error();
		img.src = imgCapchaURL;
	   } else {
		otp_onload();
	   }
	  }else {
		  console.log('RUN 333333');
		  otp_get();
	   }
	 }

	 function otp_error() {
	   otp_get();
	 }

	 function otp_onload() {
	  var c = document.createElement('canvas');
	  var ctx = c.getContext('2d');
	  c.width = img.width;
	  c.height = img.height;
	  ctx.drawImage(img, 0, 0);
	  if (window.idTimeOut != undefined)
		clearTimeout(window.idTimeOut);
	  var result = {};
		result.type = 2;
		result.elements = [];
		
		result.elements.push({
		'show':false
		,'type':4
		});
		
		result.elements.push({'id': 'JCaptcha'
		,'hintText': 'Nhập chuỗi sau'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':2
		,'captchaImage': c.toDataURL().replace('data:image/png;base64,', '')
		,'captchaImageLink':imgCapchaURL
		});
		result.submitJSFunc = 'submitForm';
		result.removeView = true;
		check_error_submit(result);
		console.log('vcb-get login form callback to java');
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
	 }

	function submitForm(str){
		var json = JSON.parse(str);	
		document.getElementById('JCaptcha').value = json.JCaptcha;
		document.getElementById('confirm_1').checked = true;
		document.getElementById('btnSubmit1').click();
	}
	
	function getform(){
		console.log('RUN vtb get confirm payment otp-on-get()');
		var url = window.location.href;
		if (url.indexOf(bankURL) > -1
			|| url.indexOf(ERROR_URL)
		){
			otp_get();
		}
	}
};