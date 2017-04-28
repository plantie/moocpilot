 /*
			//layer.length == nombre de couche [1,+inf[ 
			//layer[0] première couche l'ensemble des packet pour chaque colonne
			//layer[0].length == nombre de colonne
			//layer[0][0] == un objet de la forme x numéro de colonne, y position final en hauteur et y0 position initial
			*/




//En abscisse les différents travaux
//En ordonnée la quantité d'étudiants ayant fait l'exercice
//Les étudiant sont regroupé par semaine d'inscription
//on a autant de couche que de semaine dans le cours

function stringifyLayer(i) {
    switch (i) {
        case 0:
            return JSON.stringify(numberOfStudentByExerciseSeparateByWeek());
            break;
        case 1:
            return JSON.stringify(numberOfSignedStudentByWeek());
            break;
        case 2:
            return JSON.stringify(numberOfStudentByResult(0));
            break;
        case 3:
            return JSON.stringify(pourcentOfSuccessByExerciseSeparateByResult());
            break;
        default:
            return "";

    }
}

function LayerNull(x) {
    this.y = 0;//la position final en hauteur
    this.y0 = 0;//la position initial en hauteur
    this.x = x;//la colonne
}


function orderByWeek(layers){
	var ordonnedLayers = JSON.parse(JSON.stringify(layers));
	for(var i = 0; i < ordonnedLayers.length; i++){
		for(var j = 0; j < ordonnedLayers[i].length;j++){
			ordonnedLayers[i][j] = layers[i][parseInt(ordennedByWeek[j])];
			ordonnedLayers[i][j].x = j;
		}
	}
	orderByWeekStudent();
	return ordonnedLayers;
}

function orderByWeekStudent(){
	var ordonnedCibledStudent = JSON.parse(JSON.stringify(cibledStudent));
	for(var i = 0; i < ordonnedCibledStudent.length; i++){
		ordonnedCibledStudent[i] = cibledStudent[parseInt(ordennedByWeek[i])];
	}
	cibledStudent = ordonnedCibledStudent;
}

function orderNameByWeek(domain){
	var ordonnedDomain = JSON.parse(JSON.stringify(domain));
	for(var i = 0; i < ordonnedDomain.length; i++){
		ordonnedDomain[i] = domain[ordennedByWeek[i]]
	}
	return ordonnedDomain;
}

function layerPourcent(layers){
	if(layers.length == 1){
		var max = 0;
	    for (var i = 0; i < layers[0].length; i++) {
	    	max += layers[0][i].y;
	    }
	    for (var i = 0; i < layers[0].length; i++) {
	    	if(max == 0){
		    	layers[0][i].y = 0;
	    	}	else	{
		    	layers[0][i].y = Math.round(layers[0][i].y/max*10000)/100;
	    	}
	    }	    
	}	else	{
	    for (var i = 0; i < layers[0].length; i++) {
			var max = 0;
		    for (var j = 0; j < layers.length; j++) {
		    	max += layers[j][i].y;
		    }
		    for (var j = 0; j < layers.length; j++) {
		    	if(max == 0){
		    		layers[j][i].y = 0;
		    	}	else	{
			    	layers[j][i].y = Math.round(layers[j][i].y/max*10000)/100;
		    	}
		    	if(j != 0){		    		
			    	layers[j][i].y0 = layers[j-1][i].y + layers[j-1][i].y0;
		    	}
		    }
	    }
	}
	return layers;
}

var cibledStudent = new Array();
var cibleStudentName = "";

var listLayersStudent;

function numberOfStudentByExerciseSeparateByWeek(cohorte){
    var layers = new Array();
    listLayersStudent = new Array();
    for (var i = 0; i < sheetNames.length; i++) {//on créé les différente couche du graphique
        layers[i] = new Array(tabEleves[0].tabNotes.length);
        listLayersStudent[i] = new Array(tabEleves[0].tabNotes.length);
        for (var j = 0; j < tabEleves[0].tabNotes.length; j++) {
            layers[i][j] = new LayerNull(j);
            listLayersStudent[i][j] = new Array();
        }
    }

	tabEleves.forEach(function(eleve){//Pour chaque élève
	    if(eleve.dateInscription != -1 && eleve.cohorte.indexOf(cohorte) != -1){//Participant au cours
	        eleve.tabNotes.forEach(function(note, indexNote){//Pour chaque note
	            if(note.semaine != -1 && ((moreOf != 0 && note.note >= moreOf) || note.note > moreOf)){//Ayant fait l'exercice
	                layers[eleve.dateInscription-1][indexNote].y++;
	                listLayersStudent[eleve.dateInscription-1][indexNote].push(eleve);
	                if(eleve.id == cibleStudentName){
	                	cibledStudent.push(getStudentInfo(eleve.dateInscription-1, note.note));
	                }
	            }	else	{
	                if(eleve.id == cibleStudentName){
	                	cibledStudent.push(getStudentInfo(eleve.dateInscription-1, -1));
	                }
	            }
	        });
	    }
	});

	for (var i = 0; i < layers.length; i++) {
	    for(var j = 0; j < layers[i].length; j++){
	        if (i > 0) {
	            layers[i][j].y0 = layers[i - 1][j].y + layers[i - 1][j].y0;
	        }
	    }
	}
	return layers;
}




//En abscisse les semaines
//En ordonnée le nombre d'inscrit
function numberOfSignedStudentByWeek(cohorte){
    var layers = new Array();
    listLayersStudent = new Array();

    layers[0] = new Array(sheetNames.length);
    listLayersStudent[0] = new Array(sheetNames.length);
    for (var i = 0; i < sheetNames.length; i++) {
        layers[0][i] = new LayerNull(i);
        listLayersStudent[0][i] = new Array();
    }
    tabEleves.forEach(function (eleve) {//Pour chaque élève
        if (eleve.dateInscription != -1 && eleve.cohorte.indexOf(cohorte) != -1) {//Participant au cours
            layers[0][eleve.dateInscription - 1].y++;
            listLayersStudent[0][eleve.dateInscription - 1].push(eleve);

            if(eleve.id == cibleStudentName){
                cibledStudent = fillStudentInfo(eleve.dateInscription - 1, eleve.tabNotes[0].note, sheetNames.length);
            	//cibledStudent.push(getStudentInfo(eleve.dateInscription-1, eleve.tabNotes[0].note));
            }
        }
    });
    return layers;
}

function numberOfSignedStudentByWeekAdvanced(cohorte){
    var layers = new Array();
    listLayersStudent = new Array();

    layers[0] = new Array(sheetNames.length);
    layers[1] = new Array(sheetNames.length);
    listLayersStudent[0] = new Array(sheetNames.length);
    listLayersStudent[1] = new Array(sheetNames.length);
    for (var i = 0; i < sheetNames.length; i++) {
        layers[0][i] = new LayerNull(i);
        layers[1][i] = new LayerNull(i);
        listLayersStudent[0][i] = new Array();
        listLayersStudent[1][i] = new Array();
    }
    tabEleves.forEach(function (eleve) {//Pour chaque élève
        if (eleve.dateInscription != -1 && eleve.cohorte.indexOf(cohorte) != -1) {//Participant au cours
        	if(eleve.tabNotes.filter(function(note){
				  return note.semaine != -1;
			  }).length == 0){
                layers[1][eleve.dateInscription - 1].y++;
                listLayersStudent[1][eleve.dateInscription - 1].push(eleve);
        	}	else	{
                layers[0][eleve.dateInscription - 1].y++;
                listLayersStudent[0][eleve.dateInscription - 1].push(eleve);
        	}

            //layers[0][eleve.dateInscription - 1].y++;
            //listLayersStudent[0][eleve.dateInscription - 1].push(eleve);

            if(eleve.id == cibleStudentName){
                cibledStudent = fillStudentInfo(eleve.dateInscription - 1, eleve.tabNotes[0].note, sheetNames.length);
            }
        }
    });
	for (var i = 0; i < layers.length; i++) {
	    for(var j = 0; j < layers[i].length; j++){
	        if (i > 0) {
	            layers[i][j].y0 = layers[i - 1][j].y + layers[i - 1][j].y0;
	        }
	    }
	}
    return layers;
}




//En abscisse le nombre d'inscrit
//En ordonnée le nombre d'inscrit
function numberOfStudentByResult(noteNumber, cohorte){
    var layers = new Array();
    listLayersStudent = new Array();

    layers[0] = new Array(4);
    listLayersStudent[0] = new Array(4);
    for (var i = 0; i < 4; i++) {
        layers[0][i] = new LayerNull(i);
        listLayersStudent[0][i] = new Array();
    }
    tabEleves.forEach(function (eleve) {//Pour chaque élève
        if (eleve.dateInscription != -1 && eleve.cohorte.indexOf(cohorte) != -1) {//Participant au cours
            if (eleve.tabNotes[noteNumber].semaine != -1) {
                if (eleve.tabNotes[noteNumber].note <= 0.25) {
                    layers[0][0].y++;
                    listLayersStudent[0][0].push(eleve);
                    if(eleve.id == cibleStudentName){
                        cibledStudent = fillStudentInfo(0, eleve.tabNotes[0].note, 4);
                    }
                } else if (eleve.tabNotes[noteNumber].note <= 0.5) {
                    layers[0][1].y++;
                    listLayersStudent[0][1].push(eleve);
                    if(eleve.id == cibleStudentName){
                        cibledStudent = fillStudentInfo(2, eleve.tabNotes[0].note, 4);
                    }
                } else if (eleve.tabNotes[noteNumber].note <= 0.75) {
                    layers[0][2].y++;
                    listLayersStudent[0][2].push(eleve);
                    if(eleve.id == cibleStudentName){
                        cibledStudent = fillStudentInfo(2, eleve.tabNotes[0].note, 4);
                    }
                } else {
                    layers[0][3].y++;
                    listLayersStudent[0][3].push(eleve);
                    if(eleve.id == cibleStudentName){
                        cibledStudent = fillStudentInfo(3, eleve.tabNotes[0].note, 4);
                    }
                }
            }
        }
    });
    return layers;
}

//En abscisse les différents travaux
//En ordonnée le poucentage de réussite
//Les étudiant sont regroupé par note
//Ex: hw 0 25% on eu <0.25; 45% on eu <0.5.....
function pourcentOfSuccessByExerciseSeparateByResult(cohorte){
    var layers = new Array();
    listLayersStudent = new Array();

    for (var i = 0; i < 4; i++) {//on créé les différente couche du graphique
        layers[i] = new Array(tabEleves[0].tabNotes.length);
        listLayersStudent[i] = new Array(tabEleves[0].tabNotes.length);
        for (var j = 0; j < tabEleves[0].tabNotes.length; j++) {
            layers[i][j] = new LayerNull(j);
            listLayersStudent[i][j] = new Array();
        }
    }


    tabEleves.forEach(function (eleve) {//Pour chaque élève
        if (eleve.dateInscription != -1 && eleve.cohorte.indexOf(cohorte) != -1) {//Participant au cours
            eleve.tabNotes.forEach(function (note, indexNote) {//Pour chaque note
                if (note.semaine != -1) {
                    if (note.note <= 0.25) {
                        layers[0][indexNote].y++;
                        listLayersStudent[0][indexNote].push(eleve);
                        if(eleve.id == cibleStudentName){
                        	cibledStudent.push(getStudentInfo(0, note.note));
                        }
                    } else if (note.note <= 0.5) {
                        layers[1][indexNote].y++;
                        listLayersStudent[1][indexNote].push(eleve);
                        if(eleve.id == cibleStudentName){
                        	cibledStudent.push(getStudentInfo(1, note.note));
                        }
                    } else if (note.note <= 0.75) {
                        layers[2][indexNote].y++;
                        listLayersStudent[2][indexNote].push(eleve);
                        if(eleve.id == cibleStudentName){
                        	cibledStudent.push(getStudentInfo(2, note.note));
                        }
                    } else {
                        layers[3][indexNote].y++;
                        listLayersStudent[3][indexNote].push(eleve);
                        if(eleve.id == cibleStudentName){
                        	cibledStudent.push(getStudentInfo(3, note.note));
                        }
                    }
                }	else	{
                    if(eleve.id == cibleStudentName){
                    	cibledStudent.push(getStudentInfo(0, -1));
                    }
                }
            });
        }
    });

    for (var i = 0; i < layers.length; i++) {
        for (var j = 0; j < layers[i].length; j++) {
            if (i > 0) {
                layers[i][j].y0 = layers[i - 1][j].y + layers[i - 1][j].y0;
            }
        }
    }

    return layers;
}


function numberOfStudentByExerciseSeparateByWeekNoInscription(cohorte){
    var layers = new Array();
    listLayersStudent = new Array();

    for (var i = 0; i < sheetNames.length; i++) {//on créé les différente couche du graphique
        layers[i] = new Array(tabEleves[0].tabNotes.length);
        listLayersStudent[i] = new Array(tabEleves[0].tabNotes.length);
        for (var j = 0; j < tabEleves[0].tabNotes.length; j++) {
            layers[i][j] = new LayerNull(j);
            listLayersStudent[i][j] = new Array();
        }
    }

	tabEleves.forEach(function(eleve){//Pour chaque élève
	    if(eleve.dateInscription != -1 && eleve.cohorte.indexOf(cohorte) != -1){//Participant au cours
	        eleve.tabNotes.forEach(function(note, indexNote){//Pour chaque note
	            if(note.semaine != -1 && ((moreOf != 0 && note.note >= moreOf) || note.note > moreOf)){//Ayant fait l'exercice
	            	layers[note.semaine - 1][indexNote].y++;
	            	listLayersStudent[note.semaine - 1][indexNote].push(eleve);
                    if(eleve.id == cibleStudentName){
                    	cibledStudent.push(getStudentInfo(note.semaine - 1, note.note));
                    }
	            }	else	{
                    if(eleve.id == cibleStudentName){
                    	cibledStudent.push(getStudentInfo(0, -1));
                    }
	            }
	        });
	    }
	});
	for (var i = 0; i < layers.length; i++) {
	    for(var j = 0; j < layers[i].length; j++){
	        if (i > 0) {
	            layers[i][j].y0 = layers[i - 1][j].y + layers[i - 1][j].y0;
	        }
	    }
	}
	return layers;
}


function getSheetNames(){
	var stringSheetNames = new Array();
    for (var i = 0; i < sheetNames.length; i++) {
    	if(i == 0){
        	stringSheetNames.push("C "+ "0" + "\u2192" + sheetNames[i]);
    	}	else	{
        	stringSheetNames.push("C "+sheetNames[i-1] + "\u2192" + sheetNames[i]);
    	}
    }
    return stringSheetNames;
}

function getCourseNames(){
	var stringCourseNames = new Array();
    for (var i = 0; i < tabEleves[0].tabNotes.length; i++) {
    	var name;
    	var noteName = tabEleves[0].tabNotes[i].nom;
    	if(noteName.indexOf(":") == -1){
    		name = noteName;
    	}	else	{
    		name = noteName.substring(0, noteName.indexOf(":"));
    	}
    	//stringCourseNames.push(tabEleves[0].tabNotes[i].nom)
    	stringCourseNames.push(name);
    }
	return stringCourseNames;
}

function getStudentInfo(y, value){
	var studentInfo = new Object();
	studentInfo.y = y;
	studentInfo.value = value;
	return studentInfo;
}

function fillStudentInfo(x, value, max){
	var filled = new Array();
	for(var i = 0; i<max; i++){
		if(i == x){
			filled.push(getStudentInfo(0, value));
		}	else	{
			filled.push(getStudentInfo(0, -1));
		}
	}
	return filled;
}
