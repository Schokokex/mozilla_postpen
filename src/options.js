document.addEventListener("DOMContentLoaded", () => {
	browser.storage.sync.get("logger_url").then((result)=>{
		document.querySelector("input").value = result.logger_url || "";
	});
});

document.querySelector("form").addEventListener("submit", (e)=>{
	e.preventDefault();
	browser.storage.sync.set({
		logger_url: document.querySelector("input").value
	});
});