# Moocpilot

## Qu'est ce que moocpilot?

Moocpilot est une application web dédié au suivi des apprenants, destiné aux équipes d’enseignants de cours sur les plateformes FUN et EDX. 
Elle permet de visualiser les résultats et les forums des cours. Les visualisations sont générées à partir des fichier “Grade-report” obtenu sur FUN ou EDX.    

## Configuration serveur recommandée

-Apache Tomcat version 7.0.52   
-Java 7     
-Ubuntu

## Methode d'installation

Renommé le fichier war selon le nom de l’instance souhaité.    
Mettre le fichier à la base du dossier webapps.  
Attendre quelque seconde le déploiement du fichier.  
Après actualisation un dossier doit apparaître du même nom que le fichier war.  
L’application est désormais accessible en ligne mais ne possède pas encore de données.  
Connectez-vous ensuite à l’interface administrateur : adresseduserv/nomduwar/admin.  
Le mot de passe est : moocpilot  
Remplissez les champs demandés :  
    -identifiant administrateur du cours  
    -mot de passe associé à l’identifiant  
    -Les trois élément suivant sont accessible dans l’adresse de la page FUN du cours  
    https://www.fun-mooc.fr/courses/nom/identifiant/session/info  
    Ou https://www.fun-mooc.fr/courses/course-v1:nom+identifiant+session/info  
Le cours est maintenant installé.   
“Récupération du forum” Vous permet récupérer le contenu du forum avec le bouton    
“activer la collecte automatique” Vous permet de configurer des collectes automatiques avec le bouton  
“Récupération des collectes” permet de lancer la récupération de toute les collectes manuelle FUN.  
“Forcer une collectes manuelle” permet de lancer un collecte sur le cours FUN depuis notre application.  

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
