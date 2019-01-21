javascript:{
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
	function check_error_vib(){
		var errorMsg = document.getElementById('dnn_ctr1343_ctl00_lblMessage');
		if( errorMsg != null && errorMsg.innerText != null && errorMsg.innerText.length > 0) {
			console.log('error login VIB: ' + errorMsg.innerText);
			var result = {};
			result.type = 2;
			result.elements = [];
			result.elements.push({'title': 'Thông báo'
			,'message': errorMsg.innerText
			,'stop': false
			,'popupType':0
			,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
			,'type':3
			});
			zac_wpb.onJsPaymentResult(JSON.stringify(result));
			return;
		} else {
			window.timeoutId = setTimeout(check_error_vib, 1000);
		}
		var url = window.location.href;
		if (url.indexOf('ib.vib.com.vn/vi-vn/individual/ecommercecard.aspx?trannum=') < 0){
			console.log('VIB - submit correct and redirect to other url');
			window.clearTimeout(window.timeoutId);
		}
	}
	
	function submitForm(str){
		var json = JSON.parse(str);	
		document.getElementById('dnn_ctr1343_CardBased_ucLogin_txtUserName').value = json.dnn_ctr1343_CardBased_ucLogin_txtUserName;
		document.getElementById('dnn_ctr1343_CardBased_ucLogin_txtPassword').value = json.dnn_ctr1343_CardBased_ucLogin_txtPassword;
		document.getElementById('dnn_ctr1343_CardBased_ucLogin_lbtLogin').click();
		window.timeoutId = setTimeout(check_error_vib, 1000);
	}
	
	function getform(){
		console.log('RUN getloginformelements ');
		var url = window.location.href;
		if (url.indexOf('ib.vib.com.vn/vi-vn/individual/ecommercecard.aspx?trannum=') > -1){
			var result = {};
			result.type = 2;
			result.elements = [];
			result.elements.push({'id': 'dnn_ctr1343_CardBased_ucLogin_txtUserName'
			,'hintText': 'Tên đăng nhập'
			,'keyboardType':0
			,'capitalizeType':1
			,'type':1
			,'position': 0
			});
			result.elements.push({'id': 'dnn_ctr1343_CardBased_ucLogin_txtPassword'
			,'hintText': 'Mật khẩu'
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
			result.submitJSFunc = 'submitForm';
			result.removeView = true;
			console.log('VIB - get login form callback to java');
			zac_wpb.onJsPaymentResult(JSON.stringify(result));
		}
	}
};