
// EG: TODO to be removed ?
function callDemoJSON(callBack){
    document.getElementById("waitingPanel").style.display = "inherit";
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("waitingPanel").style.display = "none";
            var response = JSON.parse(xhr.responseText);
            if (response.error) {
                console.log(response.errorLog)
            } else {
                tabEleves = response.tabEleves;

                sheetNames = response.sheetList;
                TabHashtable = response.tabHashtable;
                collectNames = response.csvListName;
                callBack();
            }
        }
    }

    xhr.open('GET', 'UploadedFiles/demoVersion.txt' + getRandom(), true);
    xhr.send();
}

// EG: TODO to be removed ?
function callLog(){
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //var response = JSON.parse(xhr.responseText);
            console.log(xhr.responseText);
        }
    }

    xhr.open('GET', 'UploadedFiles/export_course_MinesTelecom_04013_session01.log_anonymized', true);
    xhr.send();
}
var lock = false;

function callSavedJSON(callBack) {//appelle le fichier JSON sauvegardé
	if(lock){
		return;
	}
    document.getElementById("waitingPanel").style.display = "inherit";
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
    	if(xhr.readyState == 4 && xhr.status == 404){
    		lock = true;
			document.getElementById("waitingPanel").style.display = "none";
			alert("Aucun fichier disponible");
		// EG: empty data...
		/*
                tabEleves = [{'cohorte':'Default Group', 'dateInscription':1, 'email':'', id:'007', login:'XXX'}];
                sheetNames = [1];
                TabHashtable = {};
                collectNames = ["dummy.csv"];
                callBack();
		*/
    	}
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("waitingPanel").style.display = "none";
            var response = JSON.parse(xhr.responseText);
            if (response.error) {
                console.log(response.errorLog)
            } else {
                tabEleves = response.tabEleves;
                sheetNames = response.sheetList;
                TabHashtable = response.tabHashtable;
                collectNames = response.csvListName;
console.log(response);
                callBack();
            }
console.log("tabEleves, sheetNames, collectNames");
console.log(tabEleves);
console.log(sheetNames);
console.log(collectNames);
        }
    }
    // EG change location of file
    xhr.open('GET', 'data/'+localStorage.moocId+'/versionLoaded.txt' + getRandom(), true);
    //xhr.open('GET', 'UploadedFiles/versionLoaded.txt' + getRandom(), true);
    xhr.send();
}

var lastTime;
var lastValue;
var actualTime;
var actualValue;
function callTraitement(evt, callBack) {//Envoi le fichier XLS et attend la version traitée en JSON
    //document.getElementById("waitingPanel").style.display = "inherit";
    var formData = new FormData(),
	file = evt.target.files[0];
    xhr = new XMLHttpRequest();
    lastTime = new Date();
    lastValue = 0;
    xhr.onreadystatechange = function () {
        xhr.upload.onprogress = function(e)
        {
        	actualTime = new Date();
        	actualValue = e.loaded/e.total*100;
        	
        	document.getElementById("loadA").innerText = "Traitement en cours \n État :  "+Math.round(actualValue*100)/100+"%\nTemps restant estimé : "+Math.floor((actualTime.getTime()-lastTime.getTime())/(actualValue-lastValue) * (100-actualValue)/1000)+"s\n";
        	document.getElementById("loadBar").value = actualValue;
        	document.getElementById("loadDiv").style.display = "inherit";

        	lastTime = actualTime;
        	lastValue = actualValue;
        };
        if (xhr.readyState == 4 && xhr.status == 200) {
        	document.getElementById("waitingPanel").style.display = "none";
        	document.getElementById("loadDiv").style.display = "none";
            var response = JSON.parse(xhr.responseText);
            if (response.error) {
                console.log(response.errorLog)
            } else {
                tabEleves = response.tabEleves;
                sheetNames = response.sheetList;
                TabHashtable = response.tabHashtable;
                callBack();
            }
        }
    }
    formData.append('file', file);
    xhr.open('POST', 'Upload');
    xhr.setRequestHeader('Accept-Encoding','gzip');
    xhr.send(formData);
}

function callJsonTraitement(evt) {//call la fonction avec la fonction de callBack
    callTraitement(evt, useJSON);
}
//document.getElementById('xlf').addEventListener('change', callJsonTraitement, false);

