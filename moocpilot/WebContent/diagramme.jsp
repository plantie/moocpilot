<!DOCTYPE html>
<html lang = "fr">
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
      <title id='Title'>MOOC Pilote: graphiques de progression des élèves</title>
      <link href="Styles/style.css" rel="stylesheet" media="all" type="text/css">
      <link href="Styles/diagramme.css" rel="stylesheet" media="all" type="text/css">
      <link href="Styles/screenSelector.css" rel="stylesheet" media="all" type="text/css">
   </head>
   <body>
      <div id="loadDiv">
         <a id = "loadA">Traitement en cours<br>
         Etat :  20%<br>
         Temps restant estimé : 5s<br></a>
         <progress id="loadBar" value="0" max="100"></progress>
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
         <div id = "header">
            <a class = "headPict" href = "https://www.imt.fr/"><img style = "margin-left: 60px;" src="Ressources/logo-imt.png"></a>
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
                  <a href = "diagramme.jsp" class="headerMenuSelected"></a>
                  <a></a>
               </div>
               <a style = "display:none" onclick="launchPresentation()" id="DemoButton">Démonstration</a>
               <div id="contact">
                  <a>
                     contact
                     <span>
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
                  <a id='aHeaderMenu' href = "admin" class="headerMenu">administrateur (réservé)</a>
                  <a></a>
               </div>
            </div>
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
            <button onclick="resetStudent();">Annuler</button>
         </p>
         <div id ="contentContainer">
            <div id="svgContainer"></div>
            <table id="tableau"></table>
         </div>
      </div>
      <div id="bullePopup">
         <a></a>
         <i class="fa fa-arrows"></i>				
         <div>
            <a class="visuLearner" style = "width:50%;font-size:13px;">Visualisation d'un élève</a>
            <select style = "background-color: red;width:120px;" onchange = "updateBulleStudentListCall()" id = "bulleStudentList">
               <option class="allLearners" value = "">Tous les élèves</option>
            </select>
         </div>
         <button id = "resetSelectedCohorte">Réinitialiser la sélection</button>
      </div>
      <div id = "menu">
         <div id = "screenSelectorArrows">
            <img alt="Loading" src="Ressources/sticker-fleche.png">
            <img alt="Loading" src="Ressources/sticker-fleche.png">
         </div>
         <div id = "screenSelectorSpace"></div>
         <div style="display:none" id = "dataSelection">
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
         <div class = "optionsList" id = "tutorParameters">
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
         <div id = "parameters" class = "notRequired">
            <label style ="display:none"><input style = "margin-left: 22px; margin-top:15px;" type="radio" name="mode" value="grouped"> Dépilé</label>
            <label style ="display:none"><input type="radio" name="mode" value="stacked" checked> Empilé</label>
            <div id="pourcentDiv" class = "notRequired">
               <a>Afficher en pourcentage</a>
               <input onclick = "callDisplayDiagramme()" id = "isPourcent" type = "checkbox">
            </div>
            <select style = "display : none" onchange="callDisplayDiagramme()" id="visualisationMode">
               <option value="0">Nombre d'élèves par exercice selon leur période d'inscription</option>
               <option value="1">Nombre d'élèves inscrits par collecte</option>
               <option value="2">Résultats des élèves par exercices</option>
               <option value="3">Nombre d'élèves par exercice selon leurs résultats</option>
               <option value="4">Progression Générale</option>
               <option value="10">Bilan MOOC</option>
            </select>
            <div id = "newViewSelection" style = "display : none;">
               <label class = "radioParameterLabel">Données cumulées<input onchange = "callDisplayDiagramme()" class="shape" name="visualisationMode" value="0" type="radio" checked="true"></label>
               <label class = "radioParameterLabel">Données réparties<input onchange = "callDisplayDiagramme()" class="shape" name="visualisationMode" value="1" type="radio"></label>
               <label class = "radioParameterLabel">Progression Générale<input onchange = "callDisplayDiagramme()" class="shape" name="visualisationMode" value="2" type="radio"></label>
               <label class = "radioParameterLabel">Progression Générale<input onchange = "callDisplayDiagramme()" class="shape" name="visualisationMode" value="3" type="radio"></label>
               <label class = "radioParameterLabel">Progression Générale<input onchange = "callDisplayDiagramme()" class="shape" name="visualisationMode" value="4" type="radio"></label>
            </div>
            <div class = "notRequired">
               <span id="sizeBarText"></span>
               <input title="Modifie la taille des diagrammes" id="sizeBar" min="10" max="20" value="10" step="1" oninput="changeSize()" type="range">
            </div>
            <div class = "notRequired" id="classementFS">
	       <input id="iLO3" onchange = "callDisplayDiagramme()" class="shape" name="weekModeOption" value="1" type="radio" checked="true"></input>
               <label id="LO3" for="iLO3" class = "radioParameterLabel doubleLineLabel">Classement par semaine FUN</label>
	       <input id="iLO3" onchange = "callDisplayDiagramme()" class="shape" name="weekModeOption" value="0" type="radio"></input>
               <label id="LO4" for="iLO4" class = "radioParameterLabel doubleLineLabel">Classement par type d'exercice</label>
            </div>
            <!-- 
               <div id="weekModeDiv" class = "notRequired">
                 		<a>Classement par semaine FUN</a>
                 		<input onclick = "callDisplayDiagramme()" id = "weekMode" type = "checkbox" checked = "true">
                 	</div>	 -->
            <div style = "display:none;" >
               <a class="visuLearner" style = "width:50%;">Visualisation d'un élève</a>
               <input id=studentSelect oninput = "changeStudent()" list="studentSelectData" title = "Double clique pour afficher la liste des élèves">
               <datalist id=studentSelectData></datalist>
            </div>
            <span id="exerciceNumberText"></span>
            <input title="Changer d'exercice" id="exerciceNumber" min="0" max="10" value="5" step="1" oninput="callDisplayDiagramme()" type="range">					    
            <div id="exerciseSelector" style = "display:none" class = "notRequired">
               <a>Exercice visualisé :</a>
            </div>
            <div id="options">
               <div id="optionsList">
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
         <div id = "legendContainer" class = "notRequired"></div>
      </div>




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

      </div>



<!--
      <div id = "screenSelectorArea">
         <div id = "screenSelectorCover" onclick="swapScreenMode(false)"></div>
         <div class = "tooltips tooltipsbottom" onclick="selectScreen(0)">
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="Ressources/screen0.png">
         </div>
         <div class = "tooltips tooltipsbottom" onclick="selectScreen(1)">
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="Ressources/screen1.png">
         </div>
         <div class = "tooltips tooltipsbottom" onclick="selectScreen(2)">
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="Ressources/screen2.png">
         </div>
         <div class = "tooltips tooltipsbottom" onclick="selectScreen(3)">
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="Ressources/screen3.png">
         </div>
         <div class = "tooltips tooltipsbottom" onclick="selectScreen(4)">
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="Ressources/screen4.png">
         </div>
         <div class = "tooltips tooltipsbottom" onclick="selectScreen(5)">
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="Ressources/screen5.png" onclick="selectScreen(5)">
         </div>
         <div class = "tooltips tooltipstop" onclick="selectScreen(6)">
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="Ressources/screen6.png">
         </div>
         <div class = "tooltips tooltipstop" onclick="selectScreen(7)">
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="Loading" src="Ressources/screen7.png">
         </div>
         <div class = "tooltips tooltipstop" onclick="selectScreen(8)">
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="" src="Ressources/screen8.png">
         </div>
         <div class = "tooltips tooltipstop" onclick="selectScreen(9)">
            <div>
               <a>title</a>
            </div>
            <span>test</span>
            <img alt="" src="Ressources/screen9.png">
         </div>
      </div>
-->
      <div id = "waitingPanel">
         <a>Traitement en cours</a>
      </div>
      <!-- EG: added 2 lines -->
      <script src="Libraries/jquery-3.2.1.min.js"></script>
      <script src="Scripts/common.js"></script>

      <script src="Scripts/ajax.js"></script>
      <script src="Scripts/dataGenerator.js"></script>
      <script src="Libraries/saveSvgAsPng.js"></script>
      <script src="Libraries/d3.min.js"></script>

      <script src="Scripts/D3/d3PieChart.js"></script>
      <script src="Scripts/D3/d3.tip.js"></script>
      <script src="Scripts/D3/d3Diagramme.js"></script>
      <script src="Scripts/diagramme.js"></script>
      <script src="Scripts/screenSelector.js"></script>
   </body>
</html>

