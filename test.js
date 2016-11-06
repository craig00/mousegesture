function onedirection(x1,y1,x2,y2){
	var deg = Math.atan((y1-y2)/(x1-x2)) /(Math.PI)*180;
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
	var bluediv = document.createElement("div");
	var rectanglewidth = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
	bluediv.style.width = rectanglewidth+2+'px';
	bluediv.style.height = '2px';
	bluediv.style.borderRadius = '1px';
	bluediv.style.backgroundColor = 'blue';
	bluediv.style.position = 'fixed';
	bluediv.style.zIndex = '10000';
	bluediv.style.top = ( (y1+y2)/2 - 1) +"px";
	bluediv.style.left = ( (x1+x2)/2 - rectanglewidth/2 - 1) +"px";
	if (x1==x2) {
		var deg = 90;
	}else{
		var deg = Math.atan((y1-y2)/(x1-x2)) /(Math.PI)*180;
	}

	bluediv.style.transform="rotate("+  (deg<0?(180 + deg):(deg)) +"deg)";
	return bluediv;
}
var points = new Set();
var x=null,y=null;
var PREVENTD = false;
var cancelcontextmenu = 0;
var mousemovepoints = 3;
var action = [];
window.onload = ()=>{

	window.addEventListener('mousemove',(e)=>{
		if (e.button === 2 ) {
			if (cancelcontextmenu++ > mousemovepoints) {
				PREVENTD = true;
				var oneway = onedirection(x,y,e.clientX,e.clientY);
				if (oneway == 'meaningless') {
					action = 'meaningless';
				}else if (action[action.length-1] != oneway) {
					action[action.length] = oneway;
				}
				var newone = getellipse(x,y,e.clientX,e.clientY);
				document.body.appendChild(newone);
				points.add(newone);
			}
			x=e.clientX;
			y=e.clientY;
		}
	},true);
	window.addEventListener('contextmenu',(e)=>{
		if (e.button === 2 && PREVENTD && cancelcontextmenu > mousemovepoints) {
			PREVENTD = false;
			e.preventDefault();
			if (action.length == 1) {
				switch(action[action.length-1]){
					case 'vertical-down':
					break;
					case 'vertical-up':
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
						window.close();
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
}