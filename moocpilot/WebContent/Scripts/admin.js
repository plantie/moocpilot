
var csvList;
var disabledPosNumber;
var lastCollectName = "";

weekDay = -1;

document.getElementById("updateDatabaseButton").addEventListener("click", updateCsvDatabase);
document.getElementById("updateForumButton").addEventListener("click", updateForumDatabase);
//document.getElementById("setAutomaticCollect").addEventListener("click", displayUserParametersInterface);
document.getElementById("newAutomaticCollect").addEventListener("click", setFunTask);
document.getElementById("sendMoocPilotPassword").addEventListener("click", connect);
document.getElementById("moocPilotPassword").addEventListener("keypress", validForm);
document.getElementById("startCollect").addEventListener("click", startManualCollect);

// EG: add save & restore data/
$('#dataSaveButton').click(dataSaveRestore);
$('#dataRestoreButton').click(dataSaveRestore);

translations['confirmation'] = {en:"Do you confirm action: ", fr:"Confirmez vous l'action; "};

function dataSaveRestore (evt){
	var action = $(evt.target).data("action");
	console.log("data"+action+" !");
	if (confirm(translations['confirmation'][localStorage.lang]+action)) {
	  $.post("../DataMngt?action="+action, function(msg){
		alert(msg);
		document.location.href = "."
		});
	}
}
	
// EG: get list of courses
courseName(isConnected, '../');
setHeader();
function setHeader(){
	var rightPart =	document.location.href.lastIndexOf("/", document.location.href.length-6);
	var leftPart =	document.location.href.lastIndexOf("/", rightPart-1);
	var courseName = document.location.href.substring(leftPart+1, rightPart);
	document.getElementById("headerName").innerText = "MOOC-PILOT\n Interface Administrateur \n MOOC : " + courseName;
}
document.getElementById("saveAndQuit").addEventListener("click", saveAndQuit);

$('#saveAndQuit2').css({'display': 'none'});
function saveAndQuit(){
	loadCourse();
	$('#menu').css({'display': 'none'});
	$('#AdminContent').html("<div>GET Stats</div>");
/*
	$.getJSON( '../data/'+localStorage.moocId+'/versionLoaded.txt.stats' + getRandom(), function( stat ) {
		console.log(stat);
		var txt = "<div><h3>"+translations['stats'][localStorage.lang]+"</h3><table border='1'>"
			+"<tr><td>"+translations['N'][localStorage.lang]+"</td><td>"+stat.N+"</td></td></tr>"
			+"<tr><td>"+translations['Nok'][localStorage.lang]+"</td><td>"+stat.Nok+"</td><td>"+(100.0*stat.Nok/stat.N).toFixed(2)+"%</td></tr>"
			+"<tr><td>"+translations['N1'][localStorage.lang]+"</td><td>"+stat.N1+"</td><td>"+(100.0*stat.N1/stat.N).toFixed(2)+"%</td></tr>"
			+"<tr><td>"+translations['N2'][localStorage.lang]+"</td><td>"+stat.N2+"</td><td>"+(100.0*stat.N2/stat.N).toFixed(2)+"%</td></tr>"
			+"<tr><td>"+translations['N1ok'][localStorage.lang]+"</td><td>"+stat.N1ok+"</td><td>"+(100.0*stat.N1ok/stat.N).toFixed(2)+"%</td></tr>"
			+"<tr><td>"+translations['N2ok'][localStorage.lang]+"</td><td>"+stat.N2ok+"</td><td>"+(100.0*stat.N2ok/stat.N).toFixed(2)+"%</td></tr>"
			+"</table></div>";
		$('#AdminContent').html(txt);
		$('#saveAndQuit').css({'display': 'none'});
		$('#saveAndQuit2').css({'display': 'inline-block'}).click(saveAndQuit2);
	});
*/
	
	//~ $('#AdminContent').css({'display': 'none'});
	saveAndQuit2(); // direct call...
	
}

function saveAndQuit2(){
    localStorage.setItem("selectedMenu",3);
	document.location.href = "../index.jsp";
}

document.getElementById("automaticCollectButton").addEventListener("click", displayUserParametersInterface);

var automaticActivated = false;
var automaticLabels = document.querySelectorAll("#automaticCollectLabels p");

var dateCollect = getFunTask();


function getDateCollect(task){
	if(task == ""){
		return undefined;
	}
	dateCollect = new Date(parseInt(task.split("-")[0]));
	weekDay = dateCollect.getDay();
	if(csvList!=undefined){
		arraySetUp();
	}
	switchCollectButton();
}

function switchCollectButton(){
	$('#automaticCollectButton span').text(translations[automaticActivated ? 'automaticCollect-true' : 'automaticCollect-false'][localStorage.lang]);
	$('#automaticCollectLabels p:first-of-type').text(translations[automaticActivated ? 'automaticCollectLabel-true' : 'automaticCollectLabel-false'][localStorage.lang]);
	if(automaticActivated){
		//~ document.getElementById("automaticCollectButton").firstElementChild.innerText = translations['#automaticCollectButton span'][localStorage.lang]; //"Activer la collecte automatique";
		//~ document.getElementById("automaticCollectLabels").firstElementChild.innerText = "Collecte automatique : Non active";
		automaticLabels[1].innerText = "";
		automaticLabels[2].innerText = "";
		
		automaticActivated = false;
	}	else	{
		//~ document.getElementById("automaticCollectButton").firstElementChild.innerText = "Désactiver la collecte automatique";
		//~ document.getElementById("automaticCollectLabels").firstElementChild.innerText = "Collecte automatique : Active";

		i18n[localStorage.lang]['weekdays']
		automaticLabels[1].innerText = translations['collect'][localStorage.lang]+": " + getPeriod() + " " + i18n[localStorage.lang]['weekdays'][dateCollect.getDay()] + ".";
		//automaticLabels[1].innerText = "Collecte " + getPeriod() + " les " + weekdays[dateCollect.getDay()] + ".";
		automaticLabels[2].innerText = translations['nextCollect'][localStorage.lang]+": " + dateCollect.toLocaleDateString(localStorage.lang, options) + ".";
		//automaticLabels[2].innerText = "Prochaine collecte " + dateCollect.toLocaleDateString("fr-FR", options) + ".";
		
		automaticActivated = true;
	}
}


function arraySetUp() {
    document.getElementById("csvTable").innerHTML = "";
    firstArrayLine();
    if (csvList.length == 0) {
        return;
    }
    disabledPosNumber = 0;
    var positionnedCsvList = new Array();
    for (var i = 0; i < csvList[0].weekList.length; i++) {
        positionnedCsvList[csvList[0].weekList[i].pos] = csvList[0].weekList[i];
    }
    for (var i = 0; i < positionnedCsvList.length; i++) {
        newArrayLine(positionnedCsvList[i].id, positionnedCsvList[i].pos, positionnedCsvList[i]);
    }
    setTimeout(displayTimeBar, 500);
    displayLastCollect();
}

function displayLastCollect(){
	if(lastCollectName != ""){
		d3.selectAll("#csvTable tr").each(function(){
			if(lastCollectName != "" && this.innerText.indexOf(lastCollectName) != -1){
				lastCollectName = "";
				d3.select(this)
					.transition().duration(0)
			      .style("background", "#B1B1B1")
					.transition().delay(1000).duration(5000)
			      .style("background-color", "#EBE8DE");
			}});
	}
}

function firstArrayLine() {
    var table = document.getElementById("csvTable");
    var row = table.insertRow(0);

    var cellIsActive = row.insertCell(0);
    cellIsActive.innerHTML = "Actif";

    var cellPos = row.insertCell(1);
    cellPos.innerHTML = translations['collectIdent'][localStorage.lang]; //"Identifiant de collecte";

    var cellName = row.insertCell(2);
    cellName.innerHTML = translations['collectName'][localStorage.lang]; //"Nom de la collecte";
    /*
    var cellUp = row.insertCell(3);
    cellUp.innerHTML = "Monter";

    var cellDown = row.insertCell(4);
    cellDown.innerHTML = "Descendre";
	
    var cellModify = row.insertCell(3);
    cellModify.innerHTML = "Modifier la collecte";

    var cellRemove = row.insertCell(3);
    cellRemove.innerHTML = "Supprimer la collecte";*/

    var cellDownload = row.insertCell(3);
    cellDownload.innerHTML = translations['collectSave'][localStorage.lang]; //"Enregistrer la collecte en local";
}

function newArrayLine(index, pos, focusedElement) {
    var table = document.getElementById("csvTable");


    var row = table.insertRow(pos+1);


    if (!focusedElement.isActive) {
        row.style.color = "grey";
        disabledPosNumber++;
    }

    var cellIsActive = row.insertCell(0);
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.checked = focusedElement.isActive;
    checkbox.addEventListener("change", function () { callIsActiveCsv(index, !focusedElement.isActive) });
    cellIsActive.appendChild(checkbox);

    var cellPos = row.insertCell(1);
    if(new Date(focusedElement.name.substring(focusedElement.name.length - 9, focusedElement.name.length - 19)).getDay() == weekDay){
        row.style.color = "green";
        cellPos.innerHTML = "C"+(focusedElement.pos + 1) + " (auto)";
    }	else	{
        cellPos.innerHTML = "C"+(focusedElement.pos + 1) + " (manu)";
    }
    /*
    if (focusedElement.isActive) {
        cellPos.innerHTML = "C"+(focusedElement.pos + 1 - disabledPosNumber);
    } else {
        cellPos.innerHTML = "-";
    }*/
    /*
    var arrowUp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrowUp.setAttribute("class", "arrowPos");
    var pathUp = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathUp.setAttribute("d","M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z");
    arrowUp.appendChild(pathUp);
    arrowUp.setAttribute("viewBox","0 0 24 24");
    arrowUp.addEventListener("mousedown", function () { callMoveUpCsv(index) });

    
    var arrowDown = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    arrowDown.setAttribute("class", "arrowPos");
    var pathDown = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathDown.setAttribute("d","M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z");
    arrowDown.appendChild(pathDown);
    arrowDown.setAttribute("viewBox","0 0 24 24");
    arrowDown.addEventListener("mousedown", function () { callMoveDownCsv(index) });

    
    var cellPosDiv = document.createElement('div');
    cellPosDiv.setAttribute("class", "arrowPosDiv");
    cellPosDiv.appendChild(arrowUp);
    cellPosDiv.appendChild(arrowDown);
    
    cellPos.appendChild(cellPosDiv);*/

    var cellName = row.insertCell(2);
    cellName.innerHTML = focusedElement.name;

    /*
    var cellUp = row.insertCell(3);
    var buttonUp = document.createElement('input');
    buttonUp.type = "button";
    buttonUp.value = "UP";
    buttonUp.addEventListener("mousedown", function () { callMoveUpCsv(index) });
    cellUp.appendChild(buttonUp);

    var cellDown = row.insertCell(4);
    var buttonDown = document.createElement('input');
    buttonDown.type = "button";
    buttonDown.value = "Down";
    buttonDown.addEventListener("mousedown", function () { callMoveDownCsv(index) });
    cellDown.appendChild(buttonDown);

    var cellModify = row.insertCell(3);
    var buttonModify = document.createElement('input');
    buttonModify.type = "button";
    buttonModify.value = "Modify";
    cellModify.appendChild(buttonModify);

    var cellRemove = row.insertCell(3);
    var buttonRemove = document.createElement('input');
    buttonRemove.type = "button";
    buttonRemove.value = "Supprimer";
    buttonRemove.addEventListener("mousedown", function () { callRemoveCsv(index) });
    cellRemove.appendChild(buttonRemove);*/

    var cellDownload = row.insertCell(3);
    var buttonDownload = document.createElement('input');
    buttonDownload.type = "button";
    buttonDownload.value = "Enregistrer en local";
    buttonDownload.addEventListener("mousedown", function () { callDownloadCsv(index) });
    cellDownload.appendChild(buttonDownload);
}
var waitingUpdate = false;
var timeWaiting = 0;
function getCsvList(needUpdate){
	waitingUpdate = true;
	if(timeWaiting == 5){
		location.reload();
	}	else	{
		timeWaiting++;
	}
    document.getElementById("loaderGif").style.display = "inherit";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var response = JSON.parse(xhr.responseText);
            if (response.error) {
                console.log(response.errorLog)
            } else {
                if (needUpdate && JSON.stringify(csvList) === JSON.stringify(response)) {
                	setTimeout(function(){getCsvList(true);}, 2000);
                	return;
                }
                csvList = response;
                arraySetUp();
            }
            document.getElementById("loaderGif").style.display = "none";
            waitingUpdate = false;
        }
    }

    xhr.open('GET', '../data/'+localStorage.moocId+'/csvList.json' + getRandom(), true);
    //xhr.open('GET', '../Csv/csvList.json' + getRandom(), true);
    xhr.send();
}

function getFileName() {
    if (csvList.length == 0) {
        return "0-0";
    } else {
        return "0-" + csvList[0].weekList.length;
    }
}

function callTraitementXls(evt){
	if(waitingUpdate){
		return;
	}
	if(document.getElementById('xlf').files[0]!= undefined){

		document.getElementById("loaderGif").style.display = "inherit";
		var formData = new FormData(),
		file = document.getElementById('xlf').files[0];
			//evt.target.files[0];
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4 && xhr.status==200){
				document.getElementById("loaderGif").style.display = "none";
				document.getElementById("state").value = "done";
			}
		}
	
		formData.append('typeRequest', "xls");
		formData.append('file', file);
		xhr.open('POST', '../Save?moocId='+localStorage.moocId);
		xhr.send(formData);
	}
}

function haveDate(){
	var name = document.getElementById('addCsv').files[0].name;
	var result = false;
	var previousIndex = name.indexOf("201");
	while(previousIndex!=-1 && previousIndex <= name.length-10){
		var date = new Date(name.substring(previousIndex, previousIndex+10));
		if(isNaN(date.getDate())){
			previousIndex = name.indexOf("201", previousIndex+1);
		}	else	{
			previousIndex = -1;
			result = true;
		}
	}
	return result;
}

function alreadyExist(){
	if(csvList.length == 0){
		return false;
	}
	var name = document.getElementById('addCsv').files[0].name;
	var result = false;
	for(var i = 0; i < csvList[0].weekList.length; i++){
		if(csvList[0].weekList[i].name == name){
			result = true;
		}
	}
	return result;
}

function callTraitementCsv(){
	if(waitingUpdate){
		return;
	}

	if(!haveDate()){
		alert("Erreur : Le nom de la collecte doit contenir la date au format YYYY-MM-DD (ex : 2016-08-05)");
		return;
	}

	if(alreadyExist()){
		alert("Erreur : Une collecte similaire existe déjà");
		return;
	}
	
	lastCollectName = document.getElementById('addCsv').files[0].name;
	
	if (document.getElementById('addCsv').files[0] != undefined && getFileName() != undefined) {

		document.getElementById("loaderGif").style.display = "inherit";
		var formData = new FormData(),
		file = document.getElementById('addCsv').files[0];

			//evt.target.files[0];
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4 && xhr.status==200){
				document.getElementById("loaderGif").style.display = "none";
				document.getElementById("state").value = "done";
				timeWaiting = 0;
				getCsvList(true);
			}
		}

		formData.append('typeRequest', "csv");
		formData.append('file', file);
		formData.append('fileName', getFileName());
		formData.append('realFileName', document.getElementById('addCsv').files[0].name);
		xhr.open('POST', '../Save?moocId='+localStorage.moocId);
		xhr.send(formData);
	}
}

// EG: N/A
function callRemoveCsv(index) {
	if(waitingUpdate){
		return;
	}
    document.getElementById("loaderGif").style.display = "inherit";
    var formData = new FormData();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            document.getElementById("state").value = "done";
            timeWaiting = 0;
            getCsvList(true);
            arraySetUp();
        }
    }
    formData.append('idRequest', 0);
    formData.append('idCsv', index);
    xhr.open('POST', '../csvApi?moocId='+localStorage.moocId);
    xhr.send(formData);
}

// EG: N/A
function callMoveDownCsv(index) {
	if(waitingUpdate){
		return;
	}
    if (csvList[0].weekList[index].pos >= csvList[0].weekList.length - 1) {
        return;
    }
    document.getElementById("loaderGif").style.display = "inherit";
    var formData = new FormData();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            document.getElementById("state").value = "done";
            timeWaiting = 0;
            getCsvList(true);
            arraySetUp();
        }
    }
    formData.append('idRequest', 2);
    formData.append('idCsv', index);
    xhr.open('POST', '../csvApi?moocId='+localStorage.moocId);
    xhr.send(formData);
}

// EG: N/A
function callMoveUpCsv(index) {
	if(waitingUpdate){
		return;
	}
    if (csvList[0].weekList[index].pos <= 0) {
        return;
    }
    document.getElementById("loaderGif").style.display = "inherit";
    var formData = new FormData();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            document.getElementById("state").value = "done";
            timeWaiting = 0;
            getCsvList(true);
            arraySetUp();
        }
    }
    formData.append('idRequest', 1);
    formData.append('idCsv', index);
    xhr.open('POST', '../csvApi?moocId='+localStorage.moocId);
    xhr.send(formData);
}


// EG: N/A
function callChangeNameCsv(index, newName) {
	if(waitingUpdate){
		return;
	}
    document.getElementById("loaderGif").style.display = "inherit";
    var formData = new FormData();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            document.getElementById("state").value = "done";
            timeWaiting = 0;
            getCsvList(true);
            arraySetUp();
        }
    }
    formData.append('idRequest', 3);
    formData.append('idCsv', index);
    formData.append('newName', newName);
    xhr.open('POST', '../csvApi?moocId='+localStorage.moocId);
    xhr.send(formData);
}


function callIsActiveCsv(index, newState) {
	if(waitingUpdate){
		return;
	}
    document.getElementById("loaderGif").style.display = "inherit";
    var formData = new FormData();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            document.getElementById("state").value = "done";
            timeWaiting = 0;
            getCsvList(true);
            arraySetUp();
        }
    }
    formData.append('idRequest', 4);
    formData.append('idCsv', index);
    formData.append('newState', newState);
    xhr.open('POST', '../csvApi?moocId='+localStorage.moocId); 
    xhr.send(formData);
}

function callDownloadCsv(index) {
        document.getElementById("loaderGif").style.display = "inherit";
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var blob = new Blob([xhr.responseText], { type: "text/plain;charset=utf-8" });
                saveAs(blob, csvList[0].weekList[index].name);
                document.getElementById("loaderGif").style.display = "none";
            }
        }
        xhr.open('GET', '../data/'+localStorage.moocId+'/0-'+index+'.csv' + getRandom(), true);
        //xhr.open('GET', '../Csv/0-'+index+'.csv' + getRandom(), true);
        xhr.send();
}

function loadCourse(){
	if(waitingUpdate){
		return;
	}
		document.getElementById("loaderGif").style.display = "inherit";
		var formData = new FormData();
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange=function(){
			if (xhr.readyState==4 && xhr.status==200){
				document.getElementById("loaderGif").style.display = "none";
				document.getElementById("state").value = "done";
			}
		}

		formData.append('courseId', "0"); // TODO WHY "0" ???
		xhr.open('POST', '../UseCsv?moocId='+localStorage.moocId, false);
		xhr.send(formData);
}
//document.getElementById('addCsv').addEventListener('change', callTraitementCsv, false);
//document.getElementById('xlf').addEventListener('change', callTraitementXls, false);
//document.getElementById('chargeCsv').addEventListener('mousedown', loadCourse, false);

function getRandom(){
	return '?rand='+Math.floor(Math.random() * 1000000);
}

document.getElementById('isEdx').addEventListener('change', isEdx);

function isEdx(){
	if(document.getElementById("isEdx").checked){
	    document.getElementById("instituteName").disabled = true;
	    document.getElementById("courseId").disabled = true;
	}	else	{
	    document.getElementById("instituteName").disabled = false;
	    document.getElementById("courseId").disabled = false;
	}
}

function setFunUserParameters() {
    document.getElementById("loaderGif").style.display = "inherit";
    var formData = new FormData();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            console.log(xhr.responseText)
            if(xhr.responseText == "Worked"){            	
            	//document.getElementById("automaticCollectInterface").style.display = "inherit";
            	userParamertersExistVar = true;
		moocId = localStorage.moocId = document.getElementById("instituteName").value+document.getElementById("courseId").value+document.getElementById("sessionName").value
		console.log("updated moocId: "+localStorage.moocId);

                getCsvList(true);
        		document.getElementById("userParametersInterface").style.display = "none";
        		document.getElementById("AdminContent").style.display = "inherit";
        		document.getElementById("menu").style.display = "inherit";
                arraySetUp();
            }	else	if(xhr.responseText == "Error : User Informations"){
            	alert("Identifiant ou mot de passe incorrect.");
            }	else	{
            	alert("Ce cours n'existe pas, vérifiez vos informations.");
            }
        }
    }
    formData.append('userName', document.getElementById("userName").value);
    formData.append('userPassword', document.getElementById("userPassword").value);
	if(document.getElementById("isEdx").checked){
	    formData.append('instituteName', " ");
	    formData.append('courseId', " ");
	}	else	{
	    formData.append('instituteName', document.getElementById("instituteName").value);
	    formData.append('courseId', document.getElementById("courseId").value);
	}
    formData.append('sessionName', document.getElementById("sessionName").value);
    formData.append('isEdx', document.getElementById("isEdx").checked.toString());
    
    xhr.open('POST', '../setFunUserParameters?moocId='+localStorage.moocId); // Not usefulle here...
    xhr.send(formData);
}

function updateCsvDatabase(){
	if(!userParamertersExistVar){
		document.getElementById("userParametersInterface").style.display = "inherit";
		return;
	}
    document.getElementById("loaderGif").style.display = "inherit";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            getCsvList(true);
        }
    }
    xhr.open('POST', '../UpdateCsvDataBase?moocId='+localStorage.moocId);
    xhr.send();
}

function updateForumDatabase(){
	if(!userParamertersExistVar){
		document.getElementById("userParametersInterface").style.display = "inherit";
		return;
	}
    document.getElementById("loaderGif").style.display = "inherit";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 1) {
            document.getElementById("loaderGif").style.display = "none";
            alert("Récupération en cours, attente estimée 2 heures");
        }
    }
    xhr.open('POST', '../forumRequest?moocId='+localStorage.moocId);
    xhr.send();
}

var options = {weekday: "long", year: "numeric", month: "long", day: "numeric"};

function getPeriod(){
	
	return translations["collect-"+document.getElementById("selectDelay").value][localStorage.lang];
/*	
	switch(document.getElementById("selectDelay").value) {
    case "0":
        return "hebdomadaire";
        break;
    case "1":
        return "bimensuelle";
        break;
    case "2":
        return "mensuelle";
    	break;
    default:
        return "hebdomadaire";
	} 
*/
}



function setFunTask() {
	
	dateCollect = picker.getDate();
	dateCollect.setUTCDate(dateCollect.getUTCDate()+1);
	if(isEdx){
		dateCollect.setUTCHours(10);
	}	else	{
		dateCollect.setUTCHours(21);
	}
	dateCollect.setUTCMinutes(0);
	dateCollect.setUTCSeconds(0);
	dateCollect.setUTCMilliseconds(0);
	if (!confirm("Vous allez mettre en place la collecte automatique qui débutera le " + dateCollect.toLocaleDateString("fr-FR", options) + " et qui sera répétée de manière " + getPeriod() + " les " + i18n[localStorage.lang]['weekdays'][dateCollect.getDay()] + "s. Êtes vous sûr?")) {
	    dateCollect == undefined;
		return;
	} else {
		document.getElementById("automaticCollectInterface").style.display = "none";
		switchCollectButton();
	}

	weekDay = dateCollect.getDay();
	if(csvList!=undefined){
		arraySetUp();
	}
	
    document.getElementById("loaderGif").style.display = "inherit";
    var formData = new FormData();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
        }
    }

    formData.append('startDay',dateCollect.getTime());
    formData.append('delay', document.getElementById("selectDelay").value);
    
    xhr.open('POST', '../FunCsvGetter?moocId='+localStorage.moocId);
    xhr.send(formData);
}

function removeFunTask(){
    document.getElementById("loaderGif").style.display = "inherit";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";

        }
    }
    xhr.open('POST', '../RemoveTask?moocId='+localStorage.moocId);
    xhr.send();
}

function getFunTask(){
    document.getElementById("loaderGif").style.display = "inherit";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            getDateCollect(xhr.responseText);
        }
    }
    xhr.open('POST', '../GetTask?moocId='+localStorage.moocId);
    xhr.send();
}


function startManualCollectFun(){
    document.getElementById("loaderGif").style.display = "inherit";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            alert("Collecte lancée.");
        }
    }
    xhr.open('POST', '../StartCollect?moocId='+localStorage.moocId);
    xhr.send();
}

var userParamertersExistVar = false;
var isEdx;
function userParametersExist() {
    document.getElementById("loaderGif").style.display = "inherit";

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            userParamertersExistVar = xhr.responseText.indexOf("not worked") == -1;
            isEdx = xhr.responseText.indexOf("isEdx") != -1;
            if(!userParamertersExistVar){
        		document.getElementById("userParametersInterface").style.display = "inherit";
        		document.getElementById("menu").style.display = "none";
        		document.getElementById("AdminContent").style.display = "none";
            }	else	{
        		document.getElementById("userParametersInterface").style.display = "none";
        		document.getElementById("AdminContent").style.display = "inherit";
        		document.getElementById("menu").style.display = "inherit";
        		getCsvList(false);
        		
            }
        }
    }
    xhr.open('POST', '../userParametersExist?moocId='+localStorage.moocId);
    xhr.send();
}



function connect() {
    document.getElementById("loaderGif").style.display = "inherit";
    var formData = new FormData();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            if(xhr.responseText == "You are connected"){
            	connectedDisplay();
            	getFunTask();
            }	else	{
            	alert("Mauvais mot de passe");
            }
        }
    }

    formData.append('pwd',document.getElementById("moocPilotPassword").value);
    
    xhr.open('POST', '../Connect?moocId='+localStorage.moocId);
    xhr.send(formData);
}

// Connected ???
isConnected();
function isConnected(){
    console.log("isConnected localStorage.moocId="+localStorage.moocId);
    document.getElementById("loaderGif").style.display = "inherit";
    var formData = new FormData();

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("loaderGif").style.display = "none";
            if(xhr.responseText == "You are connected"){
            	connectedDisplay();
            }	else	{
            	unconnectedDisplay();
            }
        }
    }    
    xhr.open('POST', '../IsConnect?moocId='+localStorage.moocId); // TODO moocId
    xhr.send();
}

function connectedDisplay(){
	userParametersExist();
	document.getElementById("connectDiv").style.display = "none";
	//document.getElementById("menu").style.display = "inherit";
	/*
    if(!userParamertersExistVar){
		document.getElementById("userParametersInterface").style.display = "inherit";
		document.getElementById("AdminContent").style.display = "none";
    }	else	{
		document.getElementById("userParametersInterface").style.display = "none";
		document.getElementById("AdminContent").style.display = "inherit";
    }*/
}

function unconnectedDisplay(){
	document.getElementById("connectDiv").style.display = "inherit";
	//document.getElementById("xlfDiv").style.display = "none";
	document.getElementById("menu").style.display = "none";
	document.getElementById("AdminContent").style.display = "none";
	document.getElementById("userParametersInterface").style.display = "none";
}

function displayUserParametersInterface(){
	if(automaticActivated){
		if (!confirm(translations['confirm-remove'][localStorage.lang])) {
		    return;
		} else {
			removeFunTask();
			dateCollect = undefined;

        	weekDay = -1;
        	if(csvList!=undefined){
        		arraySetUp();
        	}
        	
			switchCollectButton();
		}
	}	else	{
		document.getElementById("automaticCollectInterface").style.display = "inherit";
	}
}

var tomorrow = new Date();

var i18n = {
	'fr':{
	    previousMonth : 'Mois Précédent',
	    nextMonth     : 'Mois Suivant',
	    months        : ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Decembre'],
	    weekdays      : ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
	    weekdaysShort : ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam']
	},
	'en':{
	    previousMonth : 'Next month',
	    nextMonth     : 'Previous month',
	    months        : ['January','February','Mars','April','May','June','July','August','September','October','November','December'],
	    weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
	    weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
	}
};


//tomorrow.setDate(tomorrow.getDate() + 1);
//var weekdays = ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
// weekdays -> i18n[localStorage.lang]['weekdays']
var picker = new Pikaday({ field: document.getElementById('datepicker'),bound :false, firstDay: 1, minDate : tomorrow, showDaysInNextAndPreviousMonths : true,
	i18n: i18n[localStorage.lang]});
picker.setDate(tomorrow);

document.querySelector("#automaticCollectInterface svg").addEventListener("click", closeParent);
function closeParent(evt){
	if(evt.target.tagName != "svg"){
		evt.target.parentElement.parentElement.style.display = "none";
	}	else{
		evt.target.parentElement.style.display = "none";
	}
}

function validForm(evt){
	if (evt.keyCode == 13) {
		connect();
	}
}

function removeCookie(){
	var rightPart =	document.location.href.lastIndexOf("/", document.location.href.length-6);
	var leftPart =	document.location.href.lastIndexOf("/", rightPart-1);
	var courseName = document.location.href.substring(leftPart+1, rightPart);
	if(courseName.indexOf(":8080") != -1){
		courseName = "Unknown Name";
	}
	 document.cookie = "password"+ "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"+courseName+"/;";
}



function startManualCollect(){
	if (confirm(translations['confirm-collect'][localStorage.lang])) {
		startManualCollectFun();
	} else {
	    return;
	}
}


