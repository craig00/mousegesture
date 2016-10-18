function getellipse(x1,y1,x2,y2){
	if (x2 === null) {
		x2 = x1;
		y2 = y1;
	}
	var bluediv = document.createElement("div");
	var rectanglewidth = Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
	bluediv.style.width = rectanglewidth+2+'px';
	bluediv.style.height = '2px';
	bluediv.style.borderRadius = '1px';
	bluediv.style.backgroundColor = 'blue';
	bluediv.style.position = 'fixed';
	bluediv.style.zIndex = '100';
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
window.onload = ()=>{
	var painting = document.createElement("div");
	painting.style.zIndex = '-100';
	document.getElementsByTagName("body")[0].appendChild(painting);
	var x=null,y=null;

	var PREVENTD = false;
	window.addEventListener('mousemove',(e)=>{
		if (e.button === 2) {
			PREVENTD = true;

			var newone = getellipse(e.clientX,e.clientY,x,y);
			x=e.clientX;
			y=e.clientY;
			painting.appendChild(newone);
		}
		
	},true);
	window.addEventListener('contextmenu',(e)=>{
		if (e.button === 2 && PREVENTD) {
			PREVENTD = false;
			e.preventDefault();
			painting.innerHTML = ' ';
			x=null;
			y=null;
		}
		
	},true);
}