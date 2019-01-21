javascript: {
var znp_init_atm = function(bankCode, cardHolderName, cardNumber, cardMonth, cardYear, atmFlag) {
    var url = window.location.href;
    if(!!url) {
        if(url.indexOf('payment.smartlink.com.vn/verifycard.do') > 0
		|| url.indexOf('payment.napas.com.vn/verifycard.do') > -1) {
            znp_init_atm_smartlink_verifycard(bankCode, cardHolderName, cardNumber, cardMonth, cardYear, atmFlag);
        }
        else if(url.indexOf('paymentcert.smartlink.com.vn/gateway/atm') > 0 
		|| url.indexOf('paymentcert.napas.com.vn/gateway/atm') > -1) {
            znp_init_atm_smartlink_verifycard_new(bankCode, cardHolderName, cardNumber, cardMonth, cardYear, atmFlag);
        }
        else if(url.indexOf('paymentcert.smartlink.com.vn/gateway/verifyotp') > 0
		|| url.indexOf('paymentcert.napas.com.vn/gateway/verifyotp') > -1) {
            znp_init_atm_smartlink_new_fix_cancel();
        }
    }

};
var znp_init_atm_smartlink_cancel_in_screen_input_card = function() {
    var btnCancel = document.getElementById('cardcancel');
	if (btnCancel != null)
		btnCancel.onclick = function() { zac_wpb.onJsPaymentResult('')};
};

var znp_init_atm_smartlink_verifycard = function(bankCode, cardHolderName, cardNumber, cardMonth, cardYear, atmFlag) {
	znp_init_atm_smartlink_cancel_in_screen_input_card();
    var divMsg = document.getElementsByClassName('message');
    if(divMsg.length > 0) {
        divMsg = divMsg[0];
        var divError = divMsg.getElementsByClassName('error');
        if(divError.length > 0) {
            divError = divError[0];
            if(!!divError.innerText && divError.innerText.length > 0) {
                return;
            }
        }
    }
    
    var txtCardHolderName = document.getElementById('cardHolderName');
    var txtCardNumber = document.getElementById('cardNumber');
    var txtCardMonth = document.getElementById('cardMonth');
    var txtCardYear = document.getElementById('cardYear');
    var btnSubmit = document.getElementById('cardpaynow');
    if(!!txtCardHolderName) txtCardHolderName.value = cardHolderName;
    if(!!txtCardNumber) txtCardNumber.value = cardNumber;
    if(!!txtCardMonth) txtCardMonth.value = cardMonth;
    if(!!txtCardYear) txtCardYear.value = cardYear;
    if(!!btnSubmit) btnSubmit.click();
};

var znp_init_atm_smartlink_new_fix_cancel = function() {
    var imgTags = document.getElementsByTagName('img');
    for(var i=0; i<imgTags.length; i++) {
        if(imgTags[i].src.indexOf('cancel') > 0) {
            imgTags[i].onclick = function() { zac_wpb.onJsPaymentResult('')};
        }
    }
};

var znp_init_atm_smartlink_verifycard_new = function(bankCode, cardHolderName, cardNumber, cardMonth, cardYear, atmFlag) {
    znp_init_atm_smartlink_new_fix_cancel();
    
    var divError = document.getElementById('payment_error');
    if(!!divError && divError.innerText.length > 0) {
        return;
    }
    
    var txtCardHolderName = document.getElementById('CardName');
    var txtCardNumber = document.getElementById('CardNumber');
    var selCardMonth = document.getElementById('CardMonth');
    var selCardYear = document.getElementById('CardYear');
    var btnSubmit = document.getElementById('confirmPayment');
    if(!!txtCardHolderName) txtCardHolderName.value = cardHolderName;
    if(!!txtCardNumber) txtCardNumber.value = cardNumber;
    if(!!selCardMonth) selCardMonth.selectedIndex = cardMonth;
    if(!!selCardYear) selCardYear.selectedIndex = cardYear + 1;
    if(!!btnSubmit) btnSubmit.click();
};
/**/
var storedDataJS = {};
function loadStoredData(jsonData){
	console.log('storedDataJS: ' + jsonData);
	try {
		if (jsonData.length > 3)
			storedDataJS = JSON.parse(jsonData);
		storeData('checkvcb', '0');
		/*reset store data*/
		storeData('dab_redirect', '0');
		/**/
	}
	catch(err) {
		console.log('error message ' + err.message);
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
		console.log('error message ' + err.message);
	}
}
/**/
};