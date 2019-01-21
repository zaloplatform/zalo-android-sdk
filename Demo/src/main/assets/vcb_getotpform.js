javascript:{
	
function getform(){
		console.log('RUN otp form ');
		var url = window.location.href;
		if (url.indexOf('vietcombank.com.vn/VCBOnlineServices/VCB_Payment/VPSC.aspx') > -1){
			var result = {};
			result.type = 2;
			result.elements = [];
			result.elements.push({'id': 'ctl00__Default_Content_CenterC_OTP_Inp'
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
			result.elements.push({
			'btntext':'Thanh toán ngay'
			,'type':5
			});
			result.submitJSFunc = 'submitForm';
			result.removeView = true;
			check_error_vcb(result);
			console.log('vcb-get otp form callback to java');
			zac_wpb.onJsPaymentResult(JSON.stringify(result));
		}
	}	
	
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
	if (checkErrorStopPage() === true){
		
	} else {
		getform();
	}
}

function checkErrorStopPage(){
	var url = window.location.href;
	if (url.indexOf('vietcombank.com.vn/VCBOnlineServices/VCB_Payment/Err.aspx') > -1){
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
function check_error_vcb(result){
		var url = window.location.href;
		if (url.indexOf('vietcombank.com.vn/VCBOnlineServices/VCB_Payment/VPSC.aspx') > -1){
			/*var errorMsg = document.getElementById('ctl00__Default_Content_Center_CustomValidator1');
			if(!!errorMsg.innerText && errorMsg.innerText.length > 0) {
				console.log('error login vcb: ' + errorMsg.innerText);
				result.elements.push({'title': 'Thông báo'
				,'message': errorMsg.innerText
				,'stop': false
				,'popupType':0
				,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
				,'type':3
				});
				return;
			}*/
		}
	}
/**/

	function submitForm(str){
		var json = JSON.parse(str);	
		document.getElementById('ctl00__Default_Content_CenterC_OTP_Inp').value = json.ctl00__Default_Content_CenterC_OTP_Inp;
		document.getElementById('ctl00__Default_Content_CenterC_Pay_Out').click();
		console.log("submit otp from js");
	}
	
	
};