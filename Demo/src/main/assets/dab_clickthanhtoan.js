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
	
	function checkBoxClick(){
		$('.dtsc-payOnline-agreePayOnlineRule').find('input[type=checkbox]').attr('checked', 'true').click();
		setTimeout(function(){ znp_dab_confirm_payment_submit(); }, 1000);
	}
	
	var znp_dab_confirm_payment_submit = function() {
	    if($('.gwt-PopupPanel').find('img').length > 0) {
	        setTimeout(function(){ znp_dab_confirm_payment_submit(); }, 1000);
	        return;
	    }
	    var btnThanhToan = document.getElementsByClassName("dtsc-hover-bt");
		if (btnThanhToan != null){
			for (i = 0; i < btnThanhToan.length; i++) { 
				if (btnThanhToan[i].innerHTML == "Thanh toán"){
					btnThanhToan[i].click();
					setTimeout(function(){ znp_dab_confirm_payment_catch_error(); }, 1000);
					continue;
				}	
			}
		}
	   
	};
	
	var intervalListener = self.setInterval(function() {
		checkLoadPageFinish();
	}, 2000);
 
	 function checkLoadPageFinish(){
	 	if ($('.dtsc-payOnline-agreePayOnlineRule').length > 0) {
	 		window.clearInterval(intervalListener);
	        checkBoxClick();
	    }
	 }
	 
	 
	var znp_dab_confirm_payment_catch_error = function() {
	    var msg = $('.demo-DialogBox-message').text();
	    if(!!msg && msg.length > 0) {
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
	        return;
	    }
	    var pwd = $('input.dtsc-ck-password');
	    if(pwd.length == 0) {
	        setTimeout(function(){ znp_dab_confirm_payment_catch_error(); }, 1000);
	        return;
	    }
		/*otp page*/
	    console.log('dongabank get otp form');
		var result = {};
		result.type = 3;
		result.script = 'dab_getotpform.js';
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
		return;
	};
};