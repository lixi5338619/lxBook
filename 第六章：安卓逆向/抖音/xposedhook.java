package com.example.xuziqiang.nanotest;

import de.robv.android.xposed.XposedBridge;
import de.robv.android.xposed.XposedHelpers;
import de.robv.android.xposed.callbacks.XC_LoadPackage;


import android.text.TextUtils;
import android.content.Context;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import fi.iki.elonen.NanoHTTPD;
import java.net.URLDecoder;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.zip.GZIPOutputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.io.ByteArrayOutputStream;
import java.util.Base64;

import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import java.io.IOException;
import java.net.Authenticator;
import java.net.InetSocketAddress;
import java.net.PasswordAuthentication;
import java.net.Proxy;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class AwemeSrv extends NanoHTTPD {
    private static final String NULL_MD5_STRING = "00000000000000000000000000000000";
    private XC_LoadPackage.LoadPackageParam lpp = null;
    public  String sessionid="";

    public AwemeSrv() {
        super(18989);
    }

    public void init(XC_LoadPackage.LoadPackageParam lpparam) {
        this.lpp = lpparam;
        try {
            start();
        } catch (Exception e) {
            XposedBridge.log("[ERR]:NanoHTTPD start error! " + e.toString());
        }
    }

    public static byte[] xuzi(String str) {
        int length = str.length();
        byte[] bArr = new byte[(length / 2)];
        for (int i = 0; i < length; i += 2) {
            bArr[i / 2] = (byte) ((Character.digit(str.charAt(i), 16) << 4) + Character.digit(str.charAt(i + 1), 16));
        }
        return bArr;
    }

    public static String xuzi1(byte[] bArr) {
        if (bArr == null) {
            return null;
        }
        char[] charArray = "0123456789abcdef".toCharArray();
        char[] cArr = new char[(bArr.length * 2)];
        for (int i = 0; i < bArr.length; i++) {
            int b2 = bArr[i] & 255;
            int i2 = i * 2;
            cArr[i2] = charArray[b2 >>> 4];
            cArr[i2 + 1] = charArray[b2 & 15];
        }
        return new String(cArr);
    }

    public byte[] get_leviathan(int i,int time, byte[] s){
        return (byte[]) XposedHelpers.callStaticMethod(XposedHelpers.findClass("com.ss.sys.ces.a", lpp.classLoader), "" + "" + "", i, time, s);

    }

    public static String parseStrToMd5L32(byte[] str){
        String reStr = null;
        try {
            MessageDigest md5 = MessageDigest.getInstance("MD5");
            byte[] bytes = md5.digest(str);
            StringBuffer stringBuffer = new StringBuffer();
            for (byte b : bytes){
                int bt = b&0xff;
                if (bt < 16){
                    stringBuffer.append(0);
                }
                stringBuffer.append(Integer.toHexString(bt));
            }
            reStr = stringBuffer.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return reStr;
    }

    public byte[] get_ttencrypt(XC_LoadPackage.LoadPackageParam lpp2, byte[] data, int length) {
        return (byte[]) XposedHelpers.callStaticMethod(XposedHelpers.findClass("com.bytedance.frameworks.encryptor.EncryptorUtil", lpp2.classLoader), "a", data, length);
    }

    public byte[] get_formdata(byte[] data) throws Exception{
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream(8192);
        GZIPOutputStream gZIPOutputStream = new GZIPOutputStream(byteArrayOutputStream);
        gZIPOutputStream.write(data);
        gZIPOutputStream.close();
        byte[] bArr2 = byteArrayOutputStream.toByteArray();
        return get_ttencrypt(this.lpp, bArr2, bArr2.length);
    }

    public  String get_stub(byte[] barr) throws Exception{
        String reStr = parseStrToMd5L32(barr);
        reStr = reStr.toUpperCase();
        return reStr;
    }

    public String get_fed(String fed) throws Exception{
        return  (String) XposedHelpers.callStaticMethod(XposedHelpers.findClass("com.ss.a.b.d", lpp.classLoader), "a", fed);
    }

    public String get_device(String url, String formdata) throws Exception {
        byte[] data = formdata.getBytes();
        byte[] barr = get_formdata(data);
        String stub = get_stub(barr);
        int time = (int) (System.currentTimeMillis() / 1000);
        long time1 = System.currentTimeMillis();

        int indexOf = url.indexOf("?");
        String fed = url.substring(indexOf + 1);
        String x = get_fed(fed);
        byte[] s = xuzi(x + x + NULL_MD5_STRING + NULL_MD5_STRING);
        int i = -1;
        byte[] gon = get_leviathan(i, time, s);

        String x_gon = xuzi1(gon);
        JSONObject json_obj = new JSONObject();
        json_obj.put("X-SS-STUB", stub);
        json_obj.put("X-SS-REQ-TICKET", time1);
        json_obj.put("X-Gorgon", x_gon);
        json_obj.put("X-Khronos", time);
        String isoString = new String(barr, "ISO-8859-1");
        json_obj.put("form", isoString);
        return json_obj.toString();
    }

    private static String getUrl(String url, String stub, long time1, String x_gon, int time, byte[] barr) {
        String s2 = new String(barr);
        Authenticator.setDefault(new Authenticator() {
            public PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(ProxyUser, ProxyPass.toCharArray());
            }
        });

        String doc = null;
        try {
            doc = Jsoup
                    .connect(url)
                    .ignoreContentType(true)
                    .ignoreHttpErrors(true)
                    .timeout(3000)
                    .userAgent("okhttp/3.10.0.1")
                    .header("X-SS-STUB", stub+"")
                    .header("X-SS-QUERIES", "")
                    .header("X-SS-REQ-TICKET", time1+"")
                    .header("X-Gorgon", x_gon+"")
                    .header("X-Khronos", time+"")
                    .header("Content-Type", "application/octet-stream;tt-data=a")
                    .header("Host", "log.snssdk.com")
                    .requestBody(s2)
//                    .data(s2)
                    .post().text();

            if (doc != null) {
               return doc;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        finally {
            XposedBridge.log("X-SS-STUB " + stub);
            XposedBridge.log("x_gon " + x_gon);
            XposedBridge.log("url " + url);
            XposedBridge.log("s2 " + s2);
            return null;
        }
    }

    public NanoHTTPD.Response serve(NanoHTTPD.IHTTPSession session) {
        String msg = "";
        Map<String, String> parms = session.getParms();
        if (parms.get("url") == null && parms.get("formdata") == null) {
            String msg2 = msg + "<html><body><h1>Aweme Server</h1>\n";
            msg = msg2 + "<form action'?' 'method='get'>\n  URL: <input type='text' name='url'><br>\n  FORMDATA: <input type='text' name='formdata'><br>\n  <input type='submit' value='提交'>\n</form>";
        } else {
            try {
                String url = URLDecoder.decode(parms.get("url"), "utf-8");
                String formdata = URLDecoder.decode(parms.get("formdata"), "utf-8");
                msg = msg + get_device(url, formdata);
            } catch (Exception e) {
                XposedBridge.log(e.toString());
            }
        }
        return newFixedLengthResponse(msg);
    }
}
