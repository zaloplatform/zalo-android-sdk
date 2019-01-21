javascript:{
var img;
var url_captcha;
var OTPURL = 'ebanking.dongabank.com.vn/khcn/main';
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
	function submitForm(str){
		console.log('RUN dongabank submitForm ----- javascript-----');
		var json = JSON.parse(str);	
		znp_dab_submit_otp(json.otp);
	}
	
	function getform(){
		console.log('RUN dongbank get confirm payment getform()');
		var url = window.location.href;
		if (url.indexOf(OTPURL)){
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
		
		result.elements.push({
			'btntext':'Thanh toán ngay'
			,'type':5
			});
		result.submitJSFunc = 'submitForm';
		result.removeView = true;
		console.log('dongabank-get otp form callback to java');
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
		}
	}
	
	
/*****************/
	var znp_dab_submit_otp_check_result = function() {
    var msg = $('.dtsc-errorInfo').text();
    if(!msg || msg.legnth == 0){
        msg = $('.demo-DialogBox-message').text();
    }
    if(!!msg && msg.length > 0) {
        $('.demo-DialogBox-message').text('');
        $('button.demo-DialogBox-button').click();
        $('.dtsc-errorInfo').text('');
        var error = {};
		error.type = 2;
		error.elements = [];
		error.elements.push({'title': 'Thông báo'
		,'message': msg.trim()
		,'stop': (msg.indexOf('thực hiện lại giao dịch.') > -1 || msg.indexOf('quá thời gian xác nhận') > -1) ? true : false
		,'popupType':0
		,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
		,'type':3
		});
		zac_wpb.onJsPaymentResult(JSON.stringify(error));
		return;
    }
    if($('input[type=password]').length == 0){
        if($('#gwt-container').text().indexOf('DongA Bank thông báo giao dịch thành công') > -1) {
            return;
        };
        var error = {};
		error.type = 2;
		error.elements = [];
		error.elements.push({'title': 'Thông báo'
		,'message': 'Xảy ra lỗi!'
		,'stop': false
		,'popupType':0
		,'buttons':[{'title': 'OK', 'jsFunc': 'onCLick.js'}]
		,'type':3
		});
		zac_wpb.onJsPaymentResult(JSON.stringify(error));
        return;
    }
    window.znp_dab_submit_otp_check_result_handle = setTimeout(function(){ znp_dab_submit_otp_check_result(); }, 1000); 
};
var znp_dab_submit_otp = function (otp) {
	console.log('RUN dongabank submit form======');
	if(!!window.znp_dab_submit_otp_check_result_handle) {
        clearTimeout(window.znp_dab_submit_otp_check_result_handle);
    }
    $('input[type=password]').val(otp);
    $('button.dtsc-hover-bt:contains("Xác nhận")').click();
    setTimeout(function(){ $('demo-DialogBox-button').click(); $('.demo-DialogBox-message').text(''); $('button.demo-DialogBox-button').click();}, 500);
    window.znp_dab_submit_otp_check_result_handle = setTimeout(function(){ znp_dab_submit_otp_check_result(); }, 1000);
};
};