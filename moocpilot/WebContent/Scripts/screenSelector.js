const imgName = new Array();
imgName.push("Nombre d'élèves par collecte");
imgName.push("Progressions Cumulées");
imgName.push("Progressions Réparties");
imgName.push("Évaluation et Suivi Individuel");
imgName.push("Nombre d'élèves par exercice selon leur période d'inscription");
imgName.push("Résultats des élèves par exercices");
imgName.push("Qualité des résultats");
imgName.push("Progression Générale");
imgName.push("Analyse du forum");
imgName.push("Formulaire en ligne");

const imgTip = new Array();


imgTip.push("Ce diagramme représente les inscrits de chaque période</br>" +
        "Les colonnes représentent les périodes d'inscriptions.</br>" +
        "Une colonne contient le nombre d'inscrits sur une période. </br> " +
        "Une colonne est composée de deux parties : </br>" +
        "-Le nombre de participants </br>" +
        "-Le nombre de non-participants");

imgTip.push("Ce diagramme représente le nombre d'élèves ayant fait les exercices selon la période où ils les ont effectués.</br>" +
        "Les colonnes représentent les périodes de collectes.</br>" +
        "Les lignes représentent les exercices." +
        "Une bulle contient l'ensemble des élèves ayant fait cet exercice dans la période.</br>" );
       
imgTip.push("Ce diagramme représente dans chaque bulle le dernier exercice effectué par chaque élève selon la période où il l'a effectué.</br>" +
        "Les colonnes représentent les périodes de collectes,</br>" +
        "les lignes les exercices. " +
        "Une bulle contient l'ensemble des élèves qui se sont arrêtés à cet exercice dans la période.</br>" +
        "Chaque élève est présent dans une seule bulle par type d'exercice.</br>" );


imgTip.push("Cette visualisation permet de voir le parcours d'un élève dans le cours.</br>" +
        "Des émoticônes représentent les notes de l'élève pour l'exercice durant la semaine associée.</br>" +
        "Ces émoticônes représentent les quartiles entre 0 et 1.");

imgTip.push("Ce diagramme statistique représente le nombre d'élèves ayant fait les exercices selon leur période d'inscription.</br>" +
        "Les colonnes représentent les exercices.</br>" +
        "Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>" +
        "Elle est composée de plusieurs parties représentant la répartition des élèves selon leur période d'inscription.");

imgTip.push("Ce diagramme statistique représente la qualité des résultats d'un exercice.</br>" +
        "Les colonnes représentent les quartiles entre 0 et 1.</br>" +
        "Une colonne contient le nombre d'élèves ayant fait l'exercice indiqué avec une note comprise dans le quartile.");

imgTip.push("Ce diagramme représente la qualité des résultats des exercices.</br>" +
        "Les colonnes représentent les exercices.</br>" +
        "Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>" +
        "Elle est composée de plusieurs parties représentant la répartition des élèves selon leur résultat.");

imgTip.push("Ce diagramme représente le nombre d'élèves ayant fait les exercices selon la période où ils les ont effectués.</br>" +
        "Les colonnes représentent les exercices.</br>" +
        "Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>" +
        "Elle est composée de plusieurs parties représentant la répartition des élèves selon la période où ils les ont effectués.");

imgTip.push("Ce diagramme représente l'ensemble des échanges effectués sur le forum.</br>" +
        "Le rouge représente l'émetteur du post.</br>" +
        "Le vert représente une personne ayant répondu au message.</br>");
imgTip.push("Évolution future possible :</br> Génération d'un bilan du cours contenant les diagrammes et les données numériques de ce cours.");
/*
imgTip.push("Ce diagramme représente les inscrits de chaque période</br>" +
		"Les colonnes réprésentent les périodes d'inscriptions.</br>" + 
		"Une colonne contient le nombre d'inscrits sur une période. </br> " +
		"Une colonne est composée de deux parties : </br>" +
		"-Le nombre de participants </br>" +
		"-Le nombre de non-participants");

imgTip.push("Ce diagramme réprésente le nombre d'élèves ayant fait les exercices selon la période où ils les ont effectués.</br>" +
		"Les colonnes réprésentent les exercices.</br>" +
		"Les lignes réprésentent les périodes de collectes" +
		"Une bulle contient l'ensemble des élèves ayant fait cet exercice dans la période.</br>" );
		
imgTip.push("Ce diagramme réprésente dans chaque bulle le dernier exercice effectué par chaque élève selon la période où il l'a effectué.</br>" +
		"Les colonnes réprésentent les exercices.</br>" +
		"Les lignes les périodes de collectes" +
		"Une bulle contient l'ensemble des élèves qui se sont arrétés à cet exercice dans la période.</br>" +
		"Chaque élève est présent dans une seule bulle par type d'exercice.</br>" );


imgTip.push("Cette visualisation permet de voir le parcours d'un élève dans le cours.</br>" +
		"Des émoticônes représente le note de l'élèves pour l'exercice durant la semaine associé</br>" +
		"Ces émoticônes représente les quartiles entre 0 et 1.");

imgTip.push("Ce diagramme statistique réprésente le nombre d'élèves ayant fait les exercices selon leur période d'inscription.</br>" +
		"Les colonnes réprésentent les exercices.</br>" +
		"Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>" +
		"Elle est composée de plusieurs parties qui sont la répartition des élèves selon leur période d'inscription.");

imgTip.push("Ce diagramme statistique réprésente la qualité des résultats d'un exercice.</br>" +
		"Les colonnes représentent les quartiles entre 0 et 1.</br>" +
		"Une colonne contient le nombre d'élèves ayant fait l'exercice indiqué avec une note comprise dans le quartile.");

imgTip.push("Ce diagramme réprésente la qualité des résultats des exercices.</br>" +
		"Les colonnes réprésentent les exercices.</br>" +
		"Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>" +
		"Elle est composée de plusieurs parties qui sont la répartition des élèves selon leur résultat.");

imgTip.push("Ce diagramme réprésente le nombre d'élèves ayant fait les exercices selon la période où ils les ont effectués.</br>" +
		"Les colonnes réprésentent les exercices.</br>" +
		"Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>" +
		"Elle est composée de plusieurs parties qui sont la répartition des élèves selon la période où ils les ont effectués.");

imgTip.push("À venir:</br> -Traitement du forum.");
imgTip.push("Evolution future possible :</br> Génération d'un bilan du cours contenant les diagrammes et les données numériques de ce cours.");*/

const selectColumn = 3;
const selectLine = 4;

const padding = 10;
const margeBetweenScreen = 5;

const screenImgWidth = 1300;
const screenImgHeight = 760;

const screenRatio = screenImgWidth/screenImgHeight;

var screens = document.querySelectorAll("#screenSelectorArea img");

var isDiag = document.location.href.indexOf("diagramme") != -1;
var isForum = document.location.href.indexOf("forum") != -1;

var actualScreenNumber = 0;

document.getElementById("moreOf").value = localStorage.moreOf;
document.getElementById("cohorteSelect").value = localStorage.cohorteSelect;


function selectScreen(screenNumber){
	localStorage.moreOf = document.getElementById("moreOf").value;
	localStorage.cohorteSelect = document.getElementById("cohorteSelect").value;
	localStorage.screenNumber = screenNumber;
	actualScreenNumber = parseInt(screenNumber);
	switch(parseInt(screenNumber)) {
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
    	window.open('Ressources/Modele_Bilan_MOOC-Plateforme_FUN.pdf');
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
	
	document.querySelector("#infoDiag span").innerHTML = imgTip[screenNumber];
	
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
	if(actualScreenNumber >= 8){
		selectScreen(0);
	}	else	{
		selectScreen(actualScreenNumber+1);
	}
}

function previousScreen(){
	changeScreen = true;
	animChangeScreen();
	if(actualScreenNumber == 0){
		selectScreen(8);
	}	else	{
		selectScreen(actualScreenNumber-1);
	}
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
	selectScreen(localStorage.screenNumber);
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

function setNames(){
	var pictsA = document.querySelectorAll("#screenSelectorArea a");
	var pictsSpan = document.querySelectorAll("#screenSelectorArea span");
	for(var i = 0; i < pictsA.length;i++){
		pictsA[i].innerText = imgName[i];
		pictsSpan[i].innerHTML = imgTip[i];
	}
}

function setSmall(){
	var pictWidth = 14;
	var pictHeight = 7;

	var box = document.getElementById("screenSelectorArea");

		document.getElementById("screenSelectorCover").style.pointerEvents = "";
	box.style.top = "80px";
	box.style.left = "75px";
	box.style.width = "68.4px";
	box.style.height = "40px";
	box.style.padding = "5px 0px 5px 15px";
	box.style.zIndex = 14;
	document.getElementById("screenSelectorCover").style.margin = "-5px 0px 0px -10px";
	
	var picts = document.querySelectorAll("#screenSelectorArea img");
	
	for(var i = 0; i < picts.length;i++){
		picts[i].parentElement.style.transition = "";
		picts[i].parentElement.firstElementChild.firstElementChild.style.transition = "";

		picts[i].parentElement.style.height = pictHeight + "px";
		picts[i].parentElement.style.width = pictWidth + "px";
		
		if(i < selectColumn * (selectLine-1)){
			picts[i].parentElement.style.marginBottom = "5px";
		}
		if(0 !=  (i+1) % selectColumn){
			picts[i].parentElement.style.marginRight = "5px";
		}
		
		
		picts[i].style.height = "100%";
		picts[i].parentElement.firstElementChild.style.height = "0px";
		picts[i].parentElement.firstElementChild.firstElementChild.style.fontSize = "0vh";
	}
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
	
	if(screenSelectorMode){
		var pictWidth = 14;
		var pictHeight = 7;
		
	}	else	{	
		setButtonsActive(0);
		var pictMaxWidth = (x - 270 - 2 * padding - (selectColumn-1) * margeBetweenScreen ) / selectColumn;
		var pictMaxHeight = (y - 100 - 2 * padding - (selectLine-1) * margeBetweenScreen ) / selectLine;

		if(pictMaxWidth/screenRatio < pictMaxHeight){
			var pictWidth = pictMaxWidth;
			var pictHeight = pictMaxWidth/screenRatio;	
		}	else	{
			var pictWidth = pictMaxHeight*screenRatio;
			var pictHeight = pictMaxHeight;	
		}
		
	}
	var box = document.getElementById("screenSelectorArea");

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
		box.style.height = (pictHeight * selectLine + (selectLine-1) * margeBetweenScreen)+"px";
		box.style.padding = "10px";
		box.style.zIndex = 0;
		document.getElementById("screenSelectorCover").style.margin = "-10px 0px 0px -10px";
	}
	
	var picts = document.querySelectorAll("#screenSelectorArea img");
	
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
	if(firstRun){
		firstRun = false;
	}
}

function resetTransition(){
	var picts = document.querySelectorAll("#screenSelectorArea img");
	for(var i = 0; i < picts.length;i++){
		picts[i].parentElement.style.transition ="";
	}
}


function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
}

function setButtonsActive(index){
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

displayToolTip();
function displayToolTip(){
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
}




