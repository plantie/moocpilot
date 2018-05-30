<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
   pageEncoding="ISO-8859-1"%>
<html>
   <link href="../Styles/admin.css" rel="stylesheet" media="all" type="text/css">
   <link href="../Styles/pikaday.css" rel="stylesheet" media="all" type="text/css">
   <head>
      <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
   </head>
   <body>
      <div id = "header">
            <a class = "headPict" href = "https://www.imt.fr/"><img style = "margin-left: 60px;" src="../Ressources/logo-imt-negatif.png"></a>
	    <!--
         <div><a href = "http://socialnetworks.wp.mines-telecom.fr/"><img src="../Ressources/Imt.png"></a>
            <a><img src="../Ressources/mines_ales_logo.jpg"></a>
         </div>
	    -->
         <a id = "headerName">MOOC-PILOT<br> Interface Administrateur</a>
         <div id="headerRightPart">
            <a id = "saveAndQuit" class="link">Actualisation et retour</br>en mode tuteur</a>
            <a id = "saveAndQuit2" class="link">XXX</a>
         </div>
      </div>
      <div id = "menu" style = "display:none">
         <!--
            <div class = "buttonStyle" id = "xlfDiv">
            	<span>Générer les données à partir d'un fichier .xls</span>
            	<input type="file" name="xlfile" id="xlf" accept=".xls" />
            </div>	-->
         <div class="buttonStyle" id = "updateForumButton" style = "height:40px">
            <span style = "margin-top: 10px">Récupération du forum</span>
         </div>
         <div class="buttonStyle" id = "updateDatabaseButton" style = "margin-left:325px; height:40px">
            <span style = "margin-top: 10px">Récupération des collectes</span>
         </div>
         <div > <!-- automaticCollectDiv -->
            <div  class = "buttonStyle" id = "automaticCollectButton">
               <span>*** Activer la collecte automatique</span>
            </div>
            <div id = "automaticCollectLabels">
               <p>*** Collecte automatique : Non active</p>
               <p></p>
               <p></p>
            </div>
            <div class="buttonStyle" id = "startCollect">
               <span>Forcer une collecte manuellement</span>
            </div>
         </div>
      </div>
      <div id="AdminContent"  style = "display:none">
      <div id = "svgContainer"></div>
      <div id="csvTableDiv">
         <a>TBD     Liste des collectes chargées à partir de FUN</a>
         <table id="csvTable"></table>
         <!-- 
            <div onclick="javascript:window.open('https://www.fun-mooc.fr/');">
            	<span>Récupérer une collecte Fun</span>
            </div>
            <div id = "addCsvDiv">
            	<span id="launchSVG" type = "button">Ajouter une collecte manuellement</span>
            	<input type="file" name="csvfile" id="addCsv" accept=".csv" />
            </div>
            
            <div id = "setAutomaticCollect">
            	<span>Mettre en place une collecte automatique</span>
            </div>
            <div id = "removeAutomaticCollect">
            	<span>Annuler une collecte automatique (à venir)</span>
            </div> -->
         <!-- 
            <div id="chargeCsv">
            <span>Générer les visualisation à partir du tableau ci-dessus</span>
            </div> -->
      </div>
      </div style = "display:none">
      <div id = "userParametersInterface">
         <a id = "userParametersInterfaceTitle">Informations de connexion au cours nécessaires à la collecte automatique</a>
         <p>
            <label for="userName">Identifiant de connexion à FUN :</label>
            <input required type="text" name="userName" id="userName" />
         </p>
         <p>			
            <label for="userPassword">Mot de passe de connexion à FUN :</label>
            <input required type="password" name="userPassword" id="userPassword" />
         </p>
         <p>
            <label for="isEdx">Cours sur la plateforme EDX</label>
            <input type="CheckBox" name="isEdx" id="isEdx" />
         </p>
         <p>
            <label for="instituteName">Nom de l'institut du cours</label>
            <input required type="text" name="instituteName" id="instituteName" />
         </p>
         <p>
            <label for="courseId">Identifiant du cours</label>
            <input required type="text" name="courseId" id="courseId" />
         </p>
         <p>
            <label for="sessionName">Nom de la session du cours :</label>
            <input required type="text" name="sessionName" id="sessionName" />
         </p>
         <input type="button" value="Envoyer" onclick="setFunUserParameters()"/>

	 <div><!-- EG added -->
            <div  class = "buttonStyle" id = "dataSaveButton" data-action="Save">Save Data</div>
            <div  class = "buttonStyle" id = "dataRestoreButton" data-action="Restore">Restore Data</div>
         </div>

      </div>
      <div id = "automaticCollectInterface">
         <a id = "automaticCollectInterfaceTitle">Ajout d'une collecte automatique</a>
         <div id = "datePickerDiv">
            <a>Sélectionner le début de la collecte automatique :</a>
            <input type="text" id="datepicker" style = "display:none">
         </div>
         <div id="divSelectDelay">
            <a>Sélectionner la période de collecte :</a>
            <select id="selectDelay">
               <option value="0">Hebdomadaire</option>
               <option value="1">Bimensuelle</option>
               <option value="2">Mensuelle</option>
            </select>
         </div>
         <input type="button" id="newAutomaticCollect" value = "Valider">
         <svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
         </svg>
      </div>
      <img id = "loaderGif" alt="Loading" src="../Ressources/loading.gif" style="display:none; position:fixed; top:20%; right:calc(50% - 64px);"></img>
      <a id = "state"></a>
      <div id = "connectDiv" style = "display:none">
         <label for="moocPilotPassword">Mot de passe de connexion à l'administration :</label>
         <input required type="password" name="moocPilotPassword" id="moocPilotPassword"/>
         <input id = "sendMoocPilotPassword" type = "button" value = "Envoyer">
      </div>
   </body>
      <!-- EG: added 2 lines -->
      <script src="../Libraries/jquery-3.2.1.min.js"></script>
      <script src="../Scripts/common.js"></script>
   <script src="../Libraries/pikaday.js"></script>
   <script src="../Scripts/admin.js"></script>
   <script src="../Libraries/d3.min.js"></script>
   <script src="../Libraries/FileSaver.min.js"></script>
   <script src="../Scripts/D3/d3TimeBar.js"></script>
</html>

