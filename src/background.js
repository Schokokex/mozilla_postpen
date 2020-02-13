// Async loaded variables.
let firstnames;
let lastnames;
let emails;
let trigger_email;
let trigger_name;

browser.webRequest.onBeforeRequest.addListener(
	data => {
		if ('POST'!==data.method) return;
		console.info(data);
		if (!data.requestBody) return;
		const url = data.url;
		const rawData = data.requestBody.raw && data.requestBody.raw[0] && decodeURIComponent(String.fromCharCode.apply(null,new Uint8Array(data.requestBody.raw[0].bytes)));
		const formData = data.requestBody.formData;
		const formDataString = JSON.stringify(formData);
		const method = data.method;
		const redID = data.requestId;

		const trigger = ( formDataString && ( formDataString.search(trigger_email)>=0 || formDataString.search(trigger_name)>=0 ))
			|| ( rawData && ( rawData.search(trigger_email)>=0 || rawData.search(trigger_name)>=0 ));
		if (trigger){
			console.warn(`TRIGGER ${rawData}`);
			const goodRawData = rawData && rawData.replace(trigger_email,rand_email()).replace(trigger_name,rand_name());
			fetch(url,{method:method, body: goodRawData});
			fetch_logger({ method:method, body:goodRawData });
			return {cancel : true};
		}
	},
	{urls: ['<all_urls>']},
	['requestBody','blocking'] // requestHeaders
);

const rand_email = () => {
	return `${firstnames[Math.random() * firstnames.length | 0]}.${
		lastnames[Math.random() * lastnames.length | 0]}@${
		emails[Math.random() * emails.length | 0]}`
}
const rand_name = () => {
	return `${firstnames[Math.random() * firstnames.length | 0]}${
		lastnames[Math.random() * lastnames.length | 0]}`
}
const fetch_logger = o => {
	browser.storage.sync.get('logger_url').then(store=>{
		const logger_url = store.logger_url;
		fetch(logger_url,o);
	});
}

fetch_logger({ method:'POST', body:'postpen Addon loaded', cache: 'no-cache'});

fetch('firstnames.json').then(ä=>ä.json()).then(ä=>firstnames=ä);
fetch('lastnames.json').then(ä=>ä.json()).then(ä=>lastnames=ä);
fetch('emailendings.json').then(ä=>ä.json()).then(ä=>emails=ä);

browser.storage.sync.get().then(store=>{
	trigger_name = store.trigger_name;
	trigger_email = store.trigger_email;
});