package com.vng.zing.zdice;

import org.json.JSONObject;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.vng.zing.imageloader.ImageLoader;
//import com.zing.zalo.devicetrackingsdk.ZingAnalyticsManager;
import com.zing.zalo.zalosdk.core.helper.Utils;
import com.zing.zalo.zalosdk.core.log.Log;
import com.zing.zalo.zalosdk.oauth.LoginChannel;
import com.zing.zalo.zalosdk.oauth.ZaloOpenAPICallback;
import com.zing.zalo.zalosdk.oauth.ZaloSDK;

public class ZBaseActivity extends Activity{
	public static UserData mUserData;
	ImageLoader imgLoader;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		// TODO Auto-generated method stub
		super.onCreate(savedInstanceState);
		imgLoader = new ImageLoader(getApplicationContext());
	}
	
	@Override
	protected void onResume() {
		super.onResume();
		Utils.onPauseResume("onResume", this);
	}
	
	@Override
	protected void onPause() {
		super.onPause();
		Utils.onPauseResume("onPause", this);
	}
	
	public void showAlert(String msg, String posBtn, String negBtn){
		AlertDialog.Builder pp = new AlertDialog.Builder(this);
		
		pp.setTitle("Info");
	    pp.setMessage(msg);
	    if (!TextUtils.isEmpty(posBtn)){
	    	pp.setPositiveButton(posBtn, new DialogInterface.OnClickListener() {
	        public void onClick(DialogInterface dialog, int which) { 
	            // continue with delete
	        }
	     });
	    }
	    if (!TextUtils.isEmpty(negBtn)){
	    	pp.setNegativeButton(negBtn, new DialogInterface.OnClickListener() {
	        public void onClick(DialogInterface dialog, int which) { 
	            // do nothing
	        }
	     });
	    }
	    pp.setIcon(android.R.drawable.ic_dialog_alert);
	    pp.show();
	}
	
	public void showToast(String msg){
		Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
	}
	
	public void showProgress(){
//		progress.show();
	}
	
	public void hideProgress(){
//		progress.dismiss();
	}
	
	public void updateData(){//change image 
		ImageView img_avatar = (ImageView)findViewById(R.id.btn_avatar);
		if (mUserData != null && !isGuest()){
			if (img_avatar != null){
				imgLoader.DisplayImage(mUserData.getImgLink(), R.drawable.ic_loading, img_avatar);
			}
		}
		Log.i("debuglog", "isGuest(): " + isGuest());
		if (isGuest() && img_avatar != null){
			Log.i("debuglog", "update image for Guest");
			img_avatar.setImageResource(R.drawable.ic_launcher);
		}
	}
	
	public void requestChangeFocusImage(){
		setupClick();
		updateData();
	}
	
	protected void setupClick(){
		if (ZaloSDK.Instance.isAuthenticate(null) || isGuest()){
			findViewById(R.id.btn_avatar).setOnClickListener(new View.OnClickListener() {
				@Override
				public void onClick(View v) {
					showUserInfo();
				}
			});
		}
	}
	
	public void showUserInfo(){//dialog: custom layout for alert dialog
		AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(this);
		// ...Irrelevant code for customizing the buttons and title
		LayoutInflater inflater = this.getLayoutInflater();
		View dialogView = inflater.inflate(R.layout.layout_dialog_user, null);
		if (mUserData != null && !isGuest()){
			((TextView)dialogView.findViewById(R.id.username)).setText(mUserData.getUserName());
			((TextView)dialogView.findViewById(R.id.userid)).setText(mUserData.getUserId());
			ImageView img_avatar = (ImageView)dialogView.findViewById(R.id.imageView1);
			imgLoader.DisplayImage(mUserData.getImgLink(), R.drawable.ic_loading, img_avatar);
		} 
		if (isGuest()){
			((TextView)dialogView.findViewById(R.id.username)).setText("Guest");
			((TextView)dialogView.findViewById(R.id.userid)).setText(OAuthDemoActivity.userId);
			ImageView img_avatar = (ImageView)dialogView.findViewById(R.id.imageView1);
			imgLoader.DisplayImage(null, R.drawable.ic_launcher, img_avatar);
		}
		
		String socialId = ZaloSDK.Instance.getSocialId();
		((TextView)dialogView.findViewById(R.id.login_channel)).setText("Login Channel: " + ZaloSDK.Instance.getLastestLoginChannel() + " Social Id: " + socialId);
		dialogView.findViewById(R.id.btn_logout).setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				logout();
			}
		});

		dialogBuilder.setView(dialogView);
		final AlertDialog alertDialog = dialogBuilder.create();
		dialogView.findViewById(R.id.btn_avatar_close).setOnClickListener(new View.OnClickListener() {
			@Override
			public void onClick(View v) {
				alertDialog.dismiss();
			}
		});
		alertDialog.show();
	}
	
	private void logout() {
		new AlertDialog.Builder(this.getWindow().getContext())
		.setTitle("Xác nhận")
		.setMessage("Bạn có muốn đăng xuất không?")
		.setIcon(R.drawable.ic_warning)
		.setPositiveButton("Có", confirmLogoutListener)
		.setNegativeButton("Không", null).show();
	}
	
	private DialogInterface.OnClickListener confirmLogoutListener = new DialogInterface.OnClickListener() {
	    public void onClick(DialogInterface dialog, int whichButton) {
	    	mUserData = null;
	    	ZaloSDK.Instance.unauthenticate();
	    	Intent intent = new Intent(ZBaseActivity.this, HomeActivity.class);
			startActivity(intent);
			dialog.dismiss();
			finish();
	    }};
	    
	public boolean isGuest(){
		return (LoginChannel.GUEST.equalsName(ZaloSDK.Instance.getLastestLoginChannel()));
	}
	
	public void getProfile(){
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
}
