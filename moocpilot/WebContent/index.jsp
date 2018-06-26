<!DOCTYPE html>
<html lang = "fr">
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
      <title id='Title'>MOOC Pilote: tableau de progression des élèves</title>
      <link href="Styles/style.css" rel="stylesheet" media="all" type="text/css">
      <link href="Styles/d3.css" rel="stylesheet" media="all" type="text/css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">
      <link href="Styles/screenSelector.css" rel="stylesheet" media="all" type="text/css">
   </head>
   <body>
      <div id="presentationCoverTop" class="presentationCover"></div>
      <div id="presentationCoverRight" class="presentationCover"></div>
      <div id="presentationCoverLeft" class="presentationCover"></div>
      <div id="presentationCoverBottom" class="presentationCover"></div>
      <div id="presentationCover"></div>
      <div id="presentationPanel">
         <a></a>
         <svg id="presentationArrow" fill="#000000" height="60" viewBox="0 0 24 24" width="60" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
         </svg>
         <div id="PresentationPanelMenu">
            <div onclick="previousPresentationPage()">
               <span>Précédent</span>
            </div>
            <div onclick="nextPresentationPage()">
               <span>Suivant</span>
            </div>
            <div onclick="stopPresentation()">
               <span>Quitter la démonstration</span>
            </div>
         </div>
      </div>
      <img id = "loaderGif" alt="Loading" src="Ressources/loading.gif">
      <div id = "titleView">
         <a></a>
	 <!--  EG: changed SVG to PNG -->
         <div class = "tooltips tooltipsbottomdiag" id = "infoDiag">
	    <img alt="Loading" src="Ressources/iButton.png">
	    <!-- <img alt="Loading" src="Ressources/iHelp.png"> -->
            <span></span>
         </div>
      </div>
      <div id = "content">
         <div id="presentation">
            <div id="presentationText">
               <p>Bienvenue sur l'application Mooc-Pilot.</p>
               <p>Mooc-Pilot est une application dédié à la visualisation de la progression d'élèves au cours d'un MOOC.</p>
               <p>L'application permet une visualisation en bulles de données représentant la progression d'étudiants au sein d'un MOOC avec pour but de représenter un grand nombre de données de manière à faire ressortir les problèmes dans l'évolution des apprenants.</p>
               <p>Vous pouvez assister à une démonstration, ou commencer à visualiser des données.</p>
            </div>
            <div id="presentationMenu">
               <div onclick="checkCookieCheckBox();launchPresentation()" class="link">
                  <span>Assister à la démonstration</span>
               </div>
               <div onclick="checkCookieCheckBox();dataSelectionLink(2)" class="link">
                  <span id = "presentationMenuCourseLink" >Ignorer la démonstration</span>
               </div>
               <div style = "margin:20px 0px;">
                  <span>Ne plus afficher ce panneau</span>
                  <input id = "nonPresentationPanel" type = "checkbox">
               </div>
            </div>
         </div>
         <div id = "header">
            <a class = "headPict" href = "https://www.imt.fr/"><img style = "margin-left: 60px;" src="Ressources/logo-imt-negatif.png"></a>
	    <!--
            <a class = "headPict" href = "https://www.imt.fr/"><img style = "margin-left: 60px;" src="Ressources/imt.jpg"></a>
            <a class = "headPict" href = "http://www.mines-ales.fr/"><img src="Ressources/mines_ales_logo.jpg"></a>
	    -->
            <div id ="appNameDiv">
               <p>MOOC-PILOT</p>
            </div>
            <div id = "headerMenu">
	       <!-- EG: added icon for lang -->
	       <div><img class="langSelect" style="width:18px;height:12px" src="Ressources/icon-fr.png"> <img class="langSelect" style="width:18px;height:12px" src="Ressources/icon-en.png"></div>
               <div style = "display:none">					
                  <a href = "." class="headerMenuUnselected"></a>
                  <a></a>
               </div>
               <div style = "display:none">					
                  <a href = "diagramme.jsp" class="headerMenuUnselected"></a>
                  <a></a>
               </div>
               <a style =  "display:none" onclick="launchPresentation()" id="DemoButton">Démonstration</a>
               <div id="contact">
                  <a>
                     contact
								<span id='ContactList'>
									<p>Notre équipe de recherche au laboratoire LGi2P de l'École des Mines d'Alès :</p>
									<p>Michel Crampes, professeur et chercheur,</p>
									<p>Michel Plantié, chercheur,</p>
									<p>Axel Garcia, développeur,</p>
									<p>Pierre Jean, ingénieur de recherche</p>	
							        <p>Email : social.networks@mines-ales.fr</p>
							        <p>Numero de téléphone : 04 66 38 70 35</p>
                     </span>
                  </a>
               </div>
               <div>					
                    <a id='aHeaderMenu' href="admin" class="headerMenu">administrateur (réservé)</a>
                  <a></a>
               </div>
            </div>
         </div>
         <div id="bullePopup">
            <a></a>
            <i class="fa fa-arrows"></i>
            <button id = "visualiseCohorteButton">Progression de ce groupe d'élèves. (Passage en données cumulées)</button>
            <div id = "visualiseCohorteToggleDiv">
               <span>Progression de ce groupe d'élèves</span>
               <input id = "visualiseCohorteToggle" type = "checkbox" checked="">
            </div>
            <div>
               <a class="visuLearner" style = "width:50%;font-size:13px;">Visualisation d'un élève</a>
               <select style = "background-color: red;width:120px;" onchange = "updateBulleStudentListCall()" id = "bulleStudentList">
                  <option class="allLearners" value = "">Tous les élèves</option>
               </select>
            </div>
            <button>Liste des élèves de ce groupe</button>
            <button id = "resetSelectedCohorte">Réinitialiser la sélection</button>
         </div>
         <div id = "svgPanel">
            <table id="tableau"></table>
            <div class = "notRequired student-name-prompt">
               <a id="LO9" style = "width:50%;">Nom d'un élève</a>
               <input id=studentSelect oninput = "changeStudent()" list="studentSelectData" title = "Double clique pour afficher la liste des élèves">
               <datalist id=studentSelectData></datalist>
               <svg style = "cursor: pointer;" onclick="resetStudent();" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                  <path style = "transform: translate(0px, 5px);" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
               </svg>
            </div>
            <p id = "studentInfo">
               <a id = "pieContainer" style = "margin-right:10px"></a>
               <svg class = "smileys" style = "margin-bottom:-10px; fill:blue;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
                  <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
                  <path style="fill:#EBE8DE" d="M18 10h-12c.331 1.465 2.827 4 6.001 4 3.134 0 5.666-2.521 5.999-4zm-9.5-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
               </svg>
               <svg class = "smileys" style = "margin-bottom:-10px; fill:blue;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
                  <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
                  <path style="fill:#EBE8DE" d="M17.507 9.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
               </svg>
               <svg class = "smileys" style = "margin-bottom:-10px; fill:#ff8005;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
                  <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
                  <path style="fill:#EBE8DE" d="M16 14h-8v-2h8v2zm-7.5-9c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
               </svg>
               <svg class = "smileys" style = "margin-bottom:-10px; fill:#ff8005;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
                  <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
                  <path style="fill:#EBE8DE" d="M12 10c-2.332 0-4.145 1.636-5.093 2.797l.471.58c1.286-.819 2.732-1.308 4.622-1.308s3.336.489 4.622 1.308l.471-.58c-.948-1.161-2.761-2.797-5.093-2.797zm-3.501-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
               </svg>
               <a id = "studentInfoText"></a>
            </p>
         </div>
      </div>
      <div id = "menu">
         <div id = "screenSelectorSpace"></div>
         <div id = "screenSelectorArrows">
            <img alt="Loading" src="Ressources/sticker-fleche.png">
            <img alt="Loading" src="Ressources/sticker-fleche.png">
         </div>
         <div style = "display:none"id = "dataSelection">
            <div onclick="launchPresentation()">
               <span>Voir la démonstration</span>
            </div>
            <div onclick="callDemoJSON(useJSON)">
               <span>Données de démonstration</span>
            </div>
            <div>
               <span>Essayez avec vos données</span>
               <input type="file" name="xlfile" id="xlf" accept=".xls" />
            </div>
            <div onclick="callSavedJSON(useJSON)">
               <span>Voir les dernières données</span>
            </div>
         </div>
         <div id = "parameters">
            <div class = "optionsList">
               <span id='ptut'>Paramètres du tuteur</span>
               <div>
                  <a>Seuil des notes</a>
                  <input oninput = "stopMoreOf()" id="moreOf" step = "0.1" value = "0.0" type = "number" min = "0" max = "1">
               </div>
               <div>
                  <a id = "AcohorteSelect" style = "width:50%;">Visualisation d'une cohorte</a>
                  <select onchange = "changeCohorte()" id = "cohorteSelect">
                     <option class="allLearners" value = "0">Tous les élèves</option>
                  </select>
               </div>
            </div>
            <div id = "newViewSelection" style = "display:none">
               <label title = "En cumulée un élève est dans autant de bulles que d'exercices qu'il a effectué." class = "radioParameterLabel">Progressions Cumulées<input onchange = "changeModeVisualisation()" class="shape" name="visualisationMode" value="0" type="radio"></label>
               <label title = "En répartie un élève est présent dans la bulle qui représente le dernier exercice qu'il a effectué par type d'exercices." class = "radioParameterLabel">Progressions Réparties<input onchange = "changeModeVisualisation()" class="shape" name="visualisationMode" value="1" type="radio"></label>
               <label title = "Bilan MOOC" class = "radioParameterLabel">Bilan MOOC<input onchange = "changeModeVisualisation()" class="shape" name="visualisationMode" value="10" type="radio"></label>
            </div>
            <div id = "options">
               <div class="optionsList">
                  <div style = "display:none">
                     <a style = "width:50%;">Recherche par id/pseudo/email</a>
                     <input oninput = "stopTimerEmailArea()" onkeypress = "onEnterTimer(event)" style = "background-color:#00f6 ; width: 56px; top: calc(50% - 13px);" id = "infoContains">
                  </div>
               </div>
            </div>
         </div>
	 <!-- blue -> IMT bleu clair #00b8de -->
         <div id = "studentLegend" class = "notRequired">
            <svg class = "smileysLegend" style = "fill:#00b8de;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
               <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
               <path style="fill:#EBE8DE" d="M18 10h-12c.331 1.465 2.827 4 6.001 4 3.134 0 5.666-2.521 5.999-4zm-9.5-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
            </svg>
            <a>0.75&rarr;1&nbsp;&nbsp;&nbsp;</a>
            <svg class = "smileysLegend" style = "fill:#00b8de;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
               <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
               <path style="fill:#EBE8DE" d="M17.507 9.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
            </svg>
            <a>0.5&nbsp;&rarr;0.75</a>
            <svg class = "smileysLegend" style = "fill:#ff8005;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
               <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
               <path style="fill:#EBE8DE" d="M16 14h-8v-2h8v2zm-7.5-9c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
            </svg>
            <a>0.25&rarr;0.5</a>
            <svg class = "smileysLegend" style = "fill:#ff8005;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
               <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
               <path style="fill:#EBE8DE" d="M12 10c-2.332 0-4.145 1.636-5.093 2.797l.471.58c1.286-.819 2.732-1.308 4.622-1.308s3.336.489 4.622 1.308l.471-.58c-.948-1.161-2.761-2.797-5.093-2.797zm-3.501-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
            </svg>
            <a>0&nbsp;&nbsp;&nbsp;&nbsp;&rarr;0.25</a>
            <svg width="32" height="32" style = "margin-left: 45px;margin-bottom:7px;margin-right:5px;">
               <g transform="translate(16,16)">
                  <g class="arc">
                     <path d="M9.552245033349357e-16,-15.600000000000001A15.600000000000001,15.600000000000001 0 0,1 13.509996299037246,7.799999999999998L0,0Z" style="stroke: black; fill: rgb(255, 128, 5);"></path>
                  </g>
                  <g class="arc">
                     <path d="M13.509996299037246,7.799999999999998A15.600000000000001,15.600000000000001 0 0,1 -13.509996299037242,7.800000000000006L0,0Z" style="stroke: black; fill: rgb(255, 255, 255);"></path>
                  </g>
                  <g class="arc">
                     <path d="M-13.509996299037242,7.800000000000006A15.600000000000001,15.600000000000001 0 0,1 -2.8656735100048066e-15,-15.600000000000001L0,0Z" style="stroke: black; fill: #00b8de;"></path><!-- bleu foncé IMT -->
                  </g>
               </g>
            </svg>
            <div style = "line-height:5px;width: 100px;display: inline-block;font-size: 14px;font-weight:bold">
               <p id="noteSup" style = "color:#00b8de">note >= 0.5</p>
               <p id="noteInf" style = "color:rgb(255, 128, 5)">note < 0.5</p>
               <p id="noteNA" style = "color:white">sans note</p>
            </div>
         </div>
         <div id = "otherOption" class = "optionsList notRequired">
            <button onclick="displayOptions();" id = "optionViewer">Autres options</button>
            <div id = "realOptions" class="notRequired">
               <div id = "viewModeOption" style = "">
                  <label id="LO1" class = "radioParameterLabel">Progression Courante</label><input onchange = "changeModeVisualisation()" class="shape" name="visualisationModeOption" value="2" type="radio" checked="true">
                  <label id="LO2" class = "radioParameterLabel doubleLineLabel">Progression selon la semaine d'inscription</label><input onchange = "changeModeVisualisation()" class="shape" name="visualisationModeOption" value="0" type="radio">
               </div>
               <hr style="width: 60%; margin-bottom: 15px;">
               <div id = "navigation" style = "display:none">
                  <svg onclick="previousWeek()" fill="#000000" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
                     <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"></path>
                     <path d="M0 0h24v24H0z" fill="none"></path>
                  </svg>
                  <svg onclick = "startPlayWeek()" id = "play/pause" fill="#000000" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
                     <path d="M8 5v14l11-7z"></path>
                     <path d="M0 0h24v24H0z" fill="none"></path>
                  </svg>
                  <svg onclick="nextWeek()" fill="#000000" height="48" viewBox="0 0 24 24" width="48" xmlns="http://www.w3.org/2000/svg">
                     <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"></path>
                     <path d="M0 0h24v24H0z" fill="none"></path>
                  </svg>
                  <input title="Modifie la dernière collecte voulue" id="slideBar" min="0" max="11" value="11" step="1" type="range">	
                  <span id = "slideBarDisplay">S12</span>    	
               </div>
               <div id="classementFS">
                  <label id="LO3" class = "radioParameterLabel doubleLineLabel">Classement par semaine FUN</label><input onchange = "prepareAll()" class="shape" name="weekModeOption" value="1" type="radio" checked="true"/>
                  <label id="LO4" class = "radioParameterLabel doubleLineLabel">Classement par type d'exercice</label><input onchange = "prepareAll()" class="shape" name="weekModeOption" value="0" type="radio"/>
               </div>
               <hr style="width: 60%; margin-bottom: 15px;">
               <!-- 
                  <div>
                   			<a>Classement par semaine FUN</a>
                   			<input id = "weekMode" type = "checkbox" checked = "true">
                   		</div>	 -->
               <div style = "display:none" id="LO5">
                  <a>Taille/Type Travaux</a>
                  <input id = "maxCategorieToggle" type = "checkbox">
               </div>
               <div id="LO6">
                  <a>Afficher les nombres</a>
                  <input onclick = "circleTextBackgroundUpdate()" id = "isDisplayNumber" type = "checkbox" checked="true">
               </div>
               <div class="notRequired" id="LO7">
                  <a>Agrandissement lors du survol</a>
                  <input id = "isZooming" type = "checkbox">
               </div>
               <div class="notRequired" id="LO8">
                  <a>Cohorte seulement</a>
                  <input onclick = "actualisation(3, 0)" id = "onlyDisplaySelectedCohorte" type = "checkbox" checked="true">
               </div>
               <div style = "display:none">
                  <a>Croix ou cercle???</a>
                  <input onclick = "actualisation(3, 0)" id = "crossCircle" type = "checkbox" checked="true">
               </div>
               <div style = "display:none">
                  <a>TEST : SIZE EN SURFACE</a>
                  <input onclick = "actualisation()" id = "sizeMethod" type = "checkbox" checked="true">
               </div>
               <div style = "display:none">
                  <a>Taille logarithmique</a>
                  <input onclick = "actualisation()" id = "logDisplay" type = "checkbox">
               </div>
            </div>
         </div>
         <div id="noParameters">
            <button id="download">Sauvegarder en image</button>
         </div>
         <div id = "screenSelectorMenu">
            <div id='ssm1'>
               <a>Afficher les bulles d'aides</a>
               <input onclick = "displayToolTip();" id = "tooltipDisplay" type = "checkbox">
            </div>
         </div>
         <div id = "minimapContainer" style = "position:initial; margin-left:40px;">
            <div style = "display:none" id = "minimapSizeDiv">
               <i class="fa fa-arrows"></i>
               <input title="Changer la taille de la minimap" id="minimapSize" min="0" max="10" value="10" step="1" oninput="minimapSizeChanger()" type="range">	
            </div>
            <div id = "minimap">
               <div id = "cadre"></div>
               <div id = "minimapContent"></div>
            </div>
         </div>
      </div>
      <!-- 
         <div id = "minimapContainer">
             <div id = "minimapSizeDiv">
         <i class="fa fa-arrows"></i>
         		<input title="Changer la taille de la minimap" id="minimapSize" min="0" max="10" value="10" step="1" oninput="minimapSizeChanger()" type="range">	
         	</div>
         	<div id = "minimap">
         <div id = "cadre"></div>
         <div id = "minimapContent"></div>
         	</div>
         </div>-->


      <div id = "screenSelectorArea">
         <div id = "screenSelectorCover" onclick="swapScreenMode(false)"></div>
	 
	 <div class="tooltips headline" id="head1">Représentations principales</div>
	 <!-- data-no: current, next, back -->
	 
	<!-- Formulaire en ligne -->
<!--
         <div class = "tooltips tooltipstop block" id="screen9" data-no="9,9,9" onclick="selectScreen(this)"> 
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="">
         </div>
-->
         <div class = "tooltips tooltipsbottom block" id="screen6" data-no="6,5,2" onclick="selectScreen(this)"> <!-- Nombre d'élèves par exercice selon leurs résultats // Qualité des résultats -->
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="">
         </div>

         <div class = "tooltips tooltipsbottom block" id="screen5" data-no="5,3,6" onclick="selectScreen(this)"> <!-- Résultats des élèves par exercices -->
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="">
         </div>
         <div class = "tooltips tooltipsbottom block" id="screen3" data-no="3,1,5" onclick="selectScreen(this)"> <!-- Résultats d'un élève, datés dans le temps // Évaluation et Suivi Individuel -->
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="">
         </div>
         <div class = "tooltips tooltipsbottom block" id="screen2" data-no="2,6,7" onclick="selectScreen(this)"><!-- Dernier exercice réalisé par chaque élève // Progressions Réparties -->
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="">
         </div>
         <div class = "tooltips tooltipsbottom block" id="screen1" data-no="1,7,3" onclick="selectScreen(this)"> <!-- Progression Générale - Bubble Chart -->
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="">
         </div>
         <div class = "tooltips tooltipsbottom block" id="screen7" data-no="7,2,1" onclick="selectScreen(this)"><!-- Progression Générale - Bar Chart -->
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="">
         </div>

	 <div class="tooltips headline" id="head2">Forum</div>
	 
         <div class = "tooltips tooltipstop block" id="screen8" data-no="8,8,8" onclick="selectScreen(this)"> <!-- Analyse du forum -->
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="">
         </div>

	 <div class="tooltips headline" id="head3">Bilan de MOOC</div>
	 
         <div class = "tooltips tooltipstop block" id="screen10" data-no="10,10,10" onclick="selectScreen(this)"> <!-- Bilan MOOC -->
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="">
         </div>
	 
	 <div class="tooltips headline" id="head4">Avancé</div>

         <div class = "tooltips tooltipstop block" id="screen0" data-no="0,4,4" onclick="selectScreen(this)"> <!-- Nombre d'élèves par collecte -->
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="">
         </div>
         <div class = "tooltips tooltipstop block" id="screen4" data-no="4,0,0" onclick="selectScreen(this)"> <!-- Nombre d'élèves par exercice selon leur période d'inscription -->
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="">
         </div>

<<<<<<< c06598a0b9885d63c72baa5cb34d7360b50ad2df
				<button>Liste des élèves de ce groupe</button>
				<button id = "resetSelectedCohorte">Réinitialiser la sélection</button>
	    	</div>
    		<div id = "svgPanel">		
    			<table id="tableau"></table>
			    <div class = "notRequired student-name-prompt">
			    	<a style = "width:50%;">Nom d'un élève</a>
			    		<input id=studentSelect oninput = "changeStudent()" list="studentSelectData" title = "Double clique pour afficher la liste des élèves">
					<datalist id=studentSelectData></datalist>
					<svg style = "cursor: pointer;" onclick="resetStudent();" fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
						<path style = "transform: translate(0px, 5px);" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
					</svg>
				</div>
    			<p id = "studentInfo">
	    			<a id = "pieContainer" style = "margin-right:10px"></a>
	    			<svg class = "smileys" style = "margin-bottom:-10px; fill:blue;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
					    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
					    <path style="fill:#EBE8DE" d="M18 10h-12c.331 1.465 2.827 4 6.001 4 3.134 0 5.666-2.521 5.999-4zm-9.5-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
				    </svg>
	    			<svg class = "smileys" style = "margin-bottom:-10px; fill:blue;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
					    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
					    <path style="fill:#EBE8DE" d="M17.507 9.941c-1.512 1.195-3.174 1.931-5.506 1.931-2.334 0-3.996-.736-5.508-1.931l-.493.493c1.127 1.72 3.2 3.566 6.001 3.566 2.8 0 4.872-1.846 5.999-3.566l-.493-.493zm-9.007-5.941c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
				    </svg>
	    			<svg class = "smileys" style = "margin-bottom:-10px; fill:#ff8005;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
					    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
					    <path style="fill:#EBE8DE" d="M16 14h-8v-2h8v2zm-7.5-9c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
				    </svg>
	    			<svg class = "smileys" style = "margin-bottom:-10px; fill:#ff8005;" fill="#000000" viewBox="0 0 24 24" width="32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="32" style="/*! position: relative; *//*! top: 20px; */margin-bottom: -10px;">
					    <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"></path>
					    <path style="fill:#EBE8DE" d="M12 10c-2.332 0-4.145 1.636-5.093 2.797l.471.58c1.286-.819 2.732-1.308 4.622-1.308s3.336.489 4.622 1.308l.471-.58c-.948-1.161-2.761-2.797-5.093-2.797zm-3.501-6c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5zm7 0c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5-.672-1.5-1.5-1.5z"></path>
				    </svg>
	    			<a id = "studentInfoText"></a>
    			</p>
    		</div>
=======
      </div>
>>>>>>> Enhanced version of MOOC Pilot (see spec document for detail): layout change, management of several entities with a single application..






      <div id = "waitingPanel">
         <a>Traitement en cours</a>
      </div>
      <!-- EG: added 2 lines -->
      <script src="Libraries/jquery-3.2.1.min.js"></script>
      <script src="Scripts/common.js"></script>

      <script src="Libraries/saveSvgAsPng.js"></script>
      <script src="Libraries/FileSaver.min.js"></script>
      <script src="Libraries/d3.min.js"></script>

      <script src="Scripts/ajax.js"></script>

      <script src="Scripts/cohortes.js"></script>
      <script src="Libraries/fisheye.js"></script>
      <script src="Scripts/Class/note.js"></script>
      <script src="Scripts/Class/eleve.js"></script>
      <script src="Scripts/Class/bulle.js"></script>
      <script src="Scripts/Class/bulleData.js"></script>
      <script src="Scripts/Class/category.js"></script>
      <script src="Scripts/bulleGenerator.js"></script>
      <script src="Scripts/D3/d3.tip.js"></script>
      <script src="Scripts/D3/d3PieChart.js"></script>
      <script src="Scripts/D3/d3Generation.js"></script>
      <script src="Scripts/dataGenerator.js"></script>
      <script src="Scripts/presentationAndCookies.js"></script>
      <script src="Scripts/index.js"></script>
      <script src="Scripts/screenSelector.js"></script>
   </body>
</html>

