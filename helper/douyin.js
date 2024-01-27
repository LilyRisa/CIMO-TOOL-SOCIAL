// const fs = require('fs').promises; 

async function getid(sec_user_id,max_cursor){
	var res=await fetch("https://www.douyin.com/aweme/v1/web/aweme/post/?device_platform=webapp&aid=6383&channel=channel_pc_web&sec_user_id="+sec_user_id+"&max_cursor="+max_cursor, {
	  "headers": {
		"accept": "application/json, text/plain, */*",
		"accept-language": "vi",
		"sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Microsoft Edge\";v=\"108\"",
		"sec-ch-ua-mobile": "?0",
		"sec-ch-ua-platform": "\"Windows\"",
		"sec-fetch-dest": "empty",
		"sec-fetch-mode": "cors",
		"sec-fetch-site": "same-origin"
	  },
	  "referrer": "https://www.douyin.com/user/MS4wLjABAAAA5A-hCBCTdv102baOvaoZqg7nCIW_Bn_YBA0Aiz9uYPY",
	  "referrerPolicy": "strict-origin-when-cross-origin",
	  "body": null,
	  "method": "GET",
	  "mode": "cors",
	  "credentials": "include"
	});
	try{
	    res=await res.json();
	}catch(e){
		res=await getid(sec_user_id,max_cursor);
		console.log(e);
	}
	return res;
}

async function download(url, aweme_id, desc){
	var file_name = aweme_id + "-" + desc + ".mp4";
	var data=await fetch(url, {
  "headers": {
    "accept": "*/*",
    "accept-language": "vi,en-US;q=0.9,en;q=0.8",
    "range": "bytes=0-",
    "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Microsoft Edge\";v=\"108\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "video",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site"
  },
  "referrer": "https://www.douyin.com/",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "omit"
});
	data=await data.blob();
	var a = document.createElement("a");
	a.href = window.URL.createObjectURL(data);
	a.download = file_name;
	a.click();
}
  
  module.exports = { checkLicense };