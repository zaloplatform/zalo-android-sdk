package com.vng.zing.zdice;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.os.Build;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.View;
import android.widget.TextView;

import com.zing.zalo.zalosdk.core.log.Log;
import com.zing.zalo.zalosdk.oauth.ValidateOAuthCodeCallback;
import com.zing.zalo.zalosdk.oauth.ZaloSDK;
import com.zing.zalo.zalosdk.payment.direct.Utils;

import java.util.Locale;

public class HomeActivity extends ZBaseActivity implements ValidateOAuthCodeCallback{

	public static boolean DISABLE_SUBMIT_APP_USER = true;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		if ((getIntent().getFlags() & Intent.FLAG_ACTIVITY_BROUGHT_TO_FRONT) != 0) { 
	        finish(); 
	        return; 
	    }
		setContentView(R.layout.main_screen);
		((TextView)findViewById(R.id.title_text)).setText(R.string.title_sdk_demo);
		findViewById(R.id.btn_back).setVisibility(View.GONE);
		((TextView)findViewById(R.id.sdk_ver)).setText(ZaloSDK.Instance.getVersion());
	}
	
	@Override
	public void onRequestPermissionsResult(int requestCode,
			String[] permissions, int[] grantResults) {
		super.onRequestPermissionsResult(requestCode, permissions, grantResults);
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		setupClick();
		checkOAuthCode();
	}
	
	
	
	private void checkOAuthCode(){
		if(ZaloSDK.Instance.isAuthenticate(this)) {
			if (!DISABLE_SUBMIT_APP_USER)
				ZaloSDK.Instance.submitAppUserData("" + ZaloSDK.Instance.getZaloId(), ZaloSDK.Instance.getLastestLoginChannel(), "zalo", "appUTMSource", null);
			getProfile();
		} else {

		}
	}

	public void openapi_click(View v){
		Intent intent = new Intent(this, OpenApiDemoActivity.class);
		intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		this.startActivity(intent);
	}

	public void oauth_click(View v){
		Intent intent = new Intent(this, OAuthDemoActivity.class);
		intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		this.startActivity(intent);
	}

	public void plugin_click(View v){
		Intent intent = new Intent(this, PluginDemoActivity.class);
		intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		this.startActivity(intent);
	}

	@Override
	public void onValidateComplete(boolean isValidated, int errorCode, long userId, String oauthCode) {
		if (isValidated) {
			getProfile();
		} else {
			
		}
	}
}
