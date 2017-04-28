import java.io.FileReader;
import java.io.Reader;
import java.util.ArrayList;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;

public class CsvTraitement {
	/*Class permettant le traitement du fichier csv
	 *1-Lis le fichier
	 *2-Utilise commons csv pour le transformer en objet java
	 *3-Lis l'objet java afin de repérer des élèments significatif du fichier(détection des bords, des pages utils, du noms des exercices...)
	 *4-On creer le tableau contenant l'ensemble des donnees (les élèves avec leurs notes)
	 *5-maintenant que le fichier est traiter on peut utilisé Response afin d'en ressortir un fichier JSON et de le return
	 */
	
	//-------------Données en dure :
	//Représente le marquage prédéfini du fichier XLS a modifié en cas de changement de format
	int columnUsername;
	int columnEmail = -1;
	int columnCohorte = -1;
	int columnCertificate = -1;
	
	//--------------
	ArrayList<List<CSVRecord>> recordsList;
	ArrayList<Eleve> tabEleves;//Liste de l'ensemble des élèves
	ArrayList<Integer> sheetList;//Liste des différentes pages contenant les données
	Hashtable<Integer, Hashtable<Integer, Integer>> tabHashtable;//List qui pour une semaine données return une Liste avec en clé l'id de l'élève et en attribut ça position dans workbook
	ArrayList<Integer> tabEleveIndex;//Liste contenant tout les id des élèves existants
	ArrayList<String> listColumnName;//Noms des colonnes (Ex : login, td, ...)
	ArrayList<String> listColumnNoteName;//Noms des types de notes du fichier
	ArrayList<Integer> listColumnUtilsName;//Numéro des columns
	Response response;//L'objet response représentant le résultat utile de l'objet
	ArrayList<String> csvListName;
	
	public CsvTraitement(ArrayList<String> paths, ArrayList<String> csvListName){
		Timer timer = new Timer("Csv Traitement");
		this.csvListName = csvListName;
		try{
			recordsList = SetRecordsList(paths);
			timer.DisplayTimer("Records");
	
			stopWrongFiles();
			
			this.sheetList = GetSheetIndexUtil();
			timer.DisplayTimer("GetSheetIndexUtil");
	
			this.tabHashtable = SetHashTable();
			timer.DisplayTimer("SetHashTable");
	
			this.tabEleveIndex = SetTabEleveIndex();
			timer.DisplayTimer("SetTabEleveIndex");
				
			this.listColumnName = SetListColumnName();
			timer.DisplayTimer("SetListColumnName");

			this.listColumnNoteName = SetListColumnNoteName();
			timer.DisplayTimer("SetListColumnNoteName");

			this.listColumnUtilsName = SetListColumnUtilsName();
			timer.DisplayTimer("SetListColumnUtilsName");
				
			this.tabEleves = SetTabEleve();
			timer.DisplayTimer("SetTabEleve:");
			timer.End();

		    if(this.response == null){
		    	SetResponse();
		    }		
		}	catch(Exception e){
			System.out.println(e);
			System.out.println(e.getMessage());
			SetResponse(e.getMessage());
		}
	}

	
	
	
	
	
	private void SetResponse(){//Créer la réponse à l'aide des variables créé
		this.response = new Response(this.tabEleves, this.sheetList, this.tabHashtable, this.csvListName);
	}
	private void SetResponse(String errorLog){//Créer la réponse à l'aide du rapport d'erreur
		this.response = new Response(errorLog);
	}
		
	public String GetResponse(){//Return la réponse en JSON
		return this.response.ToJson();
	}
	
	public void SaveResponse(String path){//Sauvegarde la réponse à l'emplacement path
		this.response.Save(path);
	}
	
	
	private ArrayList<List<CSVRecord>> SetRecordsList(ArrayList<String> pathList) throws Exception{
		/*
		 * Entrée : Liste de path
		 * Sortie : Liste de records
		 */
		ArrayList<List<CSVRecord>> recordsList = new ArrayList<List<CSVRecord>>();
		for(int i = 0; i < pathList.size(); i++){
			try{ //on lit le fichier
				Reader in = new FileReader(pathList.get(i));

				recordsList.add(copyIterator(CSVFormat.EXCEL.parse(in).iterator()));
				in.close();
			} catch(Exception e){
				throw new Exception("Fichier non trouvé");
			}
		}
		return recordsList;
	}
	
	private ArrayList<Integer> GetSheetIndexUtil(){//Return l'ensemble des pages contenants des données.		
		ArrayList<Integer> sheetIndexUtil = new ArrayList<Integer>();
		for(int i = 0; i < this.recordsList.size(); i++){
			sheetIndexUtil.add(i+1);
		}
		return sheetIndexUtil;
	}
	/* --------- PAS REVISER -------------*/

	private Hashtable<Integer, Hashtable<Integer, Integer>> SetHashTable(){//Return le une Hastable<Semaine, <idEleve, positionDansWorkbook> >
		Hashtable<Integer, Hashtable<Integer, Integer>> tabHashtable = new Hashtable<Integer, Hashtable<Integer, Integer>>(this.sheetList.size());
		Hashtable<Integer, Integer> tempHashtable;
		for(int i = 0; i < this.sheetList.size(); i++){
			tempHashtable = new Hashtable<Integer, Integer>();
			for(int j = 1; j < this.recordsList.get(i).size(); j++){
				tempHashtable.put(Integer.parseInt(this.recordsList.get(i).get(j).get(0)), j);
			}
			tabHashtable.put(i, tempHashtable);
		}
		return tabHashtable;
	}
	
	private ArrayList<Integer> SetTabEleveIndex(){//Return la liste de l'ensemble des id élèves
		ArrayList<Integer> finalTabEleveIndex = new ArrayList<Integer>();
		
		
		for(int i = 0; i < this.tabHashtable.size(); i++){
			for(Integer key : this.tabHashtable.get(i).keySet()){
					if(!finalTabEleveIndex.contains(key)){
						finalTabEleveIndex.add(key);
					}
			}
		}		
		return finalTabEleveIndex;
	}
	
	private ArrayList<Eleve> SetTabEleve(){//return le tableau contenant l'ensemble des élèves
		ArrayList<Eleve> finalTabEleve = new ArrayList<Eleve>();
			for(int i = 0; i < tabEleveIndex.size(); i++){
				finalTabEleve.add(SetEleve(tabEleveIndex.get(i)));
			}
		return finalTabEleve;
	}
	
	private void stopWrongFiles(){
		CSVRecord lastColumn = this.recordsList.get(this.recordsList.size()-1).get(0);
		System.out.println(lastColumn.toString());
		for(int i = this.recordsList.size()-2 ; i>=0 ; i--){
			if(this.recordsList.get(i).size() != 0){
				CSVRecord checkedColumn = this.recordsList.get(i).get(0);
				System.out.println(checkedColumn.toString());
				//if(!lastColumn.toString().equals(checkedColumn.toString())){
				if(lastColumn.size() != checkedColumn.size()){
					this.recordsList.subList(0, i+1).clear();
					this.csvListName.subList(0, i+1).clear();
					return;
				}
			}
		}
		
		
	}
	
	private ArrayList<String> SetListColumnName(){//return le tableau contenant l'ensemble des noms des colonnes
		ArrayList<String> finalListColumnName = new ArrayList<String>();
		CSVRecord columnName = this.recordsList.get(0).get(0);
		String actualColumn;
		for(int i = 0; i < columnName.size(); i++){
			actualColumn = columnName.get(i);
			finalListColumnName.add(actualColumn);
			if(finalListColumnName.get(i).equals("username") || finalListColumnName.get(i).equals("Username")){
				this.columnUsername = i;
			}
			if(finalListColumnName.get(i).equals("email") || finalListColumnName.get(i).equals("Email")){
				this.columnEmail = i;
			}
			if(finalListColumnName.get(i).equals("Cohort Name")){
				this.columnCohorte = i;
			}
			if(finalListColumnName.get(i).equals("Verification Status")){
				this.columnCertificate = i;
			}
			
			
		}
		return finalListColumnName;
	}
	
	private ArrayList<String> SetListColumnNoteName(){
		ArrayList<String> finalListColumnNoteName = new ArrayList<String>();
		
		for(int i = 0; i < this.listColumnName.size(); i++){
			if(listColumnName.get(i).indexOf("Avg") != -1){
				finalListColumnNoteName.add(listColumnName.get(i).substring(0, listColumnName.get(i).length()-4));
			}
		}
		
		return finalListColumnNoteName;
	}
	
	private ArrayList<Integer> SetListColumnUtilsName(){		
		ArrayList<Integer> listUtilsName = new ArrayList<Integer>();
		
		boolean hasStarted = false;
		for(int i = 0; i < this.listColumnName.size(); i++){
			if(hasStarted){
				if(listColumnName.get(i).indexOf("Enrollment Track") != -1){
					break;
				}
				if(listColumnName.get(i).indexOf("Avg") == -1 && listColumnName.get(i).indexOf("Cohort Name") == -1){
					listUtilsName.add(i);
				}
			}	else	{
				if(listColumnName.get(i).equals("grade") || listColumnName.get(i).equals("Grade")){
					hasStarted = true;
					listUtilsName.add(i);
				}
			}
		}
		return listUtilsName;
	}
	
	private int getFirstColumnContain(String text){//return la première colonne contenant text
		for(int i = 0; i < this.listColumnName.size(); i++){
			if(this.listColumnName.get(i).indexOf(text) != -1){
				return i;
			}
		}
		return -1;
	}
	
	private int getLastColumnContain(String text){//return la dernière colonne contenant text
		for(int i = this.listColumnName.size()-1; i>=0; i--){
			if(listColumnName.get(i).indexOf(text) != -1){
				return i-1;
			}
		}
		return -1;
	}
	
	private Eleve SetEleve(int newId){
		/*
		 * Retourne à partir d'un idEleve un objet élèves
		 * Cet Eleve contient des notes qui sont obtenu en cherchant dans le workbook
		 */
	    int id = newId;
	    String login = "-1";
	    String email = "-1";
	    String cohorte = "Default Group";
	    ArrayList<Note> tabNotes = new ArrayList<Note>();
	    int semaineInscription = -1;
	    String typeNote;
	    List<CSVRecord> actualSheet;
	    CSVRecord actualRow;
	    int tempRow;
	    double tempNote;
	    int tempTabNotesSize;
	    
        int firstColumnContain;
        int lastColumnContain;
        int actualColumnContain;
        
        

               
	        for (int i = 0; i<sheetList.size(); i++) {
	        	if(tabHashtable.get(i).containsKey(newId)){
	        		tempRow = tabHashtable.get(i).get(newId);
	        		actualSheet = this.recordsList.get(i);
	        		actualRow = actualSheet.get(tempRow);

	        		if(semaineInscription == -1){
	        			semaineInscription = i+1;
		        		login = actualRow.get(this.columnUsername);
		        		if(this.columnEmail != -1){
			        		email = actualRow.get(this.columnEmail);
		        		}	else	{
			        		email = "Unknown";
		        		}
		        	}
		        	if(this.columnCohorte != -1 && !actualRow.get(this.columnCohorte).equals("")){
			        	cohorte = actualRow.get(this.columnCohorte);
		        	}
		        	if(this.columnCertificate != -1 && actualRow.get(this.columnCertificate).equals("ID Verified") && cohorte.equals("Default Group")){
			        	cohorte = "Certificate";
		        	}
		        	
	    	        for(int j = 0; j < this.listColumnUtilsName.size(); j++){
	    	        	if(tabNotes.size() < this.listColumnUtilsName.size()){
							String nom = listColumnName.get(this.listColumnUtilsName.get(j));
							tabNotes.add(new Note(nom, 0, -1));
	    	        	}
	    	        	if(actualRow.get(this.listColumnUtilsName.get(j)).equals("Not Attempted") || actualRow.get(this.listColumnUtilsName.get(j)).equals("Not Available")){
		    	        	tempNote = 0;
	    	        	}	else	{
		    	        	//System.out.println(actualRow.get(this.listColumnUtilsName.get(j)));
		    	        	tempNote = Double.parseDouble(actualRow.get(this.listColumnUtilsName.get(j)));
	    	        	}
	                    if (tabNotes.get(j).GetNote() != tempNote) {
	                        tabNotes.get(j).SetNote(tempNote);
	                        tabNotes.get(j).SetSemaine(i+1);
	                    }
	    	        }
	    	        
	        	}
	        }
	    return new Eleve(id, login, email, semaineInscription, tabNotes, cohorte);
	}
	
	public static <T> List<T> copyIterator(Iterator<T> iter) {
	    List<T> copy = new ArrayList<T>();
	    while (iter.hasNext())
	        copy.add(iter.next());
	    return copy;
	}

}
