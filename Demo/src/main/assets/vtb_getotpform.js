javascript:{
	var OTPURL = 'ebanking.vietinbank.vn/epayment/transact.do';
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

	
	function submitForm(str){
		var json = JSON.parse(str);	
		document.getElementById('passwordOTP').value = json.passwordOTP;
		document.getElementById('btnSubmit2').click();
	}
	
	function getform(){
		console.log('RUN vtb get confirm payment otp-on-get()');
		var url = window.location.href;
		if (url.indexOf(OTPURL)){
			var result = {};
			result.type = 2;
			result.elements = [];
			
			result.elements.push({
			'show':false
			,'type':4
			});
			
			result.elements.push({'id': 'passwordOTP'
			,'hintText': 'Nhập mã OTP'
			,'keyboardType':0
			,'capitalizeType':1
			,'type':1
			});
			result.elements.push({
			'btntext':'Thanh toán ngay'
			,'type':5
			});
			result.submitJSFunc = 'submitForm';
			result.removeView = true;
			console.log('vietinbank otp callback');
			zac_wpb.onJsPaymentResult(JSON.stringify(result));
		}
	}
};