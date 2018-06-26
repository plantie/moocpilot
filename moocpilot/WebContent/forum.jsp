<!DOCTYPE html>
<html lang = "fr">
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title id='Title'>MOOC Pilote: tableau de progression des élèves</title>
      <link href="Styles/style.css" rel="stylesheet" media="all" type="text/css">
      <link href="Styles/forum.css" rel="stylesheet" media="all" type="text/css">
      <link href="Styles/d3SimpleGraph.css" rel="stylesheet" media="all" type="text/css">
      <link href="Styles/d3.css" rel="stylesheet" media="all" type="text/css">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css">
      <link href="Styles/screenSelector.css" rel="stylesheet" media="all" type="text/css">
   </head>
   <body>
      <div id = "titleView">
         <a></a>
	 <!--  EG: changed SVG to PNG -->
         <div class = "tooltips tooltipsbottomdiag" id = "infoDiag">
	    <img alt="Loading" src="Ressources/iButton.png">
            <span></span>
         </div>
      </div>
      <div id = "content">
         <div id = "header">
            <a class = "headPict" href = "https://www.imt.fr/"><img style = "margin-left: 60px;" src="Ressources/mines_ales_logo.jpg"></a>
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
                        <p>Notre équipe de recherche au laboratoire LGi2P de l'école des Mines d'Alès :</p>
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
      </div>
      <div id = "menu">
         <div id = "screenSelectorArrows">
            <img alt="Loading" src="Ressources/sticker-fleche.png">
            <img alt="Loading" src="Ressources/sticker-fleche.png">
         </div>
         <div id = "screenSelectorSpace"></div>
         <div class = "optionsList" id = "tutorParameters">
            <span id='ptut'>Paramétres du tuteur TBD</span>
            <div>
               <a>Seuil des notes</a>
               <input oninput = "stopMoreOf()" id="moreOf" step = "0.1" value = "0.0" type = "number" min = "0" max = "1">
            </div>
            <div>
               <a id = "AcohorteSelect" style = "width:50%;">Visualisation d'une cohorte</a>
               <select onchange = "changeCohorte()" id = "cohorteSelect">
                  <option class="allLearners" value = "0">Tous les éléves</option>
               </select>
            </div>
         </div>
         <div class = "notRequired">
            <span id="weekPosText">Semaine: 0</span>
            <input title="Modifie la taille des diagrammes" id="weekPos" min="-1" max="23" value="-1" step="1" oninput="changeWeek(this.value)" type="range">
         </div>
         <div class = "notRequired">
            <span class="orderByDateText orderImportance">Ordre par importance</span>
            <input class="orderType" checked = "true" onclick="changeOrder()" type="radio" name="orderType">
            <span class="orderByDateText orderDate">Ordre par date</span>
            <input id ="orderByDate" class="orderType" onclick="changeOrder()" type="radio" name="orderType">
         </div>
<!-- EG order by names... -->
         <div class = "notRequired">
	    <hr/>
            <span class="orderNameText">Tri alphabetique: </span>
	    <input onclick = "changeNameOrder(this.checked);" id = "orderNameCheckbox" value="Y" type="checkbox"/>
         </div>
         <div class="tableContainer notRequired">
            <div class = "topTableContainer">
               <table class = "topTable tablePost tableComment">
                  <tbody></tbody>
               </table>
               <span id = "topTableHover" class='isHover'>TEST de text</span>		
            </div>
         </div>
         <div id = "noOrphanContainer" class="tableContainer notRequired" style = "z-index: 10">
            <div class = "topTableContainer">
               <table class = "topTable tableMessage">
                  <tbody></tbody>
               </table>
               <span id = "tableMessageHover" class='isHover'>TEST de text</span>		
            </div>
         </div>
         <div id = "orphanContainer" class="tableContainer notRequired" style = "z-index: 5">
            <div class = "topTableContainer">
               <table class = "topTable tableMessage">
                  <tbody></tbody>
               </table>
               <span id = "tableOrphanHover" class='isHover'>TEST de text</span>		
            </div>
         </div>
         <div class = "notRequired" id = "simpleGraphContainer"></div>
         <div id = "simpleGraphDuplicate"></div>
         <div id = "screenSelectorMenu">
            <div id='ssm1'>
               <a>Afficher les bulles d'aides</a>
               <input onclick = "displayToolTip();" id = "tooltipDisplay" type = "checkbox">
            </div>
         </div>
         <div id="noParameters" style = "display:none">
            <button id="download">Sauvegarder en image</button>
         </div>
      </div>
      <div class = "notRequired" id = "personMessagesPanel">
         <div class = "personInfos">
            <a class = "personName"></a>
            <a class = "personCohort"></a>
         </div>
         <div class = "personMessages">
            <div id = "personPosts">
               <div>
                  <table id = "personPostsTable" class = "personTables">
                     <tbody></tbody>
                  </table>
                  <span id = "personPostsTableHover" class='isHover'>TEST de text</span>
               </div>
            </div>
         </div>
      </div>
      <div class = "notRequired" id = "postPanel">
         <div id = "postAnswers">
            <div>
               <div>
                  <table id = "postAnswersTable">
                     <tbody></tbody>
                  </table>
                  <span id = "postAnswersTableHover" class='isHover'>TEST de text</span>
               </div>
            </div>
         </div>
         <div id = "postBodyContainer">
            <span></span>
            <div>
               <a id = "postBody"></a>
            </div>
            <span></span>
         </div>
      </div>
      <div class = "notRequired" id = "personAnswersPanel">
         <div class = "personInfos">
            <a class = "personName"></a>
            <a class = "personCohort"></a>
         </div>
         <div class="personMessages">
            <div id = "personAnswers">
               <div>
                  <table id = "personAnswersTable" class = "personTables">
                     <tbody></tbody>
                  </table>
                  <span id = "personAnswersTableHover" class='isHover'>TEST de text</span>		
               </div>
            </div>
         </div>
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

      <script src="Libraries/saveSvgAsPng.js"></script>
   <script src="Libraries/d3.min.js"></script>
   <script src="Libraries/fisheye.js"></script>

   <script src="Scripts/ajax.js"></script>

   <script src="Scripts/D3/d3Forum.js"></script>
   <script src="Scripts/D3/d3SimpleGraph.js"></script>
   <script src="Scripts/forum.js"></script>		
   <script src="Scripts/screenSelector.js"></script>
   </body>
</html>

