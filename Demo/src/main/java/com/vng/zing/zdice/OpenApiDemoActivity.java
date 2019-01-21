package com.vng.zing.zdice;

import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.widget.TextView;

import com.zing.zalo.zalosdk.oauth.ZaloOpenAPICallback;
import com.zing.zalo.zalosdk.oauth.ZaloSDK;

import org.json.JSONObject;

public class OpenApiDemoActivity extends ZBaseActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.openapi_demo);
		getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
		findViewById(R.id.btn_back).setVisibility(View.GONE);
		findViewById(R.id.btn_back).setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				finish();
			}
		});
		((TextView)findViewById(R.id.title_text)).setText(R.string.title_open_api);

	}
	
	@Override
	protected void onResume() {
		super.onResume();
		requestChangeFocusImage();
	}
	
	public void getprofileclick(View v){
		showProgress();
		String [] Fields = {"id", "birthday", "gender", "picture", "name"};
		ZaloSDK.Instance.getProfile(this, new ZaloOpenAPICallback() {
			@Override
			public void onResult(JSONObject arg0) {
				try{
					if (arg0.has("name")){
						mUserData = new UserData();
						mUserData.setUserName(arg0.getString("name"));
						mUserData.setUserId(arg0.getString("id"));
						JSONObject data = arg0.getJSONObject("picture").getJSONObject("data");
						mUserData.setImgLink(data.getString("url"));
					}
				}
				catch(Exception ex){

				}
				updateData();
			}
//		}, new String[]{"id", "birthday", "name", "gender", "picture"});
//		}, new String[]{"id", "birthday", "gender", "picture", "name"});
		}, Fields);
	}
	
	public void getfriendlist_click(View v){
		showProgress();
		ZaloSDK.Instance.getFriendListUsedApp(this, 0, 999, new ZaloOpenAPICallback() {
			@Override
			public void onResult(JSONObject arg0) {
				hideProgress();
				((TextView)findViewById(R.id.output_value)).setText(arg0.toString());
			}
		}, new String[]{"id", "name", "gender", "picture"});
	}
}
