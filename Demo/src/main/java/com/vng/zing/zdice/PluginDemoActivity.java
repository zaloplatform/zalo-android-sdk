package com.vng.zing.zdice;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import com.zing.zalo.zalosdk.core.log.Log;
import com.zing.zalo.zalosdk.oauth.FeedData;
import com.zing.zalo.zalosdk.oauth.OpenAPIService;
import com.zing.zalo.zalosdk.oauth.ShareVia;
import com.zing.zalo.zalosdk.oauth.ZaloPluginCallback;
import com.zing.zalo.zalosdk.oauth.ZaloSDK;

public class PluginDemoActivity extends ZBaseActivity {

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.plugin_demo);
		//getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
		findViewById(R.id.btn_back).setVisibility(View.GONE);
		findViewById(R.id.btn_back).setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				finish();
			}
		});
		((TextView)findViewById(R.id.title_text)).setText(R.string.txt_title_plugin_demo);
		((Button)findViewById(R.id.btn_share_via)).setText("Share bằng: " + (OpenAPIService.getInstance().getShareZaloUsing() == ShareVia.AppThenWeb ? "App" : "Web"));
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		requestChangeFocusImage();
	}
	public void share_via_click(View v){
		CharSequence colors[] = new CharSequence[] { "Zalo App",
		"Web View" };

		AlertDialog.Builder builder = new AlertDialog.Builder(this);
		builder.setTitle("Chọn");
		builder.setItems(colors, new DialogInterface.OnClickListener() {
			@Override
			public void onClick(DialogInterface dialog, int which) {
				if (which == 0) {
					OpenAPIService.getInstance().setShareZaloUsing(ShareVia.AppThenWeb);
					((Button)findViewById(R.id.btn_share_via)).setText("Share bằng: App");
				} else {
					OpenAPIService.getInstance().setShareZaloUsing(ShareVia.WebThenApp);
					((Button)findViewById(R.id.btn_share_via)).setText("Share bằng: Web");
				}
			}
		});
		builder.show();
	}
	
	private FeedData getFeedObject(){
		FeedData oo = new FeedData();
		oo.setLink(((EditText)findViewById(R.id.input_link_share)).getText().toString());
		oo.setMsg(((EditText)findViewById(R.id.input_msg)).getText().toString());
		oo.setAppName(((EditText)findViewById(R.id.input_app_name)).getText().toString());
		oo.setLinkTitle(((EditText)findViewById(R.id.input_link_title)).getText().toString());
		oo.setLinkDesc(((EditText)findViewById(R.id.input_link_desc)).getText().toString());
		oo.setLinkSource(((EditText)findViewById(R.id.input_link_source)).getText().toString());
		String strThumb = ((EditText)findViewById(R.id.input_link_thumb)).getText().toString();
		String [] thumb = strThumb.split(",");
		oo.setLinkThumb(thumb);
		return oo;
	}
	
	public void share_msg_click(View v){
		OpenAPIService.getInstance().shareMessage(this, getFeedObject(), mCallBack);
	}

	public void btn_share_feed_click(View v){
		OpenAPIService.getInstance().shareFeed(this, getFeedObject(), mCallBack);
	}
	
	public void btn_share_click(View v){
		OpenAPIService.getInstance().share(this, getFeedObject(), mCallBack);
	}
	
	ZaloPluginCallback mCallBack = new ZaloPluginCallback() {
		
		@Override
		public void onResult(boolean isSuccess, int errorCode, String msg, String data) {

		}
	};
}
