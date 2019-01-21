javascript: {

/**/
var storedDataJS = {};
function loadStoredData(jsonData){
	console.log('dab - redirectonepay.js --- storedDataJS: ' + jsonData);
	try {
		if (jsonData.length > 3)
			storedDataJS = JSON.parse(jsonData);
	}
	catch(err) {
		console.log('page finish error message ' + err.message);
	}
	nextPage();
}
function storeData(name, value){
	try {
		storedDataJS[name] = value;
		var stored = {};
		stored.type = 4;
		stored.data = JSON.stringify(storedDataJS);
		console.log('dab - redirectonepay.js---storeData startscript: ' + JSON.stringify(stored));
		zac_wpb.onJsPaymentResult(JSON.stringify(stored));
	}
	catch(err) {
		console.log('dab - redirectonepay.js finish error message ' + err.message);
	}
}

function getStoreData(key){
	return storedDataJS[key];
}
/**/
function nextPage(){
	var tc = document.getElementById("divBody");
	var ary = tc.getElementsByTagName("a");
	if(ary != null && ary.length > 0){
		window.location.href = ary[0].href;
	}
}
};