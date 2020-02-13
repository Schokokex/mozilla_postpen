let logger_url = "";
browser.storage.sync.get("logger_url").then((result)=>{
	logger_url = result.logger_url;
	if (""!=logger_url) document.body.style.border = "5px solid red";
},console.error);