var listSelectedId = new Array();
var listCohorteId = new Array();
var uniqueId = new Array();
var cibledList = new Array();
var wrongEmail = false;

if (!Array.prototype.includes) {
	Array.prototype.includes = function() {
        'use strict';
        return Array.prototype.indexOf.apply(this, arguments) !== -1;
    };
}
function updateSelectedId(d){
	listSelectedId = new Array();
	tabEleves.forEach(function(obj){
		if(d.includes(obj.id)){
		    listSelectedId.push(obj);
		}
	})	
}

function updateSelectedIdByInfo(info) {
	uniqueId = new Array();
    var cible = tabEleves.filter(function( eleve ) {
		  return eleve.id == info || eleve.login == info || eleve.email == info;
	});
    if(cible.length != 0){
        uniqueId.push(cible[0]);
    }
    /*
	if(email != ""){
		tabEleves.forEach(function(obj){
			if(obj.cohorte.indexOf(email) != -1){
			    listCohorteId.push(obj);
			}
		})
	}*/
	//wrongEmail = listCohorteId.length == 0 && info != "";
}



function updateSelectedIdByCohorteName(cohorteName) {
    listCohorteId = new Array();
	if(cohorteName != ""){
		tabEleves.forEach(function(obj){
			if(obj.cohorte.indexOf(cohorteName) != -1){
			    listCohorteId.push(obj);
			}
		})
	}
	wrongEmail = listCohorteId.length == 0 && cohorteName != "";
}




Array.prototype.diff = function(tab) {//fonction qui renvoi la différence entre this et tab. (this.diff(tab))
    return this.filter(function(i) {return tab.indexOf(i) < 0;});
};

var emailContent = "";



function createCohorteElevesMadeWithMore(moreOf, during, ignoreListSelected, cibleGroup) {
    tabCohorte = new Array;    
    
    
    var tabNotes = tabEleves[0].tabNotes;
    

    tabCohorte[0] = new Array();
    for (var k = 0; k < tabNotes.length; k++){
	    tabCohorte[0][k+1] = tabNotes[k].nom;	
    }

    for (var i = 0; i < sheetNames.length; i++) {
	tabCohorte[i+1] = new Array();
	tabCohorte[i+1][0] = "C"+(i+1);
	    for (var j = 0; j < tabNotes.length; j++) {
	        tabCohorte[i + 1][j + 1] = getElevesMadeWithMoreDuring(tabNotes[j].nom, moreOf, during, i + 1, ignoreListSelected, cibleGroup);
        }
    }
    return tabCohorte;
}

function SetListColumnNoteName(){
	finalListColumnNoteName = new Array;
	for (var i = 0; i < tabEleves[0].tabNotes.length; i++) {
	    if (finalListColumnNoteName.indexOf(tabEleves[0].tabNotes[i].nom.substring(0, tabEleves[0].tabNotes[i].nom.length - 3)) == -1) {
	        finalListColumnNoteName.push(tabEleves[0].tabNotes[i].nom.substring(0, tabEleves[0].tabNotes[i].nom.length - 3));
		}
	}
	return finalListColumnNoteName;
}
function createCohorteElevesLastMadeWithMore(moreOf, during, ignoreListSelected, cibleGroup) {
    tabCohorte = createCohorteElevesMadeWithMore(moreOf, during, ignoreListSelected, cibleGroup);
    var firstRowContain = 1;
    for (k = 0; k < listTypeName.length; k++) {
        var typeNote = listTypeName[k];
        var lastRowContain = -1;
	    var l = tabCohorte[0].length - 1;
	    var tempTotalTab = new Array;
	    var tempTab = new Array;
	    while (lastRowContain == -1) {
	        if (tabCohorte[0][l].indexOf(typeNote) != -1) {
			    lastRowContain = l;
	        }
	        l--;
	        if(l == 0){
	    	    break;
	        }
	    }
	    for (var i = 1; i < tabCohorte.length; i++) {
	    
	        for (var j = lastRowContain; j >= firstRowContain; j--){//tempTotalTab représente les élève déjà dans un groupe (de base aucun)
	            tempTab = tabCohorte[i][j].diff(tempTotalTab);//notre groupe actuelle représente tout les élèves ayant fait l'exercice - ceux présent dans un groupe suivant
	            tempTotalTab = tempTotalTab.concat(tempTab);//on ajoute les nouveau placé dans la liste de ceux déjà placé.
		        tabCohorte[i][j]= tempTab;//On met à jour le groupe
	        }
	    }
	    firstRowContain = lastRowContain + 1;	
    }
    return tabCohorte;
}
/*Deactivate
function createCohorteElevesLastSuiteMadeWithMore(moreOf, during, ignoreListSelected) {
    tabCohorte = createCohorteElevesMadeWithMore(moreOf, during, ignoreListSelected);
    var firstRowContain = 1;
    for (k = 0; k < 4; k++) {
        var typeNote = finalListColumnNoteName[k];
        var lastRowContain = -1;
        var l = tabCohorte[0].length - 1;
        var tempTotalTab = new Array;
        var tempTab = new Array;        
        while (lastRowContain == -1) {
            if (tabCohorte[0][l].indexOf(typeNote) != -1) {
                lastRowContain = l;
            }
            l--;
        }
        for (var i = 1; i < tabCohorte.length; i++) {
            for (var j = firstRowContain; j < lastRowContain - 1; j++) {
                tempTab = (tabCohorte[i][j].diff(tabCohorte[i][j + 1])).diff(tempTotalTab);
                tempTotalTab = tempTotalTab.concat(tempTab);
                tabCohorte[i][j] = tempTab;
            }
        }
        firstRowContain = lastRowContain + 1;
    }
    return tabCohorte;
}*/

function getElevesMadeWithMoreDuring(exercice, moreOf, during, sheetName, ignoreListSelected, cibleGroup) {

    var pos = 0;
    var tabListeEleves = new Array;

    while (tabEleves[0].tabNotes[pos].nom != exercice){
        pos++;
    }

    

    /*
    if (cibleGroup) {
        cibledList = listSelectedId;
    } else {
        cibledList = listCohorteId;
    }*/
    switch(cibleGroup) {
    case 0:
        cibledList = listCohorteId;
        break;
    case 1:        
    	cibledList = listSelectedId;
        break;
    case 2:
        cibledList = uniqueId;
        break;
    default:
	} 

    if(ignoreListSelected || (cibledList.length == 0 && !wrongEmail)){
	    for (var i = 0; i < tabEleves.length; i++) {
	            if (tabEleves[i].dateInscription == sheetName && ((moreOf != 0 && tabEleves[i].tabNotes[pos].note >= moreOf) || tabEleves[i].tabNotes[pos].note > moreOf) && tabEleves[i].tabNotes[pos].semaine-1 in during) {
	                tabListeEleves.push(tabEleves[i].id);
	            }
	    }
    }	else	{
        for (var i = 0; i < cibledList.length; i++) {
            if (cibledList[i].dateInscription == sheetName && ((moreOf != 0 && cibledList[i].tabNotes[pos].note >= moreOf) || cibledList[i].tabNotes[pos].note > moreOf) && cibledList[i].tabNotes[pos].semaine - 1 in during) {
                tabListeEleves.push(cibledList[i].id);
	            }
	    }
    }
    return tabListeEleves;
}





function createCohorteElevesMadeWithMoreByWeek(moreOf, during, ignoreListSelected, cibleGroup) {
	/*Contrainte : 
	 * moreOf : note minimal requise
	 * during : semaines visualisé
	 * ignoreListSelected : is all
	 * cibleGroup : true : selected; false : cohorte
	 */
    tabCohorte = new Array(sheetNames.length+1);//On créé un tableau d'autant d'élément 
    for(var i = 0; i < tabCohorte.length; i++){
    	tabCohorte[i] = new Array(tabEleves[0].tabNotes.length+1);
    	if(i == 0){
    		for(var j = 1; j < tabEleves[0].tabNotes.length+1; j++){
    			tabCohorte[i][j] = tabEleves[0].tabNotes[j-1].nom;
    		}
    	}	else	{
        	if(i == 1){
        		tabCohorte[i][0] = "C "+ "0" + "\u2192" + (sheetNames[i-1]);
        	}	else	{
        		tabCohorte[i][0] = "C "+(sheetNames[i-2]) + "\u2192" + (sheetNames[i-1]);
        	}
    		for(var j = 1; j < tabEleves[0].tabNotes.length+1; j++){
    			tabCohorte[i][j] = new Array();
    		}
    	}
    }
    if(ignoreListSelected){
        cibledList = tabEleves;
    }	else	{
        switch(cibleGroup) {
        case 0:
            cibledList = listCohorteId;
            break;
        case 1:        
        	cibledList = listSelectedId;
            break;
        case 2:
            cibledList = uniqueId;
            break;
        default:
    	}
    }
    
    for(var i = 0; i < cibledList.length; i++){
        	for(var j = 0; j < cibledList[i].tabNotes.length; j++){
        		if(((moreOf != 0 && cibledList[i].tabNotes[j].note >= moreOf) || cibledList[i].tabNotes[j].note > moreOf) && during.indexOf(cibledList[i].tabNotes[j].semaine) != -1){
        			tabCohorte[cibledList[i].tabNotes[j].semaine][j+1].push(cibledList[i].id);
        		}
        	}
    }
    return tabCohorte;
}


function createCohorteElevesLastMadeWithMoreByWeek(moreOf, during, ignoreListSelected, cibleGroup) {
    tabCohorte = new Array(sheetNames.length+1);//On créé un tableau d'autant d'élément 
    for(var i = 0; i < tabCohorte.length; i++){
    	tabCohorte[i] = new Array(tabEleves[0].tabNotes.length+1);
    	if(i == 0){
    		for(var j = 1; j < tabEleves[0].tabNotes.length+1; j++){
    			tabCohorte[i][j] = tabEleves[0].tabNotes[j-1].nom;
    		}
    	}	else	{
        	if(i == 1){
        		tabCohorte[i][0] = "C "+ "0" + "\u2192" + (sheetNames[i-1]);
        	}	else	{
        		tabCohorte[i][0] = "C "+(sheetNames[i-2]) + "\u2192" + (sheetNames[i-1]);
        	}
    		for(var j = 1; j < tabEleves[0].tabNotes.length+1; j++){
    			tabCohorte[i][j] = new Array();
    		}
    	}
    }
    
    if(ignoreListSelected){
        cibledList = tabEleves;
    }	else	{
        switch(cibleGroup) {
        case 0:
            cibledList = listCohorteId;
            break;
        case 1:        
        	cibledList = listSelectedId;
            break;
        case 2:
            cibledList = uniqueId;
            break;
        default:
    	}
    }
    
    var magicOrder = new Array();//le résultat ne peut qu'être l'oeuvre d'une force supérieur 
    
    for (var i = 0; i < listTypeStart.length; i++) {
    	magicOrder.push(listTypeStart[i] + listTypeSize[i]-1);
    }
    
    
    var alreadySomewhere;
    for(var i = 0; i < cibledList.length; i++){
        	for(var j = cibledList[i].tabNotes.length-1; j >= 0; j--){
        		if(magicOrder.indexOf(j) != -1){
        			alreadySomewhere = false;
        		}
        		if(!alreadySomewhere && ((moreOf != 0 && cibledList[i].tabNotes[j].note >= moreOf) || cibledList[i].tabNotes[j].note > moreOf) && during.indexOf(cibledList[i].tabNotes[j].semaine) != -1){
        			tabCohorte[cibledList[i].tabNotes[j].semaine][j+1].push(cibledList[i].id);
        			alreadySomewhere = true;
        		}
        	}
    }
    return tabCohorte;
}