function displayPresentation(){
	document.getElementById("presentation").style.display = "inherit";
	document.getElementById("parameters").style.display = "none";
	document.getElementById("realOptions").style.display = "none";
	document.getElementById("noParameters").style.display = "none";
	document.getElementById("minimapContainer").style.display = "none";
	document.getElementById("svgPanel").style.display = "none";
	//document.getElementById("demoPanel").style.display = "none";
}

function endPresentation(){
	document.getElementById("presentation").style.display = "";
	document.getElementById("parameters").style.display = "";
	document.getElementById("realOptions").style.display = "";
	document.getElementById("noParameters").style.display = "";
	document.getElementById("minimapContainer").style.display = "";
	document.getElementById("svgPanel").style.display = "";
	//document.getElementById("demoPanel").style.display = "";
    document.getElementById("minimapContent").innerHTML = document.getElementById("content").outerHTML;
    minimapCadre();
}

function dataSelectionLink(index){
	listDataSelection.item(index+1).dispatchEvent(new CustomEvent('click'));
	if(index == 1){
		document.querySelector("#dataSelectionLink input").addEventListener('change', callJsonTraitement, false);
	}
	endPresentation();
}

function neverPresentation(){
	endPresentation();
	setPresentationCookie(); //!!!!!!!!!!!!!!!!!!!!!!!!!!!DÃ©sactivÃ© lors des tests;
}


function checkCookieCheckBox(){
	if(document.getElementById("nonPresentationPanel").checked != true){
		return;
	}
	setPresentationCookie();
}


function setPresentationCookie(){
	setCookie("visited", false, 14);
}

function isSetPresentationCookie(){
	return getCookie("visited") != "";
}

function getPresentationCookie(){
	return getCookie("visited");
}

function removePresentationCookie(){
	setCookie("visited", "", -1);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function fakeLaunchPresentation(){
	document.querySelectorAll("#dataSelection div")[0].dispatchEvent(new CustomEvent('click'));
	launchPresentation();
}

var presentationIndex;
function launchPresentation(){
	callDemoJSON(useJSON);
	setTimeout(function(){
		endPresentation();
		resetPresentationPage();
		document.getElementById("presentationPanel").style.display = "inherit";
		document.getElementById("minimapContainer").style.display = "none";
		document.querySelectorAll("#PresentationPanelMenu div")[0].style.visibility = "hidden"
	}, 2000);

}

function changePresentationPanel(domElement, presentationPanelText, fixed){
	document.getElementById("presentationPanel").firstElementChild.innerHTML = presentationPanelText;
	if(fixed){
		document.getElementById("presentationPanel").style.position = "fixed";
	}	else	{
		document.getElementById("presentationPanel").style.position = "absolute";
	}
	document.getElementById("presentationPanel").style.top = domElement.offsetTop+"px";//+domElement.offsetHeight/2-document.getElementById("presentationPanel").offsetHeight/2+"px";

	if(domElement.offsetParent==null){
		document.getElementById("presentationPanel").style.left = domElement.offsetLeft + domElement.offsetLeft+50+"px";
	}	else	{
		document.getElementById("presentationPanel").style.left = domElement.offsetLeft + domElement.offsetWidth + domElement.offsetParent.offsetLeft +50+"px";
	}
	if(fixed){
		document.getElementById("presentationArrow").style.position="fixed";
		document.getElementById("presentationArrow").style.top= parseInt(document.getElementById("presentationPanel").style.top.substring(0,document.getElementById("presentationPanel").style.top.length-2))
														+ document.getElementById("presentationPanel").offsetHeight/30-30 + "px";
		document.getElementById("presentationArrow").style.left=parseInt(document.getElementById("presentationPanel").style.left.substring(0,document.getElementById("presentationPanel").style.left.length-2))
														-57+"px";
	}	else	{
		document.getElementById("presentationArrow").style.position="absolute";
		document.getElementById("presentationArrow").style.top="calc(3.3% - 30px)";
		document.getElementById("presentationArrow").style.left="-57px";
	}
}

var text0 = "<p>Ce panneau permet de revoir cette démonstration ou de sélectionner des données à afficher.</p><p>Les données de démonstrations sont des données fictives. </p><p>Utilisez les pour mieux prendre en main l'outil et comprendre son fonctionnement.</p><p>Vous pouvez importer vos propres données dans l'application afin de les visualiser</p><p>Vous pouvez visualiser les dernières données du cours</p>";
var text1 = "<p>Un groupe de progression des élèves est représenté par une bulle.</p><p>En ligne les différents travaux soumis aux élèves.</p><p>En colonne les collectes.</p>";
var text2 = "<p>Différents modes de visualisation sont possibles.</p>	<p>En mode 'Progressions Cumulées', pour une colonne de collecte, une bulle représente l'ensemble des élèves qui ont fait l'exercice correspondant. Conséquence : un élève apparait dans autant de bulles que d'exercices faits</p><p>En mode 'Progressions Réparties', pour une colonne de collecte et un type d'exercice, une bulle représente l'ensemble des élèves qui se sont arrêtés à cet exercice et n'ont pas poursuivi. Conséquence : un élève apparait une seule fois par type d'exercices</p>";
var text3 = "<p>Le 'Seuil des notes' permet de définir la note minimale requise pour apparaître dans un groupe de progression des élèves.</p><p>Le bouton 'Sauvegarder en image' permet d'extraire la vue actuelle sous forme d'image.</p>";
var text4 = "";

function changePresentationPage(){
	switch(presentationIndex) {
	/*
	    case 0:
	    	setCover(document.getElementById("dataSelection"), true);
	    	changePresentationPanel(document.getElementById("dataSelection"), text0, true);
	        break;*/
	    case 0:
	    	setCover(document.getElementById("svgPanel"), false);
	    	changePresentationPanel(document.getElementById("svgPanel"), text1, false);
	    	break;
	    case 1:
	    	setCover(document.getElementById("newViewSelection"), true);
	    	changePresentationPanel(document.getElementById("newViewSelection"), text2, true);
	    	break;
	    case 2:
	    	setCover(document.getElementById("options"), true);
	    	changePresentationPanel(document.getElementById("options"), text3, true);
	    	break;
	    default:
	}
}

var lastPresentationPageIndex = 2;
function nextPresentationPage(){
	presentationIndex++;
	if(lastPresentationPageIndex < presentationIndex){
		presentationIndex = lastPresentationPageIndex;
	}
	if(presentationIndex == lastPresentationPageIndex){
		document.querySelectorAll("#PresentationPanelMenu div")[1].style.visibility = "hidden"
	}	else	{
		document.querySelectorAll("#PresentationPanelMenu div")[1].style.visibility = ""
		document.querySelectorAll("#PresentationPanelMenu div")[0].style.visibility = ""
	}
	changePresentationPage();
}

function previousPresentationPage(){
	presentationIndex--;
	if(0 > presentationIndex){
		presentationIndex = 0;
	}
	if(presentationIndex == 0){
		document.querySelectorAll("#PresentationPanelMenu div")[0].style.visibility = "hidden"
	}	else	{
		document.querySelectorAll("#PresentationPanelMenu div")[0].style.visibility = ""
		document.querySelectorAll("#PresentationPanelMenu div")[1].style.visibility = ""
	}
	changePresentationPage();
}


function resetPresentationPage(){
	presentationIndex = 0;
	document.querySelectorAll("#PresentationPanelMenu div")[0].style.visibility = "hidden"
	document.querySelectorAll("#PresentationPanelMenu div")[1].style.visibility = ""
	changePresentationPage();
}

function stopPresentation(){
	if (localStorage.selectedMenu == undefined) {
	    localStorage.setItem("selectedMenu",1);
	}
	document.querySelectorAll("#dataSelection div")[localStorage.selectedMenu].dispatchEvent(new CustomEvent('click'));
	resetCover();
	document.getElementById("presentationPanel").style.display = "";
}

function setCover(domElement, fixed){
	setCoverTop(domElement, fixed);
	setCoverBottom(domElement, fixed);
	setCoverLeft(domElement, fixed);
	setCoverRight(domElement, fixed);
	setCoverMain(domElement, fixed);
}

function resetCover(){
	document.getElementById("presentationCoverTop").style.display = "none";
	document.getElementById("presentationCoverBottom").style.display = "none";
	document.getElementById("presentationCoverLeft").style.display = "none";
	document.getElementById("presentationCoverRight").style.display = "none";
	document.getElementById("presentationCover").style.display = "none";
	document.getElementById("minimapContainer").style.display = "";
	
}

function setCoverMain(domElement, fixed){
	document.getElementById("presentationCover").style.display = "";
	document.getElementById("presentationCover").style.top = domElement.offsetTop+"px";
	document.getElementById("presentationCover").style.left = domElement.offsetLeft+"px";
	document.getElementById("presentationCover").style.height = domElement.offsetHeight+"px";
	document.getElementById("presentationCover").style.width = domElement.offsetWidth+"px";
	if(fixed){
		document.getElementById("presentationCover").style.position = "fixed";
	}	else	{
		document.getElementById("presentationCover").style.position = "absolute";
	}
}

function setCoverTop(domElement, fixed){
	document.getElementById("presentationCoverTop").style.display = "";
	document.getElementById("presentationCoverTop").style.top = 0;
	document.getElementById("presentationCoverTop").style.left = 0;
	document.getElementById("presentationCoverTop").style.height = domElement.offsetTop+"px";
	document.getElementById("presentationCoverTop").style.width = "100%";
	if(fixed){
		document.getElementById("presentationCoverTop").style.position = "fixed";
	}	else	{
		document.getElementById("presentationCoverTop").style.position = "absolute";
	}
}

function setCoverBottom(domElement, fixed){
	document.getElementById("presentationCoverBottom").style.display = "";
	document.getElementById("presentationCoverBottom").style.top = domElement.offsetTop+domElement.offsetHeight+"px";
	document.getElementById("presentationCoverBottom").style.left = 0;
	document.getElementById("presentationCoverBottom").style.height = "calc(100% - "+document.getElementById('presentationCoverTop').style.top+")";
	document.getElementById("presentationCoverBottom").style.width = "100%";
	if(fixed){
		document.getElementById("presentationCoverBottom").style.position = "fixed";
	}	else	{
		document.getElementById("presentationCoverBottom").style.position = "absolute";
	}
}

function setCoverLeft(domElement, fixed){
	document.getElementById("presentationCoverLeft").style.display = "";
	document.getElementById("presentationCoverLeft").style.top = domElement.offsetTop+"px";
	document.getElementById("presentationCoverLeft").style.left = 0;
	document.getElementById("presentationCoverLeft").style.height = domElement.offsetHeight+"px";
	if(domElement.offsetParent==null){
		document.getElementById("presentationCoverLeft").style.width = domElement.offsetLeft+"px";
	}	else	{
		document.getElementById("presentationCoverLeft").style.width = domElement.offsetLeft+domElement.offsetParent.offsetLeft+"px";
	}
	if(fixed){
		document.getElementById("presentationCoverLeft").style.position = "fixed";
	}	else	{
		document.getElementById("presentationCoverLeft").style.position = "absolute";
	}
}

function setCoverRight(domElement, fixed){
	document.getElementById("presentationCoverRight").style.display = "";
	document.getElementById("presentationCoverRight").style.top = domElement.offsetTop+"px";
	if(domElement.offsetParent==null){
		document.getElementById("presentationCoverRight").style.left = domElement.offsetLeft + domElement.offsetWidth +"px";
	}	else	{
		document.getElementById("presentationCoverRight").style.left = domElement.offsetLeft + domElement.offsetWidth+domElement.offsetParent.offsetLeft +"px";
	}
	document.getElementById("presentationCoverRight").style.height = domElement.offsetHeight+"px";
	document.getElementById("presentationCoverRight").style.width = "calc(100% - "+document.getElementById('presentationCoverRight').style.left+")";
	if(fixed){
		document.getElementById("presentationCoverRight").style.position = "fixed";
	}	else	{
		document.getElementById("presentationCoverRight").style.position = "absolute";
	}
}




