document.getElementById("download").addEventListener("click", svgToPng);
document.getElementById("moreOf").disabled = false;
function svgToPng(){
	var duplicateLegend = 	document.getElementById("legend").cloneNode(true);
	duplicateLegend.style.transform = "translate(-140px, 50px)";
	document.getElementById("graph").appendChild(duplicateLegend);
	saveSvgAsPng(document.getElementById("graph"), "graphique.png", {
		backgroundColor : "#EBE8DE",
		top:-100,
		left : -150, 
		width : document.getElementById("graph").viewBox.baseVal.width + 150,
		height : document.getElementById("graph").viewBox.baseVal.height + 100});
	document.getElementById("graph").removeChild(duplicateLegend);
}

var listDataSelection = document.getElementById("dataSelection").children;
for(var i = 0; i < listDataSelection.length; i++){
	listDataSelection.item(i).addEventListener("click", dataSelected);
}

function dataSelected(evt){
	for(var i = 0; i < listDataSelection.length; i++){
		if(listDataSelection.item(i) === evt.currentTarget){
		    //listDataSelection.item(i).style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.55) inset";//"0 1px 4px rgba(0, 0, 0, 0.3), 0 0 40px rgba(0, 0, 0, 0.1) inset";
		    listDataSelection.item(i).style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 1) inset";
		    listDataSelection.item(i).style.fontWeight = "bold"
		    if(i==0){
		    	localStorage.selectedMenu = 1;
		    }	else	if(i == 2){
		    	localStorage.selectedMenu = 3;
		    }
		    	/*
		    if(i == 0){
		    	document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau de progression des Ã©lÃ¨ves\nDonnÃ¨es de dÃ©monstrations";
		    }	else	if(i == 1){
				document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau de progression des Ã©lÃ¨ves\nVos donnÃ©es";
		    }	else	{
				document.getElementById("headerName").innerText = "MOOC-PILOT\n tableau de progression des Ã©lÃ¨ves\n MOOC : " + courseName;
		    }*/
		}	else	{
			listDataSelection.item(i).style.boxShadow = "";
			listDataSelection.item(i).style.fontWeight = ""
		}
	}
}

var courseName;
//courseName();
/*
function courseName(){
	var rightPart =	document.location.href.lastIndexOf("/");
	var leftPart =	document.location.href.lastIndexOf("/", rightPart-1);
	courseName = document.location.href.substring(leftPart+1, rightPart);
	if(courseName.indexOf(":8080") != -1){
		courseName = "Unknown Name";
	}
	document.querySelector("#appNameDiv p").innerText = "MOOC-PILOT : " + courseName;
}

*/
window.addEventListener("resize", changeSize);


changeSize();
function changeSize(){
	if(document.getElementById("visualisationMode").value == "1"){
		var estimatedWidth = (window.innerHeight - 320) * 1.71;
		if(estimatedWidth > document.getElementById("content").offsetWidth - 250){
			document.getElementById("contentContainer").style.width = document.getElementById("content").offsetWidth - 250 + "px";
		}	else	{
			document.getElementById("contentContainer").style.width = estimatedWidth + "px";
		}
	}	else	{
		var estimatedWidth = (window.innerHeight - 150) * 1.71;
		if(estimatedWidth > document.getElementById("content").offsetWidth - 250){
			document.getElementById("contentContainer").style.width = document.getElementById("content").offsetWidth - 250 + "px";
		}	else	{
			document.getElementById("contentContainer").style.width = estimatedWidth + "px";
		}
	}
	document.getElementById("svgContainer").style.width = parseInt(document.getElementById("sizeBar").value) * 10 + "%";	
	document.getElementById("sizeBarText").textContent = "Zoom:";// "+(parseInt(document.getElementById("sizeBar").value)*10)+"%";
}

if (localStorage.selectedMenu != 3) {
    localStorage.setItem("selectedMenu",3);
}
//listDataSelection.item(localStorage.selectedMenu-1).dispatchEvent(new CustomEvent('click'));
var dataReceived = false;
//callSavedJSON(function(){dataReceived = true});
courseName(function(){callSavedJSON(function(){dataReceived = true});}, "");


var exerciseNames;
document.getElementById("exerciceNumber").value = 0;

function setExerciceNumber(){
	exerciseNames = getCourseNames();
	document.getElementById("exerciceNumber").max = exerciseNames.length-1;
	//changeExerciceNumber();
}
var exerciceNumber = 0;
function changeExerciceNumber(newExerciceNumber){
	exerciceNumber = newExerciceNumber;
	document.getElementById("exerciceNumberText").textContent = "Travaux: "+exerciseNames[exerciceNumber];
}

function exerciceNumberMakeVisible(visible){
	if(!visible){
		document.getElementById("exerciceNumber").style.display = "none";
		document.getElementById("exerciceNumberText").style.display = "none";
	}	else	{
		document.getElementById("exerciceNumber").style.display = "inherit";
		document.getElementById("exerciceNumberText").style.display = "inherit";
	}
}



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
    if(document.getElementById("cohorteSelect").value == ""){
    	document.getElementById("studentSelect").style.backgroundColor = "#00f6";
    }	else	{
    	document.getElementById("studentSelect").style.backgroundColor = "yellow";
    }
}
var moreOf = 0;
function changeMoreOfValue(){
	moreOf = parseFloat(document.getElementById("moreOf").value);
	callDisplayDiagramme();
}

document.getElementById("studentSelect").value = "";
var cibleStudentObject;
function changeStudent(){
	cibleStudentName = document.getElementById("studentSelect").value;
	var previousCibleStudent = cibleStudentObject;
	cibleStudentObject = tabEleves.filter(function(eleve) {
		  return eleve.login == cibleStudentName;
		  })[0];
	if(previousCibleStudent == cibleStudentObject){
		return;
	}
	if(cibleStudentObject != undefined){
		document.querySelector("#studentInfo #studentInfoText").innerText = stringInfo();
		document.getElementById("studentInfo").style.display = "inherit";
	}	else	{
		document.getElementById("studentInfo").style.display = "none";
	}

	callDisplayDiagramme();
}

function resetStudent(){
	document.getElementById("studentSelect").value = "";
	updateListStudent();
	cibleStudentName = "";
	cibleStudentObject = undefined;
	document.getElementById("studentInfo").style.display = "none";
    if(document.getElementById("cohorteSelect").value == ""){
    	document.getElementById("studentSelect").style.backgroundColor = "#00f6";
    }	else	{
    	document.getElementById("studentSelect").style.backgroundColor = "yellow";
    }
	callDisplayDiagramme();
}

function changeCohorte(){
	resetStudent();
	//callDisplayDiagramme();
}

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
	ordennedByWeek = Object.keys(realWeek).sort(function(a,b, descending) {
        if(realWeek[a] !== realWeek[b])
        {
          return realWeek[a] - realWeek[b];
        }

        if (descending) {
          return b - a;
        } else {
          return a - b;
        }});
	
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

function stringInfo(){
	setSmileySize(cibleStudentObject);
	if(cibleStudentObject == undefined){
		return "";
	}	else	{
		return "Id : " + cibleStudentObject.id + "    Nom : " + cibleStudentObject.login + "    Email : " + cibleStudentObject.email;
	}
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
		if(synthesis[i] == 0){
			smileys[i].style.height = "5px";
			smileys[i].style.marginBottom = "0px";
		}	else	{
			smileys[i].style.height = (16 + (synthesis[i] - synthesisMin)* rapport) + "px";
			smileys[i].style.marginBottom = (16-(synthesis[i] - synthesisMin)* rapport)/2 - 10 + "px";
		}
	}
	d3.select("#tipSmiley").remove();
		
    tipSmiley = d3.tip()
	  .attr('class', 'd3-tip')
	  .attr('id', 'tipSmiley')
	  .offset([-10, 0])
	  .html(function (d, i, j) {	
		  return synthesis[i] + "/"+ student.tabNotes.length + " notes";
	  });
	  
	svg.call(tipSmiley);
	
	d3.selectAll("#studentInfo .smileys")
	.on('mouseover', tipSmiley.show)
	.on('mouseout', tipSmiley.hide);
	
	var data = [(synthesis[2] + synthesis[3])/student.tabNotes.length*100, (synthesis[0] + synthesis[1])/student.tabNotes.length*100, (student.tabNotes.length - synthesis.reduce(function(pv, cv) { return pv + cv; }, 0))/student.tabNotes.length*100];

	var names = [(synthesis[2] + synthesis[3]), (synthesis[0] + synthesis[1]), (student.tabNotes.length - synthesis.reduce(function(pv, cv) { return pv + cv; }, 0)), student.tabNotes.length];
	studentPie(data, names);
}

document.getElementById("resetSelectedCohorte").addEventListener("click", function () { document.getElementById("bullePopup").style.display = "none";});

var bullePopupRotation= 0;
var openBulleContent;
function openBullePopup(d) {
	openBulleContent = d;
    document.querySelector("#bullePopup").style.left = "90%";
    document.querySelector("#bullePopup").style.top = "20%";
    
    document.querySelector("#bullePopup").style.transform = "rotateY(" + bullePopupRotation + "deg)";
	bullePopupRotation+=360;
	
	document.querySelector("#bullePopup a").innerText = d.length+" élèves";
	updateBulleStudentList();
	//setTimeout(function(){document.querySelector("#bullePopup a").innerText = d.length+" élèves \ncollecte "+j+"  \n"+tabCohorte[0][i];updateBulleStudentList();},250);
		
	document.getElementById("bullePopup").style.display = "inherit";
	//visualiseCohorteToggled();
}

function updateBulleStudentList(){
    document.getElementById("bulleStudentList").innerHTML = "";
    var option = document.createElement("option");
    option.value = "";
    option.text = "Tous les élèves";
    document.getElementById("bulleStudentList").appendChild(option);    

    for (var i = 0; i < openBulleContent.length; i++) {
        var option = document.createElement("option");
        option.value = openBulleContent[i].id;
        option.text = openBulleContent[i].login;
        document.getElementById("bulleStudentList").appendChild(option);
    }
}

function updateBulleStudentListCall(){
	document.getElementById("studentSelect").value = document.getElementById("bulleStudentList").value;
	changeStudent();
}

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


var moreOfTimer;
function startMoreOf(){
	moreOfTimer = setTimeout(changeMoreOfValue, 300);
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

