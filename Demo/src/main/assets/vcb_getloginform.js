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

function check_error_vcb(result){
		var url = window.location.href;
		if (url.indexOf('vietcombank.com.vn/VCBOnlineServices/VCB_Payment/VPS.aspx') > -1){
			var errorMsg = document.getElementById('ctl00__Default_Content_Center_CustomValidator1');
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
			}
			errorMsg = document.getElementById('ctl00__Default_Content_Center_Lit_AuthWarn');
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
			}
			
		}
	}


	 var img;

	 function otp_get() {
		var allImages = document.getElementsByTagName("img");
		if (allImages != undefined){
			for(var i = 0, max = allImages.length; i < max; i++){
				if (allImages[i].src.indexOf('_ScriptLibrary/JpegImage.aspx') > -1){
					console.log('found image');
				   img = allImages[i];
				   break;
				} 
			}
		}
	  if (img != undefined) {
	   if (img.naturalWidth === 0 || img.naturalHeight === 0 || img.complete === false) {
		img = document.createElement('img');
		img.id = 'js_otpimg';
		img.onload = otp_onload();
		img.onerror = otp_error();
		img.src = '_ScriptLibrary/JpegImage.aspx';
	   } else {
		otp_onload();
	   }
	  }else {
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
		result.elements.push({'id': 'ctl00__Default_Content_Center_TenTC'
		,'hintText': 'Tên đăng nhập'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':1
		,'position': 0
		});
		result.elements.push({'id': 'ctl00__Default_Content_Center_MatKH'
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
		
		result.elements.push({'id': 'ctl00__Default_Content_Center_Random_Img_Str'
		,'hintText': 'Nhập captcha'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':2
		,'position': 2
		,'captchaImage': c.toDataURL().replace('data:image/png;base64,', '')
		,'captchaImageLink':'https://www.vietcombank.com.vn/VCBOnlineServices/VCB_Payment/_ScriptLibrary/JpegImage.aspx'
		});
		result.submitJSFunc = 'submitForm';
		result.removeView = true;
		check_error_vcb(result);
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
		var json = JSON.parse(str);	
		if (!json.ctl00__Default_Content_Center_TenTC){
			genErrorFieldSubmit('Vui lòng nhập tên đăng nhập để tiếp tục giao dịch.');
			return;
		}
		if (!json.ctl00__Default_Content_Center_MatKH){
			genErrorFieldSubmit('Vui lòng nhập mật khẩu để tiếp tục giao dịch.');
			return;
		}
		if (!json.ctl00__Default_Content_Center_Random_Img_Str){
			genErrorFieldSubmit('Vui lòng nhập chuỗi ký tự bảo mật.');
			return;
		}
		document.getElementById('ctl00__Default_Content_Center_TenTC').value = json.ctl00__Default_Content_Center_TenTC;
		document.getElementById('ctl00__Default_Content_Center_MatKH').value = json.ctl00__Default_Content_Center_MatKH;
		document.getElementById('ctl00__Default_Content_Center_Random_Img_Str').value = json.ctl00__Default_Content_Center_Random_Img_Str;
		document.getElementById('ctl00__Default_Content_Center_Chk_Terms').checked = true;
		document.getElementById('ctl00__Default_Content_Center_Confirm').click();
	}
	
	function getform(){
		console.log('RUN getloginformelements otp-on-get()');
		var url = window.location.href;
		if (url.indexOf('vietcombank.com.vn/VCBOnlineServices/VCB_Payment/VPS.aspx') > -1){
			console.log('getloginformelements otp-on-get()');
			otp_get();
		}
	}
};