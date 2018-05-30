OIA = -1;
cellMax = 0;
cellMaxByType = 0;
menu = 0;
var changeMoreOf = false;
var displayedOptions = false;
document.getElementById("studentSelect").value = "";
document.getElementById("moreOf").disabled = false;

/*
if(!isSetPresentationCookie()){
	displayPresentation();
}	else{
	callSavedJSON(useJSON);
}*/

(function () {//rend compatible les custom event avec tout les navigateurs

	  if ( typeof window.CustomEvent === "function" ) return false;

	  function CustomEvent ( event, params ) {
	    params = params || { bubbles: false, cancelable: false, detail: undefined };
	    var evt = document.createEvent( 'CustomEvent' );
	    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
	    return evt;
	   }

	  CustomEvent.prototype = window.Event.prototype;

	  window.CustomEvent = CustomEvent;
})();


document.getElementById("slideBar").addEventListener("input", onInputActualisation);


//document.querySelectorAll('input[name="visualisationMode"]')[1].checked = true;
var dataReceived = false;
//callSavedJSON(function(){dataReceived = true});
courseName(function(){callSavedJSON(function(){dataReceived = true});}, "");

//document.getElementById("visualisationMode").value = "0";
/*document.getElementById("maxPeriodeToggle").addEventListener("change", actualisation);*/
document.getElementById("maxCategorieToggle").addEventListener("change", function(){actualisation(3, 0);});
//document.getElementById("weekMode").addEventListener("change", prepareAll);
document.getElementById("download").addEventListener("click", svgToPng);
document.getElementById("cohorteSelect").value = "";
var demoPagesIndex = 0;
//demoPages = document.getElementById("demoContent").children;
//changeDemoPage();

//document.getElementById("optionsRoller").addEventListener("click", optionsRoller);
document.getElementById("slideBar").addEventListener("input", displaySlideBar);

var listDataSelection = document.getElementById("dataSelection").children;
for(var i = 0; i < listDataSelection.length; i++){
	listDataSelection.item(i).addEventListener("click", dataSelected);
}
//listDataSelection.item(0).style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.55) inset";

//dataSelectedCall(localStorage.selectedMenu);
/*
listDataSelection.item(localStorage.selectedMenu).style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 1) inset";
listDataSelection.item(localStorage.selectedMenu).style.fontWeight = "bold"
document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau de progression des élèves\nDonnèes de démonstrations";*/

/*var listViewSelection = document.querySelectorAll("#viewSelection a");
for(var i = 0; i < listViewSelection.length; i++){
	listViewSelection.item(i).addEventListener("click", viewSelected);
}
listViewSelection.item(0).style.boxShadow = "inset 0 0 10px RGBA(0, 0, 0, 0.23)";*/

//callDemoJSON(useJSON);

/*document.querySelector("#helpButton").addEventListener("click", openHelpSection);
document.querySelector("#helpSection svg").addEventListener("click", closeHelpSection);*/

//document.querySelector("#bullePopup svg:last-child").addEventListener("click", function () { document.getElementById("emailContains").value = ""; closeBullePopup(); updateSelectedId(new Array()); actualisation(); });
document.querySelector("#bullePopup #visualiseCohorteButton").addEventListener("click", function (evt) {
    //document.getElementById("cohorteSelect").value = "";
	changeSelectedCohorte(openBulleContentI,openBulleContentJ); 
	updateSelectedId(openBulleContent);
	if(menu == 1){
		document.querySelector('input[name="visualisationMode"]:checked').checked = true;
		//document.getElementById("visualisationMode").value = "0";
		menu = 0;
	}
	actualisation(0, 0);
});

document.querySelector("#bullePopup #visualiseCohorteToggle").addEventListener("change", onVisualiseCohorteToggle);

document.querySelectorAll("#bullePopup button").item(1).addEventListener("click", PetiteFenetre);
document.getElementById("resetSelectedCohorte").addEventListener("click", function () { closeBullePopup(); updateSelectedId(new Array()); actualisation(1, 0); });
var openBulleContent;
var openBulleContentI;
var openBulleContentJ;
var bullePopupRotation = 0;

minimapCadre();
window.onscroll = function() {minimapCadre()};

document.getElementById("cadre").addEventListener("mousedown", cadreSelect);
document.body.addEventListener("mousemove", cadreMove);
/*document.getElementById("cadre").addEventListener("mouseup", cadreUnselect);*/
document.body.addEventListener("mouseup", cadreUnselect);
document.getElementById("minimapSize").value = 10;

function openBullePopup(d, i, j, x, y, size) {
	/*
	if(document.querySelector("#bullePopup").style.left == ""){
	    document.querySelector("#bullePopup").style.left = x + size + 15 +"px";
	    document.querySelector("#bullePopup").style.top = y - 65 + "px";
	}*/
	
	if(document.getElementById("studentSelect").parentElement.style.display != "none"){
		return;
	}

    document.querySelector("#bullePopup").style.left = x + size - 20 +"px";
    document.querySelector("#bullePopup").style.top = y - 2*size + "px";
    
    document.querySelector("#bullePopup").style.transform = "rotateY(" + bullePopupRotation + "deg)";
	bullePopupRotation+=360;
	
	setTimeout(function(){document.querySelector("#bullePopup a").innerText = d.length+" élèves \ncollecte "+j+"  \n"+tabCohorte[0][i];updateBulleStudentList();},250);
		
	openBulleContent = d;
	openBulleContentI = i;
	openBulleContentJ = j;
	document.getElementById("bullePopup").style.display = "inherit";
	visualiseCohorteToggled();
}

function updateBulleStudentList(){
	var ciblesEleves = tabEleves.filter(function( eleve ) {
		  return openBulleContent.indexOf(eleve.id) != -1;
	}).sort(function(a,b) {return (a.login.toLowerCase() > b.login.toLowerCase()) ? 1 : ((b.login.toLowerCase() > a.login.toLowerCase()) ? -1 : 0);} ); ;
	
    document.getElementById("bulleStudentList").innerHTML = "";
    var option = document.createElement("option");
    option.value = "";
    option.text = "Tous les élèves";
    document.getElementById("bulleStudentList").appendChild(option);    

    for (var i = 0; i < ciblesEleves.length; i++) {
        var option = document.createElement("option");
        option.value = ciblesEleves[i].id;
        option.text = ciblesEleves[i].login;
        document.getElementById("bulleStudentList").appendChild(option);
    }
}

function updateBulleStudentListCall(){
	document.getElementById("studentSelect").value = document.getElementById("bulleStudentList").value;
	changeStudent();
}

function visualiseCohorteToggled() {
    if (document.getElementById("visualiseCohorteToggle").style.display == "none") {
        return;
    }
    if (document.getElementById("visualiseCohorteToggle").checked) {
        changeSelectedCohorte(openBulleContentI, openBulleContentJ);
        updateSelectedId(openBulleContent);
        actualisation(2, 0);
    }
}

function onVisualiseCohorteToggle() {
    if (document.getElementById("visualiseCohorteToggle").style.display == "none") {
        return;
    }
    if (document.getElementById("visualiseCohorteToggle").checked) {
        visualiseCohorteToggled();
    } else {
        updateSelectedId(new Array());
        actualisation(2, 0);
    }
}

var popup;

function PetiteFenetre() {
	if(popup != undefined){
		popup.close();
	}
	popup = open("", "DisplayWindow", "scrollbars=yes, width=500");
	popup.document.write('<html><head><link rel="stylesheet" type="text/css" href="Styles/popup.css"></head><body>');
	popup.document.write("<table id = 'tableauDeux'><tr><td>ID</td><td>PSEUDO</td><td>EMAIL</td><td>VISUALISER</td></tr>");
	var ciblesEleves = tabEleves.filter(function( eleve ) {
		  return openBulleContent.indexOf(eleve.id) != -1;
	}).sort(function(a,b) {return (a.login.toLowerCase() > b.login.toLowerCase()) ? 1 : ((b.login.toLowerCase() > a.login.toLowerCase()) ? -1 : 0);} ); ;
    for (var i = 0; i < ciblesEleves.length; i++) {
    	popup.document.write("<tr><td>" + ciblesEleves[i].id + "</td><td>" + ciblesEleves[i].login + "</td><td>" + ciblesEleves[i].email + "</td><td><button onclick = 'window.opener.document.getElementById(\"studentSelect\").value = "+ciblesEleves[i].id+";window.opener.changeStudent();window.opener.focus();'>Visualiser</button></td></tr>");
    }
	/*
    for (var i = 0; i < openBulleContent.length; i++) {
    	var cibleEleve = tabEleves.filter(function( eleve ) {
    		  return eleve.id == openBulleContent[i];
  		});
        msg.document.write("<tr><td>" + cibleEleve[0].id + "</td><td>" + cibleEleve[0].login + "</td><td>" + cibleEleve[0].email + "</td></tr>");
    }*/
    popup.document.write("</table>");
    //window.opener
}

function closeBullePopup(){
	document.getElementById("bullePopup").style.display = "none";
	changeCircle(undefined, undefined);
}

function optionsRoller(evt){
	if(evt.target.parentElement.style.transform.indexOf("(0deg)") != -1){
		evt.target.parentElement.style.transform = "rotate(-180deg)";
		evt.target.parentElement.parentElement.style.right = "0px";
	}	else	{
		evt.target.parentElement.style.transform = "rotate(0deg)";
		evt.target.parentElement.parentElement.style.right = "-212px";
	}
}

function displaySlideBar(evt){
	document.getElementById("slideBarDisplay").textContent = "C"+(parseInt(evt.target.value)+1);
}

function changeModeVisualisation(){
console.log("changeModeVisualisation !")
	//menu = parseInt(document.getElementById("visualisationMode").value);
	menu = parseInt(document.querySelector('input[name="visualisationMode"]:checked').value) + parseInt(document.querySelector('input[name="visualisationModeOption"]:checked').value);
	//menu = parseInt(document.querySelector('input[name="visualisationMode"]:checked').value);
	if(menu != 1){
	    document.querySelector("#bullePopup #visualiseCohorteButton").style.display = "";
	    document.querySelector("#bullePopup #visualiseCohorteToggleDiv").style.display = "";
    } else {
	    document.querySelector("#bullePopup #visualiseCohorteButton").style.display = "block";
	    document.querySelector("#bullePopup #visualiseCohorteToggleDiv").style.display = "none";
	}
	generateTable();
	closeBullePopup();
	updateSelectedId(new Array());
	actualisation(0, 0);
}


function dataSelected(evt){
	for(var i = 0; i < listDataSelection.length; i++){
		if(listDataSelection.item(i) === evt.currentTarget){
		    listDataSelection.item(i).style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 1) inset";
		    listDataSelection.item(i).style.fontWeight = "bold"
		    	/*
		    if(i == 0){
		    	document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau des progressions des élèves\nDémonstrations";
		    }	else	if(i == 1){
		    	document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau des progressions des élèves\nDonnèes de démonstrations";
		    	localStorage.selectedMenu = 1;
		    }	else	if(i == 2){
				document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau des progressions des élèves\nVos données";
		    }	else	{
				document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau des progressions des élèves\n MOOC : " + courseName;
				localStorage.selectedMenu = 3;
		    }*/
		}	else	{
			listDataSelection.item(i).style.boxShadow = "";
			listDataSelection.item(i).style.fontWeight = ""
		}
	}
}

function dataSelectedCall(index){
	for(var i = 0; i < listDataSelection.length; i++){
		if(i == index){
		    //listDataSelection.item(i).style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.55) inset";//"0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset";
		    listDataSelection.item(i).style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 1) inset";
		    listDataSelection.item(i).style.fontWeight = "bold"
		    /*
		    if (i == 0) {
				document.getElementById("demoPanel").style.display = "inline-block";
			}	else	{
				document.getElementById("demoPanel").style.display = "none";
			}*/
		    if(i == 0){
		    	document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau de progression des élèves\nDémonstrations";
		    }	else	if(i == 1){
		    	document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau de progression des élèves\nDonnèes de démonstrations";
		    	localStorage.selectedMenu = 1;
		    }	else	if(i == 2){
				document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau de progression des élèves\nVos données";
		    }	else	{
				document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau de progression des élèves\n MOOC : " + courseName;
				localStorage.selectedMenu = 3;
		    }
		}	else	{
			listDataSelection.item(i).style.boxShadow = "";
			listDataSelection.item(i).style.fontWeight = ""
		}
	}
}

function changeMoreOfValue(){
	changeMoreOf = true;
	actualisation(0, 0);
}


var moreOfTimer;
function startMoreOf(){
	moreOfTimer = setTimeout(changeMoreOfValue, 800);
}


function onEnterMoreOf(e) {
    if (e.keyCode == 13) {
    	changeMoreOfValue();
    }
}

function stopMoreOf(){
	clearTimeout(moreOfTimer);
	startMoreOf();
}


var EmailArea;
function startEmailArea(){
    EmailArea = setTimeout(timerAction, 500);
}


function onEnter(e) {
    if (e.keyCode == 13) {
    	timerAction();
    }
}

function stopEmailArea(){
	clearTimeout(EmailArea);
	startEmailArea();
}

function timerAction(){
	closeBullePopup(); 
	changeSelectedCohorte(undefined, undefined);
	changeCircle(undefined, undefined); 
	updateSelectedIdByInfo(document.getElementById("infoContains").value); 
	updateSelectedId(new Array()); 
	document.getElementById("studentInfo").style.display = "inline-block";
	document.querySelector("#studentInfo #studentInfoText").innerHTML = stringInfo(document.getElementById("infoContains").value);
	
	actualisation(1, 0); 
}



function setSmileySize(student){
	var synthesis = [0,0,0,0];
	for(var i = 0; i < student.tabNotes.length;i++){
		if(student.tabNotes[i].semaine != -1){
			synthesis[Math.ceil(student.tabNotes[i].note/0.25)-1]++;
		}
	}
	var synthesisMax = Math.max.apply(Math, synthesis);
	var synthesisMin = Math.min.apply(Math, synthesis);
	var rapport = 16/(synthesisMax - synthesisMin);
	if(rapport == undefined){
		rapport = 0;
	}
	var smileys = document.querySelectorAll("#studentInfo .smileys");
	for(var i = 0; i < 4; i++){
		if(synthesis[3-i] == 0){
			smileys[i].style.height = "5px";
			smileys[i].style.marginBottom = "0px";
		}	else	{
			smileys[i].style.height = (16 + (synthesis[3-i] - synthesisMin)* rapport) + "px";
			smileys[i].style.marginBottom = (16-(synthesis[3-i] - synthesisMin)* rapport)/2 - 10 + "px";
		}
	}
	
    tipSmiley = d3.tip()
	  .attr('class', 'd3-tip')
	  .offset([-10, 0])
	  .html(function (d, i, j) {	
		  return synthesis[3-i] + "/"+ student.tabNotes.length + " notes";
	  });
	  
	svg.call(tipSmiley);
	
	d3.selectAll("#studentInfo .smileys")
	.on('mouseover', tipSmiley.show)
	.on('mouseout', tipSmiley.hide);
	
	var data = [(synthesis[2] + synthesis[3])/student.tabNotes.length*100, (synthesis[0] + synthesis[1])/student.tabNotes.length*100, (student.tabNotes.length - synthesis.reduce(function(pv, cv) { return pv + cv; }, 0))/student.tabNotes.length*100];

	var names = [(synthesis[2] + synthesis[3]), (synthesis[0] + synthesis[1]), (student.tabNotes.length - synthesis.reduce(function(pv, cv) { return pv + cv; }, 0)), student.tabNotes.length];
	studentPie(data, names);
}


function resetStudent(){
	uniqueId = new Array();
	document.getElementById("studentInfo").style.display = "none";
	document.getElementById("studentSelect").value = "";
	
    if(document.getElementById("cohorteSelect").value == ""){
    	document.getElementById("studentSelect").style.backgroundColor = "#00f6";
    }	else	{
    	document.getElementById("studentSelect").style.backgroundColor = "yellow";
    }
    actualisation(1, 0); 
}

function stringInfo(idStudent){
	var student = tabEleves.filter(function( eleve ) {
		  return eleve.id == idStudent || eleve.login == idStudent || eleve.email == idStudent;
	})[0];
	setSmileySize(student);
	if(student == undefined){
		return "";
	}	else	{
		//return "Id : " + student.id + "    Nom : " + student.login + "    Email : " + student.email;
		return "Id : " + student.id + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Email : " + student.email;
	}
}

function changeCohorte() {
    closeBullePopup(); 
    changeSelectedCohorte(undefined, undefined);
	document.getElementById("studentSelect").value = "";
	document.getElementById("studentInfo").style.display = "none";

    changeCircle(undefined, undefined); 
    updateSelectedIdByCohorteName(document.getElementById("cohorteSelect").value); 
    updateSelectedId(new Array()); 
    uniqueId = new Array();
    updateListStudent();
    
    actualisation(1, 0);
}

function viewSelected(evt){
	console.log("UTILE????")
	for(var i = 0; i < listViewSelection.length; i++){
		if(listViewSelection.item(i) === evt.target){
			listViewSelection.item(i).style.boxShadow = "inset 0 0 10px RGBA(0, 0, 0, 0.23)";
			menu = i;
		}	else	{
			listViewSelection.item(i).style.boxShadow = "";
		}
	}
	actualisation();
}

function nextDemoPage(){
	demoPageNone();
	if(demoPagesIndex < demoPages.length-1){
		demoPagesIndex++;
		changeDemoPage();
	}
}

function previousDemoPage(){
	demoPageNone();
	if(demoPagesIndex > 0){
		demoPagesIndex--;
		changeDemoPage();
	}
}

function changeDemoPage(){
	for(var i = 0; i < demoPages.length; i++){
		if(i == demoPagesIndex){
			demoPages.item(i).style.display = "inherit";
			document.getElementById("demoNavigationDisplay").textContent = "Page "+(i+1)+"/"+demoPages.length;
		}	else	{
			demoPages.item(i).style.display = "none";
		}
	}
	if(demoPagesIndex == 1){
		demoPageTwo();
	}
}

function demoPageNone(){
	var listText = d3.selectAll(".circleText")[0];
	for(var i = 0; i < listText.length; i++){
		if(isNaN(listText[i].innerHTML)){
			listText[i].style.fill = "black";
			listText[i].style.fill = "black";
		}
	}
}

function demoPageTwo(){
	var listText = d3.selectAll(".circleText")[0];
	for(var i = 0; i < listText.length; i++){
		if(isNaN(listText[i].innerHTML)){
			if(listText[i].innerHTML.indexOf("C")!=-1){
				listText[i].style.fill = "red";
			}	else	{				
				listText[i].style.fill = "blue";
			}
		}
	}
}

function nextWeek(){
	if(document.getElementById("slideBar").max == document.getElementById("slideBar").value){
		//stopPlayWeek();
		document.getElementById("slideBar").value = 0;
	}	else	{
		document.getElementById("slideBar").stepUp(1);
	}
	document.getElementById('slideBar').dispatchEvent(new CustomEvent('input'));
}

function previousWeek(){
	document.getElementById("slideBar").stepDown(1);
	document.getElementById('slideBar').dispatchEvent(new CustomEvent('input'));
}


var iFrequency = 1250;
var myInterval = 0;
function startPlayWeek(){
	document.getElementById("play/pause").firstElementChild.setAttribute("d", "M6 19h4V5H6v14zm8-14v14h4V5h-4z");
	document.getElementById("play/pause").setAttribute("onclick", "stopPlayWeek()");
    if(myInterval > 0) clearInterval(myInterval);
    myInterval = setInterval( "nextWeek()", iFrequency );
}

function stopPlayWeek(){
	document.getElementById("play/pause").firstElementChild.setAttribute("d", "M8 5v14l11-7z");
	document.getElementById("play/pause").setAttribute("onclick", "startPlayWeek()");
	clearInterval(myInterval);
}

function openHelpSection(){
	document.getElementById("helpSection").style.display = "inherit";
}

function closeHelpSection(){
	document.getElementById("helpSection").style.display = "none";
}

function onInputActualisation(evt) {//Fonction d'interaction avec la slideBar
    //console.log("Being called from " + arguments.callee.caller.toString());
    if (OIA != document.getElementById("slideBar").value) {
        OIA = document.getElementById("slideBar").value;
        if (evt.target.id == "slideBar" && evt.detail == undefined) {
            actualisation(0, 0);
        }
    }
    if (document.getElementById("slideBar").value >= sheetNames.length) {//on empeche les valeurs du menu des semaines d'etre hors contexte
        document.getElementById("slideBar").value = sheetNames.length - 1;
    }
}

function prepareAll() {//setup de variables d'initialisation
    var tabUse = sheetNames;
    if (document.getElementById("slideBar").value >= sheetNames.length) {
        document.getElementById("slideBar").value = sheetNames.length - 1;
    }
    if (document.getElementById('moreOf').value > 1) {
        document.getElementById('moreOf').value = 1;
    } else if (parseInt(document.getElementById('moreOf').value) < 0 || document.getElementById('moreOf').value == "" || isNaN(document.getElementById('moreOf').value)) {
        document.getElementById('moreOf').value = 0;
    }
    document.getElementById("waitingPanel").style.display = "inherit";
    setTimeout(function(){
        setData();
        document.getElementById("waitingPanel").style.display = "none";
    }, 200);
}
function actualisation(actualisationLevel, displayUpdateLevel) {//Est appelé pour mettre à jour la visualisation en prenant en compte les nouveaux paramètres
    //console.log("Being called from " + arguments.callee.caller.toString());

	if(screenSelectorMode == false){
		return;
	}
    var tabUse = sheetNames;
    /*
    if (document.getElementById("slideBar").value >= sheetNames.length) {
        document.getElementById("slideBar").value = sheetNames.length - 1;
    }*/
    if (document.getElementById('moreOf').value > 1) {
        document.getElementById('moreOf').value = 1;
    } else if (parseInt(document.getElementById('moreOf').value) < 0 || document.getElementById('moreOf').value == "" || isNaN(document.getElementById('moreOf').value)) {
        document.getElementById('moreOf').value = 0;
    }
    document.getElementById("waitingPanel").style.display = "inherit";
    setTimeout(function(){
        switch(actualisationLevel) {
        case 0:
            updateData(displayUpdateLevel);
            break;
        case 1:
        	lowUpdateData(displayUpdateLevel);
            break;
        case 2:
        	reallyLowUpdateData(displayUpdateLevel);
        	break;
        case 3:
        	noUpdateData(displayUpdateLevel);
        	break;
        default:
        	console.log("actualisationLevel Non Defini");
    	    console.log("Being called from " + arguments.callee.caller.toString());
            updateData();
    	}
        document.getElementById("waitingPanel").style.display = "none";
    }, 200);

    
}

function useJSON() {//Lance l'exploitation du fichier JSON
	if(!dataReceived){
		setTimeout(function(){useJSON();}, 250);
		return;
	}
    SetListColumnNoteName();
    updateCohorteNames();
    updateListStudent();
    detectWeek();
	updateSelectedId(new Array());
	listCohorteId = new Array();
	uniqueId = new Array();
	document.getElementById("studentInfo").style.display = "none";
	closeBullePopup();
    updateSlideBar();
    generateTable();
    tempDataset = createCohorteElevesMadeWithMore(0.0, sheetNames);
    cellMax = getCellMax(tempDataset);
    cellMaxByType = getCellMaxByType(tempDataset);
    menu =  parseInt(document.querySelector('input[name="visualisationMode"]:checked').value) + parseInt(document.querySelector('input[name="visualisationModeOption"]:checked').value);
	document.getElementById("isDisplayNumber").checked = true;
    prepareAll();
}

function getCellMax(dataset) {
    var maxCell = 0;
    for (var i = 1; i < dataset.length; i++) {
        for (var j = 1; j < dataset[i].length; j++) {
            if (dataset[i][j].length > maxCell) {
                maxCell = dataset[i][j].length;
            }
        }
    }
    return maxCell;
}

function getCellMaxByType(dataset) {
    var maxCell = [];
    maxCell[0] = 0;
    var maxCellIndex;
    for (var i = 1; i < dataset.length; i++) {
        maxCellIndex = 0;
        if(dataset[i] == undefined){
        	return;
        }
        for (var j = 1; j < dataset[i].length; j++) {
            if (j > 1 && getTypePart(dataset[0][j]) != getTypePart(dataset[0][j - 1])) {
                maxCellIndex++;
                if (i == 1) {
                    maxCell[maxCellIndex] = 0;
                }
            }
            if (dataset[i][j].length > maxCell[maxCellIndex]) {
                maxCell[maxCellIndex] = dataset[i][j].length;
            }
        }
    }
    return maxCell;
}

function updateSlideBar() {//Met à jour la slideBar en fonction du nombre de semaines
    document.getElementById("slideBar").max = sheetNames.length - 1;
    document.getElementById("slideBar").value = sheetNames.length - 1;
    document.getElementById('slideBar').dispatchEvent(new CustomEvent('input', {"detail": true}));
}

function generateTable() {//Genere le tableau en fonction du nombre de semaine
    if (document.getElementById("tableau").firstElementChild != null) {
        document.getElementById("tableau").removeChild(document.getElementById("tableau").firstElementChild);
    }
    var tableau = document.getElementById("tableau").appendChild(document.createElement("tbody"));
    var r0 = document.createElement("tr");
    var r1 = document.createElement("tr");
    r0.appendChild(document.createElement("td"));
    var r1c0 = document.createElement("td");
    r1c0.appendChild(document.createTextNode("Total des Inscrits"));
    r1.appendChild(r1c0);

    for (var i = 0; i < sheetNames.length; i++) {
        var r0ctemp = document.createElement("td");
        if(menu >= 2){
            r0ctemp.appendChild(document.createTextNode("Collecte " + (i + 1)));
        }	else	{
            r0ctemp.appendChild(document.createTextNode("Collecte " + i + "\u2192" + (i + 1)));
        }
        r0.appendChild(r0ctemp);
        r1.appendChild(document.createElement("td"));
    }
    r0.appendChild(document.createElement("td"));
    r0.lastChild.appendChild(document.createTextNode("Total"));
    r1.appendChild(document.createElement("td"));

    var r2 = r1.cloneNode(true);
    r2.firstChild.firstChild.textContent = "Total des non Participants";
    var r3 = r1.cloneNode(true);
    r3.firstChild.firstChild.textContent = "Total des Participants";

    tableau.appendChild(r0);
    tableau.appendChild(r1);
    tableau.appendChild(r2);
    tableau.appendChild(r3);
}
function getTypePart(examName){
    return examName.slice(0,-3);
}


function svgToPng(){
	saveSvgAsPng(document.getElementById("svgCore"), "visualisation.png", {
		backgroundColor : "#EBE8DE", 
		left : -20,
		top : -130,
		width : document.getElementById("svgCore").width.baseVal.value + 20,
		height : document.getElementById("svgCore").height.baseVal.value + 130});
}

/*------------------------------------------------------MINIMAP-------------------------------------*/

function scrollIntoSvgCore() {
	   var e = document.getElementById("tableau");
	   if (!!e && e.scrollIntoView) {
	       e.scrollIntoView();
	   }
}

function minimapCadre(){
	if(!cadreIsSelected){
		var ratio = 0.075;
		document.getElementById("cadre").style.height = window.innerHeight*ratio + "px";
		document.getElementById("cadre").style.top = window.pageYOffset * ratio + "px";
	    try {
	        if (document.querySelector("#minimapContent #content").offsetHeight * 0.075 - parseFloat(document.getElementById("cadre").style.height) <= 0) {
	            document.getElementById("cadre").style.cursor = "inherit";
	        } else {
	            document.getElementById("cadre").style.cursor = "";
	        }
	    } catch (e) {
	    }

	}
}


var cadreIsSelected = false;
var cadreInitPos = 0;
var mouseInitPos = 0;

function cadreSelect(evt){
	cadreIsSelected = true;
	mouseInitPos = evt.clientY;
	cadreInitPos = parseInt(document.getElementById("cadre").style.top);
}

function cadreMove(evt){
	if(cadreIsSelected){
		var minimapSize = parseFloat(document.getElementById("minimapSize").value)*0.1 + 1;
		var ratio = 0.075*minimapSize;
		var newPos = cadreInitPos + (evt.clientY - mouseInitPos)/minimapSize;
		if(newPos<0){
			document.getElementById("cadre").style.top = "0px";
		}	else	if(newPos> document.querySelector("#minimapContent #content").offsetHeight*0.075 - parseFloat(document.getElementById("cadre").style.height)){
			document.getElementById("cadre").style.top = document.querySelector("#minimapContent #content").offsetHeight*0.075 - parseFloat(document.getElementById("cadre").style.height)+"px"; 
		}	else	{
			document.getElementById("cadre").style.top = newPos+"px";
		}
		window.scrollTo(0, parseFloat(document.getElementById("cadre").style.top)/ratio*minimapSize)
	}
}

function cadreMoveTo(evt){
	cadreIsSelected = true;
	var minimapSize = parseFloat(document.getElementById("minimapSize").value)*0.1 + 1;
	var ratio = 0.075*minimapSize;
	var newPos = minimapSize*(evt.layerY/document.getElementById('content').clientHeight*(document.querySelector("#minimapContent #content").offsetHeight*0.075 - parseFloat(document.getElementById("cadre").style.height)));
	if(newPos<0){
		document.getElementById("cadre").style.top = "0px";
	}	else	if(newPos/minimapSize> document.querySelector("#minimapContent #content").offsetHeight*0.075 - parseFloat(document.getElementById("cadre").style.height)){
		document.getElementById("cadre").style.top = document.querySelector("#minimapContent #content").offsetHeight*0.075 - parseFloat(document.getElementById("cadre").style.height)+"px"; 
	}	else	{
		document.getElementById("cadre").style.top = newPos+"px";
	}
	window.scrollTo(0, parseFloat(document.getElementById("cadre").style.top)/ratio);
	cadreIsSelected = false;
}

function cadreUnselect(evt){
	cadreIsSelected = false;
}

function minimapSizeChanger(){
	document.getElementById("minimap").style.transform = "scale(" + (parseFloat(document.getElementById("minimapSize").value)*0.1 + 1 ) + "," + (parseFloat(document.getElementById("minimapSize").value)*0.1 + 1 ) + ")";
}
document.body.addEventListener("mousemove", moveMinimap);
document.getElementById("minimapSizeDiv").addEventListener("mousedown", moveMinimapEnter);
document.getElementById("minimapContent").addEventListener("mousedown", cadreMoveTo);
document.getElementById("minimapSizeDiv").addEventListener("mouseup", moveMinimapExit);
window.addEventListener("resize", minimapCadre);
document.getElementById("minimapSize").addEventListener("mousemove", function(event){
    event.stopPropagation();
});
var isMoving = false;
var isMovingEvt;
function moveMinimap(evt){
	if(isMoving && evt.buttons == 1){
		document.getElementById("minimapContainer").style.left = evt.clientX-isMovingEvt.layerX + "px";
		document.getElementById("minimapContainer").style.top = evt.clientY-isMovingEvt.layerY + "px";
	}
}

function moveMinimapEnter(evt){
	isMoving = true;
	isMovingEvt = evt;	
}

function moveMinimapExit(){
	isMoving = false;
}

/*------------------------------------------------------MINIMAP END-------------------------------------*/

/*------------------------------------------------------BullePopup-------------------------------------*/

var isBullePopupMoving = false;
var isBullePopupMovingEvt;
function moveBullePopup(evt){
	if(isBullePopupMoving && evt.buttons == 1){	
		document.querySelector("#bullePopup").style.left = evt.pageX-isBullePopupMovingEvt.layerX + "px";
		document.querySelector("#bullePopup").style.top = evt.pageY-isBullePopupMovingEvt.layerY - 140 + "px";
	}
}

document.body.addEventListener("mousemove", moveBullePopup);
document.querySelector("#bullePopup a").addEventListener("mousedown", moveBullePopupEnter);
document.querySelector("#bullePopup a").addEventListener("mouseup", moveBullePopupExit);

function moveBullePopupEnter(evt){
	isBullePopupMoving = true;
	isBullePopupMovingEvt = evt;	
}

function moveBullePopupExit(){
	isBullePopupMoving = false;
}


/*------------------------------------------------------BullePopup END-------------------------------------*/


function updateCohorteNames() {
    var cohorteList = new Array();
    tabEleves.forEach(function (obj) {
        if (cohorteList.indexOf(obj.cohorte) == -1 && obj.cohorte != undefined) {
            cohorteList.push(obj.cohorte);
        }
    });

    document.getElementById("cohorteSelect").innerHTML = "";
    var option = document.createElement("option");
    option.value = "";
    option.text = "Tous les élèves";
    document.getElementById("cohorteSelect").appendChild(option);

    for (var i = 0; i < cohorteList.length; i++) {
        var option = document.createElement("option");
        option.value = cohorteList[i];
        option.text = cohorteList[i];
        document.getElementById("cohorteSelect").appendChild(option);
    }
}

function updateListStudent(){
    document.getElementById("studentSelectData").innerHTML = "";
    var option = document.createElement("option");
    option.value = "";
    option.text = "Tous les élèves";
    document.getElementById("studentSelectData").appendChild(option);
    
    var cohorteState = document.getElementById("cohorteSelect").value;
    if(cohorteState == ""){
    	document.getElementById("studentSelect").style.backgroundColor = "#00f6";
    }	else	{
    	document.getElementById("studentSelect").style.backgroundColor = "yellow";
    }
    
	var ordonnedTabEleves = tabEleves.filter(function(eleve) {
							  return eleve.tabNotes.filter(function(note){
								  return note.semaine != -1;
							  }).length != 0 && eleve.cohorte.indexOf(cohorteState) != -1;
								}).sort(function(a,b) {return (a.login.toLowerCase() > b.login.toLowerCase()) ? 1 : ((b.login.toLowerCase() > a.login.toLowerCase()) ? -1 : 0);} );
    
    for (var i = 0; i < ordonnedTabEleves.length; i++) {
        var option = document.createElement("option");
        option.value = ordonnedTabEleves[i].login;
        option.text = ordonnedTabEleves[i].login;
        document.getElementById("studentSelectData").appendChild(option);
    }
}

function changeStudent(){
	var idStudent = document.getElementById("studentSelect").value;
	var exist = tabEleves.filter(function( eleve ) {
		  return eleve.id == idStudent || eleve.login == idStudent || eleve.email == idStudent;
	}).length != 0;
	if(!exist && uniqueId.length == 0){
		return;
	}
	
	changeSelectedCohorte(undefined, undefined);
	changeCircle(undefined, undefined);
	if(document.getElementById("studentSelect").value == "" || !exist){
		document.getElementById("studentInfo").style.display = "none";
		uniqueId = new Array();
	}	else	{
		updateSelectedIdByInfo(idStudent); 
		document.getElementById("studentInfo").style.display = "inline-block";
		document.querySelector("#studentInfo #studentInfoText").innerHTML = stringInfo(idStudent);
	}
	updateSelectedId(new Array()); 
	actualisation(1, 0); 
}

/* EG: updated to manage several MOOC !
 => moved to common.js


*/
var courseName;
/*
function courseName(){
	var rightPart =	document.location.href.lastIndexOf("/");
	var leftPart =	document.location.href.lastIndexOf("/", rightPart-1);
	courseName = document.location.href.substring(leftPart+1, rightPart);
	if(courseName.indexOf(":8080") != -1){
		courseName = "Unknown Name";
	}
	listDataSelection[3].firstElementChild.textContent = "Voir les dernières données du MOOC " + courseName;
	document.querySelector("#appNameDiv p").innerText = "MOOC-PILOT : " + courseName;
}
*/

if (localStorage.selectedMenu != 3) {
    localStorage.setItem("selectedMenu",3);
}

function extractBipartite(){
	var textArray = new Array();
    for (var i = 0; i < tabEleves.length; i++) {
        for (var j = 0; j < tabEleves[i].tabNotes.length; j++) {
        	if(tabEleves[i].tabNotes[j].semaine == -1){
        		textArray.push("0");
        	}	else	{
        		textArray.push("1");
        	}
        	if((j+1)<tabEleves[i].tabNotes.length){
        		textArray.push(";");
        	}
        }
        if((i+1)<tabEleves.length)	{
    		textArray.push("\r\n");
    	}
    }	

	var blob = new Blob(textArray, {type: "text/plain;charset=utf-8"});
	saveAs(blob, "moocPilotBipartiteV1.txt");
}

function noteV2(index){
	for(var i = 0; i < 5; i++){
		if(i == index){
    		textArray.push("1");
		}	else	{
    		textArray.push("0");
		}
		textArray.push(";")
	}
}

function extractBipartiteV2(){
	textArray = new Array();
	elevesUtils = tabEleves.filter(function(eleve) {
		  return eleve.tabNotes.filter(function(note){
			  return note.semaine != -1;
		  }).length != 0});
    for (var i = 0; i < elevesUtils.length; i++) {
        for (var j = 0; j < elevesUtils[i].tabNotes.length; j++) {
        	if(elevesUtils[i].tabNotes[j].semaine == -1){
        		noteV2(0);
        	}	else	{
        		noteV2(Math.ceil(elevesUtils[i].tabNotes[j].note/0.25))
        	}
        	
        	if((j+1) == elevesUtils[i].tabNotes.length){
        		textArray.pop();
        	}
        }
        if((i+1)<elevesUtils.length)	{
    		textArray.push("\r\n");
    	}
    }	

	var blob = new Blob(textArray, {type: "text/plain;charset=utf-8"});
	saveAs(blob, "moocPilotBipartiteV2.txt");
}

function noteV3(index, j){
	for(var i = 1; i < 5; i++){
		if(i == index){
    		textArray[j].push("1");
		}	else	{
    		textArray[j].push("0");
		}
	}
}

// EG: récup comment
/*fonction pour extraire des matrices bipartites des élèves avec leurs notes*/
function extractBipartiteAllV3(cibledCohorte){
	extractBipartiteV3Simple(false,cibledCohorte);
	extractBipartiteV3Simple(true,cibledCohorte);
	extractBipartiteV3Complexe(false,cibledCohorte);
	extractBipartiteV3Complexe(true,cibledCohorte);
}

// EG: récup comment
/* Simple : une colonne par note qui affiche 1 si l'élève a fait l'exercice.
Complexe : 5 colonnes par note qui représente la note de l'élève: 0 ; 0->0.25; 0.25->0.5; 0.5->0.75; 0.75->1*/
function extractBipartiteV3Simple(transpose, cibledCohorte){
	textArray = new Array();
	elevesUtils = tabEleves.filter(function(eleve) {
		  return eleve.tabNotes.filter(function(note){
			  return note.semaine != -1 && eleve.cohorte.indexOf(cibledCohorte) != -1;
		  }).length != 0});
    for (var i = 0; i < elevesUtils.length; i++) {
    	textArray[i] = new Array();
        for (var j = 0; j < elevesUtils[i].tabNotes.length; j++) {
        	if(elevesUtils[i].tabNotes[j].semaine == -1){
        		textArray[i].push("0");
        	}	else	{
        		textArray[i].push("1");
        	}
        }
    }
    
    if(transpose){
    	textArray = textArray[0].map(function(col, i) { 
    		  return textArray.map(function(row) { 
    		    return row[i] 
    		  })
    		});
    }
    
    var str = textArray.join("\r\n")
    str = str.replaceAll(",", ";")
	var blob = new Blob([str]);
    
    var name = "";
   	
    if(cibledCohorte != ""){
    	name+="_"+cibledCohorte;
    }
    
    if(transpose){
    	name += "_T"
    }
	saveAs(blob, "moocPilotBipartiteV3_Simple"+name+".csv");
}

function extractBipartiteV3Complexe(transpose, cibledCohorte){
	textArray = new Array();
	elevesUtils = tabEleves.filter(function(eleve) {
		  return eleve.tabNotes.filter(function(note){
			  return note.semaine != -1 && eleve.cohorte.indexOf(cibledCohorte) != -1;
		  }).length != 0});
    for (var i = 0; i < elevesUtils.length; i++) {
    	textArray[i] = new Array();
        for (var j = 0; j < elevesUtils[i].tabNotes.length; j++) {
        	if(elevesUtils[i].tabNotes[j].semaine == -1){
        		noteV3(0,i);
        	}	else	{
        		noteV3(Math.ceil(elevesUtils[i].tabNotes[j].note/0.25),i)
        	}
        }
    }
    
    if(transpose){
    	textArray = textArray[0].map(function(col, i) { 
    		  return textArray.map(function(row) { 
    		    return row[i] 
    		  })
    		});
    }
    
    var str = textArray.join("\r\n")
    str = str.replaceAll(",", ";")
	var blob = new Blob([str]);
    
    var name = "";
    
    if(cibledCohorte != ""){
    	name+="_"+cibledCohorte;
    }
    
    if(transpose){
    	name += "_T"
    }
	saveAs(blob, "moocPilotBipartiteV3_Complexe"+name+".csv");
}

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 

//var forcedWeek = ["0","1","2","3","4","5","6","7","28","34","39","8","9","10","11","12","29","35","13","14","16","17","18","19","30","36","20","21","22","23","31","37","24","25","26","27","32","38","33","15","40"];
var forcedWeek;// = [1,1,3,1,1,1,1,1,2,2,2,2,2,3,3,8,3,3,3,3,4,4,4,4,5,5,5,5,1,2,3,4,5,6,1,2,3,4,5,1,16]; 
function detectWeek(){
	noteData = new Array(tabEleves[0].tabNotes.length)
	for(var i = 0; i < noteData.length; i++){
		noteData[i] = new Array(sheetNames.length).fill(0);
	}
	
	for(var i = 0; i < tabEleves.length; i++){
		for(var j = 0; j < tabEleves[i].tabNotes.length;j++){
			var week = tabEleves[i].tabNotes[j].semaine-1;
			if(week != -1){
				noteData[j][week]++;
			}
		}
	}

	realWeek = new Array(noteData.length).fill(-1);

	for(var i = 0; i < noteData.length; i++){
		var j = 0;
		while(j < sheetNames.length && noteData[i][j] < 6){
			j++;
		}
		realWeek[i] = j;
	}
	if(forcedWeek != undefined){
		realWeek = forcedWeek;
	}
	
	ordennedByWeek = Object.keys(realWeek).sort(
			function(a,b, descending) {
        if(realWeek[a] !== realWeek[b])
        {
          return realWeek[a] - realWeek[b];
        }

        if (descending) {
          return b - a;
        } else {
          return a - b;
        }});
			/*
			function(a,b){
				if(realWeek[a] == realWeek[b]){
					console.log("ça arrive");
					return realWeek.indexOf(a) - realWeek.indexOf(b);
				}
				return realWeek[a]-realWeek[b];
			});*/
	
	realWeekNames = realWeek.filter(function(item, pos, self) {
	    return self.indexOf(item) == pos;
	}).sort(function(a,b) {return (a > b) ? 1 : ((b > a) ? -1 : 0);} ); ;

	var counts = {};
	realWeek.forEach(function(x) { counts[x] = (counts[x] || 0)+1; });

	listWeekStart = new Array();
	listWeekSize = new Array();
	for(var i = 0; i < realWeekNames.length; i++){
		if(i == 0){
			listWeekStart.push(0);
			listWeekSize.push(counts[realWeekNames[0]]);
		}	else	{
			listWeekStart.push(listWeekSize[i-1] + listWeekStart[i-1]);
			listWeekSize.push(counts[realWeekNames[i]]);
		}
	}
}

function orderByWeek(referenceDataset){
	ordonnedDataset = JSON.parse(JSON.stringify(referenceDataset));

	for(var i = 0; i < ordonnedDataset.length; i++){
		for(var j = 1; j < ordonnedDataset[i].length;j++){
			ordonnedDataset[i][j] = referenceDataset[i][parseInt(ordennedByWeek[j-1])+1];
		}
	}
	return ordonnedDataset;
}

function realIndex(index){
	if(document.querySelector('input[name="weekModeOption"]:checked').value == "1"){
		return parseInt(ordennedByWeek[index]);
	}	else	{
		return index;
	}
}

function displayOptions(){
	if(displayedOptions){
		document.getElementById("optionViewer").innerText = translations['#optionViewer'][localStorage.lang]; //  "Autres options";
		document.getElementById("realOptions").style.display = "none";
		displayedOptions = false;
	}	else	{
		document.getElementById("optionViewer").innerText = translations['#optionViewer2'][localStorage.lang]; //"Masquer les options";
		document.getElementById("realOptions").style.display = "inherit";
		displayedOptions = true;
	}
}

function mergeSort(arr)
{
    if (arr.length < 2)
        return arr;

    var middle = parseInt(arr.length / 2);
    var left   = arr.slice(0, middle);
    var right  = arr.slice(middle, arr.length);

    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right)
{
    var result = [];

    while (left.length && right.length) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length)
        result.push(left.shift());

    while (right.length)
        result.push(right.shift());

    return result;
}
