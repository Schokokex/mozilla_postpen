const CLASS_STORABLE_ITEM = ".store";
const HTML_ATTR_NAME_STORAGENAME = "storagename";

document.addEventListener('DOMContentLoaded', () => {
	//how can i start the sync.get before the DOM loads?
	browser.storage.sync.get().then(store=>{
		document.querySelectorAll(CLASS_STORABLE_ITEM).forEach(item=>{
			const itemStorageName = item.attributes[HTML_ATTR_NAME_STORAGENAME].value;
			item.value = store[itemStorageName] || '';
		});
	});
});

document.querySelector('form').addEventListener('submit', e=>{
	e.preventDefault();
	const toStore = {};
	document.querySelectorAll(CLASS_STORABLE_ITEM).forEach(item=>{
		const itemStorageName = item.attributes[HTML_ATTR_NAME_STORAGENAME].value;
		toStore[itemStorageName] = item.value;
	});
	browser.storage.sync.set(toStore);
});