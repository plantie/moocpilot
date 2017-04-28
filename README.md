# Moocpilot

## Qu'est ce que moocpilot?

Moocpilot est une application web dédié au suivi des apprenants, destiné aux équipes d’enseignants de cours sur les plateformes FUN et EDX. 
Elle permet de visualiser les résultats et les forums des cours. Les visualisations sont générées à partir des fichier “Grade-report” obtenu sur FUN ou EDX.    

## Configuration serveur recommandée

-Apache Tomcat version 7.0.52   
-Java 7     
-Ubuntu

## Methode d'installation


Renommer le fichier war selon le nom de l’instance souhaitée.   
Mettre le fichier à la base du dossier webapps sur le serveur tomcat.   
Attendre quelque seconde le déploiement du fichier. 
Après actualisation un dossier doit apparaître du même nom que le fichier war.  
L’application est désormais accessible en ligne, mais ne possède pas encore de données. 
Connectez-vous ensuite à l’interface administrateur : adresseduserv/nomduwar/admin  
Le mot de passe est : moocpilot 
Remplissez les champs demandés :    
    -identifiant d’un compte FUN/EDX ayant l’accès enseignant sur le cours  
    -mot de passe FUN/EDX associé à l’identifiant   
    -Les trois champs nom,identifiant,session sont accessibles dans l’adresse URL de la page FUN du cours, exemple :     https://www.fun-mooc.fr/courses/nom/identifiant/session/info   
    Ou https://www.fun-mooc.fr/courses/course-v1:nom+identifiant+session/info   
Le cours est alors maintenant installé.     
Dans votre interface administrateur de moocpilot, les quatres boutons suivant se connectent à FUN pour :    
Le bouton “Récupération du forum” Vous permet de récupérer le contenu du forum.  
Le bouton “activer la collecte automatique” Vous permet de configurer des collectes automatiques.    
Le bouton “Récupération des collectes” permet de lancer la récupération de toutes les collectes manuelle FUN.   
Le buton “Forcer une collectes manuelle” permet de lancer une collecte sur le cours FUN depuis moocpilot.  


## Données d’un cours:

La liste des fichiers suivants représentent l’ensemble des fichiers qui sont uniques à une instance moocpilot. Il faut récupérer ces fichiers dans les répertoires indiqués ci-dessous sur la sauvegarde associée au cours que l’on souhaite visualiser et les recopier dans les dossiers suivants :    
-Le dossier CSV au complet (contient les grades reports et les données du forum)    
-Dans le dossier ShellScripts : 
    -Le fichier funUserParameters.ser qui contient les informations de connexion a FUN/EDX  
    -Le fichier timerDatas.ser qui contient les informations de collecte automatique    

Il faut ensuite accéder à l’interface administrateur du cours et cliquer sur le bouton actualiser et “Actualisation et retour en mode tuteur” pour générer le jeu de données.

## Architecture

Les fichier jsp sont les pages web de moocpilot

Répertoire Admin :  
-contient la page admin.jsp

Répertoire Csv :    
-L’ensemble des fichier csv du cours    
-csvList.json: fichier de config des fichier csv    
    -Id : référence au nom du csv 0-ID  
    -pos : ordre d’affichage dans l’administrateur  
    -name : nom original du fichier 
    -isActive : si le fichier est coché ou non dans l’interface administrateur  
-Le fichier forum.json  

Répertoire Librairies : 
    -L’ensemble des bibliothèques JavaScript utilisées  

Répertoire META-INF :   
    -Manifest tomcat    

Répertoire Ressources : 
    -L’ensemble des images utilisées par le site    

Répertoire Scripts :    
    -L’ensemble des scripts javascripts 

Répertoire ShellScripts :   
    -verifUser et verifCourse permettent de vérifier que le cours existe lors de l’initialisation d’un nouveau cours    
    -funUserParameters : fichier contenant les sauvegardes d’identifiants utilisateurs et cours 
    -password.txt : le mot de passe de l’interface administrateur   
    -timerDatas : les informations de collecte automatique permet leur lancement au restart du serveur. 
    -get-reports : récupère la liste des grades reports disponibles 
    -extract-grade-report : récupère le grade report indiqué    
    -generate-grade-report : Lance une collecte 
    -Les versions edx lance les mêmes fonctions qu’au-dessus mais sur EDX   
    -get-post :  récupère la liste de tous les posts d’un page  
    -get-thread : récupère le post indiqué. 

Répertoire Styles : L’ensemble des css du site

Répertoire UploadedFiles :  
    -demoVersion: Le jeu de données de démonstrations   
    -versionLoaded : le fichier contenant les données actuellements visualisées 

Répertoire WEB-INF : classes et librairies Java.


## License

This project is licensed under the terms of the [FREE SOFTWARE LICENSING AGREEMENT CeCILL](LICENSE.txt) license.
