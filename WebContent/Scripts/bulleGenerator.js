weekData = [0,1,2];
var bulleMaxSize = 35;//Taille maximal d'une bulle

var listTypeName;
var listTypeSize;
var listTypeStart;

var typeList;
var registerWeekList;
var typeByRegisterWeekList;

var bulleList;
var bulleDataList;

var cohorteTypeList;
var cohorteRegisterWeekList;
var cohorteTypeByRegisterWeekList;

var cohorteList;
var cohorteDataList;
var cohorteGlobalDataList;

var selectedTypeList;
var selectedRegisterWeekList;
var selectedTypeByRegisterWeekList;

var selectedList;
var selectedDataList;//Relative a selected
var selectedGlobalDataList;//Relative to Global
var selectedCohorteDataList;//Relative to Cohorte

var globalBulleMax;
var cohorteBulleMax;
var selectedBulleMax;

var referenceDataset;

var uniqueDataset;

function prepareData() {
    SetListNoteName();

    typeList = setTypes();//R�fl�chir:g�n�r� une fois vide et r�pliqu�
    registerWeekList = setRegisterWeeks();
    typeByRegisterWeekList = setTypeByRegisterWeeks(typeList, registerWeekList);
    setBulles();

    bulleDataListSetUp();

    genereReferenceDataset();

    cohorteTypeList = setTypes();
    cohorteRegisterWeekList = setRegisterWeeks();
    cohorteTypeByRegisterWeekList = setTypeByRegisterWeeks(cohorteTypeList, cohorteRegisterWeekList);
    setCohortes();
    cohorteDataListSetUp();

    selectedTypeList = setTypes();
    selectedRegisterWeekList = setRegisterWeeks();
    selectedTypeByRegisterWeekList = setTypeByRegisterWeeks(selectedTypeList, selectedRegisterWeekList);
    setSelected();
    selectedDataListSetUp();
    if (menu == 0) {
        uniqueDataset = createCohorteElevesMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    } else if (menu == 1) {
        uniqueDataset = createCohorteElevesLastMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    } else if (menu == 2) {
        uniqueDataset = createCohorteElevesMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    } else if (menu == 3) {
        uniqueDataset = createCohorteElevesLastMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    }
    
}

function lowPrepareData(){
    cohorteTypeList = setTypes();
    cohorteRegisterWeekList = setRegisterWeeks();
    cohorteTypeByRegisterWeekList = setTypeByRegisterWeeks(cohorteTypeList, cohorteRegisterWeekList);
    setCohortes();
    cohorteDataListSetUp();

    selectedTypeList = setTypes();
    selectedRegisterWeekList = setRegisterWeeks();
    selectedTypeByRegisterWeekList = setTypeByRegisterWeeks(selectedTypeList, selectedRegisterWeekList);
    setSelected();
    selectedDataListSetUp();
    

    if (menu == 0) {
        uniqueDataset = createCohorteElevesMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    } else if (menu == 1) {
        uniqueDataset = createCohorteElevesLastMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    } else if (menu == 2) {
        uniqueDataset = createCohorteElevesMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    } else if (menu == 3) {
        uniqueDataset = createCohorteElevesLastMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    }
}



function reallyLowPrepareData(){
    selectedTypeList = setTypes();
    selectedRegisterWeekList = setRegisterWeeks();
    selectedTypeByRegisterWeekList = setTypeByRegisterWeeks(selectedTypeList, selectedRegisterWeekList);
    setSelected();
    selectedDataListSetUp();
    

    if (menu == 0) {
        uniqueDataset = createCohorteElevesMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    } else if (menu == 1) {
        uniqueDataset = createCohorteElevesLastMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    } else if (menu == 2) {
        uniqueDataset = createCohorteElevesMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    } else if (menu == 3) {
        uniqueDataset = createCohorteElevesLastMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 2);
    }
}


var lockSet;
function setData() {
    lockSet = true;
    prepareData();
    newGenereSVG(referenceDataset, bulleList, bulleDataList, cohorteList, cohorteDataList, cohorteGlobalDataList, selectedList, selectedDataList, selectedCohorteDataList, selectedGlobalDataList, uniqueDataset);
    lockSet = false;
}

function updateData(displayUpdateLevel) {
    while (lockSet) { }
    prepareData();
    newUpdateSVG(referenceDataset, bulleList, bulleDataList, cohorteList, cohorteDataList, cohorteGlobalDataList, selectedList, selectedDataList, selectedCohorteDataList, selectedGlobalDataList, displayUpdateLevel, uniqueDataset);
}

function lowUpdateData(displayUpdateLevel){
    while (lockSet) { }
	lowPrepareData();
    newUpdateSVG(referenceDataset, bulleList, bulleDataList, cohorteList, cohorteDataList, cohorteGlobalDataList, selectedList, selectedDataList, selectedCohorteDataList, selectedGlobalDataList, displayUpdateLevel, uniqueDataset);
}

function reallyLowUpdateData(displayUpdateLevel){
    while (lockSet) { }
    reallyLowPrepareData();
    newUpdateSVG(referenceDataset, bulleList, bulleDataList, cohorteList, cohorteDataList, cohorteGlobalDataList, selectedList, selectedDataList, selectedCohorteDataList, selectedGlobalDataList, displayUpdateLevel, uniqueDataset);
}

function noUpdateData(displayUpdateLevel){
    while (lockSet) { }
    newUpdateSVG(referenceDataset, bulleList, bulleDataList, cohorteList, cohorteDataList, cohorteGlobalDataList, selectedList, selectedDataList, selectedCohorteDataList, selectedGlobalDataList, displayUpdateLevel, uniqueDataset);
}

function setWeek() {
    weekList = new Array();
    for (var i = 0; i < weekData.length; i++) {
        weekList.push(new Category(i, "C" + weekData[i], 0, 0));
    }
}

function SetListNoteName() {//Work
    listTypeName = new Array();
    listTypeSize = new Array();
    listTypeStart = new Array();
    for (var i = 0; i < tabEleves[0].tabNotes.length; i++) {
    	var name;
    	var noteName = tabEleves[0].tabNotes[i].nom;
    	if(noteName.indexOf(":") == -1){
    		if(!isNaN(parseInt(noteName.substring(noteName.length-1)))){
        		name = noteName.substring(0, noteName.length - 3);
    		}	else	{
        		name = noteName;
    		}
    	}	else	{
    		name = noteName.substring(0, noteName.lastIndexOf(" ", noteName.indexOf(":")));
    	}
        if (listTypeName.indexOf(name) == -1) {
        	listTypeName.push(name);
            if (listTypeName.length > 1) {
                if (listTypeSize.length == 0) {
                    listTypeStart.push(0);
                    listTypeSize.push(i);
                } else {
                    listTypeSize.push(i - listTypeSize[listTypeSize.length - 1]);
                    listTypeStart.push(i - listTypeSize[listTypeSize.length - 1]);
                }
            }
        }
    }
    if(listTypeSize.length == 0){
        listTypeStart.push(0);
        listTypeSize.push(i);
    }	else	{
        listTypeSize.push(i - listTypeSize[listTypeSize.length - 1]);
        listTypeStart.push(i - listTypeSize[listTypeSize.length - 1]);
    }
}

function setTypes() {
    var typeList = new Array();
    for (var i = 0; i < listTypeName.length; i++) {
        typeList.push(new Category(i, listTypeName[i], listTypeStart[i], listTypeSize[i], 0));
    }
    return typeList;
}

function getTypeId(typeList, pos, bulleSize) {
    for (var i = 0; i < typeList.length; i++) {
        if (typeList[i].start <= pos && typeList[i].start + typeList[i].size > pos) {
            typeList[i].setMax(bulleSize);
            return i;
        }
    }
}

function setRegisterWeeks() {
    var registerWeekList = new Array();
    for (var i = 0; i < sheetNames.length; i++) {
        registerWeekList.push(new Category(i, sheetNames[i], i, 1, 0));
    }
    return registerWeekList;
}

function getRegisterWeekId(registerWeekList, pos, bulleSize) {
    for (var i = 0; i < registerWeekList.length; i++) {
        if (registerWeekList[i].start <= pos && registerWeekList[i].start + registerWeekList[i].size > pos) {
            registerWeekList[i].setMax(bulleSize);
            return i;
        }
    }
}

function setTypeByRegisterWeeks(typeList, registerWeekList) {
    var typeByRegisterWeekList = new Array();
    for (var i = 0; i < typeList.length; i++) {
        typeByRegisterWeekList[i] = new Array();
        for (var j = 0; j < registerWeekList.length; j++) {
            typeByRegisterWeekList[i][j] = new CrossCategory(i, j, 0);
        }
    }
    return typeByRegisterWeekList;
}

function setTypeByRegisterWeeksMax(typeByRegisterWeekList, typeId, registerWeekId, bulleSize) {
	typeByRegisterWeekList[typeId][registerWeekId].setMax(bulleSize);
}

function getTypeByRegisterWeekId(pos, bulleSize) {
    for (var i = 0; i < registerWeekList.length; i++) {
        if (registerWeekList[i].start <= pos && registerWeekList[i].start + registerWeekList[i].size > pos) {
            registerWeekList[i].setMax(bulleSize);
            return i;
        }
    }
}

var ToTBulleMax = -1;

function setBulles() {
    bulleList = new Array();
    bulleDataList = new Array();
    globalBulleMax = 0;
    var dataset;
    var timer = new Date().getTime() ;
    if (menu == 0) {
        dataset = createCohorteElevesMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), true, 0);
    } else if (menu == 1) {
        dataset = createCohorteElevesLastMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), true, 0);
    } else if (menu == 2) {
    	dataset = createCohorteElevesMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), true, 0);
    }	else if(menu == 3){
    	dataset = createCohorteElevesLastMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), true, 0);
    }
    
    for (var i = 1; i < dataset.length; i++) {
        for (var j = 1; j < dataset[i].length; j++) {
            bulleList.push(new Bulle((i - 1) * dataset[i].length + j - 1, getTypeId(typeList, j - 1, dataset[i][j].length), getRegisterWeekId(registerWeekList, i - 1, dataset[i][j].length), dataset[i][j]));
            setTypeByRegisterWeeksMax(typeByRegisterWeekList, bulleList[bulleList.length - 1].typeId, bulleList[bulleList.length - 1].registerWeekId, dataset[i][j].length);
            globalBulleMax = setGlobalBulleMax(globalBulleMax, dataset[i][j].length);
            bulleDataList.push(new BulleData((i - 1) * (dataset[i].length - 1) + j - 1));
        }
    }
    for(var i = 1; i < dataset[0].length; i++){
    	for(var j = 0; j < dataset.length-1; j++){
    		if(j == 0){
    			bulleList.push(new Bulle(bulleList.length , getTypeId(typeList, i - 1, dataset[j][i].length), getRegisterWeekId(registerWeekList, j - 1, dataset[j][i].length), bulleList[j * tabEleves[0].tabNotes.length + i -1].listEleves));
    			bulleDataList.push(new BulleData(bulleList.length-1));
    			bulleDataList[bulleDataList.length-1].typeSize = 35;
    			bulleDataList[bulleDataList.length-1].globalSize = 35;
    			bulleDataList[bulleDataList.length-1].typeByRegisterWeekSize = 35;
    			bulleDataList[bulleDataList.length-1].registerWeekSize = 35;    			
    		}	else	{
    			bulleList[bulleList.length-1].listEleves = bulleList[bulleList.length-1].listEleves.concat(bulleList[j * tabEleves[0].tabNotes.length + i -1].listEleves);
    		}
    	}
    	if(bulleList[bulleList.length-1].listEleves.length>ToTBulleMax){
    		ToTBulleMax = bulleList[bulleList.length-1].listEleves.length;
    	}
    }
}

function bulleDataListSetUp() {
    for (var i = 0; i < bulleDataList.length - tabEleves[0].tabNotes.length; i++) {
        bulleDataList[i].bulleDataSetUp(bulleList, globalBulleMax, typeList, registerWeekList, typeByRegisterWeekList);
    }

    for (var i = bulleDataList.length - tabEleves[0].tabNotes.length; i < bulleDataList.length; i++) {
    	bulleDataList[i].globalSize = bulleDataList[i].getSizeRelativeTo(bulleList, ToTBulleMax);
    	bulleDataList[i].registerWeekSize = bulleDataList[i].globalSize;
    }
}

function setGlobalBulleMax(globalBulleMax, newMax) {
    if (globalBulleMax < newMax) {
        globalBulleMax = newMax;
    }
    return globalBulleMax;
}

function genereReferenceDataset() {
    referenceDataset = new Array();
    for (var i = 0; i < sheetNames.length + 1; i++) {
        referenceDataset[i] = new Array();
        for (var j = 0; j < tabEleves[0].tabNotes.length + 1; j++) {
            if (i == 0 && j == 0) {
            } else if(i == 0){
            	var name;
            	var noteName = tabEleves[0].tabNotes[j - 1].nom;
            	if(noteName.indexOf(":") == -1){
            		name = noteName;
            	}	else	{
            		name = noteName.substring(0, noteName.indexOf(":"));
            	}
                referenceDataset[i][j] = name;
            } else if(j == 0){
            	if(menu >= 2){
            		referenceDataset[i][j] = "C" + sheetNames[i-1];
            	}	else	{
                	if(i == 1){
                        referenceDataset[i][j] = "C "+ "0" + "\u2192" + (sheetNames[i-1]);
                	}	else	{
                        referenceDataset[i][j] = "C "+(sheetNames[i-2]) + "\u2192" + (sheetNames[i-1]);
                	}
            	}
            } else {
                referenceDataset[i][j] = (i - 1) * tabEleves[0].tabNotes.length + j - 1;
            }
        }
    }
    referenceDataset.push(new Array());
    referenceDataset[referenceDataset.length-1].push("Total");
    for(var i = 1; i < tabEleves[0].tabNotes.length+1; i++){
    	referenceDataset[referenceDataset.length-1].push((sheetNames.length) * tabEleves[0].tabNotes.length + i -1);
    }
}

var ToTCohorteBulleMax = -1;

function setCohortes() {
    cohorteList = new Array();
    cohorteDataList = new Array();
    cohorteGlobalDataList = new Array();

    if (listCohorteId.length == 0) {
        return;
    }
    var timer = new Date().getTime(); 
    if (menu == 0) {
        cohorteDataset = createCohorteElevesMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 0);
    } else if (menu == 1) {
        cohorteDataset = createCohorteElevesLastMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 0);
    } else if (menu == 2) {
    	cohorteDataset = createCohorteElevesMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 0);
    } else if (menu == 3) {
    	cohorteDataset = createCohorteElevesLastMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 0);
    }

    cohorteBulleMax = 0;

    for (var i = 1; i < cohorteDataset.length; i++) {
        for (var j = 1; j < cohorteDataset[i].length; j++) {
            cohorteList.push(new Bulle((i - 1) * cohorteDataset[i].length + j - 1, getTypeId(cohorteTypeList, j - 1, cohorteDataset[i][j].length), getRegisterWeekId(cohorteRegisterWeekList, i - 1, cohorteDataset[i][j].length), cohorteDataset[i][j]));
            setTypeByRegisterWeeksMax(cohorteTypeByRegisterWeekList, cohorteList[cohorteList.length - 1].typeId, cohorteList[cohorteList.length - 1].registerWeekId, cohorteDataset[i][j].length);
            cohorteBulleMax = setGlobalBulleMax(cohorteBulleMax, cohorteDataset[i][j].length);
            cohorteDataList.push(new BulleData((i - 1) * (cohorteDataset[i].length - 1) + j - 1));
            cohorteGlobalDataList.push(new BulleData((i - 1) * (cohorteDataset[i].length - 1) + j - 1));
        }
    }
    for(var i = 1; i < cohorteDataset[0].length; i++){
    	for(var j = 1; j < cohorteDataset.length-1; j++){
    		if(j == 1){
    			cohorteList.push(new Bulle(cohorteList.length , getTypeId(cohorteTypeList, i - 1, cohorteDataset[j][i].length), getRegisterWeekId(cohorteRegisterWeekList, j - 1, cohorteDataset[j][i].length), cohorteList[j * tabEleves[0].tabNotes.length + i -1].listEleves));
    			
    			cohorteDataList.push(new BulleData(cohorteList.length-1));
    			cohorteDataList[cohorteDataList.length-1].typeSize = 35;
    			cohorteDataList[cohorteDataList.length-1].globalSize = 35;
    			cohorteDataList[cohorteDataList.length-1].typeByRegisterWeekSize = 35;
    			cohorteDataList[cohorteDataList.length-1].registerWeekSize = 35;    	    			
    			
    			cohorteGlobalDataList.push(new BulleData(cohorteList.length-1));
    			cohorteGlobalDataList[cohorteGlobalDataList.length-1].typeSize = 35;
    			cohorteGlobalDataList[cohorteGlobalDataList.length-1].globalSize = 35;
    			cohorteGlobalDataList[cohorteGlobalDataList.length-1].typeByRegisterWeekSize = 35;
    			cohorteGlobalDataList[cohorteGlobalDataList.length-1].registerWeekSize = 35;    			
    		}	else	{
    			cohorteList[cohorteList.length-1].listEleves = cohorteList[cohorteList.length-1].listEleves.concat(cohorteList[j * tabEleves[0].tabNotes.length + i -1].listEleves);
    		}
    	}

    	if(cohorteList[cohorteList.length-1].listEleves.length>ToTCohorteBulleMax){
    		ToTCohorteBulleMax = cohorteList[cohorteList.length-1].listEleves.length;
    	}
    }
}

function cohorteDataListSetUp() {
    if (listCohorteId.length == 0) {
        return;
    }
    for (var i = 0; i < cohorteDataList.length - tabEleves[0].tabNotes.length; i++) {
        cohorteDataList[i].bulleDataSetUp(cohorteList, cohorteBulleMax, cohorteTypeList, cohorteRegisterWeekList, cohorteTypeByRegisterWeekList);
        cohorteGlobalDataList[i].bulleDataSetUp(cohorteList, globalBulleMax, typeList, registerWeekList, typeByRegisterWeekList);
    }
    for (var i = cohorteDataList.length - tabEleves[0].tabNotes.length; i < cohorteDataList.length; i++) {
    	cohorteDataList[i].globalSize = cohorteDataList[i].getSizeRelativeTo(cohorteList, ToTCohorteBulleMax);
    	cohorteDataList[i].registerWeekSize = cohorteDataList[i].globalSize;
    	cohorteGlobalDataList[i].globalSize = cohorteGlobalDataList[i].getSizeRelativeTo(cohorteList, ToTCohorteBulleMax);
    	cohorteGlobalDataList[i].registerWeekSize = cohorteGlobalDataList[i].globalSize;
    }
}


function setSelected(){
    selectedList = new Array();
    selectedDataList = new Array();
    selectedGlobalDataList = new Array();
    selectedCohorteDataList = new Array();

    if (listSelectedId.length == 0) {//A changer
        return;
    }
    if (menu == 0) {
        selectedDataset = createCohorteElevesMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 1);
    } else if (menu == 1) {
        selectedDataset = createCohorteElevesLastMadeWithMore(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 1);
    } else if (menu == 2) {
        selectedDataset = createCohorteElevesMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 1);
    } else if (menu == 3) {
        selectedDataset = createCohorteElevesLastMadeWithMoreByWeek(document.getElementById('moreOf').value, sheetNames.slice(0, parseInt(document.getElementById("slideBar").value) + 1), false, 1);
    }

    selectedBulleMax = 0;

    for (var i = 1; i < selectedDataset.length; i++) {
        for (var j = 1; j < selectedDataset[i].length; j++) {
            selectedList.push(new Bulle((i - 1) * selectedDataset[i].length + j - 1, getTypeId(selectedTypeList, j - 1, selectedDataset[i][j].length), getRegisterWeekId(selectedRegisterWeekList, i - 1, selectedDataset[i][j].length), selectedDataset[i][j]));
            setTypeByRegisterWeeksMax(selectedTypeByRegisterWeekList, selectedList[selectedList.length - 1].typeId, selectedList[selectedList.length - 1].registerWeekId, selectedDataset[i][j].length);
            selectedBulleMax = setGlobalBulleMax(selectedBulleMax, selectedDataset[i][j].length);
            selectedDataList.push(new BulleData((i - 1) * (selectedDataset[i].length - 1) + j - 1));
            selectedGlobalDataList.push(new BulleData((i - 1) * (selectedDataset[i].length - 1) + j - 1));
            selectedCohorteDataList.push(new BulleData((i - 1) * (selectedDataset[i].length - 1) + j - 1));
        }
    }
}
function selectedDataListSetUp(){
    if (selectedList.length == 0) {
        return;
    }
    for (var i = 0; i < selectedDataList.length; i++) {
        selectedDataList[i].bulleDataSetUp(selectedList, selectedBulleMax, selectedTypeList, selectedRegisterWeekList, selectedTypeByRegisterWeekList);
        selectedGlobalDataList[i].bulleDataSetUp(selectedList, globalBulleMax, typeList, registerWeekList, typeByRegisterWeekList);
        if (cohorteList.length != 0) {
            selectedCohorteDataList[i].bulleDataSetUp(selectedList, cohorteBulleMax, cohorteTypeList, cohorteRegisterWeekList, cohorteTypeByRegisterWeekList);
        }
    }
}