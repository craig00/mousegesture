function onedirection(x1,y1,x2,y2){
	let deg = Math.atan((y1-y2)/(x1-x2)) /(Math.PI)*180;
	if (Math.abs(deg)<30) {
		if (x1<x2) {
			return 'horizontal-right';
		}else{
			return 'horizontal-left';
		}
	}else if (Math.abs(deg)<60) {
		return 'meaningless';
	}else{
		if (y1 < y2) {
			return 'vertical-down';
		}else{
			return 'vertical-up';
		}
	}
}
function getellipse(x1,y1,x2,y2){
	if (x1 === null) {
		x1 = x2;
		y1 = y2;
	}
	let deg;
	let bluediv = document.createElement("div");
	let rectanglewidth = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
	bluediv.style.width = rectanglewidth+lineweight/2+'px';
	bluediv.style.height = lineweight+'px';
	bluediv.style.borderRadius = lineweight/2+'px';
	bluediv.style.backgroundColor = 'blue';
	bluediv.style.position = 'fixed';
	bluediv.style.zIndex = '10000';
	bluediv.style.top = ( (y1+y2)/2 - lineweight/2) +"px";
	bluediv.style.left = ( (x1+x2)/2 - rectanglewidth/2 - lineweight/2) +"px";
	if (x1==x2) {
		deg = 90;
	}else{
		deg = Math.atan((y1-y2)/(x1-x2)) /(Math.PI)*180;
	}

	bluediv.style.transform="rotate("+  (deg<0?(180 + deg):(deg)) +"deg)";
	return bluediv;
}
function checkaction(actioncache){
	let index = actioncache[0];
	return actioncache.every((element)=>{
		return element==index;
	});
}
var points = new Set();
var x=null,y=null;
var PREVENTD = false;
var cancelcontextmenu = 0;
var mousemovepoints = 3;
var action = [];
var pointscache = 3;
var actioncache = new Array(pointscache);
var lineweight = 2;
var mousemoveforlink = 0;
var targeturl;
window.addEventListener('mousedown',(e)=>{
	targeturl = e.target.href||e.target.parentElement.href;
});
window.addEventListener('mousemove',(e)=>{
	if (e.button === 2 ) {
		if (cancelcontextmenu++ > mousemovepoints) {
			PREVENTD = true;
			let oneway = onedirection(x,y,e.clientX,e.clientY);
			actioncache.shift();
			actioncache.push(oneway);
			if (checkaction(actioncache)) {
				if (actioncache[0] == 'meaningless') {
					action = 'meaningless';
				}else if (action[action.length-1] != actioncache[0]) {
					action[action.length] = actioncache[0];
				}
			}
			let newone = getellipse(x,y,e.clientX,e.clientY);
			document.body.appendChild(newone);
			points.add(newone);
		}
		x=e.clientX;
		y=e.clientY;
	}else if (e.button === 0) {
		mousemoveforlink++;
		// if ( mousemoveforlink > 3 && targeturl) {
		// 	let port = chrome.runtime.connect({name:'openatab'});
		// 	port.postMessage({message:'open a new tab',targeturl:targeturl});
		// 	mousemoveforlink = 0;
		// 	targeturl = '';
		// }
	}
},true);
window.addEventListener('contextmenu',(e)=>{
	if (e.button === 2 && PREVENTD && cancelcontextmenu > mousemovepoints) {
		cancelcontextmenu = 0;
		PREVENTD = false;
		e.preventDefault();
		if (action.length == 1) {
			switch(action[action.length-1]){
				case 'vertical-down':
				window.scrollBy(0,600);
				break;
				case 'vertical-up':
				window.scrollBy(0,-600);
				break;
				case 'horizontal-left':
				history.go(-1);
				break;
				case 'horizontal-right':
				history.go(1);
				break;
				default:
				break;
			}
		}else if (action.length == 2) {
			switch(action[action.length-2]){
				case 'vertical-down':
				if (action[action.length-1] == 'horizontal-right') {
					chrome.runtime.sendMessage('close the current tab');
				}
				break;
				case 'vertical-up':
				break;
				case 'horizontal-left':
				break;
				case 'horizontal-right':
				if (action[action.length-1] == 'vertical-down') {
					window.location.reload();
				}
				break;
				default:
				break;
			}
		}
		action = [];
		points.forEach((c)=>{
			document.body.removeChild(c);
		})
		points.clear();
		x=null;
		y=null;
	}

},true);
