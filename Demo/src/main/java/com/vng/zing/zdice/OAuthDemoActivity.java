package com.vng.zing.zdice;
import java.util.Date;

import com.zing.zalo.zalosdk.core.log.Log;
import com.zing.zalo.zalosdk.oauth.AuthenticateExtention;
import com.zing.zalo.zalosdk.oauth.LoginForm;
import com.zing.zalo.zalosdk.oauth.LoginForm.ShowProtectGuestAccountListener;
import com.zing.zalo.zalosdk.oauth.LoginVia;
import com.zing.zalo.zalosdk.oauth.OAuthCompleteListener;
import com.zing.zalo.zalosdk.oauth.OauthResponse;
import com.zing.zalo.zalosdk.oauth.ValidateOAuthCodeCallback;
import com.zing.zalo.zalosdk.oauth.ZaloSDK;
import com.zing.zalo.zalosdk.oauth.ZingMeLoginView;
import com.zing.zalo.zalosdk.payment.direct.PaymentProcessingDialog;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.AdapterView;
import android.widget.AdapterView.OnItemSelectedListener;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

public class OAuthDemoActivity extends ZBaseActivity{

    public static String userId = "";
    private PaymentProcessingDialog progressDialog;
    private LoginListener listener;
    private LoginForm loginForm;
    private ImageView imgViewLoginFormBg;
    private Spinner zalo_login_type;
    private Spinner show_login_form_type;
    private String showProtectAccType ;
    AuthenticateExtention authenticateExtention;
    //Login callback
    private class LoginListener extends OAuthCompleteListener {

        private Activity ctx;
        public LoginListener(Activity ctx) {
            this.ctx = ctx;
        }

        @Override
        public void onSkipProtectAcc(Dialog dialog) {
            dialog.dismiss();
        }

        @Override
        public void onProtectAccComplete(int errorCode, String message, Dialog dialog) {

            if (errorCode == 0) {

                ZaloSDK.Instance.isAuthenticate(new ValidateOAuthCodeCallback() {

                    @Override
                    public void onValidateComplete(boolean validated, int error_Code, long userId, String oauthCode) {

                    }
                });

                dialog.dismiss();
            }

            com.zing.zalo.zalosdk.payment.direct.Utils.showAlertDialog(ctx, message, null);

        }

        @Override
        public void onAuthenError(int errorCode, String message) {
            if (ctx != null && !TextUtils.isEmpty(message))
                com.zing.zalo.zalosdk.payment.direct.Utils.showAlertDialog(ctx, message, null);
            super.onAuthenError(errorCode, message);
        }

        @Override
        public void onGetOAuthComplete(OauthResponse response) {
            super.onGetOAuthComplete(response);
            if (!HomeActivity.DISABLE_SUBMIT_APP_USER)
                ZaloSDK.Instance.submitAppUserData("" + ZaloSDK.Instance.getZaloId(), ZaloSDK.Instance.getLastestLoginChannel(), "zalo", "appUTMSource", null);

            if(response.isRegister()) {
                Toast.makeText(OAuthDemoActivity.this, "Đăng kí thành công!", Toast.LENGTH_LONG).show();
            } else {
                Toast.makeText(OAuthDemoActivity.this, "Đăng nhập thành công!", Toast.LENGTH_LONG).show();
            }

            Toast.makeText(OAuthDemoActivity.this, String.valueOf(response.getuId()), Toast.LENGTH_LONG).show();
            userId = String.valueOf(response.getuId());
            getProfile();
            ctx = null;
            if (loginForm.getVisibility() == View.VISIBLE){
                Intent intent = getIntent();
                finish();
                startActivity(intent);
            }
        }
    }

    //Verify oauth code completed
    public void onValidateComplete(boolean isValidated, int errorCode, long userId, String oauthCode) {
        progressDialog.dismiss();

        if(isValidated) {
            //Authenticated: show login form
//			showMainActivity();
            Toast.makeText(OAuthDemoActivity.this, "Login SUCC!", Toast.LENGTH_LONG).show();
        }
        else {
            //not authenticated, show login form
            loginForm.setVisibility(View.VISIBLE);
            imgViewLoginFormBg.setVisibility(View.VISIBLE);
            findViewById(R.id.zalo_login_type_container).setVisibility(View.VISIBLE);
            findViewById(R.id.show_login_form_type_container).setVisibility(View.VISIBLE);
            findViewById(R.id.title_layout).setVisibility(View.GONE);
        }
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.oauth_demo);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        authenticateExtention = new AuthenticateExtention();
        if (authenticateExtention.isGuestAccProtected()) {
            findViewById(R.id.btn_protect_acc).setVisibility(View.GONE);
        }

        findViewById(R.id.btn_back).setVisibility(View.GONE);
        findViewById(R.id.btn_back).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (loginForm.getVisibility() == View.VISIBLE){
                    loginForm.setVisibility(View.GONE);
                    imgViewLoginFormBg.setVisibility(View.GONE);
                    findViewById(R.id.zalo_login_type).setVisibility(View.GONE);
                    zalo_login_type.setVisibility(View.GONE);
                    findViewById(R.id.zalo_login_type_container).setVisibility(View.GONE);
                    findViewById(R.id.show_login_form_type_container).setVisibility(View.GONE);
                    findViewById(R.id.title_layout).setVisibility(View.VISIBLE);
                    findViewById(R.id.group_btn).setVisibility(View.VISIBLE);
                } else
                    finish();
            }
        });

        showProtectAccType = getResources().getStringArray(R.array.login_form_arrays)[0];
        progressDialog = new PaymentProcessingDialog(this, new PaymentProcessingDialog.OnCloseListener() {
            @Override
            public void onClose() {

            }
        });
//		progressDialog.setMessage("Loading...");
        loginForm = (LoginForm) findViewById(R.id.login_form);
        loginForm.setOAuthCompleteListener(listener);
        zalo_login_type = (Spinner) findViewById(R.id.zalo_login_type);
        show_login_form_type = (Spinner) findViewById(R.id.show_login_form_type);

        show_login_form_type.setOnItemSelectedListener(new OnItemSelectedListener() {

            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                showProtectAccType = parent.getItemAtPosition(position).toString();
                if (position == 0) {
                    loginForm.setOnShowProtectGuestAccountListener(null);
                }else {

                    loginForm.setOnShowProtectGuestAccountListener(new ShowProtectGuestAccountListener() {

                        @Override
                        public boolean onShowProtectGuestAccount(int loginGuestCount, int numberOfShown, Date lastShownTime) {
//							String s = "loginGuestCount: " + loginGuestCount + " numberOfShown: " + numberOfShown + " lastShownTime: "+ lastShownTime.toString();
//							Toast.makeText(OAuthDemoActivity.this, s, Toast.LENGTH_SHORT).show();
//							Log.d(s);

                            String[] type = getResources().getStringArray(R.array.login_form_arrays);
                            if (showProtectAccType.equals(type[1])) {
                                return true;
                            }else {
                                return false;
                            }

                        }
                    });
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> arg0) {

            }
        });
        zalo_login_type.setOnItemSelectedListener(new OnItemSelectedListener() {

            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                String item = parent.getItemAtPosition(position).toString();
                String[] type = getResources().getStringArray(R.array.zalo_arrays);

                if (item.equals(type[0])) {
                    loginForm.setZaloLoginVia(LoginVia.APP);
                }else if (item.equals(type[1])) {
                    loginForm.setZaloLoginVia(LoginVia.WEB);
                }else {
                    loginForm.setZaloLoginVia(LoginVia.APP_OR_WEB);
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> arg0) {

            }
        });

        listener = new LoginListener(this);
        loginForm.setOAuthCompleteListener(listener);
        loginForm.setOnShowProtectGuestAccountListener(null);
        loginForm.setOnShowProtectGuestAccountListener(new ShowProtectGuestAccountListener() {

            @Override
            public boolean onShowProtectGuestAccount(int loginGuestCount, int numberOfShown, Date lastShownTime) {
                String s = "loginGuestCount: " + loginGuestCount + " numberOfShown: " + numberOfShown + " lastShownTime: "+ lastShownTime.toString();
                Toast.makeText(OAuthDemoActivity.this, s, Toast.LENGTH_SHORT).show();
                Log.d(s);

                if (loginGuestCount >= 5) return true;

                return false;
            }
        });

        loginForm.setVisibility(View.GONE);
        ((TextView)findViewById(R.id.title_text)).setText(R.string.title_demo_oauth);

        imgViewLoginFormBg = (ImageView) findViewById(R.id.imv_login_form_bg);
        imgViewLoginFormBg.setVisibility(View.GONE);
        findViewById(R.id.sign_in_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                logingplus_click2(null);
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        requestChangeFocusImage();
    }

    @Override
    //Notify Login form when back button pressed
    public void onBackPressed()	{
        if (loginForm.canBackPressed())
            loginForm.onBackPressed();
        else if (loginForm.getVisibility() == View.VISIBLE){
            loginForm.setVisibility(View.GONE);
            imgViewLoginFormBg.setVisibility(View.GONE);
            zalo_login_type.setVisibility(View.GONE);
            findViewById(R.id.zalo_login_type_container).setVisibility(View.GONE);
            findViewById(R.id.show_login_form_type_container).setVisibility(View.GONE);
            findViewById(R.id.title_layout).setVisibility(View.VISIBLE);
            findViewById(R.id.group_btn).setVisibility(View.VISIBLE);
        } else
            super.onBackPressed();
    }

    @Override
    //This method is required by ZaloSDK
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        ZaloSDK.Instance.onActivityResult(this, requestCode, resultCode, data);
        if (authenticateExtention != null)
            authenticateExtention.onActivityResult(this, requestCode, resultCode, data);
        if (loginForm != null){
            loginForm.onActivityResult(this, requestCode, resultCode, data);
        }
    }

    public void loginform_click(View v){
        loginForm.setVisibility(View.VISIBLE);
        imgViewLoginFormBg.setVisibility(View.VISIBLE);
        findViewById(R.id.zalo_login_type).setVisibility(View.VISIBLE);
        zalo_login_type.setVisibility(View.VISIBLE);
        findViewById(R.id.zalo_login_type_container).setVisibility(View.VISIBLE);
        findViewById(R.id.show_login_form_type_container).setVisibility(View.VISIBLE);
        findViewById(R.id.title_layout).setVisibility(View.GONE);
        findViewById(R.id.group_btn).setVisibility(View.GONE);
    }

    public void loginzalo_viaapp_click(View v){
        ZaloSDK.Instance.unauthenticate();
        ZaloSDK.Instance.authenticate(this, LoginVia.APP, listener);
    }

    public void login_zalo_via_web_click(View v){
        ZaloSDK.Instance.unauthenticate();
        ZaloSDK.Instance.authenticate(this, LoginVia.WEB, listener);
    }

    public void register_click(View v){
        ZaloSDK.Instance.unauthenticate();
        ZaloSDK.Instance.registerZalo(this, listener);
    }

    public void login_via_app_or_web_click(View v){
        ZaloSDK.Instance.unauthenticate();
        ZaloSDK.Instance.authenticate(this, LoginVia.APP_OR_WEB, listener);
    }

    public void login_facebook_click(View v){
        ZaloSDK.Instance.unauthenticate();
        authenticateExtention.authenticateWithFacebook(this, listener);
    }

    public void logingplus_click(View v){
        ZaloSDK.Instance.unauthenticate();
        authenticateExtention.authenticateWithGooglePlus(this, listener);
    }

    public void logingplus_click2(View v){
        Log.i("debuglog", "OAuthDemoActivity.java----log in with google:  00000");
        ZaloSDK.Instance.unauthenticate();
        authenticateExtention.authenticateWithGooglePlus(this, listener);

    }

    public void loginzing_click(View v){
        ZaloSDK.Instance.unauthenticate();
        AlertDialog.Builder dialogBuilder = new AlertDialog.Builder(this);
        LayoutInflater inflater = this.getLayoutInflater();
        View dialogView = inflater.inflate(R.layout.loginzingme, null);
        ZingMeLoginView pp = (ZingMeLoginView)dialogView.findViewById(R.id.login_zing);

        dialogBuilder.setView(dialogView);
        final AlertDialog alertDialog = dialogBuilder.create();
        pp.setOAuthCompleteListener(new OAuthCompleteListener(){
            @Override
            public void onAuthenError(int errorCode, String message) {
                alertDialog.dismiss();
                com.zing.zalo.zalosdk.payment.direct.Utils.showAlertDialog(OAuthDemoActivity.this, message, null);
                super.onAuthenError(errorCode, message);
            }

            @Override
            public void onGetOAuthComplete(OauthResponse response) {
                super.onGetOAuthComplete(response);
                alertDialog.dismiss();
                if (!HomeActivity.DISABLE_SUBMIT_APP_USER)
                    ZaloSDK.Instance.submitAppUserData("" + ZaloSDK.Instance.getZaloId(), ZaloSDK.Instance.getLastestLoginChannel(), "zalo", "appUTMSource", null);
//				Toast.makeText(OAuthDemoActivity.this, "Login SUCC with OAuth Code: " + response.getOauthCode(), Toast.LENGTH_LONG).show();
                showToast("Login -- SUCC!");
                getProfile();
            }
        });
        alertDialog.show();
    }

    public void loginguest_click(View v){
        Log.i("debuglog", "login with Guest");
        ZaloSDK.Instance.unauthenticate();
        authenticateExtention.authenticateWithGuest(this, listener);
    }

    public void protectAcc_click(View v){

        String loginChannel = ZaloSDK.Instance.getLastestLoginChannel();
        if (loginChannel.equals("GUEST")) {
            if (authenticateExtention.isGuestAccProtected() == false) {
                LoginListener listener = new LoginListener(this);
                authenticateExtention.openProtectGuestDialog(this, listener);
            }else {
                Toast.makeText(this, "Tài khoản guest đã được bảo vệ", Toast.LENGTH_SHORT).show();
            }

        }else {
            Toast.makeText(this, "Tài khoản đăng nhập không phải tài khoản guest", Toast.LENGTH_SHORT).show();
        }

    }

    public void validate_click(View v){
        ZaloSDK.Instance.isAuthenticate(new ValidateOAuthCodeCallback() {
            @Override
            public void onValidateComplete(boolean validated, int errorCode, long userId, String oauthCode){
                Toast.makeText(OAuthDemoActivity.this, String.valueOf(userId), Toast.LENGTH_LONG).show();
                showAlert("Validated: " + validated, "Ok", null);
            }
        });
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String[] permissions, int[] grantResults) {
        // TODO Auto-generated method stub
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
//        ZaloSDK.Instance.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }
}
