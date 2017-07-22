chrome.runtime.onMessage.addListener((message, sender) => {
	if (message == "close the current tab") {
		chrome.tabs.remove(sender.tab.id);
	}
});
chrome.runtime.onConnect.addListener(port => {
	port.onMessage.addListener(function(msg) {
		if (msg.message == "open a new tab") {
			let createpro = {
				index: port.sender.tab.index + 1,
				url: msg.targeturl,
				active: false
			};
			chrome.tabs.create(createpro);
		}
	});
});
