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
	check_bank();
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
function check_error_vcb(){
	var url = window.location.href;
	if (url.indexOf('vietcombank.com.vn/VCBOnlineServices/VCB_Payment/VPS.aspx') > -1){
		var errorMsg = document.getElementById('ctl00__Default_Content_Center_CustomValidator1');
		if(!!errorMsg.innerText && errorMsg.innerText.length > 0) {
			console.log('error login vcb: ' + errorMsg.innerText);
			console.log('CONDITION URL: from check_error_vcb 222222: ' + window.location.href + divError.innerText);
			var error = {};
			error.type = 2;
			error.elements = [];
			error.elements.push({'title': 'Thông báo'
			,'message': errorMsg.innerText
			,'stop': false
			,'popupType':0
			,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
			,'type':3
			});
			zac_wpb.onJsPaymentResult(JSON.stringify(error));
			return;
		}
	}
}

function check_error(){
	var divError = document.getElementById('payment_error');
    if(!!divError && divError.innerText.length > 0) {
		var error = {};
		console.log('CONDITION URL: from check_error 0000: ' + window.location.href + divError.innerText);
		error.type = 2;
		error.elements = [];
		error.elements.push({'title': 'title'
		,'message': divError.innerText
		,'stop': true
		,'popupType':0
		,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
		,'type':3
		});
		zac_wpb.onJsPaymentResult(JSON.stringify(error));
        return;
    }
	var divMsg = document.getElementsByClassName('message');
    if(divMsg.length > 0) {
        divMsg = divMsg[0];
        var divError1 = divMsg.getElementsByClassName('error');
        if(!!divError1 && divError1.length > 0) {
            divError1 = divError1[0];
            if(!!divError1.innerText && divError1.innerText.length > 0) {
				console.log('CONDITION URL: from check_error 11111: ' + window.location.href + divError1.innerText);
                var error = {};
				error.type = 2;
				error.elements = [];
				error.elements.push({'title': 'Thông báo'
				,'message': divError1.innerText
				,'stop': true
				,'nosetview': (divError1.innerText.indexOf('không đủ tiền để thanh toán') > -1) ? true : false
				,'popupType':0
				,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
				,'type':3
				});
				zac_wpb.onJsPaymentResult(JSON.stringify(error));
				return;
            }
        }
    }
	check_error_vcb();
}
	
function check_bank(){
	var checkvcb = getStoreData('checkvcb');
	var url = window.location.href;
	console.log('CONDITION URL: ' + url);
	if (url.indexOf('vietcombank.com.vn/VCBOnlineServices/VCB_Payment/VPS.aspx') > -1){
		console.log('CONDITION CHECK LOGIN');
		storeData('checkvcb', '1');
		var result = {};
		result.type = 3;
		result.script = 'vcb_getloginform.js';
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
		return;
	}

	if (url.indexOf('vietcombank.com.vn/VCBOnlineServices/VCB_Payment/VPSC.aspx') > -1){
		console.log('CONDITION CHECK OTP');
		var result = {};
		result.type = 3;
		result.script = 'vcb_getotpform.js';
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
		return;
	}

	/*todo: check for each bank*/
	
	/*dab*/
	console.log('getStoreData(dab_redirect): ' + getStoreData('dab_redirect'));
	console.log('getStoreData(dab_loginform): ' + getStoreData('dab_loginform'));
	/*check error can not pay */
	if (url.indexOf('data:text/html,chromewebdata')>-1){
		var pr = document.getElementsByTagName("p");
		if (pr != null && pr.length > 0){
			for(var i = 0, max = pr.length; i < max; i++){
				if (pr[i] != null && pr[i].innerHTML != null && pr[i].innerHTML.length > 0){
					if (pr[i].innerHTML.indexOf('net::ERR_NAME_NOT_RESOLVED')>-1){
						var error = {};
						error.type = 2;
						error.elements = [];
						error.elements.push({'title': 'Thông báo'
						,'message': 'net::ERR_NAME_NOT_RESOLVED.'
						,'stop': true
						,'popupType':0
						,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
						,'type':3
						});
						zac_wpb.onJsPaymentResult(JSON.stringify(error));
						return;
					}
				}
			}
		}
	}
	
	if (url.indexOf('onepay.vn/onecomm-pay/bank.op') > -1
		&& getStoreData('dab_redirect') === '0'
		){
		console.log('DAB check redirect ONE PAY');
		storeData('dab_redirect', '1');
		storeData('dab_loginform', '0');
		storeData('dab_lickthanhtoan', '0');
		var result = {};
		result.type = 3;
		result.script = 'dab_redirectonepay.js';
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
		return;
	}
	
	if (url.indexOf('ebanking.dongabank.com.vn/khcn/partner?timestamp=') > -1
		&& getStoreData('dab_redirect') === '1'
		&& getStoreData('dab_loginform') === '0'
		){
		console.log('DAB get login form javascript');
		storeData('dab_loginform', '1');
		var result = {};
		result.type = 3;
		result.script = 'dab_loginform.js';
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
		return;
	}
	
	if (url.indexOf('ebanking.dongabank.com.vn/khcn/main?orderInfo') > -1
		&& getStoreData('dab_lickthanhtoan') === '0'
		){
		console.log('DAB get login SUCCSSFULL -> click thanh toan');
		storeData('dab_lickthanhtoan', '1');
		var result = {};
		result.type = 3;
		result.script = 'dab_clickthanhtoan.js';
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
		return;
	}
	/*vib*/
	if (url.indexOf('ib.vib.com.vn/vi-vn/individual/ecommercecard.aspx?trannum=')>-1){
		console.log('VIB get login form');
		var result = {};
		result.type = 3;
		result.script = 'vib_getloginform.js';
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
		return;
	}
	
	/*vietinbank*/
	if (url.indexOf('ebanking.vietinbank.vn/epayment/home.html?jsessionid=')>-1
		|| url.indexOf('ebanking.vietinbank.vn/epayment/transact.do') > -1
	){
		var vtbotp = document.getElementById('passwordOTP');
		if (vtbotp != null ){
			console.log('VIETINBANK ==== OTP');
			var result = {};
			result.type = 3;
			result.script = 'vtb_getotpform.js';
			zac_wpb.onJsPaymentResult(JSON.stringify(result));

		} else {
			console.log('VIETINBANK payment confirm');
			var result = {};
			result.type = 3;
			result.script = 'vtb_confirmbill.js';
			zac_wpb.onJsPaymentResult(JSON.stringify(result));
		}
		return;
	}
	/*acb, techcombank*/
	if(url.indexOf('payment.smartlink.com.vn/otp.do?method=ws')>-1
		|| url.indexOf('payment.napas.com.vn/otp.do?method=ws')>-1
	){
		console.log('ACB OTP');
		var result = {};
		result.type = 3;
		result.script = 'acb_getotpform.js';
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
	}
	/*mbbank*/
	if(url.indexOf('payment.smartlink.com.vn/mbotp.do?method=ws')>-1
	|| url.indexOf('payment.napas.com.vn/mbotp.do?method=ws')>-1
	){
		console.log('mbbank OTP');
		var result = {};
		result.type = 3;
		result.script = 'mbbank_getotpform.js';
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
	}
	/****************/
	if (url.indexOf('payment.smartlink.com.vn/response.do') > -1
	|| url.indexOf('payment.napas.com.vn/response.do') > -1
	){
		return;
	}
	
	if (url.indexOf('atm.credits.zaloapp.com/atm-callback') > -1){
		var result = {};
		result.type = 5;
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
		return;
	}
	
	check_error();
}
};