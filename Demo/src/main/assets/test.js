javascript:{

	/* var img;

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
	 };

	 function otp_error() {
	   otp_get();
	 };

	 function otp_onload() {
		console.log('otp_onload()');
	  var c = document.createElement('canvas');
	  var ctx = c.getContext('2d');
	  c.width = img.width;
	  c.height = img.height;
	  console.log('image width: ' + c.width + ' image height: ' + c.height);
	  console.log('c.toDataURL(): ' + c.toDataURL());
	  ctx.drawImage(img, 0, 0);
	  if (window.idTimeOut != undefined)
		clearTimeout(window.idTimeOut);
	  var result = {};
		result.type = 2;
		result.elements = [];
		result.elements.push({'id': 'ctl00__Default_Content_Center_TenTC'
		,'hintText': 'Tên truy cập VCB-iB@nking'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':1
		});
		result.elements.push({'id': 'ctl00__Default_Content_Center_MatKH'
		,'hintText': 'Mật khẩu VCB-iB@nking'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':1
		});
		
		
		result.elements.push({'id': 'ctl00__Default_Content_Center_Random_Img_Str'
		,'hintText': 'Nhập chuỗi sau'
		,'keyboardType':0
		,'capitalizeType':1
		,'type':2
		,'captchaImage': c.toDataURL().replace('data:image/png;base64,', '')
		,'captchaImageLink':'https://www.vietcombank.com.vn/VCBOnlineServices/VCB_Payment/_ScriptLibrary/JpegImage.aspx'
		});
		
		result.submitJSFunc = 'submitForm';
		result.removeView = false;
		zac_wpb.onJsPaymentResult(JSON.stringify(result));
	 };*/
	
	/*function submitForm(json){*/
	/*{'ctl00__Default_Content_Center_TenTC': '2343', 'ctl00__Default_Content_Center_MatKH' : '3465g'
	,'ctl00__Default_Content_Center_Random_Img_Str':'dfsret'
	}*/
	/*}*/
	
	function getform(){
		console.log('RUN getloginformelements otp-on-get()');
		/*var url = window.location.href;
		if (url.indexOf('vietcombank.com.vn/VCBOnlineServices/VCB_Payment/VPS.aspx') > -1){
			console.log('getloginformelements otp-on-get()');
			otp_get();
		}*/
	};
	getform();
};