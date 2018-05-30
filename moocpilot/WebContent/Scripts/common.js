/*
  Author: Emanuel Goudot
  Version 01/01/2018
  Initial version, used in index.js & diagramme.js
  
  Version 10/04/2018
  Added change of <inline> for langages (fr|en|...)
*/

// COURSE_ID: localStorage.moocId
// BASE_URL: localStorage.baseUrl
// LANG: localStorage.lang

// Fourni par Anja 18/5/2018 // "Ressources/Modele_Bilan_MOOC-Plateforme_FUN.pdf"}, // 9
var helpURL = "https://docs.google.com/document/d/1zIFfnf5Inz6srJ-LOVTbUqLl776ej4PR8pAcsT060tk/edit";
// List of translations
// List of hash #ID -> translations (fr, en, ...)
var translations = {
	//~ '#Title': {'fr':"MOOC Pilote: tableau de progression des élèves",
		//~ 'en':"MOOC PILOT student data"},
	//~ '#ContactList': {'fr':"Notre équipe de recherche au laboratoire LGi2P de l'École des Mines d'Alès :\nMichel Crampes, professeur et chercheur,\nMichel Plantié, chercheur,\nAxel Garcia, développeur,\nPierre Jean, ingénieur de recherche\nEmail : social.networks@mines-ales.fr\nNumero de téléphone : 04 66 38 70 35",
		//~ 'en':"Our team at the laboratory of the École des Mines d'Alès\nMichel Crampes, professor and research\nMichel Plantié, research,\nAxel Garcia, developper,\nPierre Jean, research engineer\nEmail : social.networks@mines-ales.fr\nNTel : 04 66 38 70 35"},
	'#aHeaderMenu': {'fr':"administrateur (réservé)",
		'en':"administrator (reserved)"},
	//~ '#ssm1 a': {'fr':"Afficher les bulles d'aides",
		//~ 'en':"Display help panel"},
	//~ '#ptut': {'fr':"Paramètres du tuteur",
		//~ 'en':"Tutor parameters"},
	//~ '.orderImportance': {'fr':"Ordre par importance",
		//~ 'en':"Order by importance"},
	//~ '.orderDate': {'fr':"Ordre  par date",
		//~ 'en':"Order by date"},
	//~ '#head1': {'fr':"Représentations principales",
		//~ 'en':"Main representation"},
	//~ '#head2': {'fr':"Analyse du forum",
		//~ 'en':"Forum analysis"},
	'#head3': {'fr':"Bilan MOOC",
		'en':"MOOC results"},
	//~ '#head4': {'fr':"Représentations avancées",
		//~ 'en':"Advanced representation"},
	'week': {'fr':"Semaine", 'en':"Week"},
	'#weekPosText': {'fr':"Semaine: 0", 'en':"Week: 0"},
	'span.orderNameText': {'fr':"Tri alphabetique:", 'en':"Alphabetic sorting"},
	//~ '#saveAndQuit': {'fr':"Actualisation",
		//~ 'en':"Actualise"},
	//~ '#saveAndQuit2': {'fr':"Retour mode tuteur",
		//~ 'en':"Back"},

	// admin
	'#updateForumButton span': {'fr':"Récupération du forum",
		'en':"Extract forum"},
	'#updateDatabaseButton span': {'fr':"Récupération des collectes",
		'en':"Extract collects"},
	'#automaticCollectButton span': {'fr':"Activer la collecte automatique",
		'en':"Activate automatic collection"},
	'#startCollect span': {'fr':"Forcer une collecte manuellement",
		'en':"Force manual collection"},
	'#csvTableDiv a': {'fr':"Liste des collectes", // chargées à partir de FUN / EdX
		'en':"List of collects"},
	'#automaticCollectInterfaceTitle': {'fr':"Ajout d'une collecte automatique",
		'en':"Add automatic collect"},
	'#datePickerDiv a': {'fr':"Sélectionner le début de la collecte automatique :",
		'en':"Select start of automatic collect :"},
	'#selectDelay option:nth-child(1)': {'fr':"Hebdomadaire",
		'en':"Weekly"},
	'#selectDelay option:nth-child(2)': {'fr':"Bimensuelle",
		'en':"Biweekly"},
	'#selectDelay option:nth-child(3)': {'fr':"Mensuelle",
		'en':"Monthly"},
	'#divSelectDelay a': {'fr':"Sélectionner la période de collecte :",
		'en':"Select collect period :"},
	'automaticCollect-true': {'fr':"Activer la collecte automatique",
		'en':"Activate automatic collect"},
	'automaticCollect-false': {'fr':"Désactiver la collecte automatique",
		'en':"Deactivate automatic collect"},
	'automaticCollectLabel-true': {'fr':"Collecte automatique : Non active",
		'en':"Automatic collect: not active"},
	// automaticCollectLabels: recopie
	'#automaticCollectLabels p:first-of-type': {'fr':"Collecte automatique : Non active",
		'en':"Automatic collect: not active"},
	'automaticCollectLabel-false': {'fr':"Collecte automatique : Active",
		'en':"Automatic collect: active"},
	'collect': {'fr':"Collecte",
		'en':"Collect"},
	'nextCollect': {'fr':"Prochaine collecte",
		'en':"Next collect"},
	'collect-0': {'fr':"hebdomadaire",
		'en':"weekly"},
	'collect-1': {'fr':"bimensuelle",
		'en':"2 weeks"},
	'collect-2': {'fr':"mensuelle",
		'en':"monthly"},
	'collectIdent': {'fr':"Identifiant de collecte",
		'en':"Collect Id"},
	'collectName': {'fr':"Nom de la collecte",
		'en':"Collect Name"},
	'collectSave': {'fr':"Enregistrer la collecte en local",
		'en':"Local save collect"},
	'confirm-remove': {'fr':"Vous allez désactiver la collecte automatique,\ndes collectes régulières sont indispensables pour suivre votre cours.\Êtes vous sûr ?",
		'en':"You will disable automatic collect,\nRegular collects are necessary to follow your course.\nAre you sure ?"},
	'confirm-collect': {'fr':"Attention, les collectes effectuées en pleines journées peuvent recontrer des problèmes.\nVoulez-vous quand même la lancer?",
		'en':"Attention: Collect issued during day can have trouble.\nDo you still want to collect ?"},
	
	// ScreenSelector.js TBC
	//~ 'SS1': {'fr':"Ce diagramme représente les inscrits de chaque période</br>Les colonnes représentent les périodes d'inscriptions.</br>Une colonne contient le nombre d'inscrits sur une période. </br>Une colonne est composée de deux parties : </br>-Le nombre de participants </br>-Le nombre de non-participants",
		//~ 'en':"This diagram shown registered at each period...</br>Les colonnes représentent les périodes d'inscriptions.</br>Une colonne contient le nombre d'inscrits sur une période. </br>Une colonne est composée de deux parties : </br>-Le nombre de participants </br>-Le nombre de non-participants"},
	// D3/d3Forum.js
	//~ 'leftTable1E': {'fr':"Emetteur",
		//~ 'en':"Emiter"},
	//~ 'leftTable1C': {'fr':"Commentateur",
		//~ 'en':"Commentator"},
	//~ 'leftTable2': {'fr':"Messages commentés",
		//~ 'en':"Commented messages"},
	//~ 'leftTable3': {'fr':"Messages orphelins",
		//~ 'en':"Orphan messages"},
	//~ 'rightTable1': {'fr':"Messages",
		//~ 'en':"Messages"},
	//~ 'rightTable2': {'fr':"Réponses au message",
		//~ 'en':"Answers to message"},
	//~ 'rightTable3': {'fr':"Commentaires",
		//~ 'en':"Commentaries"},
	//~ 'dashboard': {'fr':"Voir les données complètes sur le dashboard de la plateforme",
		//~ 'en':"See complete data on FUN dashboard"},
	'help': {'fr':"Document d'aide",
		'en':"Help document"},
	//~ 'stats': {'fr':"Statistiques",
		//~ 'en':"Statistics"},
	//~ 'N': {'fr':"Nombre d'inscrits",
		//~ 'en':"Number of students"},
	//~ 'Nok': {'fr':"Nombre d'inscrits ayant eu la certification",
		//~ 'en':"Number of certified students"},
	//~ 'N1': {'fr':"Nombre d'inscrits ayant répondu semaine 1",
		//~ 'en':"Number of students having done Week 1"},
	//~ 'N2': {'fr':"Nombre d'inscrits ayant répondu semaine 2",
		//~ 'en':"Number of students having done Week 2"},
	//~ 'N1ok': {'fr':"Nombre d'inscrits ayant répondu semaine 1 et obtenu la certification",
		//~ 'en':"Number of students having done Week 1 and certified"},
	//~ 'N2ok': {'fr':"Nombre d'inscrits ayant répondu semaine 2 et obtenu la certification",
		//~ 'en':"Number of students having done Week 2 and certified"},

  // https://docs.google.com/spreadsheets/d/1Z1DJTrcIGE5y7mfhKNhnAdB6Pwp8RmXdnAjeWAiixe4/edit?ts=5afd8aff#gid=0
  // 70 lines
		
  '#Title':{'fr':"MOOC Pilote: tableau de progression des élèves",'en':"MOOC Pilot : learner data tracking"},
  '#ContactList':{'fr':"Notre équipe de recherche au laboratoire LGi2P de l'École des Mines d'Alès :\nMichel Crampes, professeur et chercheur,\nMichel Plantié, chercheur,\nAxel Garcia, développeur,\nPierre Jean, ingénieur de recherche\nEmail : social.networks@mines-ales.fr\nNumero de téléphone : 04 66 38 70 35",'en':"Our team at the laboratory of the École des Mines d'Alès\nMichel Crampes, professor and researcher\nMichel Plantié, researcher,\nAxel Garcia, developer,\nPierre Jean, research engineer\nEmail : social.networks@mines-ales.fr\nNTel : 04 66 38 70 35"},
  '#ssm1 a':{'fr':"Afficher les bulles d'aides",'en':"Display help information"},
  '#ptut':{'fr':"Paramètres du tuteur",'en':"Instructor settings"},
  '.orderImportance':{'fr':"Ordre par importance",'en':"Order by importance"},
  '.orderDate':{'fr':"Ordre par date",'en':"Order by date"},
  '#head1':{'fr':"Représentations principales",'en':"Main graphs"},
  '#head2':{'fr':"Analyse du forum",'en':"Forum Analysis"},
  '#head4':{'fr':"Représentations avancées",'en':"Advanced representation"},
  //~ 'TR':{'fr':"Semaine",'en':"Week"},
  '#saveAndQuit':{'fr':"Actualisation",'en':"Refresh"},
  '#saveAndQuit2':{'fr':"Retour mode tuteur",'en':"Back to instructor mode"},
  'SS1':{'fr':"Ce diagramme représente les inscrits de chaque période</br>Les colonnes représentent les périodes d'inscriptions.</br>Une colonne contient le nombre d'inscrits sur une période. </br>Une colonne est composée de deux parties : </br>-Le nombre de participants </br>-Le nombre de non-participants",'en':"This graph represents the learners in each registration period. </br> The columns represent the registration periods. </br>One column includes all of the learners who enrolled in a given time span. </br> A column is made up of two groups : </br> - The number of participants </br>- The number of non participants."},
  'leftTable1E':{'fr':"Emetteur",'en':"Sender"},
  'leftTable1C':{'fr':"Commentateur",'en':"Commenter"},
  'leftTable2':{'fr':"Messages commentés",'en':"Commented messages"},
  'leftTable3':{'fr':"Messages orphelins",'en':"Orphan messages"},
  'rightTable1':{'fr':"Messages",'en':"Messages"},
  'rightTable2':{'fr':"Réponses au message",'en':"Answers to messages"},
  'rightTable3':{'fr':"Commentaires",'en':"Comments"},
  'dashboard':{'fr':"Voir les données complètes sur le dashboard de la plateforme",'en':"See complete data on FUN dashboard"},
  'help':{'fr':"Document d'aide",'en':"Help document"},
  'stats':{'fr':"Statistiques",'en':"Statistics"},
  'N':{'fr':"Nombre d'inscrits",'en':"Number of learners"},
  'Nok':{'fr':"Nombre d'inscrits éligibles à une certification",'en':"Course completers"},
  'N1':{'fr':"Nombre de démarrés (nombre d'inscrits ayant une note supérieure à 0 au premier exerice noté, semaine 1)",'en':"Course starters (number of learners having completed the first graded exercise week 1)"},
  'N2':{'fr':"Nombre d'assidus (nombre d'inscrits ayant une note supérieure à 0 au premier exerice noté, semaine 1 ainsi que celui semaine 2)",'en':"Keen learners (number of learners having completed the first graded exercise week 1 and the first graded exercise week 2)"},
  'N1ok':{'fr':"Nombre de démarrés éligibles à une certification",'en':"Number of learners having completed the first graded exercise week 1 and eligible for a certification"},
  'N2ok':{'fr':"Nombre d'assidus éligibles à une certification",'en':"Number of learners having completed the first graded exercise week 1 and the first graded exercise week 2 and eligibles for a certification"},
  'imgName0':{'fr':"Nombre d'élèves par collecte",'en':"Number of learners per data collection"},
  'imgName1':{'fr':"Progression Générale - Bubble Chart",'en':"General progression - Bubble Chart"},
  'imgName2':{'fr':"Dernier exercice réalisé par chaque élève",'en':"Exit points"},
  'imgName3':{'fr':"Résultats d'un élève, datés dans le temps",'en':"Learner's results, timestamped"},
  'imgName6':{'fr':"Nombre d'élèves par exercice selon leurs résultats",'en':"Number of learners per exercise and their results"},
  'imgName5':{'fr':"Résultats des élèves selon les exercices",'en':"Learners results per exercise"},
  'imgName7':{'fr':"Progression Générale - Bar Chart",'en':"General progression - Bar Chart"},

  '#tutorParameters div a':{'fr':"Seuil des notes",'en':"Grade threshold"},
  '#parameters div.optionsList div a':{'fr':"Seuil des notes",'en':"Grade threshold"},
  '#AcohorteSelect':{'fr':"Visualisation d'une cohorte",'en':"View a Cohort"},
		
  '#pourcentDiv a':{'fr':"Afficher en pourcentage",'en':"Display pourcent"},
  '#download':{'fr':"Sauvegarder en image",'en':"Save as picture"},
  '#classementFS input:nth-child(1)':{'fr':"Classement par semaine FUN",'en':"Sort by week FUN"},
  '#classementFS input:nth-child(2)':{'fr':"Classement par type d'exercice",'en':"Sort by exo type"},
  '#exerciseSelector a':{'fr':"Exercice visualisé :",'en':"Exercice shown"},
  '#optionViewer':{'fr':"Autres options",'en':"Other options"},
  '#optionViewer2':{'fr':"Masquer les options",'en':"Hide options"},
  'link':{'fr':"lien",'en':"link"},
  //~ '#':{'fr':"",'en':""},
  //~ '#':{'fr':"",'en':""},
  //~ '#':{'fr':"",'en':""},
  //~ '#':{'fr':"",'en':""},
  //~ '#':{'fr':"",'en':""},
  //~ '#':{'fr':"",'en':""},
  //~ '#':{'fr':"",'en':""},
  //~ '#':{'fr':"",'en':""},
  //~ '#':{'fr':"",'en':""},
  //~ '#':{'fr':"",'en':""},
  //~ '#':{'fr':"",'en':""},
  //~ '#':{'fr':"",'en':""},
	// translations[''][localStorage.lang]
	};

// Was in screenSelector.js
// TODO #titleView a
imgName = [
  {"fr": translations['imgName0']['fr'],
   "en": translations['imgName0']['en'],
   "img": "screen0.png",
   "url": "diagramme.jsp"}, // 0
  {"fr": translations['imgName1']['fr'],
   "en": translations['imgName1']['en'],
   "img": "screen1.png",
   "url": "index.jsp"}, // 1 ; R5: "Progressions Cumulées" -> "Progression Générale - Bubble Chart"
   // R6.2
  {"fr": translations['imgName2']['fr'], //"Dernier exercice réalisé par chaque élève" /*"Progressions Réparties"*/,
   "en": translations['imgName2']['en'], //"Last exercice performed by student" /*"Progressions"*/,
   "img": "screen2.png",
   "url": "index.jsp"}, // 2
  // R6.1: Suivi individuel -> Résultats d'un élève, datés dans le temps
  {"fr": translations['imgName3']['fr'], //"Résultats d'un élève, datés dans le temps" /*"Évaluation et Suivi Individuel"*/,
   "en": translations['imgName3']['en'], //"Student results, with datestamp" /*"Evaluation and individual notations"*/,
   "img": "screen3.png",
   "url": "index.jsp"}, // 3
  {"fr": "Nombre d'élèves par exercice selon leur période d'inscription",
   "en": "Number of student by inscription date",
   "img": "screen4.png",
   "url": "diagramme.jsp"}, // 4
  {"fr": translations['imgName5']['fr'], //"Résultats des élèves par exercices",
   "en": translations['imgName5']['en'], //"Student result by exercice",
   "img": "screen5.png",
   "url": "diagramme.jsp"}, // 5
   // R6.3 label change
  {"fr": translations['imgName6']['fr'], //"Nombre d'élèves par exercice selon leurs résultats" /*"Qualité des résultats"*/,
   "en": translations['imgName6']['en'], //"Number of student by exercice according to results" /*"Result quality"*/,
   "img": "screen6.png",
   "url": "diagramme.jsp"}, // 6
  {"fr": translations['imgName7']['fr'], // "Progression Générale - Bar Chart***",
   "en": translations['imgName7']['en'], //"General progression - Bar Chart",
   "img": "screen7.png",
   "url": "diagramme.jsp"}, // 7; R5: "Progression Générale" -> "Progression Générale - Bar Chart"
  {"fr": "Analyse du forum",
   "en": "Forum analysis",
   "img": "screen8.png",
   "url": "forum.jsp"}, // 8
  {"fr": "Formulaire en ligne",
   "en": "Online questionary",
   "img": "screen9.png",
   "url": helpURL}, 
  {"fr": "Bilan MOOC",
   "en": "MOOC results",
   "img": "screen10.png",
   "url": "index.jsp"}, // 10 -> index...
  //{"fr": "", "en": ""},
];
// Was in screenSelector.js
imgTip = [
  {"fr": translations['SS1']['fr'],
   "en": translations['SS1']['fr']},
   
  {'fr':"Ce diagramme représente le nombre d'élèves ayant fait les exercices selon la période où ils les ont effectués.</br>Les colonnes représentent les périodes de collectes.</br>Les lignes représentent les exercices.Une bulle contient l'ensemble des élèves ayant fait cet exercice dans la période.</br>"
	,'en':"This graph displays the number of learners having performed each exercise, based on when they performed them. </br>Columns represent data collection periods.</br>Lines represent exercises.<br/>One bubble contains all of the learners who completed this exericse in the given time span.</br>"},
	
  {'fr':"Ce diagramme représente dans chaque bulle le dernier exercice effectué par chaque élève selon la période où il l'a effectué.</br>Les colonnes représentent les périodes de collectes,</br>les lignes les exercices.<br/>Une bulle contient l'ensemble des élèves qui se sont arrêtés à cet exercice dans la période.</br>Chaque élève est présent dans une seule bulle par type d'exercice.</br>"
	,'en':"This graph displays in each bubble the last exercise completed by each learner based on when they performed them.</br>Columns represent data collection periods.</br>Lines represent exercises.One bubble contains all of the learners who completed this exericse in the given time span.</br>Each learner is only present in one bubble per type of exercise.</br>"},
  //~ {"fr": "Ce diagramme représente dans chaque bulle le dernier exercice effectué par chaque élève selon la période où il l'a effectué.</br>" +
        //~ "Les colonnes représentent les périodes de collectes,</br>" +
        //~ "les lignes les exercices. " +
        //~ "Une bulle contient l'ensemble des élèves qui se sont arrêtés à cet exercice dans la période.</br>" +
        //~ "Chaque élève est présent dans une seule bulle par type d'exercice.</br>" ,
   //~ "en": "This diagram show last exercidce done by student"},

  {'fr':"Cette visualisation permet de voir le parcours d'un élève dans le cours.</br>Des émoticônes représentent les notes de l'élève pour l'exercice durant la semaine associée.</br>Ces émoticônes représentent les quartiles entre 0 et 1"
	  ,'en':"This graph shows the path of a learner in the course.</br>Icons show the scores of the learner in one week</br>Icons represent the results in quartiles from 0 to 1"},
  //~ {"fr": "Cette visualisation permet de voir le parcours d'un élève dans le cours.</br>" +
        //~ "Des émoticônes représentent les notes de l'élève pour l'exercice durant la semaine associée.</br>" +
        //~ "Ces émoticônes représentent les quartiles entre 0 et 1.",
   //~ "en": "This graph show path of student in the course"},

  {'fr':"Ce diagramme statistique représente le nombre d'élèves ayant fait les exercices selon leur période d'inscription.</br>Les colonnes représentent les exercices.</br>Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>Elle est composée de plusieurs parties représentant la répartition des élèves selon leur période d'inscription."
	  ,'en':"This graph displays the number of learners having performed each exercise, based on their registration period. </br>Columns represent data collection periods.</br>One column contains all of the learners who completed this exercise.</br>It is made up of several groups representing the distribution of learners based on their registration period.</br>"},
  //~ {"fr": "Ce diagramme statistique représente le nombre d'élèves ayant fait les exercices selon leur période d'inscription.</br>" +
        //~ "Les colonnes représentent les exercices.</br>" +
        //~ "Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>" +
        //~ "Elle est composée de plusieurs parties représentant la répartition des élèves selon leur période d'inscription.", 
   //~ "en": "This graph sho number of student having done a exercice according to their inscription date"},

  {'fr':"Ce diagramme statistique représente la qualité des résultats d'un exercice.</br>Les colonnes représentent les quartiles entre 0 et 1.</br>Une colonne contient le nombre d'élèves ayant fait l'exercice indiqué avec une note comprise dans le quartile."
	  ,'en':"This graph represents all of the learners results for an exercise and their success rates.</br>Columns represent the results in quartiles from 0 to 1.</br>A column contains all of the learners having completed an exercise and acheived a grade within the given quartile."},
  //~ {"fr": "Ce diagramme statistique représente la qualité des résultats d'un exercice.</br>" +
        //~ "Les colonnes représentent les quartiles entre 0 et 1.</br>" +
        //~ "Une colonne contient le nombre d'élèves ayant fait l'exercice indiqué avec une note comprise dans le quartile.",
   //~ "en": "This diagram sho quality of results"},

  {'fr':"Ce diagramme représente la qualité des résultats des exercices.</br>Les colonnes représentent les exercices.</br>Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>Elle est composée de plusieurs parties représentant la répartition des élèves selon leur résultat."
	  ,'en':"This graph represents the success rate of exercises. </br>Columns represent exercises.</br>One column contains all of the learners who completed this exercise.</br>It is made up of several groups representing the distribution of learners based on their results."},
  //~ {"fr": "Ce diagramme représente la qualité des résultats des exercices.</br>" +
        //~ "Les colonnes représentent les exercices.</br>" +
        //~ "Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>" +
        //~ "Elle est composée de plusieurs parties représentant la répartition des élèves selon leur résultat.",
   //~ "en": "This diagram show quality of results"},

  {'fr':"Ce diagramme représente le nombre d'élèves ayant fait les exercices selon la période où ils les ont effectués.</br>Les colonnes représentent les exercices.</br>Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>Elle est composée de plusieurs parties représentant la répartition des élèves selon la période où ils les ont effectués."
	  ,'en':"This graph displays in each bubble the last exercise completed by each learner based on when they performed them.</br>Columns represent exercises.<br/>One column contains all of the learners who completed this exercise.</br>It is made up of several groups representing the distribution of learners based on their registration period."},
  //~ {"fr": "Ce diagramme représente le nombre d'élèves ayant fait les exercices selon la période où ils les ont effectués.</br>" +
        //~ "Les colonnes représentent les exercices.</br>" +
        //~ "Une colonne contient l'ensemble des élèves ayant fait cet exercice.</br>" +
        //~ "Elle est composée de plusieurs parties représentant la répartition des élèves selon la période où ils les ont effectués.",
   //~ "en": "This diagram show number of student having completed exercice"},

  {'fr':"Ce diagramme représente l'ensemble des échanges effectués sur le forum.</br>Le rouge représente l'émetteur du post.<br/>Le vert représente une personne ayant répondu au message."
	  ,'en':"This graph displays all of the forum exchanges.</br>Red represents the sender.</br>Green represents the person who responded to the message."},
  //~ {"fr": "Ce diagramme représente l'ensemble des échanges effectués sur le forum.</br>" +
        //~ "Le rouge représente l'émetteur du post.</br>" +
        //~ "Le vert représente une personne ayant répondu au message.</br>",
   //~ "en": "This diagram show relations of students in the forum"},
  {"fr": "Évolution future possible :</br> Génération d'un bilan du cours contenant les diagrammes et les données numériques de ce cours.",
   "en": "Futur possible evolutions"},
  {'fr':"Générer un bilan de MOOC"
	  ,'en':"Generate a MOOC data report"},
  //~ {"fr": "Bilan du MOOC",
   //~ "en": "MOOC results"},
];
//~ imgNameDiag = [4, 0, x, x, 7];

// Updates all translations with traduc
function updateLang(lang) {
	console.log("LANG="+lang);
	localStorage.lang = lang;
	$.each(translations, function( key, obj ) {
		//~ console.log('translate '+key); // +'->'+obj[lang]
		$(key).text(obj[lang].replace(/\n/g, "<br/>"));
	})
	//~ $('#titleView a').text("TBD"); // TODO
}

// Lang selector for lang icons
$('.langSelect').click(
	function(evt){//console.log(evt); EVT=evt
	  localStorage.lang = evt.target.src.substr(-6,2);
	  location.reload(); 
	  //updateLang(lang);
	}
);
// Load main table
//$( "#screenSelectorArea" ).load( "screenSelectorArea.html", function( response, status, xhr ) {console.log("screenSelectorArea: "+status)} );
function getRandom(){
	return '?rand='+Math.floor(Math.random() * 1000000);
}
/*
// Common menu for all screens
$.ajax("screenSelector.html"+getRandom(), {
	async: false,
	dataType: "html",
	error: function(){
		//alert('error loading menu');
		// if admin, but not needed !
		},
	success: function(data, textStatus){
		//~ alert(textStatus+": "+data);
		$('#screenSelectorArea').html(data);
		}
});	
*/

var lang = localStorage.lang;
if (lang===undefined) lang='en';
updateLang(lang);

var moocId = localStorage.moocId;

function courseName(callBack, dir){
	if (dir===undefined) dir="";
	console.log("courseName ("+moocId+"), "+callBack+", dir="+dir);
	//alert('MOOC: '+moocId);
	//if (moocId!==undefined) return;
	// TODO EGo
	//console.log("callBack: "+callBack);
	var select="";
	$.get( dir+'data/courses.txt'+ getRandom(), function( txt ) {
		//~ console.log(txt);
		var lines = txt.split(/\r\n|\n/).sort();
		lines.forEach(function (x){
			t = x.split(/	/); // institut, course, session, isEdx, isFunUpdated
			y = x.replace(/	/g, '|');
			var id = t[0]+t[1]+t[2];
			if (t[1]!==undefined) select+="<option value='"+y+"' "+(id == localStorage.moocId ? "selected=selected" : "")+">"+id+"</option>";
			//~ console.log("-"+x.split(" "))
			})
		$('#appNameDiv p, #headerName') // index.jsp diagramm.jsp & admin/index.jsp
			.html("<a href='.'>MOOC</a>: <select id='moocId'>"+select+"</select>")
			.change(function(evt){
				console.log(evt.target);
				var x = $(evt.target).val()
				t = x.split('|');
				moocId = localStorage.moocId = t[0]+t[1]+t[2];
				// TODO: check old version & Edx
				localStorage.baseUrl = "https://"+(t[3]=="true" ? "courses.edx.org" : "www.fun-mooc.fr")+"/courses/"+(t[4]=="true" ? "course-v1:"+t[0]+"+"+t[1]+"+"+t[2] : t[0]+"/"+t[1]+"/"+t[2]);
				console.log("moocId="+moocId+", baseUrl="+localStorage.baseUrl); 
				location.reload(); // reload page.
				//callBack(moocId);
				//callSavedJSON(courseName, function(){dataReceived = true});
			});
		return;
	});
	// Call loading first time...
	callBack();
	
/*	
	var select="";
	$.getJSON( 'data/courses.json', function( list ) {
		list.forEach(function(i){
			select+="<option value='"+i.id+"' "+(i.id == localStorage.moocId ? "selected=selected" : "")+">"+i.name+"</option>";
			});
		//console.log("select:"+select);
			select+="<option value=''>New MOOC</option>";
		$('#appNameDiv p')
			.html("<a href='index.html'>MOOC</a>: <select id='moocId'><option/>"+select+"</select>")
			.change(function(){
				moocId = localStorage.moocId = $('#appNameDiv p select').val();
				console.log("moocId="+moocId);
				callBack(moocId);
				//callSavedJSON(courseName, function(){dataReceived = true});
			});
	});

	//var sel="MOOC: <select id='moocId'><option/><option value='04003S05'>04003S05: Principes des rÃ©seaux de donnÃ©es - Session 05</option><option value='04003S06'>04003S06: Principes des rÃ©seaux de donnÃ©es - Session 06</option><option value='04018S01'>04018S01: Fabriquer un objet connectÃ© - session 01</option><option value='04018S03'>04018S03: Fabriquer un objet connectÃ© - session 03</option></select>";
	
	moocId = localStorage.moocId;
	console.log('moocId='+moocId);
	if (moocId !== undefined) callBack(moocId); //callSavedJSON(courseName, function(){dataReceived = true});
	//document.querySelectorAll("#headerMenu div>a:first-child")[0].innerText = "Progression de " + courseName;
	//document.querySelectorAll("#headerMenu div>a:first-child")[1].innerText = "Statistique de " + courseName;
*/
}
	
// MULTIPLE MOOC: list of dir in /data/list.json [{id:'04021S04', name:'Imprimer 3D Session 4'}]
	
	

/*
// Translate all inlines
var list = $('inline');
list.each(
	function(i,x){
		var l = x.innerText.split('|');
		console.log(l[0]+" / "+l[1]);
		x.innerText = l[1] || "*"+l[0]+"*"; // fr | en | ...
		}
	)
*/

// info dans localStorage.moocId


function courseNameOLD(callBack){
	if (moocId!==undefined) return;
	// TODO EGo
	//console.log("callBack: "+callBack);
	var select="";
	$.getJSON( 'data/courses.json', function( list ) {
		list.forEach(function(i){
			select+="<option value='"+i.id+"' "+(i.id == localStorage.moocId ? "selected=selected" : "")+">"+i.name+"</option>";
			});
		//console.log("select:"+select);
		$('#appNameDiv p')
			.html("<a href='.'>MOOC</a>: <select id='moocId'><option/>"+select+"</select>")
			.change(function(){
				moocId = localStorage.moocId = $('#appNameDiv p select').val();
				console.log("moocId="+moocId);
				callBack(moocId);
				//callSavedJSON(courseName, function(){dataReceived = true});
			});
	});

	//var sel="MOOC: <select id='moocId'><option/><option value='04003S05'>04003S05: Principes des rÃ©seaux de donnÃ©es - Session 05</option><option value='04003S06'>04003S06: Principes des rÃ©seaux de donnÃ©es - Session 06</option><option value='04018S01'>04018S01: Fabriquer un objet connectÃ© - session 01</option><option value='04018S03'>04018S03: Fabriquer un objet connectÃ© - session 03</option></select>";
	
	moocId = localStorage.moocId;
	console.log('moocId='+moocId);
	if (moocId !== undefined) callBack(moocId); //callSavedJSON(courseName, function(){dataReceived = true});
	/*
	document.querySelectorAll("#headerMenu div>a:first-child")[0].innerText = "Progression de " + courseName;
	document.querySelectorAll("#headerMenu div>a:first-child")[1].innerText = "Statistique de " + courseName;*/
}

/*
// index.js
function svgToPng(){
	saveSvgAsPng(document.getElementById("svgCore"), "visualisation.png", {
		backgroundColor : "#EBE8DE", 
		left : -20,
		top : -130,
		width : document.getElementById("svgCore").width.baseVal.value + 20,
		height : document.getElementById("svgCore").height.baseVal.value + 130});
}

// diagram.js
function svgToPng(){
	var duplicateLegend = 	document.getElementById("legend").cloneNode(true);
	duplicateLegend.style.transform = "translate(-140px, 50px)";
	document.getElementById("graph").appendChild(duplicateLegend);
	saveSvgAsPng(document.getElementById("graph"), "graphique.png", {
		backgroundColor : "#EBE8DE",
		top:-100,
		left : -150, 
		width : document.getElementById("graph").viewBox.baseVal.width + 150,
		height : document.getElementById("graph").viewBox.baseVal.height + 100});
	document.getElementById("graph").removeChild(duplicateLegend);
}
*/