# Moocpilot

## Qu'est ce que moocpilot?

Moocpilot est une application web dédié au suivi des apprenants, destiné aux équipes d’enseignants de cours sur les plateformes FUN et EDX. 
Elle permet la visualiser les résultats et les forums des cours et sont généré à partir des fichier “Grade-report” obtenu sur FUN ou EDX.

## Configuration serveur recommandée

-Apache Tomcat version 7.0.52
-Java 7 
-Ubuntu pour assurer une compatibilité avec les shellscript

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

## License

This project is licensed under the terms of the [FREE SOFTWARE LICENSING AGREEMENT CeCILL](LICENSE.txt) license.
