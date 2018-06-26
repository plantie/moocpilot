// 'const imgName' Moved to common.js for translation

// 'const imgTip' Moved to common.js

const selectColumn = 2; // EG: was 3
const selectLine = 4;
const selectHeader = 3;

const padding = 10;
const margeBetweenScreen = 5;

const screenImgWidth = 1300;
const screenImgHeight = 760;

const screenRatio = screenImgWidth/screenImgHeight;

var screens = document.querySelectorAll("#screenSelectorArea img");

var isDiag = document.location.href.indexOf("diagramme") != -1;
var isForum = document.location.href.indexOf("forum") != -1;

//~ var actualScreenNumber = 0;

document.getElementById("moreOf").value = localStorage.moreOf;
document.getElementById("cohorteSelect").value = localStorage.cohorteSelect;


// EG: click graph.
// parameter is now <div> instead of no
function selectScreen(div){
//~ console.log("selectScreen div="+div);
	if (div!==undefined) {
		var no = $(div).data("no");
		var nos = no.split(",");
		localStorage.screenNumber = parseInt(nos[0]);
		localStorage.screenNumberNext = parseInt(nos[1]);
		localStorage.screenNumberBack = parseInt(nos[2]);
		//~ var screenNumber = parseInt(nos[0]);
	} else {
	}
	var screenNumber = localStorage.screenNumber;
console.log("selectScreen "+screenNumber);
//~ console.log(div);
	localStorage.moreOf = document.getElementById("moreOf").value;
	localStorage.cohorteSelect = document.getElementById("cohorteSelect").value;
	//~ localStorage.screenNumber = screenNumber;
	//~ actualScreenNumber = parseInt(screenNumber);
	//~ switch(parseInt(screenNumber)) {
	var screenInfo = imgName[screenNumber];
	
	console.log("selectScreen div="+div+", "+typeof(div)+", screenNumber="+screenNumber+", target:"+screenInfo['url']+", page: "+document.location.href);
	if (document.location.href.indexOf(screenInfo['url'])<0) {
		setTimeout(function(){document.location.href = screenInfo['url'];}, 1000);
    		swapScreenMode(true);
		return;
	}
	switch(parseInt(screenNumber)) { // actualScreenNumber
    case 10:
    		document.querySelectorAll('input[name="visualisationMode"]')[0].checked = true;
    		setButtonsActive(1);
	break;
    case 1:
    	if(isDiag || isForum){
    		setTimeout(function(){document.location.href = ".";}, 1000);
    		swapScreenMode(true);
        	return;
    	}	else	{
    		document.querySelectorAll('input[name="visualisationMode"]')[0].checked = true;
    		setButtonsActive(1);
    	}
        break;
    case 2:
    	if(isDiag || isForum){
    		setTimeout(function(){document.location.href = ".";}, 1000);
    		swapScreenMode(true);
    		return;
    	}	else	{
    		document.querySelectorAll('input[name="visualisationMode"]')[1].checked = true;
    		setButtonsActive(1);
    	}
    	break;
    case 3:
    	if(isDiag || isForum){
    		setTimeout(function(){document.location.href = ".";}, 1000);
    		swapScreenMode(true);
    		return;
    	}	else	{
    		document.getElementById("moreOf").value = 0;
    		document.querySelectorAll('input[name="visualisationMode"]')[0].checked = true;
    		setButtonsActive(2);
    	}
    	break;
    case 4:
    	if(isDiag){
        	document.getElementById("visualisationMode").value = 0;
    		setButtonsActive(4);
    	}	else	{
    		setTimeout(function(){document.location.href = "diagramme.jsp";}, 1000);
    		swapScreenMode(true);
    		return;
    	}
    	break;
    case 0:
    	if(isDiag){
        	document.getElementById("visualisationMode").value = 1;
    		setButtonsActive(3);
    	}	else	{
    		setTimeout(function(){document.location.href = "diagramme.jsp";}, 1000);
    		swapScreenMode(true);
    		return;
    	}
    	break;
    case 5:
    	if(isDiag){
        	document.getElementById("visualisationMode").value = 2;
    		setButtonsActive(3);
    	}	else	{
    		setTimeout(function(){document.location.href = "diagramme.jsp";}, 1000);
    		swapScreenMode(true);
    		return;
    	}
    	break;
    case 6:
    	if(isDiag){
        	document.getElementById("visualisationMode").value = 3;
    		setButtonsActive(4);
    	}	else	{
    		setTimeout(function(){document.location.href = "diagramme.jsp";}, 1000);
    		swapScreenMode(true);
    		return;
    	}
    	break;
    case 7:
    	if(isDiag){
        	document.getElementById("visualisationMode").value = 4;
    		setButtonsActive(4);
    	}	else	{
    		setTimeout(function(){document.location.href = "diagramme.jsp";}, 1000);
    		swapScreenMode(true);
    		return;
    	}
    	break;
    case 8:
			if(isForum){
				setButtonsActive(4);
			}	else	{
				setTimeout(function(){document.location.href = "forum.jsp";}, 1000);
				swapScreenMode(true);
				return;
			}
    	break;
    case 9:
    	window.open(helpURL);
    	localStorage.screenNumber = "-1";
    	return;
    	break;
    default:
        return;
	}
	/*
	var cibledPict = document.querySelectorAll("#screenSelectorArea div")[parseInt(screenNumber)+1];
	cibledPict.style.width = parseInt(cibledPict.style.width) + 6 + "px";
	cibledPict.style.height = parseInt(cibledPict.style.height) + 6 + "px";
	cibledPict.style.border = "";*/
	
	document.querySelector("#infoDiag span").innerHTML = "<a target='FUN' href='"+localStorage.baseUrl+"/fun/dashboard/problem_stats/index/"+"'>"+translations['dashboard'][localStorage.lang]+"</a><br/>"+
					"<a target='FUN' href='"+helpURL+"'>"+translations['help'][localStorage.lang]+"</a><br/>"+
					imgTip[screenNumber][localStorage.lang]; // updated for multiple language
	// EG R2
	// Added click event -> dashboard
	$('#infoDiag img').click(function (){
		window.open(localStorage.baseUrl+"/fun/dashboard/problem_stats/index/","dashboard");
	});
	
	if (screenNumber==10) {
		$.getJSON( 'data/'+localStorage.moocId+'/csvList.json' + getRandom(), function( list ) {
			console.log(list);
			var no = list[0].weekList[0].pos;
			no = 999;
			var fn;
			list[0].weekList.forEach(function(f,n){
				if (f.isActive && n<no) {
					no = n;
					fn = f.name;
				  console.log("File id: "+f.id+", "+f.name+": "+no);
				}
				});
			var no = 0;
			console.log(no);
			// get CSV...
			$.get( 'data/'+localStorage.moocId+'/0-'+no+'.csv' + getRandom(), function( txt ) {
				csv = txt.split(/\r\n|\n/);
				var head = csv.shift().split(',');
				var idGrade, idQZ1, idTP1, idQZ2, idTP2, idCertif;
				var lqz1, lqz2, ltp1, lTP2;
				head.forEach(function(n,i){
					console.log(i+': '+n);
					if (n=="grade") idGrade=i;
					if (n.match(/Q.*1/)) {idQZ1=i;lqz1=n;}
					if (n.match(/Q.*2/)) {idQZ2=i;lqz2=n;}
					if (n.match(/T.*1/)) {idTP1=i;ltp1=n;}
					if (n.match(/T.*2/)) {idTP2=i;ltp2=n;}
					if (n.match(/Certificate Eligible/)) idCertif=i;
					
					});
				//~ console.log(head);
				console.log([idGrade, idQZ1, idTP1, idQZ2, idTP2, idCertif]);
				var N=0, Nok=0, N1qz=0, N1tp=0, N2qz=0, N2tp=0, N1oktp=0, N1okqz=0, N2oktp=0, N2okqz=0,     N1, N2, N1ok, N2ok;
				csv.forEach(function(line){
					var val = line.split(',');
					N++;
					if (val[idCertif] == 'Y') {
						Nok++;
						if (val[idQZ1] > 0.0) N1okqz++;
						if (val[idTP1] > 0.0) N1oktp++;
						if (val[idQZ1] > 0.0 || val[idTP1] > 0.0) {
							if (val[idQZ2] > 0.0) N2okqz++;
							if (val[idTP2] > 0.0) N2oktp++;
						}
					}
					if (val[idQZ1] > 0.0) N1qz++;
					if (val[idTP1] > 0.0) N1tp++;
					if (val[idQZ1] > 0.0 || val[idTP1] > 0.0) {
						if (val[idQZ2] > 0.0) N2qz++;
						if (val[idTP2] > 0.0) N2tp++;
					}
				});
			var txt = "<div><h3>"+translations['stats'][localStorage.lang]+" ("+fn+")</h3><table border='1'>"
				+"<tr><td>"+translations['N'][localStorage.lang]+"</td><td style='width: 100px;'>"+N+"</td><td></td></tr>"
				+"<tr><td>"+translations['Nok'][localStorage.lang]+"</td><td>"+Nok+"</td><td>"+(100.0*Nok/N).toFixed(2)+"%</td></tr>"
				+"<tr><td>"+translations['N1'][localStorage.lang]+"</td><td>"+lqz1+": "+N1qz+"<br>"+ltp1+": "+N1tp+"</td><td>"+(100.0*N1qz/N).toFixed(2)+"%<br>"+(100.0*N1tp/N).toFixed(2)+"%</td></tr>"
				+"<tr><td>"+translations['N2'][localStorage.lang]+"</td><td>"+lqz2+": "+N2qz+"<br>"+ltp2+": "+N2tp+"</td><td>"+(100.0*N2qz/N).toFixed(2)+"%<br>"+(100.0*N2tp/N).toFixed(2)+"%</td></tr>"
				+"<tr><td>"+translations['N1ok'][localStorage.lang]+"</td><td>"+lqz1+": "+N1okqz+"<br>"+ltp1+": "+N1oktp+"</td><td>"+(100.0*N1okqz/N).toFixed(2)+"%<br>"+(100.0*N1oktp/N).toFixed(2)+"%</td></tr>"
				+"<tr><td>"+translations['N2ok'][localStorage.lang]+"</td><td>"+lqz2+": "+N2okqz+"<br>"+ltp2+": "+N2oktp+"</td><td>"+(100.0*N2okqz/N).toFixed(2)+"%<br>"+(100.0*N2oktp/N).toFixed(2)+"%</td></tr>"
				+"</table></div>";
			$('#svgPanel').html(txt).css({width: "800px"});
			// reload ...
			$('#screenSelectorCover').click(function(){document.location.href = "index.jsp"+getRandom()});
			$('#waitingPanel').css({display: "none"});
			$('#minimap').css({display: "none"});
			$('#noParameters').css({display: "none"});
			$('#otherOption').css({display: "none"});
			});
		});
	}
	localStorage.screenNumber = "-1";
	swapScreenMode(false);
	changeScreen = false;
	if(firstLoad && !isForum){
		useJSON();
		firstLoad = false;
	}	else	{
		if(isForum){

		}	else 	if(isDiag){
			callDisplayDiagramme();
    	}	else	{
    		resetStudent();
    		changeModeVisualisation();
    	}
	}
}

document.querySelectorAll("#screenSelectorArrows img")[0].addEventListener("click", previousScreen);
document.querySelectorAll("#screenSelectorArrows img")[1].addEventListener("click", nextScreen);
var changeScreen = false;
function nextScreen(){
	changeScreen = true;
	animChangeScreen();
	// EG: known next 
console.log("nextScreen, no="+localStorage.screenNumberNext);
	selectScreen($('#screen'+localStorage.screenNumberNext));
/*
	if(actualScreenNumber >= 8){
		selectScreen(0);
	}	else	{
		selectScreen(actualScreenNumber+1);
	}
*/
}

function previousScreen(){
	changeScreen = true;
	animChangeScreen();
	// EG: known back 
console.log("nextScreen, no="+localStorage.screenNumberBack);
	selectScreen($('#screen'+localStorage.screenNumberBack));
/*
	if(actualScreenNumber == 0){
		selectScreen(8);
	}	else	{
		selectScreen(actualScreenNumber-1);
	}
*/
}

function animChangeScreen(){
	if(isNaN(parseInt(document.getElementById("screenSelectorArea").style.transform.slice(8)))){
		document.getElementById("screenSelectorArea").style.transform = "rotateY(360deg)";
	}	else	{
		document.getElementById("screenSelectorArea").style.transform = "rotateY(" + (parseInt(document.getElementById("screenSelectorArea").style.transform.slice(8)) + 360) + "deg)";
	}
}

function screenSelectorBigDisplay(){
	document.getElementById("screenSelectorArea").style.width = "calc(100% - 250px)";
	document.getElementById("screenSelectorArea").style.height = "calc(100% - 80px)";
	document.getElementById("screenSelectorArea").style.top = "80px";
	document.getElementById("screenSelectorArea").style.left = "280px";
	document.getElementById("screenSelectorCover").style.pointerEvents = "none";
	setTimeout(function(){document.getElementById("screenSelectorCover").style.pointerEvents = "none";}, 2000);
}

function screenSelectorReturnButton(){
	document.getElementById("screenSelectorArea").style.width = "";
	document.getElementById("screenSelectorArea").style.height = "";
	document.getElementById("screenSelectorArea").style.top = "";
	document.getElementById("screenSelectorArea").style.left = "";
	document.getElementById("screenSelectorArea").style.left = "";
	document.getElementById("screenSelectorCover").style.pointerEvents = "";
	//setTimeout(function(){document.getElementById("screenSelectorCover").style.pointerEvents = ""; }, 2000);
}


var screenSelectorMode = false; //false pleine page | true réduit
var isTraveling = false;
var firstLoad = true;
setNames();
var firstRun;

var isChangingPage = true;

if(localStorage.screenNumber != undefined && localStorage.screenNumber != "-1"){
	setTransition(true);
	//~ selectScreen(localStorage.screenNumber);
	selectScreen(undefined);
}	else	{
	setTransition(false);
	screenSelectorSizer();
}
function setTransition(isp){
	isChangingPage = isp;
	firstRun = !isp;

	if(isp){
		setTimeout(function(){document.getElementById("screenSelectorArea").style.transition = "all 2s, z-index 0s";}, 500);
	}	else	{
		document.getElementById("screenSelectorArea").style.transition = "all 2s, z-index 0s";
	}
}

function swapScreenMode(changePage){
	if(isTraveling || changeScreen == true){
		return;
	}
	isTraveling = true;
	screenSelectorMode = !screenSelectorMode;
	if(changePage == false){
		contextChange();
	}
	
	if(isChangingPage){
		setSmall();
		isChangingPage = false;
	}	else	{
		screenSelectorSizer();
	}
	setTimeout(function(){isTraveling = false}, 2000);
}
contextChange();

function contextChange(){
	if(screenSelectorMode){
		document.getElementById("screenSelectorArrows").style.display = "inherit";
		document.getElementById("screenSelectorMenu").style.display = "none";
		document.getElementById("titleView").style.display = "inherit";
		if(!isForum){
			document.getElementById("noParameters").style.display = "inherit";
		}

		if(isForum){
			if(document.getElementById("svgCore") != undefined){
				document.getElementById("svgCore").style.display = "inherit";
			}
		}	else	if(isDiag){
			document.getElementById("svgContainer").style.display = "inherit";
		}	else	{
			document.getElementById("svgPanel").style.display = "inherit";
			document.getElementById("minimapContainer").style.display = "inherit";
		}
		
		
	}	else	{
		document.getElementById("screenSelectorArrows").style.display = "none";
		document.getElementById("screenSelectorMenu").style.display = "inherit";
		document.getElementById("titleView").style.display = "none";
		document.getElementById("noParameters").style.display = "none";


		if(isForum){
			if(document.getElementById("svgCore") != undefined){
				document.getElementById("svgCore").style.display = "inherit";
			}
		}	else if(isDiag){
			document.getElementById("svgContainer").style.display = "none";
			document.getElementById("tableau").style.display = "none";
		}	else	{
			document.getElementById("svgPanel").style.display = "none";
			document.getElementById("minimapContainer").style.display = "none";
		}
	}
}

var picts = document.querySelectorAll("#screenSelectorArea img");
window.addEventListener("resize", screenSelectorResizer);

function screenSelectorResizer(){
	firstRun = true;
	document.getElementById("screenSelectorArea").style.transition = "none";
	screenSelectorSizer();
	setTimeout(function(){document.getElementById("screenSelectorArea").style.transition = "all 2s, border 0s";}, 500)
}

// EG: Fill test labels, but use data-no to identify what to use
function setNames(){
//~ console.log("setNames !!!");
	
	$( "#screenSelectorArea div.tooltips" ).each(function( index ) {
		var no = $( this ).data("no");
		if (no !== undefined) {
		  //~ console.log( "setNames index "+index + ", no "+no);
		  var nos = no.split(","); // current, next, back
		  no = nos[0];
		  console.log( "setNames index "+index + ", nos "+nos+": "+imgName[no][localStorage.lang]);
		  imgName[no]['next'] = parseInt(nos[1]);
		  imgName[no]['back'] = parseInt(nos[2]);
		  $('a', this).text(imgName[no][localStorage.lang]);
		  $('span', this).html("["+no+"] "+imgTip[no][localStorage.lang]);
		  $('img', this).attr('src', "Ressources/"+imgName[no]['img']);
		}
	});
	
/*
	var pictsA = document.querySelectorAll("#screenSelectorArea a");
	var pictsSpan = document.querySelectorAll("#screenSelectorArea span");
	var pictsImg = document.querySelectorAll("#screenSelectorArea img");
	for(var i = 0; i < pictsA.length;i++){
		pictsA[i].innerText = imgName[i][localStorage.lang];
		pictsSpan[i].innerHTML = imgTip[i][localStorage.lang];
		pictsImg[i].src = "Ressources/"+imgName[i]['img'];
	}
*/
}

function setSmall(){
	var pictWidth = 14;
	var pictHeight = 7;
console.log("*** setSmall");
	$('#screenSelectorArea').css({'top': '80px', 'left': '75px', 'width': '68.4px', 'height': '40px', 'padding': '5px 0px 5px 15px', 'zIndex': 14});
	$('#screenSelectorCover').css({'pointerEvents': '', 'margin': '-5px 0px 0px -10px'});

	//~ var box = document.getElementById("screenSelectorArea");

		//~ document.getElementById("screenSelectorCover").style.pointerEvents = "";
	//~ box.style.top = "80px";
	//~ box.style.left = "75px";
	//~ box.style.width = "68.4px";
	//~ box.style.height = "40px";
	//~ box.style.padding = "5px 0px 5px 15px";
	//~ box.style.zIndex = 14;
	//~ document.getElementById("screenSelectorCover").style.margin = "-5px 0px 0px -10px";
	
	var picts = document.querySelectorAll("#screenSelectorArea img");
	
	for(var i = 0; i < picts.length;i++){
		picts[i].parentElement.style.transition = "";
		picts[i].parentElement.firstElementChild.firstElementChild.style.transition = "";

		picts[i].parentElement.style.height = pictHeight + "px";
		picts[i].parentElement.style.width = pictWidth + "px";
		
		if(i < selectColumn * (selectLine-1)){
			picts[i].parentElement.style.marginBottom = "5px";
			//~ console.log("	marginBottom 5px, i="+i);
		}
		if(0 !=  (i+1) % selectColumn){
			picts[i].parentElement.style.marginRight = "5px";
			//~ console.log("	marginRight 5px, i="+i);
		}
		
		
		picts[i].style.height = "100%";
		picts[i].parentElement.firstElementChild.style.height = "0px";
		picts[i].parentElement.firstElementChild.firstElementChild.style.fontSize = "0vh";
	}
	//$('#screenSelectorArea img').css({'marginBottom': '50px', 'marginRight': '50px'});
}

function screenSelectorSizer(){
	var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = w.innerWidth || e.clientWidth || g.clientWidth,
	y = w.innerHeight|| e.clientHeight|| g.clientHeight;

	if(x<1200){
		x = 1200;
	}
	var headerSize = 20*selectHeader;
	
	if(screenSelectorMode){
		var pictWidth = 14+10;
		var pictHeight = 7;
		
	}	else	{	
		setButtonsActive(0);
		var pictMaxWidth = (x - 270 - 2 * padding - (selectColumn-1) * margeBetweenScreen                         -200) / selectColumn;
		var pictMaxHeight = (y - 100 - 2 * padding - (selectLine-1) * margeBetweenScreen -headerSize - 50) / selectLine;
		var pictMaxHeight = (y - 140) / 3; // on veux 3 ...OK

		if(pictMaxWidth/screenRatio < pictMaxHeight){
			var pictWidth = pictMaxWidth;
			var pictHeight = pictMaxWidth/screenRatio;	
		}	else	{
			var pictWidth = pictMaxHeight*screenRatio;
			var pictHeight = pictMaxHeight;	
		}
		
	}
	var box = document.getElementById("screenSelectorArea");
console.log("screenSelectorSizer, screenSelectorMode="+screenSelectorMode+", firstRun="+firstRun+", xy=("+x+", "+y+") pict ("+pictWidth+","+pictHeight+") max ("+pictMaxWidth+","+pictMaxHeight+"), screenRatio="+screenRatio);

	if(screenSelectorMode){
		document.getElementById("screenSelectorCover").style.pointerEvents = "";
		box.style.top = "80px";
		box.style.left = "75px";
		box.style.width = "68.4px";
		box.style.height = "40px";
		box.style.padding = "5px 0px 5px 15px";
		box.style.zIndex = 14;
		document.getElementById("screenSelectorCover").style.margin = "-5px 0px 0px -10px";
	}	else	{
		if(firstRun){
			document.getElementById("screenSelectorCover").style.pointerEvents = "none";
		}	else	{
			setTimeout(function(){document.getElementById("screenSelectorCover").style.pointerEvents = "none";}, 2000);
		}
		box.style.top = "80px";
		box.style.left = "250px";
		box.style.width = (pictWidth * selectColumn + (selectColumn-1) * margeBetweenScreen + 10)+"px";
		box.style.height = (y-100)+"px";
		//box.style.height = (pictHeight * selectLine + (selectLine-1) * margeBetweenScreen + headerSize + 30)+"px";
		box.style.padding = "10px";
		box.style.zIndex = 0;
		document.getElementById("screenSelectorCover").style.margin = "-10px 0px 0px -10px";
	}
	
	var picts = document.querySelectorAll("#screenSelectorArea img");
	
	// picts[i].parentElement -> '#screenSelectorArea div.block'
	
	//EG TODO pictWidth-10 ???
	$('#screenSelectorArea div.block').css({height: pictHeight + "px", width: (pictWidth-10) + "px", marginBottom: "5px", marginRight:"5px"});
	//$('#screenSelectorArea div.block').css({height: pictHeight + "px", width: 200 + "px", marginBottom: "5px", marginRight:"5px"}); // EG test
	if(!firstRun){
		$('#screenSelectorArea div.block').css({transition: "all 2s, border 0s"});
	}
	setTimeout(resetTransition, 2000);
	if(screenSelectorMode){
		$('#screenSelectorArea div.block div a').css({transition: "all 0.5s", fontSize:"0vh"});
		$('#screenSelectorArea div.headline').css({transition: "all 0.5s", fontSize:"0vh"});
		$('#screenSelectorArea img').css({height: "100%"});
		$('#screenSelectorArea div.block div').css({height: "0px"});
	} else {
		$('#screenSelectorArea div.block div a').css({transition: "all 0.5s 1.5s", fontSize:"2vh"});
		$('#screenSelectorArea div.headline').css({transition: "all 0.5s 1.5s", fontSize:"2.3vh"}); // EG plus gros !
		$('#screenSelectorArea img').css({height: "calc(100% - 50px)"});
		$('#screenSelectorArea div.block div').css({height: "50px"});
	}
		// EG: scrollbar activation !
		$('#screenSelectorArea').css({'overflow-y': screenSelectorMode ? 'hidden' : 'scroll'});
		$('#screenSelectorArea').css({'overflow-x': screenSelectorMode ? 'hidden' : 'scroll'});
/*	
	for(var i = 0; i < picts.length;i++){
		if(!firstRun){
			picts[i].parentElement.style.transition ="all 2s, border 0s";
		}
				
		setTimeout(resetTransition, 2000);
		picts[i].parentElement.style.height = pictHeight + "px";
		picts[i].parentElement.style.width = pictWidth + "px";
		
		if(i < selectColumn * (selectLine-1)){
			picts[i].parentElement.style.marginBottom = "5px";
		}
		if(0 !=  (i+1) % selectColumn){
			picts[i].parentElement.style.marginRight = "5px";
		}
		
		picts[i].parentElement.addEventListener("mouseover", function(){
			if(isTraveling){
				return;
			}
			this.style.border = "3px solid black";
		});
		picts[i].parentElement.addEventListener("mouseout", function(){
			this.style.border = "";
		});
		
		if(screenSelectorMode){
			picts[i].parentElement.firstElementChild.firstElementChild.style.transition = "all 0.5s";
			picts[i].style.height = "100%";
			picts[i].parentElement.firstElementChild.style.height = "0px";
			picts[i].parentElement.firstElementChild.firstElementChild.style.fontSize = "0vh";
		}	else	{
			picts[i].parentElement.firstElementChild.firstElementChild.style.transition = "all 0.5s 1.5s";
			picts[i].style.height = "calc(100% - 50px)";
			picts[i].parentElement.firstElementChild.style.height = "50px";
			picts[i].parentElement.firstElementChild.firstElementChild.style.fontSize = "2vh";
		}
	}
*/
	if(firstRun){
		firstRun = false;
	}
}

function resetTransition(){
	$('#screenSelectorArea div.block').css({transition: ""});
/*
	var picts = document.querySelectorAll("#screenSelectorArea img");
	for(var i = 0; i < picts.length;i++){
		picts[i].parentElement.style.transition ="";
	}
*/
}
//~ $('#screenSelectorArea').css({'overflow-y': 'scroll'});
//~ $('#screenSelectorArea').css({'overflow-x': 'scroll'});
//~ console.log('**************************************** ICI   **************************************************');
//~ $('#screenSelectorArea').css({'overflow-y': 'hidden'});
//~ $('#screenSelectorArea').css({'overflow-x': 'hidden'});


function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function setButtonsActive(index){
	// EG recup old comment
	console.log(">setButtonsActive, "+index);
	// EG: title added
	//~ $('#screenSelectorArea div.headline').css({'height': '5px', 'background-color': 'red'});
	$('#screenSelectorArea div.headline').css({'display': index ? 'none' : 'inline'});
	// *** index.jsp ***
	// nom d'un eleve
	// #studentLegend
	// #otherOption
	// #realOptions
	// zoom
	// Cohorte
	
	// *** diagramme.jsp ***
	// #parameters
	// #pourcentDiv
	// sizeBarText (zoom)
	// classement
	// 	(commented) weekMode
	// #exerciseSelector
	// #legendContainer (vide: participants / non participants)
	var allButtons = document.querySelectorAll(".notRequired");
	for(var i = 0; i < allButtons.length; i++){
		allButtons[i].style.display = "none";
	}
	switch(index) {
    case 1://cumulé et réparti
    	allButtons[2].style.display = "inherit";
    	allButtons[4].style.display = "inherit";
    	allButtons[5].style.display = "inherit";
    	if(displayedOptions){
    		document.getElementById("realOptions").style.display = "inherit";
    	}
        break;
    case 2://suivi étudiant
    	allButtons[0].style.display = "inline-block";
    	allButtons[1].style.display = "inherit";
    	allButtons[2].style.display = "inherit";
    	if(displayedOptions){
    		document.getElementById("realOptions").style.display = "inherit";
    	}
    	break;
    case 3://diagrammeNoWeek
    	for(var i = 0; i < allButtons.length; i++){
    		if(i != 3){
        		allButtons[i].style.display = "inherit";
    		}
    	}
    	break;
    case 4://diagramme
    	for(var i = 0; i < allButtons.length; i++){
       		allButtons[i].style.display = "inherit";
    	}
    	break;
    case 5://forum
    	for(var i = 0; i < allButtons.length; i++){
       		allButtons[i].style.display = "inherit";
    	}
    	break;
    default:
    	break;
	}	
}

// Function to display or not toolTips
displayToolTip();
function displayToolTip(inp){
	$('.tooltips span').css('display', $('#tooltipDisplay').prop('checked') ? 'inherit' : 'none')
	$('#infoDiag span').css('display', 'inherit');
	
	$('#infoDiag span').css({'visibility': 'hidden'});
	// EG: display info dialog top
	$('#infoDiag').mouseover(function(evt){
		console.log("infoDiag mouseover "+evt);
		$('#infoDiag span').css({'visibility': 'visible'});
	});
	$('#infoDiag span').mouseout(function(evt){
		$('#infoDiag span').css({'visibility': 'hidden'});
	});
/*
	var tooltipsSpan = document.querySelectorAll(".tooltips span");
	var newState;
	if(document.getElementById("tooltipDisplay").checked){
		newState = "inherit";
	}	else	{
		newState = "none";
	}
	for(var i = 1; i < tooltipsSpan.length; i++){
		tooltipsSpan[i].style.display = newState;
	}
*/
}




