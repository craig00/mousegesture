chrome.runtime.onMessage.addListener((message,sender)=>{
	console.log('111111111111');
	if (message == 'close the current tab') {
		chrome.tabs.remove(sender.tab.id);
	}
});